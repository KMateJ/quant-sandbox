# 08 — Hungarian edition: `/hu/...` pages with hreflang

Status: done (2026-10-19; phase 4 not started, needs the owner) · Depends on: 02, 03, 04, 05, 06 (all done first) · Suggested model: Sonnet, in the phases below; stop after each phase with build + tests green · Est. size: L

## Why

Every lab and lesson already exists in Hungarian, but crawlers can't see it. The language is a
client-side `localStorage` choice, so all URLs serve English HTML. Hungarian searchers (the owner's
own audience: BME students and Hungarian finance learners) therefore never find the Hungarian
version, and AI engines answering in Hungarian cite English or nothing. Giving each language its
own URL, pre-rendered and linked with `hreflang`, is the standard, Google-recommended set-up.

## Current state (verified 2026-10-19; re-check after plans 02–06)

- **Language selection:** `src/languageStorage.ts`: `savedLanguage()` reads
  `localStorage["qs-language"]`, and `PRERENDER_LANGUAGE = "en"`. `src/i18n.tsx`:
  `LanguageProvider` holds `language` state initialised from i18next, `setLanguage(lang)` calls
  `changeLanguage` and writes localStorage, and an effect sets `document.documentElement.lang`. After
  plan 06, `loadLanguage(lang)` lazily loads the HU table (and works on the server).
- **Language switch UI:** `src/components/ui/LanguageMenu.tsx` buttons call `setLanguage("en" | "hu")`.
- **Routing:** `src/main.tsx` uses `<BrowserRouter>`, and `src/entry-prerender.tsx` uses
  `<StaticRouter location={url}>`, both without `basename`. `src/App.tsx` builds the routes from
  `modules` (`m.path`, `${m.path}/*` for modules with `subNav`) and `redirects`. **All internal
  navigation goes through React Router** (`<Link>`, `<NavLink>`, `<Navigate>`, `useNavigate`). A
  grep found no raw `href="/…"` or `window.location` navigation in `src/`, so a router `basename`
  prefixes every link automatically.
- **Hydration rule today (`main.tsx`):** hydrate only when the reader's language is `en`, otherwise
  clear the root and render fresh.
- **SEO page list:** `src/seo.routes.ts` → `seoPages(t, english)` and `englishSeoPages()`. Module
  titles and descriptions come from **English-only literals** in the registry
  (`ModuleDef.seo: { title, description }`, `src/modules/registry.ts`). Guide lesson SEO titles are
  English-only (`src/features/guide/guide.seo.ts`), and `seoPages()` falls back to the translated
  label when `seoTitle` is absent. `docs/EXPANSION_PLAN.md` (around line 113) already planned
  `seo: { titleKey, descKey }`.
- **Runtime head:** `src/seo.tsx` → `<RouteSeo>` looks up the page by `pathname` and sets the
  canonical to `new URL(path, BASE_URL)`.
- **Build plugin:** `seo.plugin.ts` + the `seo/` helpers (plans 02–05) write HTML, 404, redirect
  stubs, JSON-LD (via `src/seo.schema.ts`), Markdown twins (via `src/seo.markdown.ts`), OG images
  (`seo/ogImages.ts`) and the sitemap, all for English only. The template has `<html lang="en">`.

## Target URL scheme

| Language | Home | Lab | Lesson |
|---|---|---|---|
| English (default, x-default) | `/` | `/wacc` | `/guide/corporate/wacc` |
| Hungarian | `/hu` | `/hu/wacc` | `/hu/guide/corporate/wacc` |

The URL is the **source of truth** for the language. localStorage remembers the reader's choice
only to redirect them on the bare home page (Phase 4, optional).

## Constraints

CLAUDE.md: DRY (the language prefix is defined in **one** module; routes still come only from the
registry; no hand-written `/hu` routes), separation of concerns (prefix helpers are pure `.ts`),
`.tsx` ≤ about 150 lines, i18n EN + HU, `///` comments. Don't change lab logic. Hungarian copy must
be natural; list new HU SEO strings for owner review in Findings.

## Phase 1 — Language-aware routing (no SEO output yet)

1. **`src/languageRoutes.ts`** (pure):
   ```ts
   import type { Language } from "./i18n";   // type-only
   export const LANGUAGES: Language[] = ["en", "hu"];
   export const DEFAULT_LANGUAGE: Language = "en";
   /// URL prefix of a language ("" for the default).
   export const languagePrefix = (lang: Language) => (lang === DEFAULT_LANGUAGE ? "" : `/${lang}`);
   /// Language encoded in a pathname ("/hu/wacc" → "hu").
   export function languageFromPath(pathname: string): Language
   /// Pathname without its language prefix ("/hu/wacc" → "/wacc", "/hu" → "/").
   export function stripLanguage(pathname: string): string
   /// Path in the given language ("/wacc", "hu" → "/hu/wacc"; "/", "hu" → "/hu").
   export function localizedPath(path: string, lang: Language): string
   ```
   Add a unit test `scripts/language-routes.test.mjs` (npm `test:language-routes`) via `importSrc`.
2. **`LanguageProvider`** (`src/i18n.tsx`): accept a prop `language: Language` (from the URL) and
   stop deriving it from storage. `setLanguage(lang)` saves localStorage and then **navigates** to
   `localizedPath(stripLanguage(location.pathname), lang) + location.search + location.hash` with a
   full page load (`window.location.assign`). A basename change can't be done in-router, and a full
   load also gets the pre-rendered HTML in the new language.
   `AppProviders` passes `language` through.
3. **`src/main.tsx`**:
   `const language = languageFromPath(location.pathname);`
   `await loadLanguage(language); await i18n.changeLanguage(language);`
   `<BrowserRouter basename={languagePrefix(language) || undefined}>`. Hydrate whenever `root` has
   children, because the markup now always matches the URL language. Remove the old
   storage-vs-prerender mismatch branch and `PRERENDER_LANGUAGE` if nothing else uses it.
4. **`src/entry-prerender.tsx`**: `renderPage(url: string)` derives `language` from `url`, does
   `await loadLanguage(language); await i18n.changeLanguage(language);`, and renders
   `<StaticRouter basename={prefix || undefined} location={url}>`. Render pages **sequentially**,
   because the i18next instance is shared.
5. `src/seo.tsx` `<RouteSeo>`: look up the page with `stripLanguage`-aware matching (the router's
   pathname is already without basename) and set the canonical to the **localized** URL. Plan 08
   Phase 2 makes `seoPages` language-aware.
6. Check: `npm run dev`, open `/hu/wacc`. The UI is Hungarian, links stay under `/hu`, and the
   language menu switches to `/wacc` and back.

## Phase 2 — Localised SEO metadata

7. Move module SEO strings into i18n: in `src/Language/Seo.ts` add `seoTitle<ModuleId>` and
   `seoDesc<ModuleId>` keys for EN (copy the current literals **exactly**) and HU (new
   translations). Change `ModuleDef.seo` to `{ titleKey: TranslationKey; descKey: TranslationKey }`
   and update the registry. `seoPages()` resolves them through `t`.
8. Guide lessons: keep `guide.seo.ts` titles for English. For Hungarian, use the translated lesson
   title (`t(labelKey)`). The description suffix stays English-only as today.
9. `seoPages(t, language)` (replacing the `english` boolean): prefix every `path`, `parent.path` and
   lesson path with `languagePrefix(language)`, and add `language` to `SeoPage`.
   `seoPagesFor(language)` replaces `englishSeoPages()` and uses `translations` from the plan 06
   loaders (on the server, load HU first).
10. `src/seo.schema.ts`: `inLanguage` from `page.language`. Use the localized category labels.

## Phase 3 — Build output per language

11. Plugin: loop over `LANGUAGES`. For each, get `seoPagesFor(lang)`, render, and write
    `dist/<path>.html`. Write the Hungarian home as **`dist/hu.html`** (served at `/hu` via
    `cleanUrls`). Replace `<html lang="en">` with `<html lang="${lang}">` in the head builder.
12. **hreflang:** for every page, emit
    `<link rel="alternate" hreflang="en" href="<EN url>" />`,
    `<link rel="alternate" hreflang="hu" href="<HU url>" />` and
    `<link rel="alternate" hreflang="x-default" href="<EN url>" />`. Pair the pages with
    `stripLanguage(path)`, and only emit a pair when both exist.
13. **Sitemap:** add `xmlns:xhtml="http://www.w3.org/1999/xhtml"` and list every URL of both
    languages, each with the three `<xhtml:link rel="alternate" hreflang=… href=…/>` entries.
14. **Redirect stubs:** also generate them under `/hu` (e.g. `/hu/guide` → `/hu/guide/derivatives`).
15. **Markdown twins** (plan 04): call `markdownPages(t, "hu")` and write them under `dist/hu/…`.
    The converter must build links with the language prefix. Pass a `base` (`BASE_URL +
    languagePrefix`) into `lessonToMarkdown` instead of a hard-coded `BASE_URL`. Keep `llms.txt`
    English, and add a final section `## Magyar` listing the Hungarian lesson `.md` URLs.
16. **OG images** (plan 05): cards from the HU pages with HU labels. The output path follows the
    page path (`og/hu/wacc.png`).
17. `404.html`: keep it English, and add a one-line Hungarian sentence and a link to `/hu` in
    `NotFound` **only if** it fits naturally. Optional.

## Phase 4 — Polish (optional, ask the owner)

18. Returning-reader convenience: on the client only, if the path is exactly `/` and
    `savedLanguage() === "hu"`, call `location.replace("/hu")`. Never redirect based on
    `Accept-Language` or for crawlers (they have no localStorage). Ask the owner before adding this.
19. Update `docs/plans/seo/README.md` §1 to describe the bilingual output.

## Audit updates (`scripts/seo-audit.test.mjs`)

- `<html lang>` equals `hu` for `/hu…` pages and `en` otherwise.
- Every page has hreflang `en`, `hu` and `x-default`. Every target exists in the sitemap, and pairs
  are reciprocal.
- Titles and descriptions are unique **within** a language. Cross-language duplicates are a
  warning (an untranslated string).
- The sitemap has 2× the English page count, and every `<url>` has 3 `xhtml:link`s.

## Acceptance criteria

- `dist/hu.html`, `dist/hu/wacc.html` and `dist/hu/guide/corporate/wacc.html` exist with Hungarian
  body text, `lang="hu"`, a Hungarian title and description, and correct hreflang.
- In `npm run preview`, `/hu/wacc` hydrates without React #418 errors. The language menu moves
  between `/wacc` and `/hu/wacc`, keeping query and hash.
- All `test:*` suites, `npm run build`, `npm run test:seo` and `npm run lint` are green.
- New Hungarian SEO strings are listed in Findings for owner review.

## Verification

```bash
npm run test:language-routes
npm run build
npm run test:seo
npm run lint
npm run preview   # manual: /hu, /hu/wacc, language switch, back/forward
```

After deploy: check `https://quantsandbox.dev/hu/wacc` in GSC URL Inspection, and check the
hreflang with any hreflang testing tool.

## Pitfalls

- **i18next is a singleton.** On the server, change the language before each render and never
  render in parallel. On the client, load HU before `hydrateRoot`, or text mismatches.
- `vite preview` serves `dist/hu.html` at `/hu` only if it supports clean URLs. If it doesn't,
  test `/hu.html` locally and verify `/hu` on a Vercel preview. Make sure `dist/hu.html` and the
  `dist/hu/` directory coexist under `cleanUrls` + `trailingSlash:false` on the preview deploy.
- `useUrlState` / `usePortfolioUrlSync.ts` read `window.location.search`. That's unaffected by
  basename, but test one lab with URL state under `/hu`.
- Hash deep links in guides (`useGuideToc.ts`, `#s-3`) must keep working under `/hu`.
- Any code comparing `pathname` to registry paths (`ModuleAboutSection`, `useActiveModule.ts`,
  `guideTrackFromPath`) gets the basename-stripped pathname from React Router. That's correct as
  long as no one reads `window.location.pathname` directly (grep again before finishing).
- `@vercel/analytics` sees `/hu/...` paths. That's fine.

## Findings (fill in)

- Progress (2026-10-19): **Phase 1 done** (`src/languageRoutes.ts` + `test:language-routes`, URL-driven
  `LanguageProvider`/`AppProviders`, basename in `main.tsx` and `entry-prerender.tsx`, localized
  canonical in `RouteSeo`; build and `test:seo` green). Phases 2–3 not started; phase 3 waits for 05.
  **Don't deploy phase 1 alone:** the language now comes only from the URL, so a reader who chose
  Hungarian sees English on `/wacc`, and `/hu/...` pages aren't written until phase 3.
- **Phase 2 done** (2026-10-19): `ModuleDef.seo` is now `{ titleKey, descKey }` (30 modules, keys
  `seoTitle<Id>` / `seoDesc<Id>` in `src/Language/Seo.ts`, English copied exactly, so the English
  build is unchanged). `seoPages(t, language)` replaces the `english` flag: paths, parents, lessons
  and categories carry the `/hu` prefix, `SeoPage.language` is set, `seoPagesFor(language)` loads the
  table first, JSON-LD `inLanguage` comes from the page, and `RouteSeo` matches the localized path.
  Hungarian lesson titles use the translated lesson label (the English `guide.seo.ts` titles and
  description suffix apply to English only).
- HU SEO titles and descriptions to review: the 30 `seoTitle*` / `seoDesc*` pairs at the end of
  `src/Language/Seo.hu.ts`. All descriptions are ≤ 160 characters. Lesson titles and descriptions
  come from the existing Hungarian guide tables and still need a read-through.
- **Phase 3 done** (2026-10-19): the build writes 192 pages (96 per language, Hungarian home at
  `dist/hu.html`), 112 redirect stubs (also under `/hu`), 156 Markdown twins (Hungarian ones under
  `dist/hu/`) and Hungarian OG cards (`og/hu/...`). Every page carries `hreflang` en / hu /
  x-default, and the sitemap lists both languages with three `xhtml:link` alternates per URL.
  `<html lang>` follows the page. `llms.txt` stays English and ends with a `## Magyar` list of the
  Hungarian lessons; `llms-full.txt` stays English. `404.html` stays English (step 17 skipped).
  `Language` now lives in the import-free `src/languageRoutes.ts` (re-exported by `i18n.tsx`), so
  the plugin can use the route helpers directly.
- Audit: the h1/title/description baselines match pages by their path without `/hu`, titles and
  descriptions must be unique within a language (same text in both languages only warns), and two
  new checks cover reciprocal hreflang links and the bilingual sitemap. Three Hungarian lesson
  titles are over 70 characters and are in the `KNOWN` title baseline: static-replication,
  mean-reversion and probability-spaces.
- All 22 `test:*` suites and `npm run build` pass.
- Hydration testing (2026-10-19, headless Chrome against `vite preview`): EN and HU pages hydrate with no
  errors, the language switch keeps query and hash both ways, and client navigation stays under `/hu`.
  Three bugs were found and fixed:
  1. The guide graph's SVG node links (`GraphCanvas.tsx`) and the "Try it" lab links (`GuideLink.tsx`, a
     raw `<a target=_blank>`) skipped the router basename, so Hungarian pages linked to English pages. Fixed
     with `localizedPath` and a router `<Link target="_blank">`. The audit test "Hungarian pages link only to
     Hungarian pages" guards this.
  2. `useGuideGraph.ts` imported the whole `index.hu`, so English guide readers downloaded the Hungarian
     chunk. It now imports only the lesson-title tables (`src/Language/guideTitles.hu.ts`, checked by
     `test:guide-graph`).
  3. `404.html` (English) served for an unknown `/hu/...` URL caused React #418. `main.tsx` now hydrates only
     when `<html lang>` matches the URL language, and renders fresh otherwise.
  Still to confirm on a Vercel preview: `/hu` is served from `hu.html` next to the `hu/` folder, and unknown
  URLs return status 404.
- Open question for the owner (phase 4): a reader who picked Hungarian before now lands on English
  at `/` and `/wacc`, because the URL decides the language. Step 18 (redirect `/` to `/hu` when
  `localStorage` says Hungarian) would fix that for the home page.

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` and
> `docs/plans/seo/08-hungarian-edition.md`, and confirm that plans 02–06 are marked done (stop and
> report if not). Implement plan 08 **one phase at a time**: after each phase run `npm run build`,
> all `npm run test:*` scripts and `npm run lint`, and only continue when they're green. Phase 4 is
> optional; ask before doing it. Keep `/hu` defined once in `src/languageRoutes.ts`, use router
> `basename` rather than editing links, and list every new Hungarian SEO string in the plan's
> Findings for the owner to review. Mark plan 08 done in the README and summarise per phase.
