# 01 — Automated SEO audit of `dist/`

Status: done (2026-10-19) · Depends on: – · Suggested model: Sonnet · Est. size: S

## Why

Every later SEO plan changes the generated HTML. Without an automated check, a broken canonical, a
duplicate title or an empty pre-render goes unnoticed until Google reports it weeks later. This plan
adds a fast, dependency-free audit of the built site, which later plans run as their verification
step.

## Current state (verified 2026-10-19)

- `npm run build` = `tsc -b && vite build`. The Vite plugin `seo.plugin.ts` (repo root) writes
  `dist/<path>.html` for every page in `englishSeoPages()` (`src/seo.routes.ts`) plus
  `dist/sitemap.xml` (96 URLs at the moment).
- Each generated page head contains: `<title>`, `<meta name="description">`,
  `<link rel="canonical">`, `og:title/description/url`, `twitter:title/description`, and one or two
  `<script type="application/ld+json">` blocks. `og:image` and `twitter:image` come from the
  `index.html` template and point to `https://quantsandbox.dev/og.png`, **which does not exist**
  (no `public/og.png`).
- The body is inside `<div id="root">…</div>`.
- JSON-LD `@type` tells the page kind: `WebSite` = home, `WebApplication` = lab/tool,
  `Course` = module with lessons (guide tracks, `/stochastic-models`), `LearningResource` = a lesson
  (guide lessons `/guide/<track>/<lesson>` and studio lessons `/stochastic-models/<lesson>`).
- Rough current body sizes: labs about 390 words. Guide lessons 2,000+ words. Studio lessons
  (`/stochastic-models/*`) are much shorter (HTML about 19–25 KB, similar to labs).
- Existing tests are `node:test` files in `scripts/*.test.mjs`, run by `npm run test:<name>` scripts
  in `package.json` (example: `scripts/url-state.test.mjs`). `scripts/lib/load-ts.mjs` exports
  `importSrc(path)` for importing TS from `src/`. It is not needed here, because the audit reads
  `dist/` only.
- `vercel.json` has `redirects` (legacy query redirects) and a catch-all rewrite. The client also
  has registry redirects (`guideRedirects()` in `src/features/guide/guide.meta.ts`, e.g. `/guide` →
  `/guide/derivatives`).

## Goal

- `scripts/lib/seo-dist.mjs`: small reusable helpers to read and parse the built pages. Later plans
  (04, 05, 08) add checks that use it.
- `scripts/seo-audit.test.mjs`: the audit, as `node:test` tests.
- The npm script `"test:seo": "node --test scripts/seo-audit.test.mjs"`.

## Non-goals

- No HTML parser dependency. Use regex on our own generated markup, which is predictable.
- Don't change any generated output in this plan. If a check fails on the current build, mark it
  `todo` (see Steps) instead of fixing it here.
- Don't run the build from inside the test. The developer runs `npm run build` first.

## Constraints

CLAUDE.md applies (short `///` comments on exported helpers, match the style of `scripts/*.test.mjs`:
ESM, `node:assert/strict`, `node:test`, double quotes). Plain `.mjs`, no TypeScript.

## Steps

1. **Create `scripts/lib/seo-dist.mjs`** exporting:
   - `DIST` = absolute path to `dist/` (resolve from `import.meta.url`, `../../dist`).
   - `BASE_URL = "https://quantsandbox.dev"`. Keep it in sync with `src/seo.routes.ts` and add a
     comment saying so.
   - `async function sitemapUrls()` → `string[]` of `<loc>` values from `dist/sitemap.xml`.
   - `function urlToFile(url)` → the absolute `dist` file. `/` → `index.html`, `/a/b` →
     `a/b.html`. Accept absolute URLs or paths.
   - `async function readPage(url)` → `{ url, path, html, head, body }`. `head` is the text between
     `<head>` and `</head>`. `body` is the inner HTML of `<div id="root">` (from after
     `<div id="root">` up to the last `</div>` before `</body>`).
   - `function meta(head, attr, name)` → the content of
     `<meta {attr}="{name}" content="…">`, or `undefined`. Also export `title(head)` and
     `canonical(head)`.
   - `function jsonLd(head)` → the array of parsed JSON objects. **Let `JSON.parse` throw**, so the
     test reports invalid JSON.
   - `function pageKind(ld)` → `"home" | "lab" | "course" | "lesson" | "unknown"` from the first
     `@type` (`WebSite`, `WebApplication`, `Course`, `LearningResource`).
   - `function visibleText(bodyHtml)` → the text with `<script>`, `<style>`, `<svg>…</svg>` and
     `<annotation>` / `.katex-mathml` duplicates removed, tags stripped, entities `&amp; &lt; &gt;
     &quot; &#x27;` decoded, and whitespace collapsed. Also export `wordCount(text)`.
   - `function internalLinks(bodyHtml)` → unique `href="/…"` values with the query and hash
     stripped. Skip `/assets/`, and skip files with an extension unless it is `.md` (plan 04).
   - `async function redirectSources()` → a set of `source` paths from `vercel.json` `redirects`.
2. **Create `scripts/seo-audit.test.mjs`.** Load all pages once at the top (top-level `await`).
   Write one `test()` per rule. Each test collects **all** offending URLs and asserts that the list
   is empty, so the failure message lists every bad page (e.g.
   `assert.deepEqual(bad, [], "pages with …")`). Rules:
   1. The sitemap has ≥ 1 URL, and every URL starts with `BASE_URL` and maps to an existing file.
   2. Every `dist/**/*.html` except `google*.html` and `404.html` is in the sitemap (no orphan
      pages).
   3. There is exactly one `<h1` in `body`.
   4. The title exists, is ≤ 70 characters, and is unique across pages. Separately, log titles
      longer than 60 characters with `console.warn`, without failing.
   5. The description exists, is 50–160 characters, and is unique.
   6. The canonical equals `BASE_URL + path` (home: `BASE_URL + "/"`), and `og:url` equals the
      canonical.
   7. Every JSON-LD block parses and has `@context` `https://schema.org` and a `@type`.
   8. Body word count by kind. **Set the thresholds from the baseline** (Step 3). Start with
      `lab ≥ 250`, `lesson ≥ 250`, `course ≥ 150`, `home ≥ 300`, and lower them only if the current
      build fails, with a `// raise in plan 07` comment. Also print a sorted table of the 10
      thinnest pages (`console.log`) for information.
   9. Internal links in `body` resolve to a page in the sitemap, a redirect source, or a `.md` file
      in `dist`.
   10. `og:image` and `twitter:image` exist and resolve to a file in `dist`. **This fails today.**
       Register it as `test("og images exist", { todo: "fixed by plans 02/05" }, …)` so the suite
       stays green but reports it.
   11. `<html lang="…">` is present and equals `en` for pages outside `/hu/` (plan 08 extends this).
3. **Baseline.** Run `npm run build` and then `npm run test:seo`. Tune only the thresholds in rule 8
   so the current build passes. Do not loosen the other rules. If another rule fails on the current
   build, keep the rule, mark that test `{ todo: "<reason>" }`, and record it in the "Findings"
   section at the bottom of this plan file.
4. Add `"test:seo": "node --test scripts/seo-audit.test.mjs"` to `package.json` `scripts`, next to
   the other `test:*` entries.

## Acceptance criteria

- `npm run build && npm run test:seo` exits 0 on the current code. The `todo` tests are reported but
  don't fail the run.
- Deliberately breaking a page (e.g. temporarily editing `dist/wacc.html` to remove its `<h1>`)
  makes the run fail with the URL named in the message.
- The helpers in `scripts/lib/seo-dist.mjs` are exported with `///` doc comments.

## Verification

```bash
npm run build
npm run test:seo
npm run lint
```

## Pitfalls

- `dist/index.html` is the home page **and** the template. Treat it as the `/` page.
- KaTeX renders math twice (MathML + HTML). Strip `<span class="katex-mathml">…</span>` before
  counting words, or lessons get inflated counts. The spans nest, so a non-greedy regex up to
  `</math></span>` works for KaTeX output.
- On Windows, build paths with `node:path` / `fileURLToPath`, never string concatenation with `/`.
- Don't import from `src/` here. The audit must only depend on the built output.

## Findings (fill in during execution)

- Baseline thresholds chosen: the starting values pass unchanged (`lab 250, lesson 250, course 150,
  home 300`). Thinnest pages are studio lessons (`/stochastic-models/random-walk` 341 words) and the
  derivatives labs (`/delta-hedging` 366, `/heston` 374, `/black-scholes` 376).
- Rules marked todo and why: rules 3–5 are enforced for every page. The pages that fail them today
  are listed in `KNOWN` in `scripts/seo-audit.test.mjs` and reported by a separate
  `(known baseline)` todo test. Delete entries from `KNOWN` as they are fixed (02 or 07):
  - **h1:** all 11 studio lessons `/stochastic-models/<lesson>` render no `<h1>` at all.
  - **title > 70 chars (13):** `/treasury-futures` (74), `/stochastic-models` (75), the guide track
    pages `/guide/derivatives|portfolio|fixed-income|corporate|stochastic` (72–83), and
    `/guide/portfolio/{returns-volatility,diversification,efficient-frontier,performance-measures}`,
    `/guide/fixed-income/{yield-curve,credit-risk}` (71–83). About 45 more are 61–70 (warned only).
  - **description > 160 chars (6):** `/` 171, `/payoff` 164, `/delta-hedging` 170,
    `/efficient-frontier` 178, `/stochastic-models` 174, `/guide/portfolio` 161.
  - **og images:** todo for every page, as planned (no `/og.png`).
- All internal links resolve, JSON-LD is valid everywhere, there are no orphan pages, and canonicals
  and `og:url` match.

## Prompt to hand off

> You are working in the Quant Sandbox repo (Vite + React 19 + TS). Read `CLAUDE.md` and
> `docs/plans/seo/01-seo-audit-script.md`, then implement that plan exactly: create
> `scripts/lib/seo-dist.mjs` and `scripts/seo-audit.test.mjs`, add the `test:seo` npm script, run
> `npm run build` and `npm run test:seo`, tune only the word-count thresholds to the baseline, and
> mark the OG-image test as `todo`. Don't change any app or plugin code. When done, fill in the
> "Findings" section of the plan, set plan 01 to `done` in `docs/plans/seo/README.md`, and report
> the test output.
