# Release status

Verified on 2026-09-23.

## Astral redesign preview

- Feature branch: `feature/2026-09-23-astral-portfolio`
- Original 4:5 AVIF hero artwork and a validated 1200 × 630 social card are checked in with provenance notes.
- A dependency-free Canvas 2D constellation, persisted pause control, reduced-motion override, pointer-safe highlights, and three project-specific CSS constellations are implemented. The unverified security-harness motif is intentionally absent.
- Portfolio verification passes 17 unit/data tests and 27 of 27 applicable Playwright checks across desktop and Pixel 7 projects; three device-specific checks are skipped on the opposite profile by design.
- Axe reports no WCAG A/AA violations on the homepage or transformer case study. Keyboard, non-interactive-canvas, coarse-pointer, 200% scale, metadata, and dark/light screenshot checks pass.
- Nine Lighthouse runs meet the required gates. Minimum scores are 0.99 performance and 1.00 accessibility, best practices, and SEO on the homepage and experience page; the transformer case study scores 1.00 in all four categories.
- The generated client layout chunk is 3,066 bytes gzip, below the 15 KB motion-code budget. The source hero AVIF is 53 KB, and the measured responsive mobile request is 31 KB.
- Remaining release sign-off: protected-preview review and a human macOS VoiceOver pass. Production `main` remains unchanged until those manual gates are confirmed.

## Ready locally

- Recruiter-first portfolio routes, résumé download, structured metadata, sitemap, robots, Open Graph image, theme support, and responsive navigation.
- Portfolio lint, type checking, 17 unit/data tests, internal-link validation, production build, and 27 applicable desktop/mobile browser checks.
- Transformer CPU verification: nine tests, a versioned deterministic smoke artifact, and a controlled full-tuning versus LoRA parameter comparison.
- Distributed validation lab: race-tested concurrency, bounded retries, dead letters, REST control API, Prometheus-format counters, implemented RabbitMQ and PostgreSQL adapters, and five versioned 10,000-entity memory-adapter samples.
- VoiceMed AI: strict schemas, provider adapters, request boundaries, deterministic no-key mode, human-review gate, 16 unit/contract tests, four browser tests, production build, and a zero-vulnerability npm audit.
- Canonical GitHub profile README and repository-pinning checklist.

## Public production

- Production URL: <https://ajaykr-engineering-portfolio.vercel.app>
- Unauthenticated HTTP checks return `200` for the home, experience, writing,
  résumé, all three project case studies, and résumé PDF routes.
- GitHub Actions passed the portfolio quality gates for the deployed `main`
  commit.
- All five featured repositories are public. Their latest CI runs pass.

## Not claimed as complete

- Transformer multi-GPU execution, vLLM or SGLang serving, and serving telemetry.
- RabbitMQ and external PostgreSQL performance benchmarks. The adapter path is implemented and compile-verified; its live Compose test is configured in CI but has not produced a public artifact yet.
- VoiceMed clinical or provider-model accuracy.
- Separate always-on deployments for the training lab, distributed lab, and AI
  journey. Their public repositories and portfolio case studies are the current
  recruiter-facing surfaces.

## Release note

The older `ajay-dev-engineer.vercel.app` address is protected by Vercel login and
must not be used in recruiter-facing links. The canonical public address is the
production URL above.
