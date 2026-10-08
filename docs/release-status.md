# Release status

## Backend positioning revision · 8 October 2026

- Professional identity and metadata use Ajay Kumar Pondugala; the compact header
  brand remains Ajay. Role, Bengaluru location, backend focus, and primary skills
  appear on the first screen.
- The distributed lab is the first case study and is marked Runnable Lab. Accepted
  NATS and Prometheus contributions follow, then the verified transformer CPU
  recovery case study. Corrected external-path metrics replace the older baseline
  cards; the historical memory-only receipt stays linked and explicitly scoped.
- `/recruiting` is the public one-page evidence packet. `/opensource_dev` remains
  the accepted-contribution shortcut. The canonical URL stays
  `https://ajaykr-engineering-portfolio.vercel.app`.
- NATS #1043 merged at `2026-10-01T21:36:34Z`, Prometheus #19882 at
  `2026-10-05T10:20:20Z`, and Foreman #39 at `2026-10-05T13:00:52Z`.
  Display labels explicitly use UTC. Prometheus restores activation time and
  resumes firing on the next evaluation; immediate firing is not claimed.
- Three concise field notes explain commit-before-ack, outbox recovery, and
  backpressure. They pin the corrected durable source, real-service regressions,
  and complete local observed-result receipts. Polling overhead, single-host
  scope, and the later binary-provenance inspection are explicit limitations.
- A build-generated monochrome social image aligns professional identity and
  role with the current page metadata. The previous image remains historical.
- The backend's passing durable race/integration job is linked separately from
  local measurements. All twelve trials retain 12,000 measured completed jobs;
  throughput is 262.73–323.21 jobs/s and observed p95 is 95.43–151.08 ms, including
  approximately 50 ms polling plus query, sampling, and scheduler overhead.
- The corrected broker restart receipt is one 3.401676166-second local sample.
  The 90-second captioned replay of actual agent terminal output contains a
  separate 5.119233-second restart. Both include Compose startup/health; neither
  is a recovery SLO or learner narration. Interactive replays trace the linked
  real-service helper exits and broker outage, not live system controls.
- Backend `v0.1.0` is an experimental prerelease, not a production certification.

Local verification passed: lint, type checking, 52 unit/data tests, internal-link
validation across 41 source files, production build with 21 static pages and
102 kB shared first-load JavaScript, and 52 desktop/mobile browser tests with
10 intentional profile skips. The existing mobile compactness limit is retained.
Brave runs the macOS browser checks; CI continues to use bundled Chromium.
Lighthouse category gates passed across five routes and 15 runs. Accessibility,
best-practice, and SEO medians are 1.00; performance medians are 0.94–0.99.
All samples are retained: home scored 0.71/0.99/0.94; experience 0.99/0.99/0.99;
recruiting 0.99/0.84/0.99; backend 0.93/0.99/0.99; transformer 0.98/0.98/0.99.
Warnings about DOM size, render blocking, legacy JavaScript, and main-thread
work remain visible. No existing assertion threshold was lowered.
Secret-pattern and diff checks passed. Portfolio publication and signed-out
production verification remain pending. No production capacity, multi-host
deployment, arbitrary kill timing, database
failover, or recovery SLO is claimed by these portfolio changes.

Historical release status recorded on 2026-09-23 follows.

## Monochrome cosmos preview

- Feature branch: `feature/2026-09-23-astral-portfolio`
- Public pages are dark-only and image-free. The previous bust/portal artwork, light
  theme, theme control, and hero image-delivery configuration are removed.
- Public identity is `Ajay`; legal-name occurrences remain only where required by the
  résumé PDF, copyright, or functional account URLs.
- A deterministic 216/144/80-star Canvas cosmos uses three depth levels, a 72-second
  seamless loop, two connections per star within 112 CSS pixels, a 30 FPS cap, and
  a 1.5 device-pixel-ratio cap. Six seeded bursts each send two slower shooting
  stars through separate upper and lower lanes, guaranteeing that paired paths do
  not intersect. Paused and reduced-motion modes render a static frame with no
  shooting stars.
- Editorial project rows and standalone controls expose distinct spectrum contracts.
  The CSS-only spectrum follows a 32-second cycle and has paused, reduced-motion,
  coarse-pointer, keyboard, and forced-colors fallbacks.
- Inter Tight is pinned and self-hosted under the SIL OFL 1.1. The typography-only
  monochrome 1200 × 630 social card is checked in with prompt and hash provenance.
- The four `visualKey` values select constellation geometry only. The security
  harness motif is backed by a public Go repository, commit-pinned tests, and a
  passing CI job; planned persistence and agent work remain labelled as planned.
- Short project-glyph animations, four authored wide-screen constellation
  islands, content-aware cosmic masks, and an accessible mission rail add
  meaning without adding another continuous animation loop.
- The first-screen CTA, compact mobile header, anchor offsets, route-aware
  navigation, public-safe experience strip, and two-link project rows address
  the recruiter-conversion issues found in the prior preview.
- Every published metric now exposes a commit-pinned source, exact command,
  passing CI job, environment, snapshot date, and limitation. Deterministic
  replay panels visualize linked tests and explicitly state that they are not
  live telemetry; no unsupported worker-kill control was added.
- Writing now includes two substantive implementation-backed articles on
  deterministic checkpoint recovery and at-least-once idempotency.

## Release gates

| Gate | Revision status |
| --- | --- |
| Lint and type checking | Passed |
| Unit/data tests | 43 passed |
| Internal-link validation | Passed across 30 source files |
| Production build and bundle-size check | Passed; 102 kB shared first-load JS; relevant site client chunks total 6,998 bytes gzip |
| Playwright desktop/mobile suite | 46 passed, 10 intentional profile skips, 0 failed |
| Axe accessibility scan | Passed with no violations on home and flagship project routes |
| Lighthouse 0.90 / 0.95 / 0.95 / 0.95 gates | Passed the configured assertions across 9 runs; median 0.99 / 1.00 / 1.00 / 1.00. One cold first run measured 0.77 performance; all eight subsequent runs measured 0.99. |
| Secret-sensitive diff review | Passed; local pattern scan and independent review found no secrets or private paths |
| Signed-out production-route verification | Pending after release candidate deployment |
| Human macOS VoiceOver pass | Pending manual sign-off |
| Protected Vercel preview review | Pending manual approval |

The merge was authorized after the automated gates and visual preview approval.
The human VoiceOver pass remains an explicitly documented follow-up rather than an
automated claim. Final counts and performance scores come from this revision's own
reports.

## Existing project evidence retained

- Transformer lab: nine CPU verification tests, a versioned deterministic smoke
  artifact, exact restart-state equality at zero tolerance, and a controlled
  full-tuning versus LoRA parameter comparison.
- Distributed validation lab: race-tested concurrency, bounded retries, dead
  letters, REST controls, Prometheus-format counters, RabbitMQ/PostgreSQL adapters,
  versioned memory-adapter samples, and test-grounded duplicate/retry/dead-letter
  replays.
- VoiceMed AI: strict schemas, provider adapters, deterministic no-key mode,
  human-review gating, and commit-pinned unit/contract/browser evidence.
- Evidence-First Security Harness: deterministic OSV normalization, known-exploited
  alias policy, replayable in-memory results, and commit-pinned Go test/vet CI.
- Existing portfolio routes, project evidence, repository destinations, résumé
  download, metadata, sitemap, robots, and contact behavior remain in scope for the
  final regression run.

## Public production

The canonical public address remains
<https://ajaykr-engineering-portfolio.vercel.app>. It continues to represent the
current `main` release until the monochrome branch clears its gates and is merged.
The older `ajay-dev-engineer.vercel.app` address is protected by Vercel login and
must not be used in recruiter-facing links.

## Not claimed as complete

- Transformer multi-GPU execution, vLLM or SGLang serving, and serving telemetry.
- RabbitMQ and external PostgreSQL performance benchmarks.
- VoiceMed clinical or provider-model accuracy.
- Security-harness durable storage, isolated validation workers, automatic
  remediation, or a constrained security-reasoning agent.
- Separate always-on deployments for the training lab, distributed lab, and AI
  journey.
