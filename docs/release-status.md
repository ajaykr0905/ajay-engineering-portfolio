# Release status

Status recorded on 2026-09-23.

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
