# Vercel release runbook

## Repository

Publish `ajaykr0905/ajay-engineering-portfolio` first. The project requires no production secrets.

## Production URL

The canonical public deployment is:

<https://ajaykr-engineering-portfolio.vercel.app>

It is connected to `ajaykr0905/ajay-engineering-portfolio` and deploys from
`main`. Keep preview-deployment protection enabled. Production must remain
accessible without Vercel Authentication.

Do not publish `ajay-dev-engineer.vercel.app` as the portfolio address while it
redirects signed-out visitors to Vercel login.

## Public release verification

- Open the production URL in a signed-out private window.
- Confirm `/`, `/experience`, `/writing`, `/resume`, and all three project pages open without a login.
- Download the résumé and verify the PDF opens.
- Verify GitHub, LinkedIn, and email actions.
- Run the CI browser, link, and Lighthouse gates against the deployed URL.
- Confirm no environment secrets, employer material, or internal artifacts appear in the deployment output.

Do not mark the portfolio public until an unauthenticated request returns the site rather than a Vercel login redirect.
