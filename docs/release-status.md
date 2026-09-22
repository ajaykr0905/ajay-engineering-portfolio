# Release status

Verified on 2026-09-22.

## Ready locally

- Recruiter-first portfolio routes, résumé download, structured metadata, sitemap, robots, Open Graph image, theme support, and responsive navigation.
- Portfolio lint, type checking, seven unit tests, internal-link validation, production build, and six desktop/mobile browser tests.
- Transformer CPU verification: nine tests, a versioned deterministic smoke artifact, and a controlled full-tuning versus LoRA parameter comparison.
- Distributed validation lab: race-tested concurrency, bounded retries, dead letters, REST control API, Prometheus-format counters, implemented RabbitMQ and PostgreSQL adapters, and five versioned 10,000-entity memory-adapter samples.
- VoiceMed AI: strict schemas, provider adapters, request boundaries, deterministic no-key mode, human-review gate, 16 unit/contract tests, four browser tests, production build, and a zero-vulnerability npm audit.
- Canonical GitHub profile README and repository-pinning checklist.

## Not claimed as complete

- Transformer multi-GPU execution, vLLM or SGLang serving, and serving telemetry.
- RabbitMQ and external PostgreSQL performance benchmarks. The adapter path is implemented and compile-verified; its live Compose test is configured in CI but has not produced a public artifact yet.
- VoiceMed clinical or provider-model accuracy.
- Public production deployment or public GitHub repository availability.

## External release blockers

- GitHub CLI credentials for `ajaykr0905` are invalid on this machine, so the clean local commits cannot be pushed yet.
- Vercel deployment tools are unavailable in the current session, so the existing production URL cannot be relinked or its protection policy changed here.
- Lighthouse Chrome discovery succeeds, but the local audit stalls in this sandbox. The check remains configured as a required CI gate and writes private workflow artifacts rather than uploading reports publicly.

These blockers affect publication, not the verified local builds.
