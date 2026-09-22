import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusPill } from "@/components/status-pill";
import { SystemDiagram } from "@/components/system-diagram";
import { getProject, projects } from "@/lib/projects";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: { title: project.title, description: project.summary, type: "article" },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.summary,
    codeRepository: project.repositoryUrl,
    programmingLanguage: project.stack,
    author: { "@type": "Person", name: "Ajay Kumar Pondugala" },
  };

  return (
    <div className="shell page-shell project-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <Link className="back-link" href="/#projects">← All projects</Link>
      <header className="project-header">
        <div>
          <p className="eyebrow">{project.eyebrow}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
        <div className="project-header-meta">
          <StatusPill
            projectTitle={project.title}
            repositoryUrl={project.repositoryUrl}
            status={project.status}
          />
          <p>Evidence checked {project.lastVerified}</p>
        </div>
      </header>

      <ul className="tag-list project-tags" aria-label="Project technology stack">
        {project.stack.map((item) => <li key={item}>{item}</li>)}
      </ul>

      <SystemDiagram project={project} />

      {project.metrics.length > 0 ? (
        <section className="metric-grid" aria-label="Verified project metrics">
          {project.metrics.map((metric) => (
            <article className="metric-card" key={`${metric.value}-${metric.label}`}>
              <p className="metric-value">{metric.value}</p>
              <h2>{metric.label}</h2>
              <p>{metric.method}</p>
            </article>
          ))}
        </section>
      ) : (
        <div className="evidence-notice"><strong>No performance metric published yet.</strong> Results stay private until the method and environment are reproducible.</div>
      )}

      <div className="case-study-grid">
        <section>
          <p className="eyebrow">Problem</p>
          <h2>The engineering question</h2>
          <p>{project.problem}</p>
        </section>
        <section>
          <p className="eyebrow">Constraints</p>
          <h2>What the design must respect</h2>
          <ul className="detail-list">{project.constraints.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <section className="case-section">
        <p className="eyebrow">Architecture decisions</p>
        <h2>Deliberate choices and why they exist</h2>
        <div className="decision-grid">
          {project.decisions.map((decision, index) => (
            <article key={decision.title}>
              <span className="decision-index">0{index + 1}</span>
              <h3>{decision.title}</h3>
              <p>{decision.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <div className="case-study-grid three-up">
        <section>
          <p className="eyebrow">Failure modes</p>
          <h2>Designed to fail visibly</h2>
          <ul className="detail-list">{project.failureModes.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <p className="eyebrow">Verification</p>
          <h2>How claims are checked</h2>
          <ul className="detail-list">{project.verification.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
        <section>
          <p className="eyebrow">Limitations</p>
          <h2>What remains unproven</h2>
          <ul className="detail-list">{project.limitations.map((item) => <li key={item}>{item}</li>)}</ul>
        </section>
      </div>

      <section className="project-cta">
        <div>
          <p className="eyebrow">Inspect the work</p>
          <h2>Source and evidence</h2>
          <p>The repository is the source of truth for implementation status. The case study never upgrades a planned feature into a shipped claim.</p>
        </div>
        <div className="hero-actions">
          {project.repositoryUrl ? <a className="button button-primary" href={project.repositoryUrl} rel="noreferrer">View repository</a> : null}
          {project.demoUrl ? <a className="button button-secondary" href={project.demoUrl} rel="noreferrer">Open demo</a> : null}
        </div>
      </section>
    </div>
  );
}
