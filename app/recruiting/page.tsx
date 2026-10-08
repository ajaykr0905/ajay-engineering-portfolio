import type { Metadata } from "next";
import Link from "next/link";
import { mergedOpenSourceContributions } from "@/lib/open-source";
import { getProject } from "@/lib/projects";
import { siteConfig, stack } from "@/lib/site";

export const metadata: Metadata = {
  title: "Backend engineering evidence",
  description: `${siteConfig.name}: Bengaluru-based Software Engineer II at Cisco. Go and Java backend experience, merged NATS and Prometheus fixes, and reproducible recovery labs.`,
  alternates: { canonical: "/recruiting" },
};

export default function RecruitingPage() {
  const distributed = getProject("distributed-scale-validation-platform")!;
  const transformer = getProject("fault-tolerant-transformer-lab")!;
  const acceptedFixes = mergedOpenSourceContributions.filter(({ repository }) =>
    ["nats-io/nats.py", "prometheus/prometheus"].includes(repository),
  );

  return (
    <div className="shell page-shell">
      <header className="page-header" data-cosmos-mask>
        <p className="eyebrow">One-page recruiting evidence · {siteConfig.location}</p>
        <h1>{siteConfig.name}</h1>
        <p>{siteConfig.title}</p>
        <p>Seeking backend, platform, and service infrastructure opportunities in India. Experience spans Go/Java services, messaging, release readiness, and Kubernetes operations.</p>
        <div className="inline-links">
          <a className="text-link" data-spectrum-option href={siteConfig.resumePath}>Résumé PDF →</a>
          <a className="text-link" data-spectrum-option href={siteConfig.proofPacketPath}>Proof packet PDF →</a>
          <a className="text-link" data-spectrum-option href={siteConfig.linkedin} rel="noreferrer">LinkedIn ↗</a>
          <a className="text-link" data-spectrum-option href={siteConfig.emailHref}>Contact →</a>
        </div>
      </header>

      <ul className="tag-list project-tags" aria-label="Backend skills">{stack.map((skill) => <li key={skill}>{skill}</li>)}</ul>

      <section className="case-section" aria-labelledby="accepted-fixes">
        <p className="eyebrow">Reviewed upstream work</p>
        <h2 id="accepted-fixes">Two accepted infrastructure fixes</h2>
        <div className="decision-grid">
          {acceptedFixes.map((fix) => (
            <article key={fix.url}>
              <h3><a href={fix.url} rel="noreferrer">{fix.repository} {fix.pullRequest} ↗</a></h3>
              <p>{fix.impact}</p>
              <p>{fix.evidence}. Merged <time dateTime={fix.mergedAt}>{fix.mergedOn}</time>.</p>
            </article>
          ))}
        </div>
      </section>

      <div className="case-study-grid">
        <section>
          <p className="eyebrow">Flagship · {distributed.status}</p>
          <h2>{distributed.title}</h2>
          <p>Separate Go submission API, transactional-outbox dispatcher, and RabbitMQ workers. PostgreSQL records accepted jobs, bounded attempts, terminal status, and one durable result per job.</p>
          <p>Real-service tests cover known helper-process exits, broker restart, duplicates, and database rollback. Corrected local measurements retain every trial and include observation/polling overhead; this is a single-host synthetic lab.</p>
          <p>Across twelve 1,000-job trials with 1/2/4/8 independent workers: 262.73–323.21 jobs/s and 95.43–151.08 ms observed p95. All measured jobs completed. Polling is approximately 50 ms plus query/sampling overhead; the run does not demonstrate linear scaling.</p>
          <p>The historical 10,000-job result is an in-memory functional run, separate from the external-path evidence.</p>
          <Link className="text-link" data-spectrum-option href="/projects/distributed-scale-validation-platform">Inspect the case study →</Link>
          <p><a className="text-link" data-spectrum-option href="https://github.com/ajaykr0905/distributed-scale-validation-lab/blob/0a03f985bb78a7a0889e541ece71672b74a73912/artifacts/2026-10-08-durable-results-v2.md" rel="noreferrer">Corrected local evidence ↗</a></p>
          <p><a className="text-link" data-spectrum-option href={distributed.demoUrl} rel="noreferrer">Watch the 90-second recovery demo ↗</a></p>
          <p>The video is a captioned replay of actual agent-executed terminal output, not learner narration. Its 5.119233-second Compose/broker recovery is a separate trial from the corrected benchmark receipt.</p>
        </section>
        <section>
          <p className="eyebrow">Recovery evidence · Runnable Lab</p>
          <h2>{transformer.title}</h2>
          <p>Four actual SIGKILL drills on pinned public data restore the exact six-step model, optimizer, RNG, and history state of an independent CPU control.</p>
          <p>The interactive replay explains a committed report. It is a tiny local CPU proof at known failure boundaries, with no distributed-training or power-loss claim.</p>
          <Link className="text-link" data-spectrum-option href="/projects/fault-tolerant-transformer-lab#failure-replay">Open the recovery replay →</Link>
        </section>
      </div>

      <section className="case-section">
        <p className="eyebrow">Relevant professional record</p>
        <h2>Cisco · Software Engineer II</h2>
        <p>Software Engineer II since September 2025; Software Engineer from August 2024 to September 2025; internship January–June 2024. Public summaries cover backend implementation, regression validation, and service reliability.</p>
        <Link className="text-link" data-spectrum-option href="/experience">Read the experience record →</Link>
      </section>
    </div>
  );
}
