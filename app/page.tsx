import Link from "next/link";
import { ProjectCard } from "@/components/project-card";
import { SectionHeading } from "@/components/section-heading";
import { experience } from "@/lib/experience";
import { projects } from "@/lib/projects";
import { siteConfig, stack } from "@/lib/site";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.title,
  email: `mailto:${siteConfig.email}`,
  address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
  sameAs: [siteConfig.github, siteConfig.linkedin],
  knowsAbout: [...stack],
};

export default function HomePage() {
  const featuredProjects = projects.filter((project) => project.featured);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <section className="hero shell">
        <div className="hero-grid">
          <div>
            <p className="availability"><span aria-hidden="true" /> Bengaluru · Open to backend, platform, security, and AI engineering roles</p>
            <h1>{siteConfig.title}</h1>
            <p className="hero-copy">{siteConfig.description}</p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/#projects">See projects and code</Link>
              <a className="button button-secondary" href={siteConfig.resumePath} download>Download résumé</a>
            </div>
          </div>
          <aside className="hero-proof" aria-label="Engineering focus">
            <p className="eyebrow">How I work</p>
            <p className="proof-statement">Every project links to working code, tests, and honest limitations.</p>
            <dl>
              <div><dt>Building</dt><dd>Backend and distributed systems</dd></div>
              <div><dt>Learning</dt><dd>Training and inference systems</dd></div>
              <div><dt>Rule</dt><dd>Working evidence before claims</dd></div>
            </dl>
          </aside>
        </div>
        <ul className="stack-strip" aria-label="Core technology stack">
          {stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </section>

      <section className="section shell" id="projects">
        <SectionHeading
          eyebrow="Featured projects"
          title="What each project does—and what works today."
          aside={<p className="section-aside">Open a project for the problem, working code, setup guide, tests, and current limitations.</p>}
        />
        <div className="project-list">
          {featuredProjects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
        </div>
      </section>

      <section className="section section-tinted">
        <div className="shell">
          <SectionHeading eyebrow="Experience" title="Ownership across the delivery path." />
          <div className="experience-preview">
            <div>
              <p className="role-title">{experience[0].role}</p>
              <p className="role-meta">{experience[0].company} · {experience[0].period}</p>
              <p className="role-meta">{experience[0].product}</p>
            </div>
            <div>
              <p className="experience-summary">{experience[0].summary}</p>
              <ul className="outcome-list">
                {experience[0].outcomes.slice(0, 3).map((outcome) => <li key={outcome}>{outcome}</li>)}
              </ul>
              <Link className="text-link" href="/experience">Read the complete experience record <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="section shell">
        <SectionHeading eyebrow="Research practice" title="A public learning trail, with runnable evidence." />
        <div className="writing-feature">
          <div className="writing-marker" aria-hidden="true">90</div>
          <div>
            <h3>AI Infrastructure Engineering Journey</h3>
            <p>Deterministic exercises, tests, experiment notes, and implementation evidence from foundations toward fault-tolerant training and inference.</p>
            <div className="inline-links">
              <Link className="text-link" href="/writing">Explore the learning trail</Link>
              <a className="text-link" href="https://github.com/ajaykr0905/ai-journey" rel="noreferrer">View source ↗</a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section">
        <div className="shell contact-inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Have a role or project to discuss?</h2>
            <p className="contact-copy">
              Open a Gmail draft or email me directly at <a href={siteConfig.emailHref}>{siteConfig.email}</a>.
            </p>
          </div>
          <div className="contact-actions">
            <a
              aria-label="Email Ajay in Gmail (opens in a new tab)"
              className="button button-primary"
              href={siteConfig.gmailComposeUrl}
              rel="noreferrer"
              target="_blank"
            >
              Email Ajay in Gmail <span aria-hidden="true">↗</span>
            </a>
            <a className="button button-secondary" href={siteConfig.emailHref}>Use your email app</a>
          </div>
        </div>
      </section>
    </>
  );
}
