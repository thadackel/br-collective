# Baton Rouge Gold & Silver: SEO audit and cutover plan
Audited October 27, 2026. No DNS, account settings, source code, or public deployments changed.

## Decision
Hold launch. The new build has useful server-rendered content, distinct titles and descriptions, production-domain canonicals, local business schema and preserved core service URLs. However, sixteen existing articles fail on the preview, internal links lead to errors, and WordPress media continuity has not been proven. These are material migration risks.

## Scope and evidence
Read-only HTTP crawl: 55 distinct paths on the preview, plus seven sitemap-only pages; 108 paths on production, including feeds and archives. The preview's original 55 responses were 34 HTTP 200, 20 HTTP 404 and one HTTP 500. These totals include technical/test paths and a slash variant, so they are not unique content-page totals. All 38 URLs in the preview sitemap were covered across the crawl and supplemental checks, and returned 200 at that time. Production crawl was capped; this is not a complete backlink or historical-URL inventory.

Files in audit/ retain response bodies and metadata. br-collective.vercel.app.json and batonrougegoldandsilver.com.json contain paths, status, final URL, title, canonical/description tags, headings, images, links and JSON-LD. HTTP fetching follows redirects in the initial crawl; redirect chains and exact 301/308 behavior were not established. Later preview requests returned 403 even for previously accessible HTML, so later image responses cannot establish that files are absent. PageSpeed API returned 429 quota exceeded. No performance score or Core Web Vitals pass is claimed.

## P0: fix before cutover

1. Restore sixteen articles at their existing paths. Fifteen returned 404 and one returned 500 on the preview; each returned 200 on production. The full list is in migration-map.csv. Restore content, relevant images, unique metadata and article schema rather than redirecting every article to the home page or blog index. If an article is deliberately retired, select a truly equivalent replacement and permanently redirect it; use 410 if no replacement exists. Obtain Search Console/analytics/backlink data before choosing removal. Blog links currently advertise missing content.

2. Fix the 500 route /precious-metals-and-the-ecb%E2%80%99s-stimulus-plan-and-danish-rate-cuts/. Check percent-encoded Unicode apostrophe decoding and content lookup. Verify encoded and decoded forms safely resolve without a server error. Prefer retaining the existing URL for migration.

3. Correct inherited broken internal links and add explicit 301s:
- /investing-in-coins/ -> /buying-coins/
- /consingnment-services/ -> /consignment-services/
- /jewelry-repairs-and-custom-designs/ -> /jewelry-repairs/ (verify content equivalence; include a custom-design link on the destination).
The first two are already broken on production and were copied into the rebuild; the third is still listed in the old sitemap. Correct the source links as well as adding redirects. /buying-coins/ and /consignment-services/ returned 200 in the supplemental preview checks. Rules must live in the Vercel project/framework: old WordPress .htaccess rules stop controlling requests after DNS cutover.

4. Make all media independent of the old web host. Seventy unique WordPress upload paths were extracted from preview image elements. Rare-coins has absolute image sources on batonrougegoldandsilver.com and relative image links under /wp-content/uploads/. The GSA image returned 200 on the old host. Whether the preview serves those image paths remains unverified because later preview requests were denied. Copy the complete used media set into the deployment, preserving public /wp-content/uploads/... paths, or update every image source, srcset, lightbox link and downloadable file to migrated equivalents. Confirm /og.png is a valid 1200x630 image on the final domain. Do not shut down WordPress hosting until this passes.

5. Complete URL coverage beyond navigation. Export WordPress posts/pages/media URLs and Search Console landing pages, analytics landing pages and known backlinks. Include category/author/date archives, pagination, feeds and attachment pages in the disposition list. The production crawl found these routes, but did not exhaust them. Preserve valuable content; redirect only to equivalent content. Do not blanket-redirect unknown URLs to home. The deliberate unknown test URL correctly returned 404 on the preview.

6. Verify host and slash normalization. Canonicals, internal navigation and sitemap generally use trailing slashes, while Vercel's X-Matched-Path values omit them; this alone is not a redirect failure. Test both variants, HTTP/HTTPS, www/apex and query strings. Select HTTPS non-www as canonical to match existing production references. Equivalent variants should permanently redirect to their final destination, preferably in one hop, and destination pages should return 200 with self-referencing canonical tags.

## P1: on-page SEO and content

Titles exist and are distinct across audited successful core routes. Some new titles lose useful local and commercial intent compared with production. Proposed replacements:
- /rare-coins/: Buy & Sell Rare Coins in Baton Rouge | Gold & Silver of Louisiana
- /sell-silverware/: Sell Sterling Silverware in Baton Rouge | Gold & Silver of Louisiana
- /antique-jewelry/: Antique & Estate Jewelry in Baton Rouge | Gold & Silver of Louisiana
- /notes-currency/: Buy & Sell Paper Currency in Baton Rouge | Gold & Silver of Louisiana
- /jewelry-repairs/: Jewelry Repair in Baton Rouge | Gold & Silver of Louisiana
Do not change the existing URL just to add keywords. Keep titles natural; displayed width varies and no character count guarantees display.

Several descriptions are programmatically clipped mid-sentence with an ellipsis: rare-coins, bullion, silver coins, platinum, notes/currency, designer jewelry, antique jewelry, watches, gold buyers, blog-posts and colored diamonds. Replace clipping with complete, page-specific sentences. Suggested rare-coins description: "Buy or sell rare U.S. and world coins in Baton Rouge. Visit Gold & Silver of Louisiana at CitiPlace for a professional, no-obligation evaluation."

Rare-coins H1 should be "Buy & Sell Rare Coins in Baton Rouge". Its visible content is only two substantial paragraphs and two images, with nearly all body copy bold. Add useful sections: coins accepted, what affects numismatic value, evaluation process, what to bring, avoiding cleaning coins, and an in-content call/visit link. Use regular paragraph weight and accurate photo-specific alt text instead of repeating "Rare Coins". Verify any credential and specialist claims with the business. Correct the awkward sentence about the "power of custom IT platform" to a plain explanation of current market research. Suggested wording: "Our team uses current market research and specialist networks to evaluate rare coins and paper money."

Homepage H1 is "Know what it’s worth. Leave with confidence." Add explicit service/location wording, e.g. "Buy & Sell Gold, Silver & Rare Coins in Baton Rouge", keeping the slogan as supporting copy. Gold and silver coin pages contain multiple H1s inherited from WordPress; retain a single primary H1 and change buying/selling subsections to H2. Multiple H1s are not by themselves a Google penalty; this improves page structure.

Consolidate /blog/ and /blog-posts/ after comparing their content. Both return 200, but duplication was not established. Keep /blog-posts/ if it remains the primary established archive, then redirect /blog/ if redundant and remove the redundant URL from sitemap/internal links. Add useful contextual links to sitemap-only pages such as /buying-coins/, /consignment-services/, /silver-dollars/ and /turquoise/. Whether every such page is orphaned is unverified.

Meta keywords are present globally but are not a Google ranking lever. Prioritize content, links, titles and migration integrity over expanding that list.

## Technical SEO and structured data

Preview robots.txt returns 200 with Allow: / and points to the production /sitemap.xml. It does not prevent preview indexing. Sampled page metadata and response headers had no noindex. Production canonicals on preview pages are appropriate for the intended final host but do not guarantee preview exclusion. Before launch, use host-specific X-Robots-Tag: noindex on the vercel.app host or deployment protection, keeping production indexable at launch. Do not globally ship noindex. Do not rely on robots Disallow as a substitute for noindex, since crawlers need access to read noindex. Consider a host-specific permanent redirect from the stable preview hostname to production after launch if preview access is no longer needed; preserve paths and avoid loops.

Preview sitemap.xml returns valid-looking XML containing 38 production-domain URLs. All share lastmod 2026-09-24T14:16:19.264Z; use actual substantive content modification dates or omit lastmod when unknown. Include restored article URLs and only final, canonical, indexable 200 pages. Current production sitemap includes HTTP URLs and stale/broken paths; replace it with the new HTTPS sitemap. /sitemap_index.xml and /wp-sitemap.xml return 200 on old production but 404 on preview; add 301s to /sitemap.xml for continuity. priority/changefreq fields are not a substitute for correct URLs and dates.

JSON-LD includes LocalBusiness/Store/JewelryStore, WebSite, WebPage, BreadcrumbList and Service. Sampled rare-coins and location markup is parseable JSON with address, phone and opening hours consistent with visible contact details. Formal Rich Results Test/Schema Validator results are not available. The template labels even the location page as a Service: restrict Service to actual services and use appropriate WebPage/ContactPage or CollectionPage/Blog/BlogPosting for other content. Give restored articles dates and authors that accurately reflect the original material. Do not add fabricated ratings or reviews. Maintain stable #business and #website IDs. Keep Baton Rouge entity separate from Covington; verify any sameAs links identify the same business entity. Add accurate map/geographic details and verified profiles if available. Add visible breadcrumbs that match the existing breadcrumb schema.

## Images, forms, mobile and performance

All extracted preview img tags had alt attributes; some decorative images have empty alt, which can be appropriate. Several credential/logo images lack explicit width/height; reserve space or set aspect-ratio to reduce layout shift. Rare-coins content images have dimensions and lazy loading. Avoid preloading below-the-fold credential logos on every page; prioritize the actual largest above-the-fold image and measure before/after. Serve responsive WebP/AVIF or optimized JPEG where appropriate, with srcset/sizes and caching. Image byte weights and complete asset success were not verified.

No customer enquiry form was found in fetched public HTML on either crawled site. The only extracted form was the framework's reload button on the 500 page. Thus no form-delivery pass is claimed. Existing calls to action use tel/mailto and visit links. A new lead form is optional; if added, verify required fields, accessible labels, spam protection, server-side validation, success/error handling and receipt in the actual business inbox. Test actual phone dialing, mail composition, map directions and external Shopify/Covington navigation on a device; href presence alone does not prove successful completion.

A browser screenshot of rare-coins at approximately 633px wide showed the responsive Menu layout and readable text. This is not a phone-width audit. The large hero spacing puts much of the useful copy below the first screen; consider reducing padding on phones. Menu operation, keyboard/focus behavior, 320/375/390/430px widths, landscape, 200% zoom, touch targets, contrast and screen readers were not fully verified. Require no horizontal overflow and comfortable 44px touch targets for primary controls.

PageSpeed API returned 429, so mobile Lighthouse score, LCP, INP and CLS are unverified. Cached/prerendered Vercel responses are encouraging but do not establish speed. Run mobile PageSpeed/Lighthouse for home, rare-coins, location and a media-heavy service page. Targets at the 75th percentile: LCP <=2.5s, INP <=200ms, CLS <=0.1. Lab results diagnose problems; field data may be unavailable for the preview and takes time to accumulate after launch.

## GoDaddy + Vercel cutover runbook — execute only after explicit approval

Public DNS observed during audit: nameservers ns35.domaincontrol.com and ns36.domaincontrol.com; apex A 192.169.223.13 (TTL 600); www CNAME batonrougegoldandsilver.com (TTL 3600). This is a public snapshot, not an authenticated DNS-zone export. Mail, TXT, CAA, AAAA and other records were not exhaustively inspected.

Preparation:
1. Back up WordPress database, files and complete uploads. Export GoDaddy DNS records/screenshots and retain the old host. Record all A/AAAA/CNAME values and TTLs for @ and www, any forwarding, plus MX, SPF, DKIM, DMARC, verification and CAA records. Confirm no mail service relies on the apex A record or an MX target that follows it. Resolve that dependency before changing the apex.
2. Complete P0 fixes and preview acceptance tests. Record the approved Vercel deployment/version and rollback owner. Verify environment variables and any future form credentials are configured without exposing them in frontend code.
3. About a day before the approved cutover, lower relevant web-record TTLs to 600 seconds if available. The apex was already 600; www was 3600. Wait out the former TTL. This step itself changes DNS and requires approval.
4. In the correct Vercel project, open Settings > Domains. Add batonrougegoldandsilver.com and www.batonrougegoldandsilver.com for Production. Choose non-www as primary to match canonicals, and configure www to permanently redirect to it, preserving path/query. Domain assignment can make a deployment reachable and is within the approval gate.
5. Copy the exact A and CNAME targets Vercel displays for this project. Do not substitute an old blog's IP or a generic Vercel target. Add an ownership TXT record only if Vercel asks, using its exact name/value.

Approved cutover:
6. GoDaddy > Domain Portfolio > batonrougegoldandsilver.com > DNS > DNS Records. Keep GoDaddy nameservers; this migration does not require nameserver replacement.
7. Edit the web records as follows:
   Type A | Name @ | Value exact apex IPv4 shown by Vercel | TTL 600 if available.
   Type CNAME | Name www | Value exact project CNAME target shown by Vercel (hostname only) | TTL 600 if available.
   Replace conflicting old web A/AAAA/CNAME records for those exact hostnames only, following Vercel's instructions. In particular, an old AAAA can send IPv6 users to the wrong host. Do not remove unrelated subdomains or mail/verification records. Do not enter https://, a path, or a full URL into the record value. Do not use GoDaddy domain forwarding as a replacement for Vercel routing.
8. Wait for Vercel to report Valid Configuration and issue HTTPS certificates for both hosts. If issuance fails, inspect the exact validation error, DNS and CAA restrictions; do not disable protections blindly. DNS propagation can take up to 48 hours even though many resolvers update sooner.
9. Verify from more than one network: apex and www over HTTP and HTTPS, rare-coins, location, restored articles, important services, all migrated media, og.png, sitemap and robots. Check valid certificates, final 200, correct canonical host, expected permanent redirects, real 404 for nonexistent paths, and absence of production noindex. Verify all old-to-new rules on Vercel, including encoded article slug and query-string behavior. Confirm images work without fetching from the old hosting server. Confirm phone/email/maps/shop links and any form delivery.
10. Verify existing Search Console domain ownership remains intact. Submit https://batonrougegoldandsilver.com/sitemap.xml and inspect representative URLs. No Change of Address is needed when keeping the same domain. Preserve analytics identifiers and verify collection/phone-click events if used. Monitor errors, indexed pages, traffic and business enquiries daily in the first week and weekly for at least a month. Keep permanent redirects at least one year, preferably indefinitely. Keep old hosting available through propagation and an agreed stabilization period; it does not substitute for redirects on Vercel.

Rollback:
If major pages, media, HTTPS or lead paths fail, restore the saved previous @ A record (observed 192.169.223.13, but use the approved current snapshot), www CNAME and any other web records changed. Keep the old WordPress site functional. Verify the old site and email from multiple networks. DNS rollback is subject to caching and is not instant. Retain the failing deployment and logs for diagnosis. Do not cancel old hosting or domain registration during cutover.

## Official references
- Vercel domain setup and project-specific DNS values: https://vercel.com/docs/domains/working-with-domains/add-a-domain
- Vercel custom-domain verification: https://vercel.com/docs/domains/set-up-custom-domain
- GoDaddy record editing: https://www.godaddy.com/en-uk/help/edit-a-cname-record-19237
- Google URL migration and permanent redirects: https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes

## Explicitly unverified
Authenticated GoDaddy/Vercel settings; repository implementation; production-domain behavior after cutover; complete historical/backlink URL inventory; Search Console indexing/rankings; analytics; formal schema validation; all assets and file sizes; final redirects/chains; actual phone/email/map completion; customer form delivery; full mobile/accessibility testing; Lighthouse and field Core Web Vitals. No SEO ranking guarantee is implied.
