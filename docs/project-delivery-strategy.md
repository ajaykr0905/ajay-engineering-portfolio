# End-to-end engineering project delivery strategy

Status: active operating plan, 2026-09-22

This plan turns the featured repositories into public, reproducible engineering
evidence. The standard is senior-quality design and execution: explicit
invariants, failure handling, reproducibility, operability, measured results,
and honest limitations. It is not a claim of unearned years of production
experience.

## Outcome

Every featured project must give a reviewer a complete path:

```text
portfolio case study
        |
        +--> public demo or evidence dashboard
        |
        +--> tagged GitHub release
                 |
                 +--> under-five-minute local quickstart
                 +--> architecture and failure model
                 +--> CI, tests, and evidence artifacts
                 +--> runbook and known limitations
```

A repository is not complete because its README uses production language. It is
complete only when the code, commands, tests, deployment, and evidence support
the public claims.

## What the three projects solve

| Project | Engineering question | What exists now | Gap to the intended claim |
| --- | --- | --- | --- |
| Distributed Scale Validation Lab | Can an at-least-once work pipeline retry failures without losing work or creating duplicate durable results? | Deterministic generation, queue and store contracts, memory execution, RabbitMQ and PostgreSQL adapters, bounded retries, dead letters, REST control API, race-tested code, and an external-adapter CI check. | The application path still runs in one process with memory adapters. It needs separate producers/workers, real broker/database wiring, run state, failure drills, and external-path scale evidence. |
| VoiceMed AI | Can speech-derived documentation be made inspectable and fail closed through strict schemas and an explicit export gate? | Deterministic no-key workflow, optional provider adapters, bounded schemas, a browser workflow, an export confirmation gate, and unit/browser tests. | It needs claim corrections, deterministic report rendering, editable review, route/failure tests, demo-only production mode, a standalone public deployment, and monitoring. |
| Fault-Tolerant Transformer Lab | Can a small training run stop and resume without silently changing the verified outcome? | Deterministic CPU training, causal and gradient checks, configuration-bound atomic replacement, exact checked restart equivalence, and a controlled full-tuning/LoRA experiment. | It needs a real killed-process recovery demo, crash-durable checkpoint generations and validation, full artifact provenance, a locked one-command environment, and a separately scoped serving path. |

## What “deployed” means

The deployment proof depends on the product type.

| Type | Required public proof | Required local proof |
| --- | --- | --- |
| Web product | Unauthenticated HTTPS demo, synthetic data, health check, post-deploy smoke test, monitoring, rollback path, and no public paid-provider access. | Clean clone to production-mode build and complete browser workflow with documented commands. |
| Distributed system lab | Read-only evidence dashboard first; a bounded live reference environment only after abuse and cost controls exist. | One Compose command starts the API, producer, multiple workers, broker, and database; a second command runs normal and failure scenarios. |
| ML systems lab | Static evidence explorer and, if useful, a small bounded CPU service. GPU runs are on-demand evidence jobs rather than an idle public endpoint. | One command reproduces tests, baseline, interruption/restart, equivalence verification, and machine-readable artifacts. |

Free hosting that sleeps is not an availability guarantee. If “always on” is a
hard requirement, the deployment needs a paid runtime, a cost ceiling, an
external synthetic monitor, an alert destination, and a tested recovery
runbook.

## Shared release contract

All three projects must pass the following gates before their status changes to
`Shipped`.

### 1. Problem and guarantees

- State the user or engineering problem in one paragraph.
- Document invariants, trust boundaries, failure assumptions, and non-goals.
- Separate proven behavior from planned behavior.
- Include an architecture diagram plus happy-path and failure-path sequences.
- Record consequential choices as short architecture decision records.

### 2. Clean-clone reproducibility

- Pin the language/runtime and lock dependencies.
- Provide a canonical verification command and a canonical demo command.
- Include `.env.example` without credentials and validate configuration at
  startup.
- Use deterministic synthetic fixtures by default.
- Support current amd64 and arm64 developer machines where dependencies permit.

### 3. Verification depth

- Run format/lint, static analysis, unit, integration, failure, and end-to-end
  checks appropriate to the project.
- Test the negative path: malformed input, timeouts, cancellation, partial
  writes, retries, duplicate delivery, corrupt artifacts, and shutdown.
- Build the release container in CI and smoke-test the produced artifact.
- Keep expensive GPU or scale suites opt-in, but record their environment and
  raw results when they run.

### 4. Operability and safety

- Expose health and readiness separately when the service has dependencies.
- Emit structured logs with request/run identifiers and no sensitive payloads.
- Measure latency, error, saturation, retry, and recovery signals relevant to
  the system.
- Bound input size, concurrency, time, retries, memory, and public cost.
- Document startup, shutdown, rollback, data cleanup, and incident checks.

### 5. Evidence and release

- Generate artifacts from code without manual editing.
- Record commit SHA, exact command, configuration, dependency lock hash,
  platform/hardware, timestamps, raw results, artifact hashes, and limitations.
- Publish immutable semantic-version tags, checksums, changelog, and release
  notes only after CI passes.
- Link the live surface, release, evidence, architecture, and quickstart from
  the portfolio.
- Keep a 60–90 second demo script that shows one happy path and one meaningful
  failure/recovery path.

## Prioritization

The sequence optimizes role relevance, current readiness, public demo value,
and risk. Work in progress stays limited to one flagship implementation plus
small portfolio/link updates.

### Now — Distributed Scale Validation Lab

This is first because it is the closest to the target backend/distributed role,
but its current adapter test must become a real multi-process application.

#### D0: reproducible release shell

- Align the Docker and Go toolchain versions.
- Add `make verify`, `make demo`, `make demo-infra`, and `make down`.
- Add API, producer, and worker images to Compose with readiness checks and
  pinned infrastructure versions.
- Add container build and clean-clone smoke checks to CI.

Acceptance: one documented command builds the full stack, waits for readiness,
runs a deterministic scenario, prints the result, and exits successfully.

#### D1: genuine distributed vertical slice

- Split the control API/producer and worker into separate processes.
- Select memory or RabbitMQ/PostgreSQL adapters through validated
  configuration.
- Persist run state, accepted task counts, outcomes, attempts, and dead-letter
  metadata.
- Return `202 Accepted` with a run identifier and add bounded status/result
  endpoints.
- Use a transactional outbox for the database-to-broker publication boundary.
- Keep consumer idempotency on stable message identifiers.
- Treat handled retries as work state rather than a reason to terminate a run.

Acceptance: at least three worker containers process 1,000 deterministic tasks;
the queue drains, durable unique results equal generated tasks, and duplicate
delivery creates no duplicate rows.

#### D2: deterministic failure laboratory

- Fail the first N database writes.
- Kill a worker after commit and before acknowledgement.
- Pause/restart the database and broker.
- Exercise malformed input, retry exhaustion, dead-letter inspection, and
  bounded redrive.
- Produce a machine-readable scenario timeline and expected/actual counters.

Acceptance: accepted work completes after worker restart without duplicate
durable results, each scenario has exact retry/dead-letter expectations, and at
least one restart drill runs in CI.

#### D3: scale evidence and recruiter release

- Benchmark the external path with 1/2/4/8 workers and bounded workload sizes.
- Record warm-up and repeated samples, throughput, end-to-end p50/p95/p99,
  errors, retries, duplicates, queue depth, CPU, memory, and database pressure.
- Publish raw JSON, environment metadata, methodology, limitations, dashboard,
  tagged image digest, release notes, and a concise recovery demo.

Acceptance: a clean-clone command reproduces a documented result within its
stated tolerance. No laptop measurement is described as production scale.

### Next — VoiceMed AI

VoiceMed is the fastest path to a compelling live product, but the public demo
must remain deterministic and unable to spend provider credits.

#### V0: correct the safety contract

- Remove inferred severities and codes from the demo fixture, or make the
  source transcript state them explicitly.
- Rename the current checkbox accurately as an export confirmation gate until
  an editable review workflow exists.
- Add `APP_MODE=demo|provider` and force public production to `demo`.
- Render the report deterministically from validated entities rather than with
  a second generative call.
- Add data-provenance and threat-model documents.

Acceptance: every structured demo value maps to source text, no public route can
invoke a paid provider, and the UI makes no clinical-validation claim.

#### V1: reproducible and failure-safe application

- Pin Node, add one full verification command, and add a production-mode demo
  command or container.
- Add a health route, non-root image, and container health check.
- Validate every route; add provider timeouts/cancellation and explicit error
  classes.
- Add editable fields, evidence spans, and automatic review invalidation after
  a correction.
- Surface microphone, network, provider, schema, and export failures safely.
- Test routes, headers, size/type limits, rate limits, malformed provider
  output, timeouts, reset behavior, and downloaded content.

Acceptance: critical happy and failure paths run in CI, invalid input fails
closed, provider outage cannot hang a request, and a report cannot add facts
outside validated fields.

#### V2: standalone public release

- Deploy a demo-only production project with no provider secrets.
- Add preview builds, post-deploy synthetic workflow checks, dependency and
  secret checks, an SBOM, masked logs, uptime monitoring, and rollback steps.
- Publish a versioned synthetic evaluation corpus before publishing accuracy
  metrics.

Acceptance: an unauthenticated reviewer can complete the synthetic workflow;
monitoring detects a broken workflow; rollback is tested; provider spend is
impossible from the public application.

### Later — Fault-Tolerant Transformer Lab

The transformer project has strong correctness foundations, but operational
fault tolerance and serving should be separate evidence gates.

#### T0: reproducible evidence bundle

- Lock dependencies and add setup, verification, demo, and container commands.
- Add lint, typing, package/container builds, and security checks to CI.
- Generate provenance-rich artifacts with direct/resumed state hashes.
- Remove the unused serving extra until a serving implementation exists.

Acceptance: the same CPU demo command passes from a clean clone and in CI, and
all checked artifacts are generated without hand edits.

#### T1: real recovery demonstration

- Run an uninterrupted baseline, terminate a separate training process after a
  known checkpoint, resume in a fresh process, and compare complete state.
- Add file and directory synchronization, checksums, bounded checkpoint
  generations, structural validation, last-known-good fallback, and clear
  failure classes.
- Test interruption before/during/after replacement plus truncated, corrupt,
  incompatible, and configuration-drifted checkpoints.
- Never accept user-uploaded pickle-backed checkpoints.

Acceptance: one command exits successfully only when restarted model,
optimizer, loss history, token count, and state hashes match the baseline in
the declared CPU/software environment.

#### T2: bounded data and serving evidence

- Add an optional public dataset pinned by revision, checksum, and license while
  keeping the offline synthetic fixture as the fast default.
- Build a small CPU evidence service around repository-produced artifacts with
  health/readiness, bounded requests, structured logs, metrics, timeouts,
  graceful shutdown, and last-known-good model retention.
- Publish failure/load evidence and a static recovery dashboard.

Acceptance: a corrupt candidate artifact cannot replace the healthy model; the
local service is one-command reproducible; latency/error/memory results name the
exact environment.

#### T3: real GPU gate

- Run single-GPU evidence before any two-GPU DDP/FSDP experiment.
- Record image digest, GPU, driver/CUDA, commit, utilization, throughput,
  memory, recovery time, cost, raw results, and limitations.
- Inject a real worker termination before describing distributed recovery.

Acceptance: GPU and multi-GPU claims appear only after the matching real
hardware artifacts exist. GPU work remains an on-demand, budget-capped job.

## Scope discipline

### Must

- Working local quickstart, CI parity, failure tests, versioned evidence,
  honest README, tagged releases, public links, monitoring, and runbooks.

### Should

- Structured telemetry, architecture decisions, reproducible benchmark
  reports, signed or checksummed artifacts, and short demo recordings.

### Could

- Kubernetes deployment, richer dashboards, OpenTelemetry traces, private
  provider mode, and real GPU experiments after the core gates pass.

### Will not claim now

- Production-scale operation, exactly-once delivery, clinical accuracy or
  compliance, real-patient safety, multi-region reliability, or multi-GPU
  experience without matching public evidence.

## Public communication

GitHub and LinkedIn updates follow the evidence, not the other way around. Each
milestone post should contain:

1. The concrete problem and invariant.
2. One architecture or failure-flow visual.
3. The exact failure injected or experiment run.
4. A measured result with method and limitation.
5. Links to the tagged release, live surface, code, and raw artifact.

Resume bullets and portfolio status change only after the corresponding release
gate passes. The implementation may meet a senior-quality bar; the wording must
still identify it as independently built public portfolio work.

## Decisions deferred until their gate

- Monthly hosting budget and alert destination for an always-on distributed
  reference environment.
- Domain/subdomain naming for standalone demos.
- GPU provider and hard spending ceiling.
- Independent clinical/data review before any VoiceMed accuracy or safety
  statement.

None of these decisions blocks D0, so implementation starts with the
Distributed Scale Validation Lab release shell and vertical slice.
