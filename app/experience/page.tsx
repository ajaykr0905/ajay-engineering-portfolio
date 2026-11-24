import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
import { caseStudies } from "@/lib/case-studies";
import { experience } from "@/lib/experience";

export const metadata: Metadata = {
  title: "Experience",
  description: "Public-safe engineering ownership and outcomes across backend, distributed systems, and reliability work.",
  alternates: { canonical: "/experience" },
};

export default function ExperiencePage() {
  return (
    <div className="shell page-shell">
      <header className="page-header" data-cosmos-mask>
        <p className="eyebrow">Experience</p>
        <h1>Ownership from requirement to release evidence.</h1>
        <p>Public-safe summaries of engineering scope. Employer code, customer data, private architecture, and internal benchmarks are deliberately excluded.</p>
      </header>
      <section className="section compact-section">
        <SectionHeading eyebrow="Cisco · Bengaluru" title="Backend, identity, and platform reliability" />
        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={`${item.role}-${item.period}`}>
              <div className="timeline-meta">
                <p className="role-title">{item.role}</p>
                <p>{item.company}</p>
                <p>{item.product}</p>
                <p>{item.period}</p>
                <p>{item.location}</p>
              </div>
              <div>
                <p className="experience-summary">{item.summary}</p>
                <ul className="outcome-list">
                  {item.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="section compact-section" id="case-studies">
        <SectionHeading eyebrow="Production case studies" title="Two shipped changes, explained." />
        <div className="timeline">
          {caseStudies.map((study) => (
            <article className="timeline-item" id={study.slug} key={study.slug}>
              <div className="timeline-meta">
                <h3 className="role-title">{study.title}</h3>
                <p>Scope: {study.scope.join(" · ")}</p>
              </div>
              <div className="case-study-body">
                <p className="experience-summary">{study.context}</p>
                <h4 className="eyebrow">Problem</h4>
                <p>{study.problem}</p>
                <h4 className="eyebrow">My part</h4>
                <p>{study.ownership}</p>
                <h4 className="eyebrow">Decision</h4>
                <p>{study.decision}</p>
                <h4 className="eyebrow">Result</h4>
                <ul className="outcome-list">
                  {study.result.map((line) => <li key={line}>{line}</li>)}
                </ul>
                <h4 className="eyebrow">Limits</h4>
                <ul className="outcome-list">
                  {study.limits.map((line) => <li key={line}>{line}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
