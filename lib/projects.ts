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
  evidenceLinks: z.array(z.object({ label: z.string().min(1), url: z.string().url() })).optional(),
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

const transformerRepository = "https://github.com/ajaykr0905/fault-tolerant-transformer-lab";
const transformerTuningCommit = "41dcd0ea315515f63ea764225867ff569bc50316";
const transformerTuningCommitUrl = `${transformerRepository}/commit/${transformerTuningCommit}`;
const transformerTuningCiUrl = "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/actions/runs/35731966039/job/106759520958";
const transformerRecoveryCommit = "e6a7d44a7f60b5f87e60e28efe6232070b43954e";
const transformerRecoveryCommitUrl = `${transformerRepository}/commit/${transformerRecoveryCommit}`;
const transformerRecoveryCiUrl = "https://github.com/ajaykr0905/fault-tolerant-transformer-lab/actions/runs/37114067040/job/111177338320";
const transformerRecoveryArtifacts = `${transformerRepository}/tree/${transformerRecoveryCommit}/artifacts/peps-process-kill-2026-10-03`;

const distributedCommit = "e0a1a197265869a15043df462d1f230221660ba5";
const distributedRepository = "https://github.com/ajaykr0905/distributed-scale-validation-lab";
const distributedDurableSource = "6b01125cb71d49fc2fba1cf009aeb7d45e61cab6";
const distributedDurableArtifacts = "0a03f985bb78a7a0889e541ece71672b74a73912";
const distributedDemoCommit = "cf0ab0f93adc55f74fbdbcce2243dd6ecee3dd68";
const distributedDurableCiUrl = "https://github.com/ajaykr0905/distributed-scale-validation-lab/actions/runs/37741425446/job/113192773204";
const distributedBenchmarkCommand = `git checkout ${distributedDurableSource} && go build -o bin/durable ./cmd/durable && go build -o bin/durable-benchmark ./cmd/benchmark && SCALE_LAB_DOCKER_PROJECT=ajay-durable-local bin/durable-benchmark -bin bin/durable -seed public-durable-v1 -warmup 100 -count 1000 -output artifacts/local/durable-benchmark.json`;

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
      "CPU transformer checkpoint recovery after real process kills. Four pinned public-data drills match an independent control; GPU and serving remain planned.",
    currentFocus:
      "Extend the verified process-kill recovery path to asynchronous kill timing, then measure controlled model-quality ablations before adding GPU or serving claims.",
    status: "Runnable Lab",
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
        title: "Independent recovery workers",
        detail:
          "A parent pauses a worker at a known uncommitted step-two boundary and sends SIGKILL. Separate spawned control, replay, and completion processes prevent accidental inheritance of model, optimizer, or RNG state.",
      },
      {
        title: "Public-data proof, network-free CI",
        detail:
          "Local evidence uses the pinned public PEP corpus. CI exercises the same verifier with an independently written CC0 fixture, so it checks recovery semantics without downloading or claiming to rerun the corpus proof.",
      },
    ],
    tradeoffs: [
      "A small public model gives reviewers reproducibility rather than impressive but unauditable scale.",
      "Pinned test and artifact replay is reliable and free, but it is not live training, serving, or a GPU endpoint.",
    ],
    failureModes: [
      "SIGKILL at before-forward, after-backward, after-optimizer, and during-checkpoint-write boundaries, with durable step one restored after attempted step two.",
      "An abandoned checkpoint staging file after mid-write termination; the next successful save removes it without treating it as a committed generation.",
      "Checkpoint integrity or configuration, dataset, tokenizer, and run-contract mismatch during restart.",
      "Worker startup/completion deadlines and error cleanup, without leaving a child process running.",
      "Causal-mask or gradient regressions caught by focused tests.",
    ],
    verification: [
      "Finite-difference and framework gradient checks.",
      "Repeatable CPU smoke training in CI.",
      "Four actual parent-controlled SIGKILL drills on pinned public PEP data: six steps, 384 input tokens, and 12 sampled windows per control/recovered run.",
      "Sixteen verification checks require exact model and optimizer tensors, RNG state, loss/batch/sample histories, cursor, counters, logits, checkpoint state, and fingerprints, plus staging cleanup.",
      "Network-free CI uses the CC0 fixture for all four kill boundaries, deadline cleanup, dataset drift rejection, and CLI behavior; it is separate from the local public-corpus reports.",
    ],
    limitations: [
      "No public multi-GPU result is claimed yet.",
      "The tiny CPU proof consumes 12 windows from 12 documents, not every document in the 536-document training split or 656-document manifest.",
      "SIGKILL is sent while the worker is paused at a known boundary; arbitrary asynchronous kill timing remains unverified.",
      "The OS and filesystem stay alive. This is not a power-loss durability proof, a model-quality result, distributed training, or production-readiness evidence.",
      "Local startup, restore, replay, and IPC timings are not throughput benchmarks or recovery SLOs.",
      "The public demo is an artifact explorer, not an always-on inference service.",
    ],
    metrics: [
      {
        value: "4 / 4",
        label: "SIGKILL boundaries recovered on public data",
        method: "Kill the worker at each declared step-two boundary, restore durable step one, replay the failed batch, and finish the six-step pinned PEP run. Each report records exit code -9, zero durable committed steps lost, and all 16 exact verification checks passing.",
        evidence: {
          sourceLabel: "Four pinned public-data process-kill reports",
          sourceUrl: transformerRecoveryArtifacts,
          commitSha: transformerRecoveryCommit,
          commitUrl: transformerRecoveryCommitUrl,
          command: "for point in before-forward after-backward after-optimizer during-checkpoint-write; do uv run --frozen fttl-verify-process-recovery --config configs/peps-cpu.json --dataset-manifest .cache/fttl/peps-v1/manifest.json --failure-point \"$point\" --output \"artifacts/local-process-$point\"; done",
          ciLabel: "Passing CPU verifier job · network-free CC0 fixture",
          ciUrl: transformerRecoveryCiUrl,
          environment: "Local deterministic CPU · pinned environment in each report; CI uses ubuntu-latest · Python 3.12 · CC0 fixture",
          limitation: "Known paused boundaries in a tiny six-step CPU run; not arbitrary kill timing, power loss, GPU scale, model quality, or production readiness. CI does not rerun the public corpus.",
        },
      },
      {
        value: "5.5%",
        label: "trainable parameters in the controlled LoRA run",
        method: "The same initialized model, synthetic batches, seed, and step budget were used for full tuning and LoRA; 1,536 LoRA parameters were trainable versus 28,032 in full tuning. This is a parameter-efficiency result, not a quality claim.",
        evidence: {
          sourceLabel: "Pinned comparison artifact",
          sourceUrl: `${transformerRepository}/blob/${transformerTuningCommit}/artifacts/tuning-comparison/result.json`,
          commitSha: transformerTuningCommit,
          commitUrl: transformerTuningCommitUrl,
          command: "fttl-compare-tuning --config configs/smoke.json --output artifacts/tuning-comparison/result.json",
          ciLabel: "Passing deterministic CPU verification job",
          ciUrl: transformerTuningCiUrl,
          environment: "Local CPU artifact · Python 3.12.14 · PyTorch 2.14.0; command also runs in CI",
          limitation: "Parameter-efficiency observation on a randomly initialized tiny model and synthetic tokens; not a quality comparison.",
        },
      },
      {
        value: "rtol 0 / atol 0",
        label: "resumed model-state equality",
        method: "For each public-data kill drill, compare the uninterrupted and recovered six-step model tensors exactly with torch.equal. The same reports also require exact optimizer/RNG state, loss and sample histories, cursor, counters, logits, checkpoint state, and fingerprint equality.",
        evidence: {
          sourceLabel: "Pinned exact-state process-kill report",
          sourceUrl: `${transformerRepository}/blob/${transformerRecoveryCommit}/artifacts/peps-process-kill-2026-10-03/after-optimizer/process-recovery-report.json`,
          commitSha: transformerRecoveryCommit,
          commitUrl: transformerRecoveryCommitUrl,
          command: "uv run --frozen fttl-verify-process-recovery --config configs/peps-cpu.json --dataset-manifest .cache/fttl/peps-v1/manifest.json --failure-point after-optimizer --output artifacts/local-process-after-optimizer",
          ciLabel: "Passing CPU verifier job · network-free CC0 fixture",
          ciUrl: transformerRecoveryCiUrl,
          environment: "Local deterministic CPU · pinned public PEP corpus · six steps; CI independently checks CC0 fixture recovery",
          limitation: "Exact-state equality for this tiny deterministic CPU configuration and known failure boundary; not a model-quality, GPU, distributed restart, or recovery SLO claim.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "checkpoint-recovery",
        label: "Checkpoint recovery",
        outcome: "After a real step-two SIGKILL, recovery from durable step one reaches the same six-step state as an independent control, with all 16 exact checks passing.",
        sourceLabel: "Inspect the pinned public-data SIGKILL report",
        sourceUrl: `${transformerRepository}/blob/${transformerRecoveryCommit}/artifacts/peps-process-kill-2026-10-03/after-optimizer/process-recovery-report.json`,
        limitation: "Replay of a pinned local CPU report, not live training. The killed worker pauses at a known boundary; this does not prove arbitrary kill timing, power-loss durability, GPU recovery, or distributed training.",
        steps: [
          {
            title: "Run the control path",
            detail: "An independently spawned control trains the tiny configuration for six deterministic CPU steps on pinned PEP data: 384 input tokens across 12 sampled windows.",
            state: "input",
          },
          {
            title: "Kill an uncommitted step",
            detail: "A second worker durably saves step one, pauses after the step-two optimizer update, and is killed by the parent with SIGKILL; the report requires exit code -9.",
            state: "failure",
          },
          {
            title: "Restore and replay the failed batch",
            detail: "A fresh replay process loads durable generation one, restores model/optimizer/RNG/cursor state, consumes the identical failed batch and sample IDs, and durably commits step two.",
            state: "recovery",
          },
          {
            title: "Finish in another fresh process",
            detail: "A fourth spawned worker loads the replayed checkpoint and completes the remaining four steps without inheriting in-memory training state.",
            state: "processing",
          },
          {
            title: "Require exact final-state equality",
            detail: "All 16 report checks must pass, including every model/optimizer tensor, RNG state, histories, cursor, counters, logits, checkpoint state, fingerprints, and staging cleanup.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-10-03",
  },
  {
    slug: "distributed-scale-validation-platform",
    title: "Distributed Scale Validation Lab",
    eyebrow: "Reliable background jobs",
    visualKey: "distributed",
    summary:
      "Durable Go API, outbox dispatcher, RabbitMQ workers, and PostgreSQL. Pinned recovery tests and single-host measurements; not production.",
    currentFocus:
      "Study admission saturation, authenticated operation, and dependency failover beyond the verified single-host proof.",
    status: "Runnable Lab",
    featured: true,
    roleAlignment: ["Distributed systems", "Backend engineering", "Platform reliability"],
    stack: ["Go", "PostgreSQL", "RabbitMQ", "Prometheus", "Docker"],
    repositoryUrl: "https://github.com/ajaykr0905/distributed-scale-validation-lab",
    demoPath: "/projects/distributed-scale-validation-platform#failure-replay",
    demoUrl: `${distributedRepository}/blob/${distributedDemoCommit}/artifacts/2026-10-08-recovery-demo.mp4`,
    evidenceLinks: [
      { label: "Experimental v0.1.0 prerelease", url: `${distributedRepository}/releases/tag/v0.1.0` },
      { label: "Clean-clone setup", url: `${distributedRepository}/blob/${distributedDurableSource}/README.md` },
      { label: "Durable operating contract", url: `${distributedRepository}/blob/${distributedDurableSource}/docs/durable-backend.md` },
      { label: "Corrected local measurement report", url: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-durable-results-v2.md` },
      { label: "Raw observed-result samples", url: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-durable-benchmark-v2.json` },
      { label: "Broker-restart receipt", url: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-recovery-v2.json` },
      { label: "Later binary provenance and its limits", url: `${distributedRepository}/blob/6cc588b72cb44258d65ea12e6f18ec281e9ea033/artifacts/2026-10-08-binary-inspection-v2.json` },
      { label: "90-second terminal replay receipt", url: `${distributedRepository}/blob/${distributedDemoCommit}/artifacts/2026-10-08-recovery-demo.json` },
      { label: "Historical in-memory functional receipts", url: `${distributedRepository}/blob/${distributedCommit}/artifacts/2026-09-22-memory-10000.json` },
    ],
    problem:
      "Durable acceptance and message settlement are separate failure boundaries. The lab makes missing publication, duplicate delivery, process exit, broker interruption, retries, and database errors inspectable using public synthetic inputs.",
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
      {
        title: "Atomic job and publication intent",
        detail:
          "POST /api/v1/jobs commits the canonical payload, stable idempotency key, and outbox event together. The dispatcher locks one due row with SKIP LOCKED and marks it sent only after broker confirmation and transaction commit.",
      },
      {
        title: "Commit before acknowledgement",
        detail:
          "Workers commit result and terminal status together before acknowledging. Validation failures commit retry/dead events; SQL failures roll back and requeue without consuming the validation attempt budget.",
      },
      {
        title: "Bounded work and visible accounting",
        detail:
          "Admission returns 429 at its unfinished-job capacity; worker prefetch is one and database pools are bounded. PostgreSQL-backed gauges expose accepted, pending, retrying, completed, failed, outbox, retry, and duplicate state.",
      },
    ],
    tradeoffs: [
      "Dependency-free tests are fast and reviewable, but they do not replace broker and database integration tests.",
      "A single sequential producer and one confirmed outbox publication at a time can bottleneck the local benchmark; extra workers did not demonstrate linear scaling.",
      "Row locks remain held during a bounded publish-confirm wait. This simple lab contract trades dispatch parallelism against transaction duration.",
    ],
    failureModes: [
      "Redelivery after a worker acknowledges too late.",
      "Duplicate writes after a persistence retry.",
      "Poison messages exhausting bounded retries.",
      "Actual fault-helper subprocess exits before commit, after commit-before-ack, and after dispatcher publication; known injected boundaries, not arbitrary SIGKILL timing.",
      "A live broker outage leaves accepted jobs and outbox state pending until independent dispatcher and worker processes reconnect.",
      "Database/context failures roll back processing; AMQP startup obeys cancellation and timeout even when the peer stalls before handshake.",
    ],
    verification: [
      "Go unit and concurrency tests.",
      "Deterministic workload generation from a fixed seed.",
      "Equal generated and stored counts for successful runs.",
      "Restricted Kubernetes workload security context.",
      "Real-service integration covers idempotency/conflict/capacity, retry exhaustion, dead queues, SQL rollback, subprocess exits, broker restart, and graceful independent-process shutdown.",
      "Corrected observed-result measurements retain every worker-count trial, all raw latencies and queue/resource samples, exact dependency image references, and the reported clean source commit.",
    ],
    limitations: [
      "External-path measurements are a single-host synthetic lab with RabbitMQ/PostgreSQL in Docker Desktop, not a distributed cluster or production capacity claim.",
      "Observed latency spans client submission through the first observed committed result and includes approximately 50 ms polling, SQL/resource sampling, and scheduler overhead; it is not an isolated database commit duration.",
      "RSS/CPU cover API, dispatcher, and workers only. Broker, database, and Docker VM resources are excluded; samples can miss peaks and ps CPU percentages are lifetime averages.",
      "Recovery timing includes Compose startup and health checks. Known helper exit boundaries and one broker restart do not prove arbitrary crash timing, power loss, database failover, or a recovery SLO.",
      "The unauthenticated localhost API is a single-tenant lab. Authorization, retention/redrive policy, and HA deployment are not implemented.",
      "Historical 10,000-job evidence remains a single-process memory-adapter functional run. The original SQL-timestamp benchmark is superseded by corrected observed-result receipts.",
      "The v2 measurement runs recorded source and clean state but did not capture runtime binary hashes. A later matching-build provenance check cannot retroactively prove the executed binary bytes.",
      "The 90-second video replays actual agent-executed terminal output, with no learner narration. Its 5.119233-second broker restart is a separate trial from the v2 receipt's 3.401676166 seconds; both include Compose health wait.",
    ],
    metrics: [
      {
        value: "12 / 12",
        label: "external-path trials fully accounted",
        method: `At clean measured source ${distributedDurableSource.slice(0, 7)}, each of 1/2/4/8 worker-count groups runs 100 warmups followed by three 1,000-job trials. All 12,000 measured jobs complete; each isolated schema retains 3,100 accepted/completed jobs and results, no pending outbox, and no normal-load retries or duplicates. The reproduction command includes the full source pin; use the pinned README's service environment.`,
        evidence: {
          sourceLabel: "All corrected trial receipts",
          sourceUrl: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-durable-benchmark-v2.json`,
          commitSha: distributedDurableArtifacts,
          commitUrl: `${distributedRepository}/commit/${distributedDurableArtifacts}`,
          command: distributedBenchmarkCommand,
          ciLabel: "Passing durable race/integration job; local benchmark not rerun",
          ciUrl: distributedDurableCiUrl,
          environment: "Local Darwin/arm64 · Go 1.26.4 · 11 logical CPUs · isolated Docker Desktop PostgreSQL/RabbitMQ · separate Go processes",
          limitation: "Single-host synthetic accounting, not production capacity. Original runs did not capture executable hashes; later matching-build metadata cannot prove historical runtime bytes. CI validates recovery contracts separately.",
        },
      },
      {
        value: "262.73 – 323.21",
        label: "jobs/s across all twelve local trials",
        method: "Range over every measured 1,000-job trial with 1, 2, 4, or 8 independent workers. Throughput includes HTTP submission and polling through committed-result observation. The raw samples retain all three trials per group, without choosing only the fastest.",
        evidence: {
          sourceLabel: "All trial throughput and raw samples",
          sourceUrl: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-durable-benchmark-v2.json`,
          commitSha: distributedDurableArtifacts,
          commitUrl: `${distributedRepository}/commit/${distributedDurableArtifacts}`,
          command: distributedBenchmarkCommand,
          ciLabel: "Passing durable race/integration job; local benchmark not rerun",
          ciUrl: distributedDurableCiUrl,
          environment: "Local Darwin/arm64 · Go 1.26.4 · 11 logical CPUs · RabbitMQ/PostgreSQL in isolated Docker Desktop services",
          limitation: "Lightweight synthetic validation on one host. The sequential HTTP producer and confirmed dispatcher can bottleneck load; these results do not demonstrate linear worker scaling or cluster capacity. Resource sampling excludes broker/database/VM costs.",
        },
      },
      {
        value: "95.43 – 151.08",
        label: "ms observed p95 across trials",
        method: "Each trial's p95 uses the floor of (n−1)×0.95 over sorted client-monotonic latencies. Timing begins immediately before HTTP submission and ends when a query first observes the committed completed-job/result join. The displayed range is over all twelve trials.",
        evidence: {
          sourceLabel: "Raw committed-result observations",
          sourceUrl: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-durable-benchmark-v2.json`,
          commitSha: distributedDurableArtifacts,
          commitUrl: `${distributedRepository}/commit/${distributedDurableArtifacts}`,
          command: distributedBenchmarkCommand,
          ciLabel: "Passing durable race/integration job; local benchmark not rerun",
          ciUrl: distributedDurableCiUrl,
          environment: "Local Darwin/arm64 · Go 1.26.4 · client observation polling approximately every 50 ms plus query/resource sampling and scheduling",
          limitation: "Includes acceptance, delivery, processing, result commit, and observation overhead. Not isolated SQL commit duration; no fixed upper polling delay under load. Original pre-commit SQL timestamps are not used for this claim.",
        },
      },
      {
        value: "3.402 s",
        label: "broker-restart observation · one sample",
        method: "The corrected receipt records 3.401676166 seconds from Compose restart invocation through health wait and the outage job's committed-result observation. Final durable accounting is two accepted/completed jobs and two results, with no pending/retrying/failed work and one deliberately replayed duplicate.",
        evidence: {
          sourceLabel: "Corrected broker-restart receipt",
          sourceUrl: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-recovery-v2.json`,
          commitSha: distributedDurableArtifacts,
          commitUrl: `${distributedRepository}/commit/${distributedDurableArtifacts}`,
          command: `git checkout ${distributedDurableSource} && SCALE_LAB_DOCKER_PROJECT=ajay-durable-local SCALE_LAB_INTEGRATION=1 go test -race -tags=integration ./internal/durable -run '^TestIndependentProcessesAndBrokerRestart$' -count=1`,
          ciLabel: "Passing real-service process/recovery job",
          ciUrl: distributedDurableCiUrl,
          environment: "Local Darwin/arm64 · Go 1.26.4 · separate dispatcher/worker binaries · actual isolated Compose broker stop/restart",
          limitation: "One local sample including Compose startup/health, not a recovery SLO, database failover, or production result. The demo's later 5.119233-second restart is a different trial and is not substituted for this receipt.",
        },
      },
    ],
    replayScenarios: [
      {
        id: "commit-before-ack",
        label: "Commit before ack",
        outcome: "A helper exits after commit but before acknowledgement. Redelivery leaves one accepted, completed job, one result, and one accounted duplicate.",
        sourceLabel: "Inspect the pinned process-exit regression",
        sourceUrl: `${distributedRepository}/blob/${distributedDurableSource}/internal/durable/integration_test.go`,
        limitation: "Real PostgreSQL/RabbitMQ test-helper exit at a known boundary—not arbitrary SIGKILL timing or live telemetry.",
        steps: [
          {
            title: "Accept durable work",
            detail: "The fixture commits one job and its outbox event, then publishes its stable identity through RabbitMQ.",
            state: "input",
          },
          {
            title: "Commit result and completed status",
            detail: "The helper locks the job, validates it, and commits the result and terminal status in one PostgreSQL transaction.",
            state: "processing",
          },
          {
            title: "Exit before acknowledgement",
            detail: "The AfterCommit hook exits the real helper process with code 86, leaving the committed effect but an unsettled delivery.",
            state: "failure",
          },
          {
            title: "Absorb redelivery",
            detail: "The next processor sees the completed job under its row lock, records the duplicate, and acknowledges without inserting a second result.",
            state: "recovery",
          },
          {
            title: "Assert durable accounting",
            detail: "The test requires one accepted job, one completed job, one result, and exactly one duplicate.",
            state: "verified",
          },
        ],
      },
      {
        id: "outbox-recovery",
        label: "Recover outbox",
        outcome: "Publication succeeds before the helper exits. Replaying unsent intent delivers twice, but commits one result and one accounted duplicate.",
        sourceLabel: "Inspect the pinned after-publish regression",
        sourceUrl: `${distributedRepository}/blob/${distributedDurableSource}/internal/durable/integration_test.go`,
        limitation: "Actual helper-process exit after publication at a known boundary—not exactly-once delivery, power-loss proof, or live telemetry.",
        steps: [
          {
            title: "Commit publication intent",
            detail: "Durable submission atomically creates the job and its attempt-one outbox row.",
            state: "input",
          },
          {
            title: "Publish, then exit",
            detail: "The dispatcher publishes successfully, then the AfterPublish hook exits with code 86 before the sent-state transaction commits.",
            state: "failure",
          },
          {
            title: "Dispatch unsent intent again",
            detail: "Rollback releases the row lock. A restarted dispatcher selects the unsent row, confirms a second publish, and records it sent.",
            state: "recovery",
          },
          {
            title: "Deduplicate and account",
            detail: "Processing both deliveries requires one accepted/completed job, one result, and one duplicate.",
            state: "verified",
          },
        ],
      },
      {
        id: "broker-restart",
        label: "Restart broker",
        outcome: "Independent dispatcher/worker processes recover accepted outage work after a real broker restart. Both accepted jobs finish with two results and a deliberate duplicate is accounted.",
        sourceLabel: "Inspect the pinned broker-restart receipt",
        sourceUrl: `${distributedRepository}/blob/${distributedDurableArtifacts}/artifacts/2026-10-08-recovery-v2.json`,
        limitation: "One isolated single-host Compose broker restart—not database failover, a recovery SLO, or live telemetry.",
        steps: [
          {
            title: "Finish the healthy control job",
            detail: "The test starts separate dispatcher/worker binaries and waits for the first durable job to complete.",
            state: "input",
          },
          {
            title: "Stop the isolated broker",
            detail: "The named Compose project stops RabbitMQ. A second durable submission remains pending with its publication intent intact.",
            state: "failure",
          },
          {
            title: "Restart and reconnect",
            detail: "Compose starts the broker and waits for health. The independent processes reconnect, dispatch the pending event, and commit its result.",
            state: "recovery",
          },
          {
            title: "Assert final accounting",
            detail: "The receipt records two accepted/completed jobs and two results, no pending/retrying/failed work, and one duplicate after deliberate replay.",
            state: "verified",
          },
        ],
      },
    ],
    lastVerified: "2026-10-08",
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

const projectOrder = ["distributed", "transformer", "voicemed", "security"] as const;
export const projects = z.array(projectSchema).parse(projectInput).sort(
  (left, right) => projectOrder.indexOf(left.visualKey) - projectOrder.indexOf(right.visualKey),
);

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
