# 09 — Search Console, Bing, IndexNow and ongoing monitoring

Status: Part B done (2026-10-19), Part A pending (owner) · Depends on: 02 (ideally all of 01–08 deployed) · Suggested model: Haiku/Sonnet for the IndexNow code; the rest is a **checklist for the owner** (it needs their accounts) · Est. size: S

## Why

Correct HTML only matters once search engines crawl it. Search Console and Bing Webmaster Tools
show which pages are indexed, why others aren't, and which queries bring visitors. Bing matters
more than its market share suggests: ChatGPT search and Copilot draw on Bing's index. IndexNow lets
the site tell Bing (and Yandex, Seznam, Naver) about changed URLs immediately instead of waiting
for a crawl.

## Current state (verified 2026-10-19)

- Google Search Console is verified with the HTML-file method: `public/google56b3ee549bb44cea.html`
  (copied to `dist/`). **Never delete or rename this file.**
- `public/robots.txt` → `Sitemap: https://quantsandbox.dev/sitemap.xml`. The sitemap is generated
  by `seo.plugin.ts`.
- Hosting: Vercel (`vercel.json`). Analytics: `@vercel/analytics` (`src/main.tsx`).
- No Bing verification and no IndexNow key.

## Part A — Owner checklist (manual, about 30 minutes)

1. **Google Search Console** (https://search.google.com/search-console, property
   `quantsandbox.dev`):
   - Sitemaps → submit `https://quantsandbox.dev/sitemap.xml`. Resubmit after plan 08 adds `/hu`
     pages (the same URL; just click "resubmit").
   - URL Inspection → "Request indexing" for `/`, `/wacc`, `/black-scholes`,
     `/guide/derivatives/no-arbitrage` and `/guide/corporate/wacc` (top pages; the daily quota is
     about 10).
   - Pages report: note the "Not indexed" reasons. After plan 02 there should be no "Soft 404" or
     "Duplicate without user-selected canonical".
   - Enhancements: check Breadcrumbs, FAQ (may not show; see plan 03) and Course after plan 03.
2. **Bing Webmaster Tools** (https://www.bing.com/webmasters): "Import from Google Search Console"
   (the fastest path, no extra verification file), then submit the sitemap.
3. **Rich Results Test** (https://search.google.com/test/rich-results) for one lab, one lesson and
   the home page, after plan 03 deploys.
4. **Social preview check** (after plan 05): https://www.opengraph.xyz/ and the LinkedIn Post
   Inspector (https://www.linkedin.com/post-inspector/) for the home page and one lesson.
5. **AI answer-engine spot check** (monthly, 10 minutes): ask ChatGPT (search on), Perplexity,
   Claude and Copilot:
   - "interactive binomial option pricing tree calculator"
   - "explain put-call parity with an example"
   - "WACC calculator with tax shield"
   - "Itô's lemma intuition drift correction"
   - a Hungarian one after plan 08: "WACC számítás magyarázat"
   Record in the log table below whether quantsandbox.dev is cited.

## Part B — IndexNow (small code task, optional)

1. Generate a key (32 hex characters). Add `public/<key>.txt` containing just the key. This is
   IndexNow's ownership proof; the key is public by design.
2. Create `scripts/indexnow.mjs`. It reads `dist/sitemap.xml` and POSTs to
   `https://api.indexnow.org/indexnow` with
   `{ host: "quantsandbox.dev", key, keyLocation: "https://quantsandbox.dev/<key>.txt", urlList: [...] }`
   (at most 10,000 URLs per call). Log the HTTP status. `200` or `202` means OK.
   Put the key in a constant in the script (it's public anyway) and add a one-line comment.
3. Add the npm script `"indexnow": "node scripts/indexnow.mjs"`. The owner runs it **manually after
   a production deploy** that changes content. Don't wire it into `npm run build`: preview builds
   would ping for unreleased pages.
4. Optional refinement: send only URLs whose sitemap `<lastmod>` is newer than the last run (store
   the timestamp in `node_modules/.cache/indexnow.json`).

**Done 2026-10-19.** Key file `public/60459a4456dc081a5d799566df2bc117.txt`. `npm run indexnow` sends URLs whose
sitemap `lastmod` is on or after the last successful run (all on the first run); `-- --all` sends
everything and `-- --dry` only prints. The last-run date is stored in `node_modules/.cache/indexnow.json`.
Not yet run against production: the key file must be deployed first.

## Part C — Routine after each SEO-relevant deploy

```bash
npm run build && npm run test:seo     # before deploying
curl -sI https://quantsandbox.dev/does-not-exist | head -1     # → HTTP/2 404
curl -s https://quantsandbox.dev/wacc | grep -c "<h1"           # → 1
curl -sI https://quantsandbox.dev/llms.txt | grep -i content-type
npm run indexnow                       # if Part B is done
```

## Acceptance criteria

- Part A items 1–2 done by the owner, with dates entered in the log below.
- (If Part B is done) `npm run indexnow` returns 200/202 against production, and the key file is
  reachable at `https://quantsandbox.dev/<key>.txt`.

## Log (owner fills in)

| Date | Action / observation |
|---|---|
| | GSC sitemap submitted |
| | Bing imported from GSC |
| | AI spot check: … |

## Prompt to hand off (Part B only)

> You are working in the Quant Sandbox repo. Read `docs/plans/seo/09-search-console-monitoring.md`
> and implement Part B only: generate an IndexNow key, add `public/<key>.txt`, write
> `scripts/indexnow.mjs` that submits all URLs from `dist/sitemap.xml` to api.indexnow.org, and add
> the `indexnow` npm script. Don't run it against production and don't hook it into the build.
> Run `npm run lint`, then tell the owner the key filename and how to run it after a deploy.
