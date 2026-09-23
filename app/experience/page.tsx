import type { Metadata } from "next";
import { SectionHeading } from "@/components/section-heading";
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
    </div>
  );
}
