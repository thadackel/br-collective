# Review deployment — October 27, 2026

Update: the owner-requested homepage restoration is deployed to the [current review preview](https://br-collective-git-review-seo-ready-tda4.vercel.app/). See [homepage restoration details](HOMEPAGE-RESTORATION.md). The deployment and full-site observations below describe the preceding SEO preview and remain its historical verification record.

The approved review version is deployed on Vercel:

- [Review website](https://br-collective-o7rggdoc5-tda4.vercel.app/)
- [Vercel deployment details](https://vercel.com/tda4/br-collective/DEwDa2rNYS7emrXBq6LpqHDtivQZ)
- Source branch: `review/seo-ready`
- Deployed source commit: `ec665c87fe5fce678e2c3c910b6b2256ddec6b5d`
- Environment: Preview, with `noindex,follow`
- Vercel project: `TDA22 / br-collective`

The Vercel project is connected to `thadackel/br-collective`, with the framework preset changed from Next.js to Other. The checked-in configuration supplies install/build/output settings. Automatic Git deployments remain disabled. The previous production Vercel deployment and WordPress domain were not replaced; custom-domain assignment was skipped and no DNS changes were made.

## Hosted verification

All 53 pages were visited in an authenticated browser on the final preview. Each had one H1, a production-domain canonical and preview noindex. No loaded-image failures appeared in the sampled page observations. The rare-coin gallery's two images and brand logos were separately confirmed loaded at their migrated local WebP paths.

All 46 explicit redirect source variants, representing 24 legacy mappings, were visited with a query string. Every navigation reached the expected destination with the query preserved. The initial preview exposed that Vercel did not match slash variants from the shorter source rules; explicit variants were added and the corrected preview was deployed and rechecked. The local server now uses exact source matches and a regression check requires both variants.

The hosted sitemap contains 53 production-domain URLs. Robots points to the production sitemap. An unknown path displayed the custom noindex error page. The phone-width homepage had no horizontal overflow and displayed the requested gold, silver, jewelry and rare-coins headline. Screenshots and detailed observations are in `docs/screenshots/` and `docs/hosted-checks.json`.

All nine automated test groups passed locally. GitHub verification passed for the corrected deployed source on main and the review branch.

## Access and limits

The preview retains Vercel's existing authentication protection; the owner can view it while signed in. No protection was weakened. Unauthenticated HTTP requests led to Vercel's login page, so independent edge status/header checks and public PageSpeed/rich-result tests were not completed. Browser checks establish final navigation destinations, not an independently captured count of HTTP hops. The configured permanent status is 301 for explicit legacy mappings; Vercel's slash normalization uses 308.

Production-domain HTTPS, host redirects, indexability, analytics/Search Console and real phone/email/store completion still need the approval-gated checks in `docs/CUTOVER.md`. Do not promote a preview-generated build directly to production without rebuilding and verifying production indexing settings.
