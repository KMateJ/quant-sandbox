# 02 — Baseline fixes: real 404s, strict pre-render, manifest, lastmod, OG fallback

Status: done (2026-10-19) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why

Several small defects make the site look worse to crawlers than it is. Unknown URLs return the home
page with HTTP 200 (soft 404s, which waste crawl budget and create duplicate content). A failed
pre-render silently ships an empty page. Every social or AI link preview points to a missing image.
The web manifest has no name. Every sitemap URL claims it changed today. Fixing these is cheap and
lays the ground for plans 03–08.

## Current state (verified 2026-10-19)

- **`vercel.json`**: `"cleanUrls": true`, two `redirects` (`/stochastic-models?lesson=x` →
  `/stochastic-models/x` and `/guide?topic=x` → `/guide/x`), and
  `"rewrites": [{ "source": "/(.*)", "destination": "/" }]`. Vercel serves real files first
  (`dist/wacc.html` at `/wacc`), so the rewrite only catches URLs **without** a file. Those get
  `index.html` (the home page) with status 200.
- **`src/App.tsx`**: the last route is `<Route path="*" element={<Navigate to="/" replace />} />`,
  so the client also bounces unknown paths to home. Registry redirects
  (`redirects` in `src/modules/registry.ts`, built by `guideRedirects()` in
  `src/features/guide/guide.meta.ts`, e.g. `/guide` → `/guide/derivatives`) are client-side
  `<Navigate>` only. On the server, `/guide` has no file today, so it gets home via the rewrite.
- Unknown lesson ids under `/guide/<track>/*` and `/stochastic-models/*` are handled inside
  `GuideView.tsx` / `StochasticModelsView.tsx` (`useParams()["*"]` + `<Navigate>`). All **valid**
  routes are pre-rendered, as checked against the registry.
- **`seo.plugin.ts`**: `renderBody()` catches errors and timeouts and returns `""`. If
  `entry-prerender.tsx` fails to load, every page is written without a body. Both paths only
  `console.warn`. The final log is `seo: wrote N pages (M pre-rendered)`.
- `sitemap()` in `seo.plugin.ts` uses `new Date().toISOString().slice(0, 10)` as `<lastmod>` for every
  URL.
- **`index.html`** (the template) contains an orphaned `<!-- Canonical -->` comment (the plugin
  strips the canonical link, so the comment sits alone). `og:image` and `twitter:image` =
  `https://quantsandbox.dev/og.png`. **`public/og.png` does not exist.**
- **`public/site.webmanifest`**: `"name":""`, `"short_name":""`, theme and background `#ffffff`.
  The site's dark background token is `--bg: #0b1220` (`src/styles/tokens.scss`), which matches
  `<meta name="theme-color" content="#0b1220">`.
- There is no CI workflow (`.github/` only has `prompts/`). Builds run on Vercel.

## Goal

1. Unknown URLs → HTTP **404** with a proper "Page not found" page carrying `noindex`.
2. Registry redirects work without JavaScript (crawlers see a redirect, not home).
3. The build **fails** if any page pre-renders empty, unless explicitly allowed.
4. `lastmod` reflects when the page's sources last changed.
5. A static `public/og.png` fallback exists (plan 05 adds per-page images later), the manifest is
   filled in, and the template is clean.
6. Trailing-slash variants (`/wacc/`) redirect to the canonical form.

## Non-goals

Per-page OG images (plan 05). Structured-data changes (plan 03). Any change to lab logic.

## Constraints

CLAUDE.md hard rules: DRY (redirects and pages come from the registry; never list routes by hand in
`vercel.json`), i18n for every visible string (EN + HU), `.tsx` under about 150 lines, `///`
comments. Owner memory: no left-border accents, no pill-shaped buttons.

## Steps

### A. Not-found page

1. Add a language file `src/Language/NotFound.ts` exporting `notFoundEn` / `notFoundHu` with keys
   `notFoundTitle` ("Page not found" / "Az oldal nem található"), `notFoundBody` (one sentence:
   "The page you are looking for doesn't exist or has moved." / Hungarian equivalent) and
   `notFoundHome` ("Go to the home page" / "Vissza a kezdőlapra"). Follow the export pattern of
   another small file such as `src/Language/Theme.ts`. Register both in `src/i18n.tsx`: import, then
   spread into `translations.hu` and `translations.en` next to `...themeHu` / `...themeEn`.
2. Create `src/components/layout/NotFound.tsx` (well under 150 lines). It composes the existing
   primitives (look at `src/components/layout/` for `PageHeader` / `Panel`, and copy how a simple
   page uses them): an `<h1>` with `t("notFoundTitle")`, a paragraph, and a react-router `<Link>`
   to `/`. Use an existing button or link class. Don't add new SCSS unless needed; if you must,
   put it in an existing partial such as `src/styles/_shell.scss`.
3. In `src/App.tsx`, replace `<Route path="*" element={<Navigate to="/" replace />} />` with
   `<Route path="*" element={<NotFound />} />`. Keep the `redirects.map(...)` routes as they are.
4. `<RouteSeo>` (`src/seo.tsx`) finds no page for an unknown path and renders nothing, so the head
   keeps the previous route's tags during client navigation. Accept this (client-only, crawlers
   never see it). Do not add a second route list.

### B. Plugin changes (`seo.plugin.ts`)

The plugin is about 218 lines. Create a folder `seo/` at the repo root for helpers that this and
later plans add, and keep `seo.plugin.ts` as the orchestrator. Move or add pure helpers there as
`.ts` files (e.g. `seo/sitemap.ts`, `seo/html.ts`). `tsconfig.node.json` currently has
`"include": ["vite.config.ts", "seo.plugin.ts"]`. Add `"seo/**/*.ts"` so the helpers are
type-checked by `tsc -b`.

5. **404 page:** after writing the pages, render `"/__not-found"` with `renderBody`. It matches the
   `*` route and renders `<NotFound>`. Write `dist/404.html` from the template with
   - `<title>Page not found | Quant Sandbox</title>`
   - `<meta name="robots" content="noindex" />`
   - no canonical, no JSON-LD, and no og:url (strip them the same way `PER_PAGE_TAGS` does).
   Factor the head building in `pageHtml()` so the 404 reuses it rather than duplicating the
   template handling (e.g. `pageHtml(template, head: string[], body)` plus a
   `seoHead(page, site)` that returns the tag list).
6. **Redirect stubs (DRY, from the registry):** load `redirects` from `/src/modules/registry.ts`
   via `server.ssrLoadModule` (the same server instance). For each `{from, to}` write
   `dist/<from>.html` containing a minimal document with:
   `<meta http-equiv="refresh" content="0; url=<to>">`,
   `<link rel="canonical" href="<BASE_URL><to>">`, `<meta name="robots" content="noindex">`, and
   a plain `<a href="<to>">` link. Skip a `from` that collides with a real page path. Google treats
   a 0-second meta refresh as a permanent redirect. The client router still performs its own
   `<Navigate>`.
7. **Strict mode:** collect the paths whose body came back empty. After the loop, if the list is
   non-empty **and** `process.env.SEO_ALLOW_EMPTY !== "1"`, `throw new Error(...)` listing them.
   This fails `vite build` and therefore the Vercel deploy. Apply the same rule when
   `entry-prerender.tsx` fails to load: throw instead of falling back to empty pages, unless
   `SEO_ALLOW_EMPTY=1`. Update the `///` comment on `renderBody` ("never breaks the build" no longer
   holds by default).
8. **lastmod from git:** add `seo/lastmod.ts` with
   `/// Last commit date (YYYY-MM-DD) touching any of the files, or undefined outside a git checkout.`
   `export function gitLastModified(files: string[]): string | undefined`. Use
   `execFileSync("git", ["log", "-1", "--format=%cs", "--", ...files])` and catch everything.
   Decide the source files per page **from data the plugin already has**:
   - guide lesson (`/guide/<track>/<id>`): `src/Language/guides/<camelCaseId>.ts`. Resolve it by
     globbing `src/Language/guides/*.ts` and matching the import map in
     `src/Language/guides/index.ts`. If that is fiddly, use the whole `src/Language/guides` dir.
   - any other page: `src/features/<module-id>` plus the module's language file if it exists (e.g.
     `src/Language/Wacc.ts`). Simplest robust rule: pass the directory `src/features/<first path
     segment>` and fall back to the build date if git returns nothing.
   Note that Vercel clones shallowly. If `git log` returns nothing (or the same date for all
   pages), **omit `<lastmod>`** rather than lie. Detect this by checking
   `git rev-parse --is-shallow-repository` once; if it is `true`, skip lastmod entirely. Document
   this in the code comment.
9. Remove the remaining "(N pre-rendered)" ambiguity: log
   `seo: wrote N pages, 404.html, R redirect stubs and sitemap.xml`.

### C. Hosting + static files

10. `vercel.json`: **delete** the `rewrites` block, keep both `redirects`, and add
    `"trailingSlash": false`. Vercel then serves `dist/404.html` with status 404 for unknown paths.
11. `index.html`: delete the `<!-- Canonical -->` comment line (leave the canonical `<link>`; the
    plugin replaces it per page).
12. `public/site.webmanifest`: set `"name": "Quant Sandbox"`, `"short_name": "Quant Sandbox"`,
    `"theme_color": "#0b1220"`, `"background_color": "#0b1220"`, and add `"start_url": "/"`. Keep
    the icons.
13. **Fallback OG image:** create `public/og.png` at 1200×630. Plan 05 will generate it properly.
    For now, produce a simple one with a tiny Node script run **once** (not part of the build):
    dark `#0b1220` background, "Quant Sandbox" in large white text, and the subtitle "Interactive
    quantitative finance labs and lessons" in `#9fb0c9`. If no rasteriser is available without new
    dependencies, skip this step, leave the OG test as `todo`, and note that plan 05 creates it.
    Don't add a dependency just for this.
14. Plan 01's audit: remove `todo` from the OG-image test if step 13 was done. Add tests that
    `dist/404.html` exists, contains `noindex`, has exactly one `<h1>` and is **not** in the
    sitemap, and that every redirect stub has a `http-equiv="refresh"`. Read the stubs by listing
    the registry redirect sources: parse `dist/**/*.html` files whose head contains
    `http-equiv="refresh"` and exclude them from the orphan-page rule.

## Acceptance criteria

- `npm run build` succeeds and writes `dist/404.html` and the redirect stubs (at least
  `dist/guide.html` → `/guide/derivatives`).
- Temporarily making one module throw during render (e.g. `throw new Error()` at the top of a lab
  view) fails `npm run build` with the path listed. `SEO_ALLOW_EMPTY=1 npm run build` succeeds.
  Revert the throw.
- `vercel.json` has no catch-all rewrite and has `"trailingSlash": false`.
- `npm run test:seo` is green (with the new 404 and stub checks).
- `npm run preview` → `/nope` shows the Not-found page. Note that `vite preview` falls back to
  `index.html` and won't return 404; the real status is verified on a Vercel preview deploy (step
  in Verification).
- The manifest has a name. `index.html` has no orphaned comment.

## Verification

```bash
npm run build && npm run test:seo && npm run lint
npx vercel build && npx vercel dev   # optional, if the Vercel CLI is set up: /nope → 404
```

After deploying a preview:
`curl -sI https://<preview>/nope | head -1` → `404`, `curl -s https://<preview>/guide | grep refresh`.

## Pitfalls

- **Don't remove the rewrite without the 404.html and stubs.** Without stubs, `/guide` would 404.
- `ssrLoadModule("/src/modules/registry.ts")` imports `lazy()` components. That's fine, because
  they're never invoked. It's already loaded indirectly through `seo.routes.ts`.
- Keep `SEO_ALLOW_EMPTY` documented in a one-line comment where it's read. Don't set it on Vercel.
- `trailingSlash: false` plus `cleanUrls` is the documented Vercel combination. Don't also add
  manual trailing-slash redirects.
- `NotFound.tsx` must not use `window` during render (it is pre-rendered on the server).
- The Hungarian string must be real Hungarian (the owner is Hungarian). Keep it short and neutral.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4 rules) and `docs/plans/seo/02-baseline-fixes.md`, then implement plan 02 step by step: the
> NotFound page with EN/HU strings, the `seo/` helper folder, 404.html + registry redirect stubs +
> strict empty-page failure + git lastmod in `seo.plugin.ts`, the `vercel.json` / `index.html` /
> `site.webmanifest` fixes, the OG fallback if possible without new dependencies, and the new audit
> checks. Run `npm run build`, `npm run test:seo` and `npm run lint` and make them pass. Then mark
> plan 02 `done` in the README table and summarise what changed, including anything you skipped.
