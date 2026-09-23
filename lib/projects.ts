import { z } from "zod";

export const projectStatusSchema = z.enum(["Shipped", "Runnable Lab", "Building"]);
export const projectVisualKeySchema = z.enum(["transformer", "distributed", "voicemed", "security"]);
export type ProjectVisualKey = z.infer<typeof projectVisualKeySchema>;

export const metricEvidenceSchema = z.object({
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url(),
  commitSha: z.string().regex(/^[a-f0-9]{40}$/),
  commitUrl: z.string().url(),
  command: z.string().min(1),
  ciLabel: z.string().min(1),
  ciUrl: z.string().url(),
  environment: z.string().min(1),
  limitation: z.string().min(1),
}).superRefine((evidence, context) => {
  if (!evidence.sourceUrl.includes(`/${evidence.commitSha}/`)) {
    context.addIssue({
      code: "custom",
      message: "sourceUrl must be pinned to commitSha",
      path: ["sourceUrl"],
    });
  }
  if (!evidence.commitUrl.endsWith(`/commit/${evidence.commitSha}`)) {
    context.addIssue({
      code: "custom",
      message: "commitUrl must resolve to commitSha",
      path: ["commitUrl"],
    });
  }
});

const metricSchema = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
  method: z.string().min(1),
  evidence: metricEvidenceSchema,
});

export const replayStepStateSchema = z.enum(["input", "processing", "failure", "recovery", "verified"]);

export const replayScenarioSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  label: z.string().min(1),
  outcome: z.string().min(1),
  sourceLabel: z.string().min(1),
  sourceUrl: z.string().url().refine(
    (url) => /\/(?:blob|tree)\/[a-f0-9]{40}\//.test(url),
    "Replay evidence must use a commit-pinned source URL",
  ),
  limitation: z.string().min(1),
  steps: z.array(
    z.object({
      title: z.string().min(1),
      detail: z.string().min(1),
      state: replayStepStateSchema,
    }),
  ).min(3),
});

export type ReplayScenario = z.infer<typeof replayScenarioSchema>;

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  title: z.string().min(1),
  eyebrow: z.string().min(1),
  visualKey: projectVisualKeySchema,
  summary: z.string().min(1),
  currentFocus: z.string().min(1),
  status: projectStatusSchema,
  featured: z.boolean(),
  roleAlignment: z.array(z.string().min(1)).min(1),
  stack: z.array(z.string().min(1)).min(1),
  repositoryUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  demoPath: z.string().regex(/^\/.*#[a-z0-9-]+$/).optional(),
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
  replayScenarios: z.array(replayScenarioSchema).min(1),
  lastVerified: z.string().date(),
});

export type Project = z.infer<typeof projectSchema>;

const transformerCommit = "41dcd0ea315515f63ea764225867ff569bc50316";
const transformerRepository = "https://github.com/ajaykr0905/fault-tolerant-transformer-lab";
const transformerCommitUrl = `${transformerRepository}/commit/${transformerCommit}`;
const transformerCiUrl = "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/actions/runs/35731966039/job/106759520958";

const distributedCommit = "e0a1a197265869a15043df462d1f230221660ba5";
const distributedRepository = "https://github.com/ajaykr0905/distributed-scale-validation-lab";
const distributedCommitUrl = `${distributedRepository}/commit/${distributedCommit}`;
const distributedUnitCiUrl = "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/35731961184/job/106759506319";
const distributedAdapterCiUrl = "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/35731961184/job/106759506059";

const voiceMedCommit = "824b2331c476ccfab320e5b186f1846ae21d79f3";
const voiceMedRepository = "https://github.com/ajaykr0905/voicemed-ai";
const voiceMedCommitUrl = `${voiceMedRepository}/commit/${voiceMedCommit}`;
const voiceMedChecksCiUrl = "https://github.com/ajaykr0905/voicemed-ai/actions/runs/35732026537/job/106759732651";
const voiceMedBrowserCiUrl = "https://github.com/ajaykr0905/voicemed-ai/actions/runs/35732026537/job/106759732214";

const securityCommit = "2caa83604fa969f4c9d6e226e479c331899d76ba";
const securityRepository = "https://github.com/ajaykr0905/evidence-first-security-harness";
const securityCommitUrl = `${securityRepository}/commit/${securityCommit}`;
const securityCiUrl = "https://github.com/ajaykr0905/evidence-first-security-harness/actions/runs/35780173790/job/106923368505";

const projectInput = [
  {
    slug: "fault-tolerant-transformer-lab",
    title: "Fault-Tolerant Transformer Lab",
    eyebrow: "Model training reliability",
    visualKey: "transformer",
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
      "Small model demos often stop at a successful training curve. This project treats restart safety, experimental controls, and negative results as first-class engineering outputs.",
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
        title: "Inspectable CPU evidence",
        detail:
          "The public portfolio links pinned CPU tests and versioned artifacts. Training is locally reproducible at the documented scale; serving and GPU work remain explicitly planned.",
      },
    ],
    tradeoffs: [
      "A small public model gives reviewers reproducibility rather than impressive but unauditable scale.",
      "Pinned test and artifact replay is reliable and free, but it is not live training, serving, or a GPU endpoint.",
    ],
    failureModes: [
      "A controlled stop after checkpoint publication followed by restart.",
      "Checkpoint or configuration mismatch during restart.",
      "Causal-mask or gradient regressions caught by focused tests.",
      "Corrupt, truncated, and mid-write crash recovery remain known untested boundaries.",
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
        evidence: {
          sourceLabel: "Pinned test suite",
          sourceUrl: `${transformerRepository}/tree/${transformerCommit}/tests`,
          commitSha: transformerCommit,
          commitUrl: transformerCommitUrl,
          command: "pytest -q",
          ciLabel: "Passing deterministic CPU verification job",
          ciUrl: transformerCiUrl,
          environment: "GitHub Actions ubuntu-latest · Python 3.12 · CPU",
          limitation: "Small synthetic CPU fixtures; no GPU, model-quality, throughput, or production claim.",
        },
      },
      {
        value: "5.5%",
        label: "trainable parameters in the controlled LoRA run",
        method: "The same initialized model, synthetic batches, seed, and step budget were used for full tuning and LoRA; 1,536 LoRA parameters were trainable versus 28,032 in full tuning. This is a parameter-efficiency result, not a quality claim.",
        evidence: {
          sourceLabel: "Pinned comparison artifact",
          sourceUrl: `${transformerRepository}/blob/${transformerCommit}/artifacts/tuning-comparison/result.json`,
          commitSha: transformerCommit,
          commitUrl: transformerCommitUrl,
          command: "fttl-compare-tuning --config configs/smoke.json --output artifacts/tuning-comparison/result.json",
          ciLabel: "Passing deterministic CPU verification job",
          ciUrl: transformerCiUrl,
          environment: "Local CPU artifact · Python 3.12.14 · PyTorch 2.14.0; command also runs in CI",
          limitation: "Parameter-efficiency observation on a randomly initialized tiny model and synthetic tokens; not a quality comparison.",
        },
      },
      {
        value: "rtol 0 / atol 0",
        label: "resumed model-state equality",
        method: "A four-step uninterrupted CPU run is compared with a run resumed from the step-two checkpoint; every model-state tensor must match with zero relative and absolute tolerance.",
        evidence: {
          sourceLabel: "Pinned restart-equality test",
          sourceUrl: `${transformerRepository}/blob/${transformerCommit}/tests/test_recovery.py#L23-L36`,
          commitSha: transformerCommit,
          commitUrl: transformerCommitUrl,
          command: "pytest -q tests/test_recovery.py::test_checkpoint_restart_matches_uninterrupted_training",
          ciLabel: "Passing deterministic CPU verification job",
          ciUrl: transformerCiUrl,
          environment: "GitHub Actions ubuntu-latest · Python 3.12 · deterministic CPU fixture",
          limitation: "Proves model-tensor equality for one tiny CPU fixture; it does not prove process-kill durability, GPU recovery, or distributed restart.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "checkpoint-recovery",
        label: "Checkpoint recovery",
        outcome: "The resumed model reaches the same four-step state as the uninterrupted run with rtol=0 and atol=0.",
        sourceLabel: "Inspect the pinned recovery test",
        sourceUrl: `${transformerRepository}/blob/${transformerCommit}/tests/test_recovery.py#L23-L36`,
        limitation: "A deterministic replay of a tiny CPU unit test—not a live training process or GPU failure drill.",
        steps: [
          {
            title: "Run the control path",
            detail: "Train the declared tiny configuration for four uninterrupted deterministic CPU steps.",
            state: "input",
          },
          {
            title: "Stop at step two",
            detail: "Run the same configuration to step two and save the model, optimizer, configuration fingerprint, counters, and RNG state.",
            state: "failure",
          },
          {
            title: "Resume the same run",
            detail: "Load the step-two checkpoint and finish the remaining two steps with the same deterministic batches.",
            state: "recovery",
          },
          {
            title: "Compare every model tensor",
            detail: "Require equal step and token counts, then compare the resumed and uninterrupted state dictionaries with rtol=0 and atol=0.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "distributed-scale-validation-platform",
    title: "Distributed Scale Validation Lab",
    eyebrow: "Reliable background jobs",
    visualKey: "distributed",
    summary:
      "A Go lab that tests what happens when background jobs are duplicated, retried, or fail. The local demo uses memory today; RabbitMQ and PostgreSQL are covered by integration tests.",
    currentFocus:
      "Connecting the API and multiple workers through RabbitMQ and PostgreSQL, then testing worker failures.",
    status: "Runnable Lab",
    featured: true,
    roleAlignment: ["Distributed systems", "Backend engineering", "Platform reliability"],
    stack: ["Go", "REST", "Prometheus", "PostgreSQL", "Kubernetes", "Docker"],
    repositoryUrl: "https://github.com/ajaykr0905/distributed-scale-validation-lab",
    demoPath: "/projects/distributed-scale-validation-platform#failure-replay",
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
        value: "2 → 1",
        label: "duplicate deliveries produce one result",
        method: "The deterministic worker test publishes the same stable message twice, processes both deliveries, and requires the first insert to succeed, the second to deduplicate, and the store length to remain one.",
        evidence: {
          sourceLabel: "Pinned duplicate-delivery test",
          sourceUrl: `${distributedRepository}/blob/${distributedCommit}/internal/worker/worker_test.go#L49-L72`,
          commitSha: distributedCommit,
          commitUrl: distributedCommitUrl,
          command: "go test -race ./internal/worker -run '^TestDuplicateDeliveryCreatesOneResult$' -count=1",
          ciLabel: "Passing race-test job",
          ciUrl: distributedUnitCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.23 · in-memory queue and store",
          limitation: "Unit-level adapter result; it is not a broker-redelivery, production-throughput, or exactly-once-delivery claim.",
        },
      },
      {
        value: "3 → DLQ",
        label: "bounded attempts before dead-lettering",
        method: "An injected validation failure is processed three times with a maximum-attempt budget of three, after which exactly one dead letter exists and the work queue is empty.",
        evidence: {
          sourceLabel: "Pinned bounded-retry test",
          sourceUrl: `${distributedRepository}/blob/${distributedCommit}/internal/worker/worker_test.go#L128-L153`,
          commitSha: distributedCommit,
          commitUrl: distributedCommitUrl,
          command: "go test -race ./internal/worker -run '^TestValidationFailureMovesToDeadLetterAfterBoundedRetries$' -count=1",
          ciLabel: "Passing race-test job",
          ciUrl: distributedUnitCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.23 · injected validation failure · in-memory queue",
          limitation: "Deterministic in-memory failure injection; not a live worker kill or RabbitMQ dead-letter performance result.",
        },
      },
      {
        value: "1 / 1",
        label: "external adapter contract passing",
        method: "The integration job starts RabbitMQ and PostgreSQL, confirms one persistent publish, manually acknowledges the processed delivery, and requires the stable message ID to exist in PostgreSQL.",
        evidence: {
          sourceLabel: "Pinned external-adapter test",
          sourceUrl: `${distributedRepository}/blob/${distributedCommit}/integration/adapters_test.go#L19-L60`,
          commitSha: distributedCommit,
          commitUrl: distributedCommitUrl,
          command: "docker compose --profile infra up -d --wait && SCALE_LAB_INTEGRATION=1 go test -tags=integration ./integration",
          ciLabel: "Passing RabbitMQ and PostgreSQL adapter job",
          ciUrl: distributedAdapterCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.23 · RabbitMQ 3 management-alpine · PostgreSQL 16-alpine",
          limitation: "Single-message adapter contract; no failure injection, concurrency benchmark, or external-path performance claim.",
        },
      },
      {
        value: "10,000 / 10,000",
        label: "synthetic entities generated and stored",
        method: "Five declared local memory-adapter samples used the same seed, eight workers, and bounded attempts; each sample reports equal generated and stored counts.",
        evidence: {
          sourceLabel: "Pinned local-run artifact",
          sourceUrl: `${distributedRepository}/blob/${distributedCommit}/artifacts/2026-09-22-memory-10000.json`,
          commitSha: distributedCommit,
          commitUrl: distributedCommitUrl,
          command: "go run ./cmd/lab -seed portfolio-verified -count 10000 -workers 8 -max-attempts 3",
          ciLabel: "Passing race-test job at the pinned commit",
          ciUrl: distributedUnitCiUrl,
          environment: "macOS 26.6.2 · arm64 · Go 1.26.4 · memory adapters · no external services",
          limitation: "Local functional run captured before publication; not a RabbitMQ/PostgreSQL result or hardware-independent throughput claim.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "duplicate-delivery",
        label: "Inject duplicate",
        outcome: "Two deliveries with the same stable message ID leave exactly one stored result.",
        sourceLabel: "Inspect the pinned duplicate-delivery test",
        sourceUrl: `${distributedRepository}/blob/${distributedCommit}/internal/worker/worker_test.go#L49-L72`,
        limitation: "Deterministic memory-adapter test replay—not live broker traffic or production telemetry.",
        steps: [
          {
            title: "Publish the same identity twice",
            detail: "The test places two messages carrying the same stable message ID onto the in-memory queue.",
            state: "input",
          },
          {
            title: "Accept the first result",
            detail: "The worker validates the first delivery and the idempotent store inserts its result.",
            state: "processing",
          },
          {
            title: "Suppress the duplicate",
            detail: "The second delivery validates, but PutIfAbsent reports that the stable message ID already exists.",
            state: "recovery",
          },
          {
            title: "Assert one stored result",
            detail: "The test requires first.Inserted=true, second.Inserted=false, and a final store length of one.",
            state: "verified",
          },
        ],
      },
      {
        id: "retry-failed-job",
        label: "Retry failed job",
        outcome: "One injected validation failure is requeued, then the second attempt succeeds with one stored result.",
        sourceLabel: "Inspect the pinned retry test",
        sourceUrl: `${distributedRepository}/blob/${distributedCommit}/internal/worker/worker_test.go#L74-L90`,
        limitation: "Controlled in-memory validation failure; the current application runner does not expose this as a live API control.",
        steps: [
          {
            title: "Publish one deterministic job",
            detail: "The test queues a stable synthetic message and configures the validator to fail once.",
            state: "input",
          },
          {
            title: "Fail the first validation",
            detail: "The first ProcessOne call returns the injected error and negatively acknowledges the delivery for requeue.",
            state: "failure",
          },
          {
            title: "Process the requeued job",
            detail: "The second ProcessOne call receives the incremented attempt and completes validation and persistence.",
            state: "recovery",
          },
          {
            title: "Assert bounded recovery",
            detail: "The test requires exactly two validator calls and one stored result.",
            state: "verified",
          },
        ],
      },
      {
        id: "bounded-dead-letter",
        label: "Exhaust retries",
        outcome: "Three failed attempts produce one inspectable dead letter and no remaining queued copy.",
        sourceLabel: "Inspect the pinned dead-letter test",
        sourceUrl: `${distributedRepository}/blob/${distributedCommit}/internal/worker/worker_test.go#L128-L153`,
        limitation: "Injected in-memory failure path; it does not claim a real worker process was killed.",
        steps: [
          {
            title: "Declare the retry budget",
            detail: "The worker receives one stable job, a validator that keeps failing, and a maximum of three attempts.",
            state: "input",
          },
          {
            title: "Requeue attempts one and two",
            detail: "Each failed validation is surfaced and the unsettled job returns to the queue with an incremented attempt count.",
            state: "failure",
          },
          {
            title: "Dead-letter attempt three",
            detail: "The exhausted message is recorded once in the dead-letter sink and is negatively acknowledged without requeue.",
            state: "recovery",
          },
          {
            title: "Assert the terminal state",
            detail: "The dead letter records three attempts and the queue remains empty after the scenario.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "voicemed-ai",
    title: "VoiceMed AI",
    eyebrow: "Voice-to-notes AI prototype",
    visualKey: "voicemed",
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
      "One public synthetic fixture and bundled reference-data contracts.",
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
        method: "Vitest covers the public synthetic fixture, bundled reference-data contracts, strict clinical schemas, rejected malformed output, and the deterministic provider contract.",
        evidence: {
          sourceLabel: "Pinned unit and contract tests",
          sourceUrl: `${voiceMedRepository}/tree/${voiceMedCommit}/src/__tests__`,
          commitSha: voiceMedCommit,
          commitUrl: voiceMedCommitUrl,
          command: "npm run test",
          ciLabel: "Passing checks job",
          ciUrl: voiceMedChecksCiUrl,
          environment: "GitHub Actions ubuntu-latest · Node.js 22 · deterministic synthetic fixtures",
          limitation: "Contract and fixture coverage only; no clinical-accuracy, diagnosis, or real-provider reliability claim.",
        },
      },
      {
        value: "4 / 4",
        label: "desktop and mobile browser checks passing",
        method: "Playwright verifies public safety copy and that export remains disabled until human review is explicit.",
        evidence: {
          sourceLabel: "Pinned review-gate browser test",
          sourceUrl: `${voiceMedRepository}/blob/${voiceMedCommit}/tests/e2e/demo.spec.ts#L3-L19`,
          commitSha: voiceMedCommit,
          commitUrl: voiceMedCommitUrl,
          command: "npm run build && npm run test:e2e",
          ciLabel: "Passing browser job",
          ciUrl: voiceMedBrowserCiUrl,
          environment: "GitHub Actions ubuntu-latest · Node.js 22 · Chromium desktop and Pixel 7 emulation",
          limitation: "Synthetic no-key browser workflow; it does not measure clinical accuracy or external-provider performance.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "human-review-gate",
        label: "Human review gate",
        outcome: "The download control remains disabled until the reviewer explicitly confirms the synthetic draft.",
        sourceLabel: "Inspect the pinned browser test",
        sourceUrl: `${voiceMedRepository}/blob/${voiceMedCommit}/tests/e2e/demo.spec.ts#L3-L12`,
        limitation: "Synthetic browser-test replay—not a clinical workflow, accuracy result, or medical-device claim.",
        steps: [
          {
            title: "Open the documentation lab",
            detail: "The browser test enters the public console and starts the deterministic synthetic example.",
            state: "input",
          },
          {
            title: "Render an unreviewed draft",
            detail: "The interface labels the generated content as unreviewed and exposes the review state explicitly.",
            state: "processing",
          },
          {
            title: "Keep export locked",
            detail: "Before confirmation, the Download reviewed draft control must remain disabled.",
            state: "failure",
          },
          {
            title: "Confirm and unlock",
            detail: "After the human-review checkbox is selected, the same browser test requires the download control to become enabled.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-09-22",
  },
  {
    slug: "evidence-first-security-harness",
    title: "Evidence-First Security Harness",
    eyebrow: "Security automation and vulnerability remediation",
    visualKey: "security",
    summary:
      "An open-source Go security-platform lab that turns dependency evidence into explainable, reviewable remediation priorities. The current slice queries OSV, enriches findings with optional KEV data, applies deterministic policy, and preserves replayable results.",
    currentFocus:
      "Adding CycloneDX SBOM ingestion, durable evidence storage, isolated validation workers, and a constrained security-reasoning agent.",
    status: "Building",
    featured: true,
    roleAlignment: ["Security platform engineering", "Vulnerability management", "AI safety and developer tooling"],
    stack: ["Go", "OSV", "CISA KEV", "HTTP API", "GitHub Actions"],
    repositoryUrl: securityRepository,
    demoPath: "/projects/evidence-first-security-harness#failure-replay",
    problem:
      "A vulnerability list is not yet a remediation decision. The current harness connects an affected component, source evidence, known-exploitation context, fixed versions, policy rationale, and a replayable result; human approval remains a boundary for future remediation work.",
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
        value: "4 / 4",
        label: "public Go tests passing",
        method:
          "The checked suite covers injected OSV normalization, fixed-version extraction, known-exploited alias priority, and in-memory result persistence and retrieval.",
        evidence: {
          sourceLabel: "Pinned Go test packages",
          sourceUrl: `${securityRepository}/tree/${securityCommit}/internal`,
          commitSha: securityCommit,
          commitUrl: securityCommitUrl,
          command: "go test ./...",
          ciLabel: "Passing Go test and vet job",
          ciUrl: securityCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.26.4 · synthetic in-process fixtures",
          limitation: "Small deterministic fixtures; no production deployment, live-catalog reliability, throughput, or exploit-capability claim.",
        },
      },
      {
        value: "1 → 1",
        label: "scan result stored and retrieved",
        method:
          "One synthetic component scan uses an injected OSV response, applies deterministic policy, writes the result to the memory store, and retrieves the same result identifier.",
        evidence: {
          sourceLabel: "Pinned scan orchestration test",
          sourceUrl: `${securityRepository}/blob/${securityCommit}/internal/scan/service_test.go#L16-L33`,
          commitSha: securityCommit,
          commitUrl: securityCommitUrl,
          command: "go test ./internal/scan -run '^TestRunStoresExplainableResult$' -count=1",
          ciLabel: "Passing Go test and vet job",
          ciUrl: securityCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.26.4 · injected HTTP transport · memory store",
          limitation: "In-process memory-store proof; it does not exercise the public HTTP handlers, durable storage, concurrency, or a multi-user deployment.",
        },
      },
      {
        value: "critical",
        label: "known-exploited alias policy outcome",
        method:
          "A synthetic advisory alias present in the injected known-exploited map is deterministically promoted to critical priority and retains its known-exploited marker.",
        evidence: {
          sourceLabel: "Pinned policy test",
          sourceUrl: `${securityRepository}/blob/${securityCommit}/internal/policy/policy_test.go#L9-L14`,
          commitSha: securityCommit,
          commitUrl: securityCommitUrl,
          command: "go test ./internal/policy -run '^TestKnownExploitedAliasIsCritical$' -count=1",
          ciLabel: "Passing Go test and vet job",
          ciUrl: securityCiUrl,
          environment: "GitHub Actions ubuntu-latest · Go 1.26.4 · synthetic known-exploited map",
          limitation: "Deterministic policy-unit proof; it does not validate freshness, completeness, or availability of the live CISA KEV catalog.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "evidence-policy-replay",
        label: "Evidence-to-policy replay",
        outcome: "The synthetic advisory is normalized, classified as critical from declared known-exploited context, stored, and retrieved with the same scan identifier.",
        sourceLabel: "Inspect the pinned scan test",
        sourceUrl: `${securityRepository}/blob/${securityCommit}/internal/scan/service_test.go#L16-L33`,
        limitation: "Deterministic unit-test replay—not a live OSV or KEV request, HTTP end-to-end run, durable-storage proof, or automated remediation.",
        steps: [
          {
            title: "Declare the synthetic component",
            detail: "The test submits one Go component with a fixed name, version, ecosystem, and project identifier.",
            state: "input",
          },
          {
            title: "Inject vulnerability evidence",
            detail: "A deterministic HTTP transport returns one advisory with a fixed version instead of contacting the public OSV service.",
            state: "processing",
          },
          {
            title: "Apply the policy boundary",
            detail: "The declared known-exploited context promotes the finding to critical without model-generated reasoning.",
            state: "recovery",
          },
          {
            title: "Store and retrieve the result",
            detail: "The memory store returns the same scan identifier, proving replayable result persistence within this test boundary.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-09-23",
  },
] satisfies Project[];

export const projects = z.array(projectSchema).parse(projectInput);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
