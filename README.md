# Ajay Engineering Portfolio

Public portfolio for Ajay Kumar Pondugala, positioned around distributed systems and AI infrastructure engineering.

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

## Deployment

1. Connect this repository to the existing `ajay-dev-engineer` Vercel project.
2. Keep deployment protection enabled for previews only.
3. Disable Vercel Authentication on the production domain.
4. Verify the production URL in a signed-out browser before linking it from LinkedIn.

## Public-safety boundary

No employer source code, private architecture, customer information, internal identifiers, proprietary datasets, or unverifiable benchmark results may be added. Synthetic projects must stay clean-room implementations.

## License

MIT
