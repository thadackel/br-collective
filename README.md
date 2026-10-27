# Gold & Silver of Louisiana — Baton Rouge

An approved Vercel review deployment is available. See [deployment status and verification](docs/DEPLOYMENT.md). The production domain and DNS remain unchanged.

Reconstructed, independently maintainable website for `batonrougegoldandsilver.com`, based on the public `br-collective.vercel.app` rebuild and the business's existing WordPress content. No access to the original rebuild's source code was available. This is a new static implementation, not a recovered copy of its Next.js repository.

## Local use

Requires Node.js 24 and npm.

```sh
npm ci
npm run build
npm test
npm start
```

Open `http://localhost:4173`. Builds outside Vercel Production include `noindex` so local and preview copies aren't indexed.

```sh
# Production SEO verification only; this does not deploy anything.
VERCEL_ENV=production npm run build
npm test
```

PowerShell equivalent: `$env:VERCEL_ENV='production'; npm run build; npm test`, then remove that environment variable before creating a preview build.

## Edit and build

- `data/pages.json`: preserved service content and original dated articles. The build script improves selected pages and generates navigation and structured data. Edits to generated `dist/` are overwritten.
- `data/template.json`: source header and footer.
- `scripts/build.mjs`: page-specific copy improvements, metadata, canonical URLs, schema, local link normalization, optimized images, sitemap and 404 page.
- `public/site.css` / `public/site.js`: responsive design and small accessible navigation enhancements. There is no React hydration or browser-side dependency bundle.
- `public/wp-content/uploads/`: original migrated uploads. Original URLs stay available; rendered images use optimized WebP copies generated during build.
- `data/media-manifest.json`: successful original media downloads, content types and hashes.
- `vercel.json`: static build settings, 24 explicit 301 mappings, slash normalization, headers, and preview-host noindex protection.

The build requires no network access or WordPress service. It writes 53 pages, including sixteen restored articles, plus sitemap, robots and 404 output. Original article publication dates are retained. Current rare-coin explanatory copy corrects inherited location and categorization issues. Archived price commentary is visibly identified as historical.

Contact actions use real telephone, email, Google Maps and showroom links. There is no enquiry form that pretends to submit or deliver mail. A mail form needs a separately configured delivery service and inbox verification before being offered to customers. No analytics/tracking identifier has been invented.

## Deployment is intentionally disabled pending approval

`git.deploymentEnabled` is `false` in `vercel.json`. A source upload is not approval to deploy. Do not connect or publish to a Vercel production project or change DNS until the business owner explicitly approves. After approval, follow `docs/CUTOVER.md`; enable automatic builds only if desired.

Vercel settings: Framework **Other**, install **npm ci**, build **npm run build**, output **dist**, Node.js **24.x**. Production builds are indexable only when `VERCEL_ENV=production`; Vercel supplies this environment marker. Verify the rendered page's robots tag before release.

## Verification limits

Automated tests exercise local generated pages and a local server; they do not establish Vercel's live edge redirect order, domain certificates, external account ownership, email receipt, or Google indexing. Run the final domain acceptance checks in `docs/CUTOVER.md` after an approved staging/cutover. A local browser and lab performance check is not field Core Web Vitals. Search Console, analytics and backlink history were not available for the original audit.

Credentials and access tokens must never be committed to this repository.
