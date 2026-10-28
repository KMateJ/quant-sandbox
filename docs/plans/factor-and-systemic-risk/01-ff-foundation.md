# 01 — Fama–French data, OLS, factor maths, module shell

Status: done (2026-10-28) · Depends on: – · Suggested model: Sonnet · Est. size: L

## Why
Everything in the Fama–French lab runs on real factor data and multi-factor regressions, and the four tabs
(plans 02 and 03) need a shell they can fill without touching each other's files. This plan brings in a
cited snapshot of the Ken French Data Library, a general OLS with standard errors, the factor maths, and the
registered module with a period brush and four stub tabs.

## Current state (verified 2026-10-28, commit `a4b1706`)
- `src/lib/stats/regression.ts`: `linearRegression(xs, ys)` → `{ slope, intercept, r2 }` (one regressor
  only). `src/lib/math/matrix.ts`: `transpose`, `matMul`, `matVec`, `inverse`, `identity`.
  `src/lib/stats/moments.ts`: `mean`, `stdDev`, `varianceSample`. `src/lib/math/random.ts`: `makeRng`,
  `nextNormal`; `src/lib/game/seed.ts`: `subSeed`.
- No datasets anywhere in `src`/`public`; no JSON imports yet. Vite supports `import("./x.json")` as a
  separate chunk. The test loader (`scripts/lib/load-ts.mjs`, `importSrc(...)`) is for `.ts`; in tests read
  JSON with `fs.readFileSync` + `JSON.parse`.
- Registry (`src/modules/registry.ts`): the `capm` entry (`id: "capm"`, `path: "/capm"`, `navKey: "navCapm"`,
  `category: "portfolio"`, `seo: { titleKey: "seoTitleCapm", descKey: "seoDescCapm" }`,
  `about: moduleAbout("Capm", 4)`, `relatedGuides`, `Component: lazy(() => import(...))`). Insert the new
  entry **directly after** it. Copy lives in `src/Language/Home.ts` (`navCapm`), `Seo.ts`, `ModuleAbout.ts`
  (+ `.hu.ts`); tables are registered in `src/Language/index.en.ts` / `index.hu.ts` (HU must have identical
  keys: `satisfies Record<BaseKey, string>`).
- Home tiles: `src/features/home/home.viz.ts` `MODULE_VIZ[id]` (120×64 box, `{ lines: [{ d, w, o, area? }],
  dots? }`, checked by `scripts/home.test.mjs`); icons `src/components/layout/ModuleIcon.tsx` `ICONS[id]`.
- `scripts/seo-audit.test.mjs`: lab ≥ 400 words, About must link a guide lesson (via `relatedGuides`).
- Primitives: `PageHeader`, `Workspace`, `Panel`, `ChartContainer` (`src/components/layout`); `Tabs`
  (`src/components/ui/Tabs.tsx`, `TabItem<T>`; see `src/features/capm/CapmView.tsx` for a segmented tab
  bar); `IntervalSelector` (`src/components/charts/IntervalSelector.tsx`: `frame`, `from`, `to`,
  `onChange(from, to)`, `bounds`, `minGap`, `snap`, `color`, `labels?`, `slidable?` — find a current user with
  `grep -rn IntervalSelector src/features`); `LineChart`; `useUrlState(schema)` + `urlNumber/urlEnum`.
- Guide: lesson `factor-models` in `src/features/guide/guide.meta.ts` L27 lists `labs: ["capm", "portfolio-lab"]`.
  That file is a guide shared file (single writer, see `docs/GUIDES_PLAN.md`): **don't edit it**; post a Log
  request there instead (step 12).

## Goal
1. `npm run data:fama-french` produces `src/features/fama-french/data/famaFrench.json` from Ken French's site.
2. `src/lib/stats/ols.ts` (multiple regression with standard errors) and the lab's factor maths, tested.
3. `/fama-french` registered with a working shell: data loading, period brush, four tabs with stubs.

## Non-goals
- Tab content (plans 02 and 03). No edits to the CAPM lab.

## Constraints
- README §2/§4. The JSON is generated: never hand-edit it; the script is the source of truth.

## Steps
**Phase A — data (stop and report `BLOCKED` in LOG.md if the session cannot download; never invent data).**
1. `scripts/data/fetch-fama-french.mjs` (Node 18+, no dependencies) downloads from
   `https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/`:
   `F-F_Research_Data_5_Factors_2x3_CSV.zip`, `F-F_Momentum_Factor_CSV.zip`, `25_Portfolios_5x5_CSV.zip`,
   `10_Industry_Portfolios_CSV.zip`. Each zip holds one CSV: read it with a tiny zip reader (find the local file
   header signature `0x04034b50`, read the compressed size and name length, `zlib.inflateRawSync` the data).
   Parse the **first** block of consecutive lines matching `/^\s*\d{6}\s*,/` (that is the monthly block; for
   the portfolio files it is "Average Value Weighted Returns -- Monthly"); take column names from the line just
   above it. Values are percent; keep them in percent with 2 decimals; treat `-99.99`/`-999` as missing (fail
   if any appear inside the kept range).
2. Align on months from **1963-07** to the last month present in all four files. Write
   `src/features/fama-french/data/famaFrench.json`:
   `{ "source": "Kenneth R. French Data Library", "url": "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html", "retrieved": "YYYY-MM-DD", "start": "1963-07", "unit": "percent per month", "factors": { "mkt": [...], "smb": [...], "hml": [...], "rmw": [...], "cma": [...], "mom": [...], "rf": [...] }, "p25": { "labels": [...25], "returns": [[...], ...25] }, "industries": { "labels": [...10], "returns": [[...], ...10] } }`
   (`mkt` is Mkt-RF). Record file size in Findings (expect ~120–200 KB; fail the script above 300 KB).
   `package.json`: `"data:fama-french": "node scripts/data/fetch-fama-french.mjs"`.

**Phase B — maths (pure).**
3. `src/lib/stats/ols.ts`: `ols(y: number[], columns: number[][], intercept = true): OlsResult` with
   `OlsResult = { coef: number[]; se: number[]; t: number[]; r2: number; adjR2: number; sigma: number;
   residuals: number[]; fitted: number[]; n: number; k: number }` (intercept first when present) via
   `inverse(XᵀX)`; σ² = RSS/(n − k); se = √(σ²·diag((XᵀX)⁻¹)). Throw on n ≤ k or singular `XᵀX`. `///` docs.
4. `src/features/fama-french/famaFrench.types.ts`: `FactorId = "mkt" | "smb" | "hml" | "rmw" | "cma" | "mom"`;
   `ModelId = "capm" | "ff3" | "carhart" | "ff5"`; `FfData = { months: string[]; factors: Record<FactorId |
   "rf", number[]>; p25: { labels: string[]; returns: number[][] }; industries: { labels: string[]; returns:
   number[][] }; source: string; retrieved: string }` (decimals); `Window = { from: number; to: number }`
   (inclusive month indices); `FfTabProps = { data: FfData; window: Window }`.
5. `famaFrench.math.ts` (`///` docs): `MODEL_FACTORS: Record<ModelId, FactorId[]>` (capm [mkt]; ff3 [mkt,
   smb, hml]; carhart ff3 + mom; ff5 ff3 + rmw, cma); `toFfData(raw)` (percent → decimal, month labels,
   length checks); `slice(series, w)`; `factorFit(excessReturns, data, model, w)` → `{ alpha, alphaT,
   alphaAnnual, betas: { id, b, se, t }[], r2 }` via `ols`; `premia(data, w)` → per factor `{ mean, vol,
   sharpe, t }` annualised (×12, ×√12); `cumulative(series)` (compounded); `returnAttribution(fit, data, w)` →
   `WaterfallStep[]` (α then β·mean per factor, then total = mean excess return, all annualised);
   `syntheticFund(spec, data, seed)` → excess returns `α/12 + Σ βᵢ fᵢ,t + σ_ε/√12·z` with `makeRng(subSeed(seed,
   spec.salt))`; `FUND_SPECS` (stable ids, loadings, alpha, idio vol): `small-value` (mkt 1.05, smb 0.7, hml
   0.6, α 0), `quality-growth` (mkt 0.95, smb −0.2, hml −0.4, rmw 0.5, cma −0.2, α 0), `momentum` (mkt 1.1, smb
   0.2, mom 0.5, α 0), `closet-indexer` (mkt 0.98, α −0.8%, idio 1.5%), `true-alpha` (mkt 0.9, smb 0.3, hml
   0.2, α 2%, idio 4%); idio vol default 4%/yr.
6. Tests `scripts/ff-foundation.test.mjs`: `ols` recovers exact coefficients on noise-free data; one-regressor
   `ols` equals `linearRegression` slope/intercept/r2; a hand-checked t-stat on a 6-point example (write the
   expected numbers in the test); throws when n ≤ k; data integrity (all series equal length, months
   contiguous, `|value| < 50%`, `rf ≥ −0.5%`); sanity on real data (full-sample monthly mean Mkt-RF between
   0.3% and 0.9%; FF3 regression of portfolio S5B1 (big growth) has |α| < 0.3%/month); a synthetic fund's FF5 fit
   recovers its loadings within 3 s.e.; `returnAttribution` steps sum to the total; JSON file < 300 KB.
   `package.json`: `"test:fama-french": "node --test scripts/ff-*.test.mjs"`.

**Phase C — module shell.**
7. Registry entry after `capm`: `{ id: "fama-french", path: "/fama-french", navKey: "navFamaFrench", category:
   "portfolio", status: "planned", seo: { titleKey: "seoTitleFamaFrench", descKey: "seoDescFamaFrench" },
   about: moduleAbout("FamaFrench", 4), relatedGuides: ["factor-models", "capm"], Component: lazy(() =>
   import("../features/fama-french/FamaFrenchView")) }`.
8. Copy: `navFamaFrench` ("Fama–French" both languages would be equal — HU "Fama–French-modell"),
   `seoTitleFamaFrench` ("Fama–French Factor Model Lab: Size, Value, Momentum"), `seoDescFamaFrench`
   (120–160 chars), About intro (~90 words) + 4 Q&As (~70 words each: what the three/five factors are, how
   to read a loading, why CAPM alphas shrink, where the data comes from — "Kenneth R. French Data Library,
   used with attribution"). Tables `src/Language/FamaFrench.ts` (shell keys `ffmTitle`, `ffmDesc`, `ffmTab*`,
   `ffmLoading`, `ffmLoadError`, `ffmPeriod`, `ffmSource`), `FamaFrenchFund.ts` (one key `ffmFundStub`) and
   `FamaFrenchSort.ts` (one key `ffmSortStub`), each with `.hu.ts`, registered in both index files.
9. `useFamaFrenchData.ts`: `import("./data/famaFrench.json")` in an effect → `toFfData` → `{ status:
   "loading" | "ready" | "error"; data?: FfData }`. During pre-render and loading the page shows header, a
   short loading panel and the About section (no data in HTML).
10. `famaFrench.url.ts` (`tab` = fund | alpha | sort | cross, `from`, `to` as month indices with defaults =
    full sample) and `FamaFrenchView.tsx`: `PageHeader`; a `PeriodBar.tsx` (cumulative Mkt-RF line with an
    `IntervalSelector`, minimum 60 months, snap 12; shows "Jul 1963 – Dec 2024"); a `Tabs` bar; the active tab
    component from `components/tabs/` (`FundTab.tsx`, `AlphaTab.tsx`, `SortTab.tsx`, `CrossSectionTab.tsx`,
    each a stub taking `FfTabProps` and rendering a `Panel` with its stub key); a footer line "Data: Kenneth R.
    French Data Library, retrieved {{date}}".
11. Styles `src/styles/_fama-french.scss`, `_fama-french-fund.scss`, `_fama-french-sort.scss` (the last two
    empty with a one-line owner comment), three `@use` lines at the end of `main.scss`. `MODULE_VIZ["fama-
    french"]` (three diverging cumulative lines) and an `ICONS` glyph (three stacked bars).
12. Append to `docs/GUIDES_PLAN.md` Log: request adding `"fama-french"` to lesson `factor-models` `labs` in
    `guide.meta.ts`. Append one Log line to `docs/LABS_PLAN.md`.

## Acceptance criteria
- The script reproduces the JSON byte-for-byte on a second run on the same day (deterministic output).
- `/fama-french` renders the shell; the data chunk loads only there (smoke `--watch-request`).
- `npm run test:fama-french`, `test:home`, `test:seo` pass; break `ols` (drop the intercept column) and
  see the tests fail.

## Verification
```bash
npm run data:fama-french && npx tsc -b && npm run lint && npm run test:fama-french && npm run test:home && npm run test:search
npm run build && npm run test:seo && ls -la dist/assets | grep -i famaFrench
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/fama-french,/fama-french?tab=sort,/hu/fama-french" --watch-request "famaFrench"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" --paths "/capm,/" --watch-request "famaFrench"
```
(Expect the watched request on `/fama-french` pages and **not** on `/capm` or `/`.) Stop the server; confirm
port 4173 is free.

## Pitfalls
- **Percent vs decimal:** the CSVs are in percent; convert once in `toFfData`, nowhere else.
- **Multiple blocks per CSV:** the 25-portfolio file also contains equal-weighted, annual, firm-count and
  size blocks; only the first monthly block is value-weighted returns. Check the header line text and assert it
  contains "Value Weight".
- **Hydration:** the JSON must not be imported statically (it would land in the main chunk and pre-rendered
  pages); keep the dynamic import inside the hook.
- `navFamaFrench` HU must differ from EN (tests enforce HU ≠ EN for some tables; keep it consistent).

## Findings (fill in during execution)
- Data range, JSON size, retrieval date: 1963-07 to 2026-09 (759 months; the source files are the "202609 CRSP database" release), 170,788 bytes, retrieved 2026-10-28. A second run the same day reproduced it byte for byte. The built data chunk is `famaFrench-*.js` (170 KB, its own file; requested only on `/fama-french` pages, confirmed with `--watch-request`).
- Spot checks (full-sample means of each factor, %/month): Mkt-RF 0.600, SMB 0.180, HML 0.292, RMW 0.247, CMA 0.245, MOM 0.604, RF 0.363. FF3 alpha of S5B1 (big growth) is inside ±0.3%/month.
- Labels: the 25 portfolios are `S{size}B{bm}` (S1 small … S5 big, B1 growth/low B/M … B5 value), row-major as in the Ken French file; industries keep the file's names (NoDur, Durbl, Manuf, Enrgy, HiTec, Telcm, Shops, Hlth, Utils, Other). The JSON also carries `end` ("2026-09") and `FfData` carries `url`.
- New HU keys for owner review: `navFamaFrench` ("Fama–French-modell"), `homeLabDesc_famaFrench`, `seoTitleFamaFrench`, `seoDescFamaFrench`, `aboutFamaFrenchIntro`, `aboutFamaFrenchQ1`–`Q4` and `A1`–`A4` (longest block), `ffmTitle`, `ffmDesc`, `ffmTabsLabel`, `ffmTabFund`, `ffmTabAlpha`, `ffmTabSort`, `ffmTabCross`, `ffmLoading`, `ffmLoadError`, `ffmPeriod`, `ffmPeriodHint`, `ffmPeriodChart`, `ffmSource`, `ffmSourceLink`, `ffmFundStub`, `ffmSortStub`.
- Hand-off notes for plans 02/03: the shell passes `{ data, window }` to each tab; `useFfPeriod(data)` owns the `tab`/`from`/`to` URL keys (`FF_URL_SCHEMA`), tabs add their own prefixed keys with a separate schema. `FACTOR_LABEL`, `FUND_SPECS`, `syntheticFund(spec, data, seed)` return the full-sample series; `factorFit(excess, data, model, window)` slices by the window itself. The momentum fund only resolves in the Carhart model (FF5 has no MOM factor, so its Mkt loading is biased by the omitted momentum). Stub tabs are `components/tabs/{Fund,Alpha,Sort,CrossSection}Tab.tsx` (no props used); replace the file contents, keep the default export.
- Deviations: (1) the test fits the momentum fund with Carhart, not FF5 (see above; logged). (2) Registry status is `planned` as the plan says, so the sidebar shows a "Planned" badge until plan 02/03 flip it. (3) `scripts/home.test.mjs` lab count bumped to 33 (market-making 31 + fama-french + systemic-risk; logged as CONTRACT). (4) Guide request for `guide.meta.ts` was appended to `docs/GUIDES_PLAN.md`; that file was not edited. (5) The shared tree was red from other sessions' half-done files (systemic-risk engine type error, then empty pre-renders), so the build, `test:seo` and smoke ran in a temporary detached worktree at HEAD holding only this plan's files and edits (removed afterwards). There `test:seo` failed only the four "known baseline"/budget checks that fail at HEAD too (initial JS 957 KB against the HEAD budget of 955 KB; the working tree already raises it to 1,000,000), no fama-french page failed. The smoke used `--port 9441` and a preview on 4180 because 4173 and the default DevTools port 9339 were in use by other sessions (a smoke run on 9339 got another session's tab). (6) Not run: `test:systemic-risk` (plan 04's script does not exist yet), layout audit and the 360/768/1536 widths (checked 375 and ~1280 by hand in the browser pane, no horizontal overflow). (7) Brush colour is `var(--primary)` (the house blue), not a chart-role colour.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/01-ff-foundation.md`. Implement plan
> 01: the Ken French download/convert script and JSON snapshot, `src/lib/stats/ols.ts`, the Fama–French types
> and maths with synthetic funds, tests (`test:fama-french`), and the `/fama-french` shell (registry entry,
> copy, lazy data hook, period brush, four stub tabs, styles, home tile). If you cannot download the data,
> stop and log BLOCKED — never invent numbers. Run the verification block, fill in Findings, append DONE to
> LOG.md, set plan 01 to `done`, and summarise.
