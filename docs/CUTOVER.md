# Approval-gated Vercel and GoDaddy cutover

This repository is source-ready, not a deployed or migrated production site. The live WordPress site and the prior Vercel deployment have not been changed. Automatic Git deployments are disabled in `vercel.json`. Keep them disabled until the owner approves publishing.

## Prepare the Vercel release

1. Obtain explicit approval to create a deployment. In the existing Vercel project for `br-collective.vercel.app`, review the current production deployment and save its version for rollback. If using a new project instead, record which project will own both production domains; never move domain assignment casually between projects.
2. Connect `thadackel/br-collective` only as part of the approved deployment work. Use Framework **Other**, Node.js **24.x**, Install **npm ci**, Build **npm run build**, Output **dist**. No API secrets are needed for this static site.
3. Make a preview deployment and verify `noindex` in the HTML and on the `vercel.app` host. A production build uses Vercel's `VERCEL_ENV=production` marker to generate `index,follow`; verify this on the intended final host. The `vercel.app` host remains noindex via its response header even if it serves a production build. A preview deployment cannot simply be promoted without confirming it was rebuilt with production indexing settings.
4. Verify all 53 sitemap pages, migrated image URLs, OG image, canonical tags, structured data and the 24 configured 301 rules at the actual Vercel edge. Local tests exercise a local server, not Vercel's slash/redirect ordering. Check both source variants with and without trailing slash, query preservation, direct final destinations and no loops.
5. Verify the encoded Unicode-apostrophe article URL. Keep original article URLs; do not replace article pages with redirects to home. The typo, duplicate blog, old sitemap, known category/author/date archive URLs have explicit relevant redirects. Original empty WordPress comment feeds, XML-RPC and admin endpoints are not recreated. Other unknown paths should remain genuine 404s. Export Search Console/backlink URLs to extend the known mapping before cutover if available.
6. Check real phones: homepage, rare coins, showroom, heavy image content, menu, keyboard focus and call/email/map/store links. Calls and email links require the device's handler. Actual phone connection, mail delivery and third-party shop checkout are not established by automated link tests. There is no newly invented contact form or tracking account.
7. Run mobile Lighthouse/PageSpeed on the approved hosted version. Local source and layout checks do not establish field Core Web Vitals or a Lighthouse score. Validate JSON-LD with Google's Rich Results Test and Schema Validator. Confirm current business hours, address, services and credentials against the business's actual records and Google Business Profile.
8. Preserve any existing analytics identifier only after checking the business account. No identifier has been invented in this repository.

## DNS snapshot and backup

Public records observed October 27, 2026:

| Record | Observed value | Observed TTL |
| --- | --- | --- |
| Nameserver | `ns35.domaincontrol.com` | 3600 |
| Nameserver | `ns36.domaincontrol.com` | 3600 |
| Apex A | `192.169.223.13` | 600 |
| `www` CNAME | `batonrougegoldandsilver.com` | 3600 |

This is not a complete DNS-zone export. Before changing anything, export/screenshot the entire GoDaddy zone. Save WordPress database, files and uploads; retain old hosting. Record web A/AAAA/CNAME records, forwarding, MX, SPF, DKIM, DMARC, verification and CAA. Confirm that mail routing does not depend on an apex A record or an MX target that follows it. Resolve any such dependency first.

## Approved domain cutover

1. If approved, lower web TTLs to 600 seconds where available at least one previous TTL before switching. This is itself a DNS change.
2. Vercel project → **Settings → Domains**: add `batonrougegoldandsilver.com` and `www.batonrougegoldandsilver.com`. Choose HTTPS non-www as primary to match the site canonicals, and configure a permanent www-to-apex redirect preserving path and query. Adding domains may itself expose the deployment and requires approval.
3. Copy Vercel's exact project-specific apex A and `www` CNAME targets. If requested, copy its exact ownership TXT name/value too. Do not substitute generic IPs or old instructions.
4. GoDaddy → **Domain Portfolio → batonrougegoldandsilver.com → DNS → DNS Records**. Keep the existing GoDaddy nameservers.
5. Replace only the web records for the intended hostnames:

| Type | Name | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | Exact apex IPv4 supplied by this Vercel project | 600, if available |
| CNAME | `www` | Exact hostname supplied by this Vercel project | 600, if available |

Do not enter `https://` or a URL path. Replace conflicting old web A/AAAA/CNAME records only for `@` and `www` as instructed by Vercel. An old IPv6 AAAA can direct some visitors to the wrong host. Preserve unrelated subdomains, mail and verification records. Do not replace nameservers or use GoDaddy forwarding as a substitute for Vercel routing.

6. Wait for **Valid Configuration** and valid HTTPS certificates for both hosts. If validation fails, inspect the reported record/CAA issue; do not bypass certificate errors. Propagation can take up to 48 hours.
7. Verify from more than one network: all four HTTP/HTTPS + www/apex variants; home, rare coins, showroom, restored articles, uploaded images, `/og.png`, `/robots.txt`, `/sitemap.xml`, 301 rules and real 404s. Confirm canonical URLs are final 200 pages, production has no noindex, and preview hosts remain noindex. Check Google Maps, phone, email, Shopify and Covington links on actual devices.
8. Submit `https://batonrougegoldandsilver.com/sitemap.xml` in the existing Search Console property. Keeping the same domain does not require a Change of Address submission. Retain verification TXT records. Inspect representative URLs and monitor errors, traffic and enquiries daily in the first week, then weekly for at least a month.
9. Keep permanent redirects for at least one year, preferably indefinitely. Keep old hosting until propagation and an agreed stabilization period are complete. WordPress redirect rules will not control requests once DNS points at Vercel.

## Rollback

If critical pages, images, HTTPS or business contact paths fail, restore the saved pre-change web records. The observed root A was `192.169.223.13` and `www` pointed to the apex, but use the current approved backup rather than assuming the snapshot remains current. Keep WordPress serving on that host. DNS rollback is cached and not immediate. If the problem is only a Vercel release, use the saved prior deployment where domain routing permits. Retain logs and failed version for diagnosis.

## Official references

- [Vercel custom domain setup](https://vercel.com/docs/domains/set-up-custom-domain)
- [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json)
- [Disabling automatic Git deployments](https://vercel.com/docs/project-configuration/git-configuration)
- [GoDaddy CNAME editing](https://www.godaddy.com/en-uk/help/edit-a-cname-record-19237)
- [Google site-move guidance](https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes)
