import Link from "next/link";
import { MissionRail } from "@/components/mission-rail";
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
        <div className="hero-grid" data-pointer-surface>
          <div className="hero-content" data-cosmos-mask>
            <p className="identity-kicker">AJAY <span aria-hidden="true">/</span> SYSTEMS PORTFOLIO</p>
            <p className="availability"><span aria-hidden="true" /> Software Engineer II · Backend and platform reliability · Building fault-tolerant AI and security labs in public</p>
            <h1>{siteConfig.title}</h1>
            <p className="hero-copy">{siteConfig.description}</p>
            <div className="hero-actions">
              <Link className="button button-primary" data-spectrum-option href="/#projects">
                See projects and code <span aria-hidden="true" className="action-arrow">↘</span>
              </Link>
              <a className="button button-secondary" data-spectrum-option href={siteConfig.resumePath} download>
                Download résumé <span aria-hidden="true" className="action-arrow">↓</span>
              </a>
            </div>
          </div>
          <aside className="hero-proof" aria-label="Evidence before claims">
            <p className="eyebrow">Evidence before claims</p>
            <dl>
              <div><dt>Recoverable</dt><dd>Failure injection and deterministic restart</dd></div>
              <div><dt>Inspectable</dt><dd>Tests, CI runs, and versioned artifacts</dd></div>
              <div><dt>Honest</dt><dd>Proven now versus planned next</dd></div>
            </dl>
          </aside>
        </div>
        <ul className="stack-strip" aria-label="Core technology stack">
          {stack.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      </section>

      <section aria-labelledby="experience-heading" className="experience-strip section-tinted" id="experience">
        <div className="shell experience-strip-inner">
          <div>
            <p className="eyebrow">Experience</p>
            <h2 id="experience-heading">{experience[0].role} at {experience[0].company}</h2>
          </div>
          <p className="experience-strip-copy">
            Backend delivery, release readiness, and reliability work across Go, Java, and Kubernetes systems.
          </p>
          <Link className="text-link" data-spectrum-option href="/experience">
            View experience record <span aria-hidden="true" className="action-arrow">↗</span>
          </Link>
        </div>
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

      <section className="section shell" id="research">
        <SectionHeading eyebrow="Research practice" title="A public learning trail, with runnable evidence." />
        <div className="writing-feature">
          <div className="writing-marker" aria-hidden="true">90</div>
          <div>
            <h3>AI Infrastructure Engineering Journey</h3>
            <p>Deterministic exercises, tests, experiment notes, and implementation evidence from foundations toward fault-tolerant training and inference.</p>
            <div className="inline-links">
              <Link className="text-link" data-spectrum-option href="/writing">Explore the learning trail <span aria-hidden="true" className="action-arrow">→</span></Link>
              <a className="text-link" data-spectrum-option href="https://github.com/ajaykr0905/ai-journey" rel="noreferrer">View source <span aria-hidden="true" className="action-arrow">↗</span></a>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="shell contact-inner">
          <div>
            <p className="eyebrow">Contact</p>
            <h2>Have a role or project to discuss?</h2>
            <p className="contact-copy">
              Send a note to <a data-spectrum-option href={siteConfig.emailHref}>{siteConfig.email}</a>. I&apos;ll reply as soon as I can.
            </p>
          </div>
          <div className="contact-actions">
            <a
              aria-label="Email Ajay in Gmail (opens in a new tab)"
              className="button button-primary"
              data-spectrum-option
              href={siteConfig.gmailComposeUrl}
              rel="noreferrer"
              target="_blank"
            >
              Email Ajay <span aria-hidden="true" className="action-arrow">↗</span>
            </a>
          </div>
        </div>
      </section>
      <MissionRail />
    </>
  );
}
