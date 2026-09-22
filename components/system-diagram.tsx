import type { Project } from "@/lib/projects";

const diagramLabels: Record<Project["slug"], string[]> = {
  "fault-tolerant-transformer-lab": ["Dataset + manifest", "Training + checkpoints", "Serving + telemetry", "Evidence artifacts"],
  "distributed-scale-validation-platform": ["Synthetic workload", "Queue + workers", "Idempotent store", "Benchmark report"],
  "voicemed-ai": ["Synthetic speech", "Transcribe + extract", "Human review", "Structured export"],
};

export function SystemDiagram({ project }: { project: Project }) {
  const labels = diagramLabels[project.slug];
  return (
    <figure className="system-diagram" aria-labelledby={`${project.slug}-diagram-caption`}>
      <div className="diagram-flow">
        {labels.map((label, index) => (
          <div className="diagram-step" key={label}>
            <span className="diagram-number">{String(index + 1).padStart(2, "0")}</span>
            <span>{label}</span>
            {index < labels.length - 1 ? <span className="diagram-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>
      <figcaption id={`${project.slug}-diagram-caption`}>
        Review path from input to inspectable evidence. The diagram describes the intended system boundary, not an unverified scale claim.
      </figcaption>
    </figure>
  );
}
