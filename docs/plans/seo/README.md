# SEO & AI-discoverability plans

Goal: every page of Quant Sandbox (https://quantsandbox.dev) should be fully readable, well
described, fast, and linkable for search engines (Google, Bing) and AI crawlers / answer engines
(GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, …), in English first and
Hungarian later.

This folder holds **self-contained plans**. Each `NN-*.md` can be given to an executor model
(Sonnet is recommended) without this README or any earlier chat. Each plan ends with a ready-to-paste
**handoff prompt**.

Snapshot taken: **2026-10-19** (commit `5f10366`). If the code has moved on, the executor must
re-check the "Current state" section of its plan before editing.

---

## 1. Current state (what already works)

The site is a Vite + React 19 SPA with **build-time pre-rendering (SSG)**. Do not rebuild this from
scratch. Extend it.

| Piece | File | What it does |
|---|---|---|
| Page list | `src/seo.routes.ts` | `seoPages(t, english)` builds `{path,title,description,parent?,lessons?}` for every module in `src/modules/registry.ts` plus each `subNav` item with a `descKey` (guide lessons, stochastic studio lessons). `englishSeoPages()` = the English list. |
| Build plugin | `seo.plugin.ts` (repo root, about 218 lines) | `apply: "build"`. In `closeBundle` it starts a middleware-mode Vite server, `ssrLoadModule`s the page list and `src/entry-prerender.tsx`, and writes `dist/<path>.html` for each page: the rendered body plus title, description, canonical, OG/Twitter and JSON-LD. It then writes `dist/sitemap.xml`. |
| Server render | `src/entry-prerender.tsx` | `react-dom/static` `prerender()` inside `StaticRouter` + `AppProviders`. It waits for lazy routes. |
| Client entry | `src/main.tsx` | Hydrates the pre-rendered markup when the reader's language is `en`, otherwise renders fresh. |
| Runtime head | `src/seo.tsx` | `<RouteSeo>` updates title, meta and canonical on client navigation. |
| Hosting | `vercel.json` | `cleanUrls`, 2 legacy query redirects, catch-all rewrite `/(.*) → /`. |
| Robots | `public/robots.txt` | Allows all and lists the sitemap. Google Search Console is verified (`public/google56b3ee549bb44cea.html`). |

Audit of the 2026-10-18 `dist/`: **96 pages + sitemap**, all with body content. Labs have about 390
words each (h1, controls, "About this tool" + 2 FAQ). Guide lessons have 2,000+ words with h2
sections and server-rendered KaTeX. JSON-LD is present on every page. `<html lang="en">` everywhere.

### Gaps (each one is handled by a plan)

| # | Gap | Plan |
|---|---|---|
| G1 | No automated check of the `dist/` SEO output | 01 |
| G2 | `og:image` → `/og.png` **does not exist** (broken previews everywhere) | 02 (fallback), 05 (per page) |
| G3 | Soft 404s: unknown URLs return the home page with status 200 (catch-all rewrite + client `<Navigate to="/">`) | 02 |
| G4 | A failed pre-render only warns, so the build ships empty pages | 02 |
| G5 | `site.webmanifest` has an empty name; template has an orphaned `<!-- Canonical -->` comment; sitemap `lastmod` = build date for all URLs | 02 |
| G6 | JSON-LD is hard-coded in the plugin; module FAQs are not emitted as `FAQPage`; no `Organization` | 03 |
| G7 | No `llms.txt` and no Markdown versions for AI crawlers | 04 |
| G8 | No per-page social/AI preview images | 05 |
| G9 | Main entry chunk is about 1.1 MB (both language tables plus more, eager). This hurts Core Web Vitals | 06 |
| G10 | Labs are thin (about 390 words); internal linking from lab body to lessons is weak | 07 |
| G11 | Hungarian content is invisible to crawlers (no `/hu` URLs, no `hreflang`) | 08 |
| G12 | Search Console / Bing / IndexNow / monitoring routine | 09 |

---

## 2. Decision: SSG, not runtime SSR

The request was "SSR if possible". **We keep and harden the existing build-time pre-rendering.** We
do not add runtime SSR (Vercel functions / a Node server). The reasons:

- Every indexable route is known at build time (the registry), and the content is static.
- Interactive state lives on the client or in query params, and the canonicals strip those
  parameters, so it never needs to be rendered on the server.
- Crawlers already get full HTML. Runtime SSR would add cold starts, function cost and a second
  runtime target, with **zero** extra crawler benefit.

Revisit only if we ever need pages that depend on the request (user accounts, per-query-param
landing pages, A/B tests).

---

## 3. Plans, order, status

| Plan | Title | Depends on | Size | Status |
|---|---|---|---|---|
| [01](01-seo-audit-script.md) | Automated SEO audit of `dist/` | – | S | done (2026-10-19) |
| [02](02-baseline-fixes.md) | Baseline fixes (404, strict pre-render, manifest, lastmod, OG fallback) | 01 | M | done (2026-10-19) |
| [03](03-structured-data.md) | Structured data module + FAQPage / Organization | 01, 02 | M | done (2026-10-19) |
| [04](04-ai-crawlers-llms-txt.md) | AI crawlers: `llms.txt`, Markdown twins, robots | 01, 02 | M | done (2026-10-19) |
| [05](05-og-images.md) | Per-page OG images at build time | 01, 02 | M | done (2026-10-19) |
| [06](06-performance-cwv.md) | Core Web Vitals: bundle split, lazy Hungarian tables | 01 | M–L | done (2026-10-19) |
| [07](07-content-depth-internal-links.md) | Content depth + internal links on labs | 01, 03 | M | done (2026-10-19) |
| [08](08-hungarian-edition.md) | Hungarian edition `/hu/...` + hreflang | 02–06 | L | done (2026-10-19; preview check and optional phase 4 pending) |
| [09](09-search-console-monitoring.md) | Search Console, Bing, IndexNow, monitoring | 02 (ideally all) | S | Part B done (2026-10-19); Part A owner checklist pending |

Recommended order: **01 → 02 → (03, 04, 05 in any order) → 06 → 07 → 08 → 09**. Plans 03/04/05 all
edit `seo.plugin.ts`, so run them **one after another, not in parallel**.

When a plan is finished, the executor updates its row in this table (`done` + date) and nothing else
in this README unless the plan says so.

---

## 4. Rules for every executor

Read `CLAUDE.md` (repo root) first. Its hard rules apply:

1. **DRY.** Page metadata comes only from the registry (`src/modules/registry.ts`) and
   `seoPages()`. Never keep a second list of routes.
2. **Separation of concerns.** Pure logic goes in `*.ts` with no React import. Views go in `*.tsx`.
   Strings go in `src/Language/*` in **EN and HU**. Heavy build-time work stays in the build plugin,
   not in the client bundle.
3. **`.tsx` files stay under about 150 lines.** Split them if needed. Plain `.ts` (the plugin,
   `*.math.ts`, data) is exempt but must stay cohesive. `seo.plugin.ts` is already about 218 lines;
   when a plan adds a lot, move pieces into a `seo/` helper folder at the repo root (for example
   `seo/structuredData.ts`, `seo/markdown.ts`). The plans say where.
4. Comments are short. Use `///` doc comments on exported functions. Match the existing style
   (double quotes in TS, 2-space indent, no semicolon-free style changes).
5. Don't add docs files beyond these plans.

Owner preferences (from project memory). Respect them:

- **Derivatives labs are hands-off.** Do not change the logic or UI of the payoff, binomial,
  black-scholes, heston and delta-hedging labs unless the plan explicitly says so. SEO head tags,
  the About/FAQ copy and the shared layout are fine.
- **No left-border accent bars** for active or highlighted states. Use background or colour.
- **Avoid pills and capsules** for nav or decorative labels (CLAUDE.md §4.8). Use plain links and
  lists.
- **Guide writing style:** plain descriptive titles, explanations built up from basics, no
  movie-title headings.

General verification commands (each plan lists its own as well):

```bash
npm run build          # tsc -b && vite build (+ seo plugin)
npm run test:seo       # added by plan 01
npm run lint
```

Windows note: the owner develops on Windows (Git Bash / PowerShell). Use `node:path` `join` and
avoid shell-specific scripts in `package.json`.

---

## 5. Definition of done (whole programme)

- `npm run build && npm run test:seo` is green. Every sitemap URL has a unique title and
  description, a canonical, valid JSON-LD, a real body, and an existing OG image.
- Unknown URLs return HTTP 404 with a `noindex` page.
- `/llms.txt`, `/llms-full.txt` and `.md` twins are served with `text/markdown`.
- The entry JS is ≤ 500 KB raw, and Lighthouse SEO is 100 with Performance ≥ 90 on a lab and a
  lesson (mobile).
- `/hu/...` pages exist with `hreflang` pairs, and the sitemap lists both languages.
- The sitemap is submitted in Google Search Console and Bing Webmaster Tools.

## 6. Post-deploy checklist (after each SEO plan ships)

1. `curl -sI https://quantsandbox.dev/does-not-exist` → `404`.
2. `curl -s https://quantsandbox.dev/wacc | grep -c "<h1"` → `1`.
3. Paste a lab URL and a lesson URL into https://search.google.com/test/rich-results.
4. Paste a URL into https://www.opengraph.xyz/ (or similar) and check the preview image.
5. Check GSC → Pages for new "Not indexed" reasons.
