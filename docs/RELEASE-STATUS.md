# Prepared release — October 27, 2026

Status: deployed to an approved Vercel Preview environment. Production and DNS unchanged. See [deployment details](DEPLOYMENT.md).

## Implemented

- Reconstructed 53 independently served pages from the public rebuild and the business's old site; retained established service paths.
- Restored sixteen missing articles and original publication dates, including the encoded apostrophe route that previously failed. Historical market commentary is clearly marked as archival.
- Migrated 152 original images; generated WebP display images, a 1200×630 social preview and favicon. Original upload URLs remain available. No WordPress hosting is needed at build or runtime.
- Added complete unique descriptions, improved local titles/headings, one primary H1 per page, consistent canonical URLs, semantic breadcrumbs, relevant structured data, sitemap and real 404 page.
- Expanded and corrected rare-coin content, corrected inherited Covington-specific rare-coin copy, and clarified the showroom contact page.
- Added 24 explicit 301 redirects for known typo, duplicate blog, sitemap and old archive URLs. Internal links use final destinations.
- Added responsive navigation, Escape dismissal, skip link, visible focus states, mobile call action and system font stacks. Navigation and core content work without JavaScript.
- Removed heavy framework hydration and external embedded maps. Contact, directions, online shop and Covington are real destination links.
- No contact form, analytics account, fabricated reviews or live prices were invented. Credentials shown as text preserve the existing site's claims; current business details and credentials still require owner verification.
- Added preview noindex, production-indexing build behavior, disabled automatic deployment, documented cutover/rollback and automated GitHub verification.

## Verified locally

Both preview and production-mode builds passed eight automated test groups covering all 53 pages: unique metadata and H1s; internal links/assets; JSON-LD and breadcrumbs; sixteen article dates; image attributes and local sources; full sitemap coverage; absence of fake forms/old runtime bundles; and HTTP success, redirect query preservation and genuine 404 behavior.

Browser checks covered home, rare coins, showroom, colored diamonds and the formerly failing encoded article. Representative layouts were checked at 320, 390, 768 and 1440-pixel viewport settings. No horizontal overflow or broken loaded images was observed in those checks. Phone navigation opened, followed the rare-coin link and closed with Escape. No browser errors or warnings appeared in the sampled navigation session. Screenshots are in `docs/screenshots/`.

Dependency audit after patched dependency updates: zero known vulnerabilities reported. Build verification does not imply dependencies will remain vulnerability-free indefinitely.

GitHub's clean Linux verification also passed for both preview and production builds: [verification run](https://github.com/thadackel/br-collective/actions/runs/40531326523). The Covington external link returned HTTP 200; the online store returned HTTP 429, so its customer journey remains unverified.

## Remaining launch verification

- Approve and create the Vercel deployment, verify live edge routing, redirect order, certificates and both domain variants.
- Run hosted Lighthouse/PageSpeed and formal Rich Results/Schema Validator checks; no performance score, rich-result eligibility or field Core Web Vitals pass is claimed.
- Confirm current business hours, services, credentials, Google Business Profile consistency, actual phone connection, email receipt and third-party shop behavior.
- Obtain Search Console/analytics/backlink exports to extend the known legacy URL map and preserve existing tracking identifiers if any. The original crawl was capped; unknown historic URLs cannot be guaranteed.
- Execute approved DNS cutover and monitor using `docs/CUTOVER.md`.

This is a new static implementation. The original Next.js source was unavailable; its exact components, unpublished functionality and private integrations could not be recovered from public HTML.
