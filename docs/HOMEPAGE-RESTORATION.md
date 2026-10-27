# Homepage appearance restored — October 27, 2026

At the owner's request, the homepage again uses the original design from `https://br-collective.vercel.app/` rather than the reconstructed replacement styling.

- Recovered the original stylesheet and original BBB, NGC, PMG and ANA image files directly from the rendered reference page's asset bundle. The GIA Graduate on Staff wordmark retains the reference page's original markup and styling.
- Restored the original headline, hero artwork, typography, colors, spacing, navigation, service rows, credential row, showroom presentation and footer. The homepage does not use the newly introduced footer directory or fixed mobile call strip.
- Kept the requested word “jewelry” immediately after “silver” in the original introductory buying-and-selling sentence. Search metadata continues to include jewelry.
- Kept the corrected titles/descriptions, canonical, JSON-LD, sitemap, migrated local images, accessible skip link and permanent redirect mappings.
- Other pages retain the previously repaired implementation. The original homepage stylesheet is loaded only for the homepage.

The restored credential raster images are served as locally optimized WebP files. Phone-width checks found no horizontal overflow, and all credential images fit inside the viewport. The four image logos loaded successfully; the GIA staff wordmark matched the reference styling. All nine existing automated test groups passed after the restoration.

The homepage's original Google Maps iframe is restored, with its existing directions link. The in-app browser blocked the third-party map frame during local review; the directions link remains available. No browser protection was bypassed.
