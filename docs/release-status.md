# Release status

Verified on 2026-09-22.

## Ready locally

- Recruiter-first portfolio routes, résumé download, structured metadata, sitemap, robots, Open Graph image, theme support, and responsive navigation.
- Portfolio lint, type checking, seven unit tests, internal-link validation, production build, and six desktop/mobile browser tests.
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
