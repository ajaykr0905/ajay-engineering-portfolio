import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Writing",
  description: "Engineering notes on AI infrastructure, distributed systems, reliability, and reproducible experiments.",
  alternates: { canonical: "/writing" },
};

const notes = [
  {
    date: "Sep 2026",
    title: "From manual gradients to an inspectable training system",
    summary: "Why deterministic exercises, gradient checks, and explicit artifacts come before distributed scale.",
    href: "https://github.com/ajaykr0905/ai-journey",
    label: "AI Journey source",
  },
  {
    date: "Sep 2026",
    title: "At-least-once delivery needs an idempotency story",
    summary: "A practical design note on stable message identity, bounded retries, acknowledgements, and duplicate writes.",
    href: "/projects/distributed-scale-validation-platform",
    label: "Distributed lab case study",
  },
  {
    date: "Building",
    title: "What a trustworthy ML benchmark must record",
    summary: "Hardware, software, workload, measurement window, negative results, and the claims those results do not support.",
    href: "/projects/fault-tolerant-transformer-lab",
    label: "Flagship case study",
  },
];

export default function WritingPage() {
  return (
    <div className="shell page-shell">
      <header className="page-header">
        <p className="eyebrow">Writing and evidence</p>
        <h1>Notes that connect implementation to engineering judgment.</h1>
        <p>Short, inspectable records of what was tested, what failed, and what remains unproven.</p>
      </header>
      <section className="note-list" aria-label="Technical writing">
        {notes.map((note) => (
          <article className="note-card" key={note.title}>
            <p className="note-date">{note.date}</p>
            <div>
              <h2>{note.title}</h2>
              <p>{note.summary}</p>
              {note.href.startsWith("http") ? (
                <a className="text-link" href={note.href} rel="noreferrer">{note.label} ↗</a>
              ) : (
                <Link className="text-link" href={note.href}>{note.label} ↗</Link>
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
