import { z } from "zod";

export const projectStatusSchema = z.enum(["Shipped", "Runnable Lab", "Building"]);

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  method: z.string().min(1),
  evidenceUrl: z.string().url().optional(),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  summary: z.string().min(1),
  currentFocus: z.string().min(1),
  status: projectStatusSchema,
  featured: z.boolean(),
  roleAlignment: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  problem: z.string().min(1),
  constraints: z.array(z.string().min(1)).min(1),
  decisions: z.array(
    z.object({
      title: z.string().min(1),
      detail: z.string().min(1),
    }),
  ),
  tradeoffs: z.array(z.string().min(1)).min(1),
  failureModes: z.array(z.string().min(1)).min(1),
  verification: z.array(z.string().min(1)).min(1),
  limitations: z.array(z.string().min(1)).min(1),
  metrics: z.array(metricSchema),
  lastVerified: z.string().date(),
});

export type Project = z.infer<typeof projectSchema>;

const projectInput = [
  {
    slug: "fault-tolerant-transformer-lab",
    title: "Fault-Tolerant Transformer Lab",
    eyebrow: "Model training reliability",
    summary:
      "A small PyTorch lab that saves model training progress and checks that a restarted run reaches the same verified state. It runs on CPU today; GPU and serving work are still planned.",
    currentFocus:
      "A real stop-and-restart recovery demo, stronger checkpoint validation, and evidence-rich artifacts.",
    status: "Building",
    featured: true,
    roleAlignment: ["AI infrastructure", "ML systems", "Research engineering"],
    stack: ["PyTorch", "Python", "pytest", "Docker", "GitHub Actions"],
    repositoryUrl: "https://github.com/ajaykr0905/fault-tolerant-transformer-lab",
    problem:
      "Small model demos often stop at a successful training curve. This project treats restart safety, experimental controls, serving behavior, and negative results as first-class engineering outputs.",
    constraints: [
      "The public path must run deterministically on CPU for review and CI.",
      "GPU and multi-GPU results must name the actual hardware and may never be simulated as evidence.",
      "All datasets, implementations, and result artifacts must be public-safe and independently produced.",
    ],
    decisions: [
      {
        title: "Evidence before scale",
        detail:
          "The first release proves gradient correctness, deterministic restarts, and artifact lineage before adding distributed execution.",
      },
      {
        title: "One variable per ablation",
        detail:
          "Experiment manifests hold the dataset, seed, model, and environment fixed while changing one declared variable.",
      },
      {
        title: "Offline public demo",
        detail:
          "Zero-cost hosting replays signed benchmark artifacts while the complete training and serving stack remains locally reproducible.",
      },
    ],
    tradeoffs: [
      "A small public model gives reviewers reproducibility rather than impressive but unauditable scale.",
      "Static benchmark playback is reliable and free, but it is not presented as a live GPU endpoint.",
    ],
    failureModes: [
      "Interrupted training between checkpoint writes.",
      "Checkpoint or configuration mismatch during restart.",
      "Serving worker termination during concurrent requests.",
      "Telemetry loss that makes recovery time unverifiable.",
    ],
    verification: [
      "Finite-difference and framework gradient checks.",
      "Repeatable CPU smoke training in CI.",
      "Checkpoint restart equality checks at a declared step boundary.",
      "Versioned experiment manifests and machine-readable result artifacts.",
    ],
    limitations: [
      "No public multi-GPU result is claimed yet.",
      "The public demo is an artifact explorer, not an always-on inference service.",
    ],
    metrics: [
      {
        value: "9 / 9",
        label: "CPU verification tests passing",
        method: "Pytest suite covering contracts, causal isolation, autograd gradients, checkpoint restart equality, configuration drift rejection, and LoRA behavior.",
        evidenceUrl: "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/tree/main/tests",
      },
      {
        value: "5.5%",
        label: "trainable parameters in the controlled LoRA run",
        method: "The same initialized model, synthetic batches, seed, and step budget were used for full tuning and LoRA; 1,536 LoRA parameters were trainable versus 28,032 in full tuning. This is a parameter-efficiency result, not a quality claim.",
        evidenceUrl: "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/blob/main/artifacts/tuning-comparison/result.json",
      },
      {
        value: "512",
        label: "tokens in the checked smoke artifact",
        method: "Eight deterministic CPU steps with the seed, model configuration, Python version, and PyTorch version recorded in the result artifact.",
        evidenceUrl: "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/tree/main/artifacts/cpu-smoke",
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "distributed-scale-validation-platform",
    title: "Distributed Scale Validation Lab",
    eyebrow: "Reliable background jobs",
    summary:
      "A Go lab that tests what happens when background jobs are duplicated, retried, or fail. The local demo uses memory today; RabbitMQ and PostgreSQL are covered by integration tests.",
    currentFocus:
      "Connecting the API and multiple workers through RabbitMQ and PostgreSQL, then testing worker failures.",
    status: "Runnable Lab",
    featured: true,
    roleAlignment: ["Distributed systems", "Backend engineering", "Platform reliability"],
    stack: ["Go", "REST", "Prometheus", "PostgreSQL", "Kubernetes", "Docker"],
    repositoryUrl: "https://github.com/ajaykr0905/distributed-scale-validation-lab",
    problem:
      "At-least-once delivery is easy to describe and difficult to validate. The lab makes duplicate delivery, retry behavior, idempotency, and persistence failures reproducible with synthetic inputs.",
    constraints: [
      "The default test path must require no external services.",
      "Local adapter verification must never be described as a production deployment or production benchmark.",
      "No employer code, data, schemas, identifiers, or benchmark results may enter the repository.",
    ],
    decisions: [
      {
        title: "Transport-neutral contracts",
        detail:
          "Queue and store interfaces allow deterministic in-memory tests before RabbitMQ and PostgreSQL integration tests are enabled.",
      },
      {
        title: "Stable identity",
        detail:
          "Every synthetic message receives a reproducible identifier so retries can prove idempotent behavior.",
      },
      {
        title: "Failure as input",
        detail:
          "Validation and persistence failures are injected explicitly rather than inferred from flaky environments.",
      },
    ],
    tradeoffs: [
      "Dependency-free tests are fast and reviewable, but they do not replace broker and database integration tests.",
      "The current lab prioritizes delivery semantics over a public always-on API.",
    ],
    failureModes: [
      "Redelivery after a worker acknowledges too late.",
      "Duplicate writes after a persistence retry.",
      "Poison messages exhausting bounded retries.",
      "Worker termination while a message is in flight.",
    ],
    verification: [
      "Go unit and concurrency tests.",
      "Deterministic workload generation from a fixed seed.",
      "Equal generated and stored counts for successful runs.",
      "Restricted Kubernetes workload security context.",
    ],
    limitations: [
      "RabbitMQ and PostgreSQL adapters are implemented, but no external-service performance result is published yet.",
      "No public throughput or latency claim is published until the benchmark environment is recorded.",
    ],
    metrics: [
      {
        value: "10,000",
        label: "synthetic entities stored without loss",
        method: "Five local memory-adapter samples used the same declared seed and recorded equal generated and stored counts; this is not a production throughput claim.",
        evidenceUrl: "https://github.com/ajaykr0905/distributed-scale-validation-lab/blob/main/artifacts/2026-09-22-memory-10000.json",
      },
      {
        value: "0",
        label: "employer datasets",
        method: "Clean-room project boundary documented in the repository.",
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "voicemed-ai",
    title: "VoiceMed AI",
    eyebrow: "Voice-to-notes AI prototype",
    summary:
      "A synthetic-data prototype that turns speech into a structured draft and blocks export until a person confirms it. It does not diagnose or prove clinical accuracy.",
    currentFocus:
      "Correcting demo safety boundaries and shipping a standalone no-key public demo.",
    status: "Building",
    featured: true,
    roleAlignment: ["AI product engineering", "Structured generation", "Human-in-the-loop systems"],
    stack: ["Next.js", "TypeScript", "Zod", "Whisper", "Gemini", "Vitest", "Playwright"],
    repositoryUrl: "https://github.com/ajaykr0905/voicemed-ai",
    problem:
      "Clinical documentation is time consuming, while unconstrained generation creates unacceptable ambiguity. The prototype explores multilingual capture, schema-bound extraction, and mandatory review.",
    constraints: [
      "The public demo uses synthetic examples and must not retain health information.",
      "Every generated report requires visible human review before export.",
      "The product must state clearly that it does not diagnose or replace clinical judgment.",
    ],
    decisions: [
      {
        title: "Deterministic demo mode",
        detail:
          "A no-key path returns fixed synthetic fixtures so reviewers can inspect the complete workflow without transmitting data.",
      },
      {
        title: "Schema before prose",
        detail:
          "Model output is validated as structured entities before it is rendered as a clinical note.",
      },
      {
        title: "Review is a state",
        detail:
          "Draft, reviewed, and exported states are explicit rather than implied by a successful model response.",
      },
    ],
    tradeoffs: [
      "Demo fixtures improve privacy and reliability but do not prove performance on real clinical speech.",
      "Third-party model adapters accelerate experimentation while increasing disclosure and provider-dependency requirements.",
    ],
    failureModes: [
      "Unsupported language or low-quality audio.",
      "Missing, malformed, or contradictory structured fields.",
      "Provider timeout or rate limit.",
      "A user attempting to export an unreviewed draft.",
    ],
    verification: [
      "Schema and API contract tests.",
      "Deterministic no-key end-to-end browser flow.",
      "Small public evaluation set with documented limitations.",
      "No persisted audio or personal health information in the public demo.",
    ],
    limitations: [
      "The project is a research prototype and is not a medical device.",
      "Accuracy metrics remain unpublished until the evaluation set and method are checked in.",
    ],
    metrics: [
      {
        value: "16 / 16",
        label: "unit and contract tests passing",
        method: "Vitest covers public datasets, strict clinical schemas, rejected malformed output, and the deterministic provider contract.",
        evidenceUrl: "https://github.com/ajaykr0905/voicemed-ai/tree/main/src/__tests__",
      },
      {
        value: "4 / 4",
        label: "desktop and mobile browser checks passing",
        method: "Playwright verifies public safety copy and that export remains disabled until human review is explicit.",
        evidenceUrl: "https://github.com/ajaykr0905/voicemed-ai/tree/main/tests/e2e",
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "evidence-first-security-harness",
    title: "Evidence-First Security Harness",
    eyebrow: "Security automation and vulnerability remediation",
    summary:
      "An open-source Go security-platform lab that turns dependency evidence into explainable, reviewable remediation decisions. The current slice queries OSV, enriches findings with optional KEV data, applies deterministic policy, and preserves replayable results.",
    currentFocus:
      "Adding CycloneDX SBOM ingestion, durable evidence storage, isolated validation workers, and a constrained security-reasoning agent.",
    status: "Building",
    featured: true,
    roleAlignment: ["Security platform engineering", "Vulnerability management", "AI safety and developer tooling"],
    stack: ["Go", "OSV", "CISA KEV", "PostgreSQL", "Docker", "OpenTelemetry", "GitHub Actions"],
    repositoryUrl: "https://github.com/ajaykr0905/evidence-first-security-harness",
    problem:
      "A vulnerability list is not yet a remediation decision. The harness connects affected component, source evidence, known-exploitation context, fixed versions, policy rationale, and human approval state.",
    constraints: [
      "The public default is read-only and must not probe arbitrary hosts or execute exploit payloads.",
      "Every recommendation must be explainable from captured source evidence.",
      "Fixtures and examples must remain synthetic and free of employer code, data, identifiers, or secrets.",
    ],
    decisions: [
      {
        title: "Evidence before model output",
        detail:
          "OSV results and policy decisions are first-class records; future model output can only propose structured actions from that evidence.",
      },
      {
        title: "Deterministic policy boundary",
        detail:
          "Known-exploited and fixed-version signals are translated into explicit priorities and rationales before any human-gated automation is introduced.",
      },
      {
        title: "Transport-injected verification",
        detail:
          "The OSV client uses injectable HTTP transport so tests are deterministic and do not depend on public network availability.",
      },
    ],
    tradeoffs: [
      "The current in-memory store keeps the first release easy to run, but it is not a durable multi-user deployment.",
      "The initial project prioritizes trustworthy evidence flow over automatic patch application.",
    ],
    failureModes: [
      "Malformed or oversized scan input.",
      "Vulnerability catalog outage or response drift.",
      "A known exploited alias missed during normalization.",
      "A remediation recommendation that lacks a fixed version or validation evidence.",
    ],
    verification: [
      "Go unit tests for OSV normalization and fixed-version extraction.",
      "Policy tests for known-exploited aliases and fixed-version priority.",
      "Service tests proving results are stored and replayable.",
      "Go vet and GitHub Actions checks.",
    ],
    limitations: [
      "CycloneDX ingestion, PostgreSQL persistence, isolated validation workers, and the constrained AI agent are planned next slices.",
      "No production deployment, exploit capability, or automatic repository write is claimed.",
    ],
    metrics: [
      {
        value: "20",
        label: "files in the first public slice",
        method:
          "The initial human-reviewed Go project includes API, CLI, policy, OSV client, tests, threat model, and CI workflow.",
        evidenceUrl: "https://github.com/ajaykr0905/evidence-first-security-harness/commit/2caa836",
      },
      {
        value: "3",
        label: "public scan endpoints",
        method:
          "Health, scan submission, and replay endpoints are documented in the repository README.",
        evidenceUrl: "https://github.com/ajaykr0905/evidence-first-security-harness#current-slice",
      },
      {
        value: "0",
        label: "employer artifacts",
        method:
          "The repository is a clean-room public project using synthetic fixtures and documented security boundaries.",
        evidenceUrl: "https://github.com/ajaykr0905/evidence-first-security-harness/blob/main/SECURITY.md",
      },
    ],
    lastVerified: "2026-09-23",
  },
] satisfies Project[];

export const projects = z.array(projectSchema).parse(projectInput);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
