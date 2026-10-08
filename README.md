# Ajay Engineering Portfolio

Public portfolio for Ajay Kumar Pondugala, a Bengaluru-based Software Engineer II at Cisco, positioned around backend reliability and service infrastructure.

**Production:** [ajaykr-engineering-portfolio.vercel.app](https://ajaykr-engineering-portfolio.vercel.app)

The home page leads with the distributed backend lab, accepted NATS and
Prometheus contributions, and the transformer recovery case study. The
[one-page recruiting evidence](https://ajaykr-engineering-portfolio.vercel.app/recruiting)
collects role, location, accepted fixes, résumé, and the existing recovery replay.
Contribution dates use exact GitHub UTC timestamps. Backend field notes explain
the implemented local transaction/recovery contract and corrected observed-result
measurement boundary; the 10,000-job result remains a separate single-process
memory-adapter functional run. Local receipts do not imply production capacity.

## Design goals

- Communicate role alignment within ten seconds.
- Treat architecture, verification, failure modes, and limitations as portfolio content.
- Publish only public-safe, reproducible evidence.
- Keep the production site fast, accessible, static-first, and deployable on Vercel's free tier.

## Architecture

```text
Typed project evidence ─┐
Experience summaries ───┼─> Next.js static routes ─> Vercel production
MDX engineering notes ──┘             │
                                      ├─> metadata, sitemap, JSON-LD
                                      ├─> anonymous page-view analytics
                                      └─> CI, browser tests, Lighthouse
```

Project status is restricted to `Shipped`, `Runnable Lab`, or `Building`. Every published metric requires a human-readable method, commit-pinned source, exact reproduction command, passing CI job, environment, snapshot date, and explicit limitation.

## Local development

```bash
pnpm install
pnpm dev
```

Open <http://localhost:3000>.

## Verification

```bash
pnpm check
pnpm build
pnpm test:e2e
```

The GitHub Actions workflow also runs Lighthouse against the home page, experience page, recruiting packet, and both reliability case studies.

See the [verified release status](docs/release-status.md) for completed gates and deliberately unclaimed work.
The [end-to-end project delivery strategy](docs/project-delivery-strategy.md)
defines the implementation order and the evidence required before a project is
called shipped.

## Deployment

The `main` branch deploys to the public production URL above. Preview deployments
may remain protected, but the production site must stay accessible without a
Vercel login. The [Vercel release runbook](docs/vercel-release.md) documents the
verified routes and recovery checks.

## Analytics

The root layout includes Vercel Web Analytics for aggregate page views across all
routes when the site runs on Vercel. Local and CI builds do not load the collector.
The integration does not add a custom visitor database, user accounts, or identity
tracking. Analytics must also be enabled for the Vercel project before production
traffic appears in the dashboard.

## Public-safety boundary

No employer source code, private architecture, customer information, internal identifiers, proprietary datasets, or unverifiable benchmark results may be added. Synthetic projects must stay clean-room implementations.

## License

MIT
