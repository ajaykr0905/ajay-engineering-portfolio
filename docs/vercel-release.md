# Vercel release runbook

## Repository

Publish `ajaykr0905/ajay-engineering-portfolio` first. The project requires no production secrets.

## Existing production URL

1. Open the Vercel project currently owning `ajay-dev-engineer.vercel.app`.
2. Change its connected Git repository to `ajaykr0905/ajay-engineering-portfolio`, or import the new repository and move the existing domain to it.
3. Use the detected Next.js settings and the repository's `pnpm` lockfile.
4. Keep preview-deployment protection enabled.
5. Disable authentication protection for the production deployment only.
6. Deploy the `main` branch.

## Public release verification

- Open the production URL in a signed-out private window.
- Confirm `/`, `/experience`, `/writing`, `/resume`, and all three project pages open without a login.
- Download the résumé and verify the PDF opens.
- Verify GitHub, LinkedIn, and email actions.
- Run the CI browser, link, and Lighthouse gates against the deployed URL.
- Confirm no environment secrets, employer material, or internal artifacts appear in the deployment output.

Do not mark the portfolio public until an unauthenticated request returns the site rather than a Vercel login redirect.
