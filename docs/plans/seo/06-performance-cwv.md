# 06 — Core Web Vitals: shrink the entry bundle (lazy Hungarian tables)

Status: done (2026-10-19) · Depends on: 01 · Suggested model: Sonnet (measurement-heavy; stop and report if the numbers disagree with this plan) · Est. size: M–L

## Why

Google uses Core Web Vitals (LCP, INP, CLS) as a ranking signal, and slow pages hurt engagement.
Our pages arrive pre-rendered, so the first paint is fast. But the browser must download, parse and
execute a **1.1 MB entry script** before the page becomes interactive and hydrates. On mid-range
phones this delays interactivity and blocks the main thread. The largest avoidable part is that
every UI string ships twice, once in English and once in Hungarian, while a reader needs only one
language.

## Current state (verified 2026-10-19, from the 2026-10-18 `dist/`)

- Largest assets: `index-*.js` **1,103,916 B** (entry), `GraphCanvas-*.js` 1,067,769 B and
  `Surface3D-*.js` 940,137 B (both lazy, three.js / graph), `index-*.css` 217,005 B, and
  `GuideView-*.js` 183,591 B (lazy). Total `dist/assets` is about 6.5 MB across 164 files.
- `src/i18n.tsx` (239 lines) statically imports **about 50 language tables**, each exporting
  `xxxEn` and `xxxHu` (`src/Language/*.ts`, about 1.9 MB of source including the guide lessons). It
  merges them into `translations = { hu: {...}, en: {...} }` and initialises i18next with **both**
  resources. Important typing detail:
  `export type TranslationKey = keyof typeof translations.hu;` and the `t` signature also uses
  `translations.hu`.
- `i18n.tsx` also has a hot-reload branch (`i18n.isInitialized` → `addResourceBundle` for both
  languages) and `getInitialLanguage()` → `savedLanguage() ?? "en"`.
- Guide lesson bodies (`src/Language/guides/*`) are **not** in the entry chunk. They load with the
  lazy `GuideView`. A spot check found no lesson body text in `index-*.js`, but UI keys like
  `aboutWaccQ1` and `guideWaccTitle` are present.
- `src/main.tsx` hydrates when the language is `en`, otherwise clears the root and calls
  `createRoot().render()`. `src/entry-prerender.tsx` renders English on the server.
- `src/seo.routes.ts` → `englishSeoPages()` reads `translations.en` directly.
- Fonts: `@fontsource-variable/inter` and `source-serif-4` CSS imported in `main.tsx` (all subsets
  are declared with `unicode-range`, so browsers fetch only what they need). KaTeX CSS is imported
  in `main.tsx`.
- Build tool: Vite 8 (Rolldown). There is no bundle analyser installed.

## Goal

1. Measure and record a baseline: the entry size (raw and gzip), the composition of the top
   contributors, and Lighthouse mobile scores for `/`, `/wacc` and a guide lesson.
2. Ship **only English** in the entry. Load Hungarian with a dynamic `import()` the first time it's
   needed (saved preference, or switching language).
3. Keep the type safety: the Hungarian table must still be checked at compile time to have exactly
   the English keys.
4. No hydration regressions (no React error #418/#423), and no flash of English for a returning
   Hungarian reader.
5. Target: entry ≤ 500 KB raw / ≤ 150 KB gzip. If the i18n split alone doesn't reach it, record what
   is left (from the measurement) and list the next candidates in "Findings". Don't force risky
   changes.

## Non-goals

- Splitting English tables per module. That's a possible follow-up, recorded in Findings only.
- Touching the derivatives labs or lazy 3D/graph chunks beyond confirming they stay lazy.
- Changing the route-level lazy loading in `src/modules/registry.ts`.

## Constraints

CLAUDE.md: DRY (one aggregate per language; don't duplicate the list of tables twice by hand if it
can be avoided), separation of concerns, `.tsx` ≤ about 150 lines (`i18n.tsx` is 239 lines and is a
`.tsx`, so moving the table aggregation out of it **also fixes a rule violation**), `///` comments.

## Steps

1. **Baseline (record numbers in "Findings").**
   - `npx vite build --sourcemap`, then
     `npx source-map-explorer "dist/assets/index-*.js" --html "%TEMP%/entry.html"` (any temp path;
     don't commit it). List the top 10 contributors by size.
   - `npm run preview`, then in a second terminal run
     `npx lighthouse http://localhost:4173/wacc --only-categories=performance,seo --form-factor=mobile --quiet --output=json --output-path=./lh-wacc.json`
     (and the same for `/` and `/guide/corporate/wacc`). Record Performance, LCP, TBT and CLS, then
     delete the JSON files. If Lighthouse can't run (no Chrome), note it and rely on sizes.
2. **Aggregate tables per language.** Create `src/Language/index.en.ts` and
   `src/Language/index.hu.ts`. Move the spread lists from `i18n.tsx` there unchanged, including the
   inline `navGuide` entries:
   ```ts
   // index.en.ts
   export const en = { ...intuitionEn, …, navGuide: "Guide" };
   export type TranslationKey = keyof typeof en;
   ```
   ```ts
   // index.hu.ts
   import type { TranslationKey } from "./index.en";
   export const hu = { ...intuitionHu, …, navGuide: "Útmutató" } satisfies Record<TranslationKey, string>;
   ```
   The `satisfies` gives the compile-time check (a missing Hungarian key fails `tsc`). Extra keys in
   HU: also make them an error with a helper type if that's simple
   (`Exact<…>`); otherwise note it in Findings.
3. **Rewrite `src/i18n.tsx`** (aim for ≤ 150 lines):
   - `import { en, type TranslationKey } from "./Language/index.en"` and re-export `TranslationKey`
     from `i18n.tsx`, so the dozens of existing `import type { TranslationKey } from "../i18n"`
     keep working. **Don't touch those importers.**
   - Keep `export const translations` for compatibility **only for `en`**. Search usages first
     (`grep -rn "translations\." src seo.plugin.ts scripts`). Known users: `src/seo.routes.ts`
     (`translations.en`). Update any `translations.hu` users to the async loader.
   - `/// Loads a language's table into i18next once; English is always present.`
     `export async function loadLanguage(lang: Language): Promise<void>`. For `"hu"`:
     `const { hu } = await import("./Language/index.hu"); i18n.addResourceBundle("hu", "translation", hu, true, true);`.
     Memoise the promise.
   - Initialise i18next with only `en` resources and `lng: "en"`. Language selection happens
     after `loadLanguage` (step 4).
   - `setLanguage(lang)` in `LanguageProvider`: `await loadLanguage(lang)`, then
     `changeLanguage`, `localStorage` and state, as now. Show no spinner; the load is fast.
   - Keep the HMR branch working: re-add `en` (and `hu` if already loaded).
4. **`src/main.tsx`**: before rendering, `const language = savedLanguage() ?? PRERENDER_LANGUAGE;`
   then `await loadLanguage(language); await i18n.changeLanguage(language);` (top-level `await` is
   fine in an ES module entry; check that the `tsconfig.app.json` target allows it). Keep the
   current hydrate-vs-render decision unchanged.
5. **Server render**: `src/entry-prerender.tsx` and `src/seo.routes.ts` keep using English
   synchronously. Nothing to load.
6. **Confirm the lazy chunks stay lazy:** `Surface3D` and `GraphCanvas` must not be in the entry.
   Check the `index.html` `modulepreload` links and the source-map-explorer output.
7. **Fonts (small win, optional):** if the baseline shows LCP is text that waits for a web font,
   check that `@fontsource-variable/*` CSS uses `font-display: swap` (it does by default). Don't add
   preloads with hashed filenames by hand.
8. Re-measure (step 1) and record the "after" numbers next to the baseline.
9. **Guard:** add an audit check to `scripts/seo-audit.test.mjs`. Read `dist/index.html`, find the
   entry `<script type="module" src="/assets/index-*.js">`, and assert that its size is ≤ the new
   size + 10% (store the budget as a constant with a comment). This catches future regressions.

## Acceptance criteria

- `grep -c "Útmutató" dist/assets/index-*.js` → 0 (Hungarian not in the entry), and a separate
  `index.hu-*.js` chunk exists.
- `tsc -b` fails if a key is removed from one Hungarian table (try it, then revert).
- Manual: with `localStorage.setItem("qs-language","hu")`, reload `/wacc` in `npm run preview`. The
  page shows Hungarian with no console errors and no visible English flash after JS runs. (The
  pre-rendered English HTML is visible until JS loads; that's expected behaviour today.) Switching
  EN → HU → EN in the language menu works.
- With English, hydration produces no React #418/#423 errors in the console.
- `npm run build`, `npm run test:seo`, `npm run lint` and the existing `npm run test:*` suites that
  import i18n keep passing (`npm run test:labs`, `test:guide-checks`, `test:guide-interactive`).
- Findings has the before and after numbers.

## Verification

```bash
npm run build
npm run test:seo
npm run lint
npm run test:labs
npm run test:guide-checks
npm run preview   # manual checks above
```

## Pitfalls

- **`TranslationKey` source of truth flips from HU to EN.** If some HU-only key exists, `tsc` will
  surface it, so fix the data and don't loosen the types.
- `scripts/*.test.mjs` load TS through `scripts/lib/load-ts.mjs`, which resolves only relative
  `.ts` imports. Make sure any test that imported `i18n.tsx` or `translations.hu` still works. Run
  every `test:*` script and fix the imports rather than the tests' intent.
- i18next with `react: { useSuspense: false }`: changing to a language whose bundle isn't loaded
  renders keys. Always `await loadLanguage` before `changeLanguage`.
- Plan 08 (Hungarian edition) will pre-render Hungarian on the server. It must call
  `await loadLanguage("hu")` in `entry-prerender.tsx` first. Leave a one-line `///` note on
  `loadLanguage` saying it works in SSR too.

## Findings (fill in)

- Baseline (commit `5f10366`): entry `index-*.js` 1,103,959 B raw / 341 KB gzip; everything loaded up front
  (entry + `modulepreload`s) 1,117 KB / 348 KB gzip. Top contributors: language tables EN+HU 466 KB,
  KaTeX 238 KB, react-dom 176 KB, i18next 42 KB, react-router 38 KB, registry 15 KB. Lighthouse mobile
  (local `vite preview`, one run each): `/` perf 78 · LCP 3.8 s · TBT 70 ms · CLS 0.128; `/wacc` 75 ·
  4.2 s · 60 ms · 0.128; `/guide/corporate/wacc` 41 · 7.8 s · 150 ms · 0.511. SEO 100 on all three.
- **Deviation from step 2:** aggregating per language was not enough on its own. Each
  `src/Language/<X>.ts` exported both `xEn` and `xHu`, and a module can only live in one chunk, so the
  Hungarian half stayed in the eager chunk (measured: still 1,117 KB). Every table (63 files,
  including `figures/`) is now split into `<X>.ts` (English) and `<X>.hu.ts` (Hungarian). The
  per-file `Record<keyof typeof …>` checks remain as `import type` (erased at build). **New strings
  go in both files.** `index.en.ts` / `index.hu.ts` aggregate them. The i18next setup and
  `loadLanguage` live in `src/languageLoader.ts` (plain `.ts`, which keeps `i18n.tsx` at 64 lines and
  avoids a new react-refresh lint error). Extra HU-only keys also fail `tsc` (`HuOnlyKeys` in
  `index.hu.ts`), and so do missing keys. Both were tried and reverted.
- After: entry stub 7 KB, but Rolldown now splits the up-front code into 9 files totalling
  **867 KB raw / 272 KB gzip** (−22%). Hungarian is a separate 249 KB `index.hu-*.js` that is
  fetched only for HU readers (verified in headless Chrome: an EN visit doesn't request it; a saved
  `hu` loads Hungarian with no console errors; EN↔HU switching works; no #418/#423). The
  Surface3D/GraphCanvas chunks stay lazy. Lighthouse after (same setup): `/` 80 · 3.5 s · 0 ms · 0.128;
  `/wacc` 76 · 4.1 s · 0 ms · 0.128; lesson 57 · 7.7 s · 190 ms · 0.205. SEO 100. Guard: test
  "initial JS stays within budget…" in `scripts/seo-audit.test.mjs` (budget 955,000 B = after + 10%,
  summed over entry + modulepreloads, and it also asserts no Hungarian in those files).
- Target ≤ 500 KB **not reached**. Next candidates, by size:
  1. KaTeX (238 KB) is eager because `components/intuition/IntuitionPanel.tsx` (help drawer in
     `AppShell`) imports `react-katex`. Lazy-loading the panel/math renderer → about 630 KB.
  2. English tables (224 KB): split per module so that each lazy route carries its own strings
     (shell/nav/registry strings stay eager).
  3. A `react-router` chunk from its `development/` build appears in the map. Check that the production
     export condition is resolved.
  4. LCP of about 3.5–4 s and CLS 0.128 are the same before and after, so they don't come from JS
     size. Investigate the LCP element and the layout shift (fonts / late-mounting shell) separately.
     The lesson's CLS 0.2–0.5 is the worst.
- Side note for plan owners: `seo.plugin.ts` uses `join(config.root, config.build.outDir)`, so an
  absolute `--outDir` breaks the build (`resolve` would fix it).

## Prompt to hand off

> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/seo/README.md` (section
> 4) and `docs/plans/seo/06-performance-cwv.md`, and confirm that plan 01 is done. First measure the
> baseline as described and write the numbers into the plan's Findings. Then move the language
> aggregation into `src/Language/index.en.ts` / `index.hu.ts` (HU checked with
> `satisfies Record<TranslationKey, string>`), make Hungarian a lazily loaded chunk via
> `loadLanguage()`, update `main.tsx` and `LanguageProvider`, keep `TranslationKey` exported from
> `i18n.tsx`, and add the entry-size guard to the SEO audit. Run every `test:*` script, build and
> lint, re-measure, record the after numbers, mark plan 06 done in the README, and summarise. If
> the measurements contradict this plan (e.g. i18n isn't the main contributor), stop after the
> baseline and report instead of guessing.
