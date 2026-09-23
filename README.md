# Ajay Engineering Portfolio

Public portfolio for Ajay, positioned around distributed systems and AI infrastructure engineering.

**Production:** [ajaykr-engineering-portfolio.vercel.app](https://ajaykr-engineering-portfolio.vercel.app)

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
                                      └─> CI, browser tests, Lighthouse
```

Project status is restricted to `Shipped`, `Runnable Lab`, or `Building`. Performance metrics require a human-readable method and may optionally link to a checked-in evidence artifact.

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

The GitHub Actions workflow also runs Lighthouse against the home page, experience page, and flagship project page.

See the [verified release status](docs/release-status.md) for completed gates and deliberately unclaimed work.
The [end-to-end project delivery strategy](docs/project-delivery-strategy.md)
defines the implementation order and the evidence required before a project is
called shipped.

## Deployment

The `main` branch deploys to the public production URL above. Preview deployments
may remain protected, but the production site must stay accessible without a
Vercel login. The [Vercel release runbook](docs/vercel-release.md) documents the
verified routes and recovery checks.

## Public-safety boundary

No employer source code, private architecture, customer information, internal identifiers, proprietary datasets, or unverifiable benchmark results may be added. Synthetic projects must stay clean-room implementations.

## License

MIT
