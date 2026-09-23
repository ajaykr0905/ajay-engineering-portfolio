# Release status

Status recorded on 2026-09-23.

## Monochrome cosmos preview

- Feature branch: `feature/2026-09-23-astral-portfolio`
- Public pages are dark-only and image-free. The previous bust/portal artwork, light
  theme, theme control, and hero image-delivery configuration are removed.
- Public identity is `Ajay`; legal-name occurrences remain only where required by the
  résumé PDF, copyright, or functional account URLs.
- A deterministic 128/80/48-star Canvas cosmos uses three depth levels, a 72-second
  seamless loop, two connections per star within 120 CSS pixels, a 30 FPS cap, and
  a 1.5 device-pixel-ratio cap.
- Editorial project rows and standalone controls expose distinct spectrum contracts.
  The CSS-only spectrum follows a 32-second cycle and has paused, reduced-motion,
  coarse-pointer, keyboard, and forced-colors fallbacks.
- Inter Tight is pinned and self-hosted under the SIL OFL 1.1. The typography-only
  monochrome 1200 × 630 social card is checked in with prompt and hash provenance.
- The three existing `visualKey` values select constellation geometry only. No
  security-harness motif, fake live metric, or unverified capability was added.

## Release gates

| Gate | Revision status |
| --- | --- |
| Lint and type checking | Passed |
| Unit/data tests | 20 passed |
| Internal-link validation | Passed across 24 source files |
| Production build and bundle-size check | Passed; 102 kB shared first-load JS; layout client chunk 2,894 bytes gzip |
| Playwright desktop/mobile suite | 35 passed, 7 intentional profile skips, 0 failed |
| Axe accessibility scan | Passed with no violations on home and flagship project routes |
| Lighthouse 0.90 / 0.95 / 0.95 / 0.95 gates | Passed in all 9 runs: 0.99 / 1.00 / 1.00 / 1.00 |
| Secret-sensitive diff review | Passed; local pattern scan and independent review found no secrets or private paths |
| Signed-out production-route verification | Pending after release candidate deployment |
| Human macOS VoiceOver pass | Pending manual sign-off |
| Protected Vercel preview review | Pending manual approval |

Production `main` must remain unchanged until every automated gate passes and both
manual gates are approved. Final counts and performance scores must be added only
from the completed revision's own reports.

## Existing project evidence retained

- Transformer lab: nine CPU verification tests, a versioned deterministic smoke
  artifact, and a controlled full-tuning versus LoRA parameter comparison.
- Distributed validation lab: race-tested concurrency, bounded retries, dead
  letters, REST controls, Prometheus-format counters, RabbitMQ/PostgreSQL adapters,
  and versioned memory-adapter samples.
- VoiceMed AI: strict schemas, provider adapters, deterministic no-key mode,
  human-review gating, and checked unit/contract/browser evidence.
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
- A tested Evidence for Security Harness repository or constellation.
- Separate always-on deployments for the training lab, distributed lab, and AI
  journey.
