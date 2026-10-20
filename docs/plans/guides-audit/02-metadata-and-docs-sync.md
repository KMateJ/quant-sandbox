# 02 — Metadata, SEO and docs sync

Status: done (2026-10-20) · Depends on: 01 · Suggested model: Sonnet · Est. size: S

## Why
The curriculum grew from 40 to 55 lessons, but the texts that describe it did not follow: the track
descriptions and SEO track texts still name the first wave, 15 lessons have no search title, the
coordination doc lists 48 lessons, and the immunization lesson does not know the immunization lab exists.
Readers, crawlers and the next executor all see a smaller curriculum than there is.

## Current state (verified 2026-10-20)
- Track descriptions: `src/Language/Guide.ts` lines 3–12 (`guideTrack<Track>Title/Desc`) and the same keys in
  `src/Language/Guide.hu.ts`. Current EN values:
  - derivatives: "From payoffs, through arbitrage-free pricing and the binomial tree, to the Black–Scholes formula."
  - portfolio: "Risk and return, diversification, the efficient frontier and CAPM."
  - fixed income: "Bond pricing, yield curves, duration and convexity."
  - corporate: "Time value of money, NPV and IRR, WACC, capital structure and DCF valuation."
  - stochastic: "Brownian motion, geometric Brownian motion, Itô's lemma and Monte Carlo."
- SEO track texts: `src/Language/Seo.ts` lines 72–81 (`seoTitleGuide<Track>`, `seoDescGuide<Track>`) and
  `src/Language/Seo.hu.ts` lines 72–81. Used by `guideModule()` in `src/modules/registry.ts` for the track pages.
- SEO lesson titles: `src/features/guide/guide.seo.ts`, `guideSeoTitles: Partial<Record<GuideId, string>>`,
  grouped by track with a blank line between groups. Missing ids: `annuities`, `valuation-multiples`,
  `risk-aversion`, `performance-measures`, `immunization`, `callable-bonds`, `sde-simulation`, `probability-spaces`,
  `filtrations`, `martingales`, `brownian-properties`, `reflection-principle`, `brownian-bridge`, `ito-integral`,
  `feynman-kac`. Existing style: "Topic Keyword Phrase Explained" / "X: A, B and C", title case, ≤ 60 characters.
- Immunization: `src/features/guide/guide.meta.ts` line
  `{ id: "immunization", track: "fixed-income", …, labs: ["duration-convexity", "bond-pricing"] }`; the lesson file
  `src/Language/guides/immunization.ts` ends with `lab("/duration-convexity", …)` in both languages. The lab module
  `immunization` (path `/immunization`, nav key `navImmunization` = "Immunization Lab") exists in the registry with
  `relatedGuides: ["immunization", "duration-convexity"]`.
- `docs/GUIDES_PLAN.md`: five curriculum tables under `## Curriculum` (lines ~31–104). The stochastic table has
  8 rows in the old order; the live order (from `guideLessons`) is: random-walks, probability-spaces, filtrations,
  martingales, brownian-properties, reflection-principle, brownian-bridge, ito-integral, ito-lemma, feynman-kac,
  change-of-measure, monte-carlo-pricing, sde-simulation, mean-reversion, jump-diffusion. The 7 new lessons have
  figures `sigma-partition`, `filtration-tree`, `bm-transformations`, `reflection-max`, `brownian-bridge`,
  `ito-sums`, `feynman-kac` and owner `my-app-1b`. Titles (EN) are in `src/Language/GuideStochasticTheory.ts`.
  Other stale cells: martingales' figure is `martingale-betting` (correct), the "Figure" column for lessons with
  two figures lists only the first (fine; the harness accepts any of the lesson's figures).
- Harness allowlists to empty here (`scripts/guide-audit.test.mjs`): `NO_SEO_TITLE`, `NOT_IN_GUIDES_PLAN`,
  `LAB_WITHOUT_LESSON`.
- Home/README counts were already corrected to 55 lessons on 2026-10-20; plan 07 bumps them to 64.

## Goal
1. Track descriptions (EN + HU) and SEO track titles/descriptions (EN + HU) name the current content of each track.
2. `guideSeoTitles` has an entry for all 55 lessons.
3. The immunization lesson practises the immunization lab.
4. `docs/GUIDES_PLAN.md` curriculum tables list all 55 lessons in registry order with correct titles and figures.
5. The three allowlists above are empty and `npm run test:guide-audit` passes.

## Non-goals
- No lesson body text changes beyond the one `lab()` path in `immunization.ts`.
- No changes to `guide.meta.ts` other than the `labs` array of `immunization`.
- Do not rewrite the GUIDES_PLAN log or conventions; tables only, plus one Log line.

## Constraints
- All user-facing strings through the i18n tables; EN and HU edited together.
- SEO titles ≤ 60 characters, descriptions ≤ 160, written the way the topic is searched for.
- Hungarian copy: natural, not word for word; list every HU string you wrote in Findings for the owner.

## Steps
1. `guide.seo.ts`: add the 15 titles in their track groups, e.g.
   `annuities: "Annuities, Perpetuities and Loan Amortization Explained"`,
   `"valuation-multiples": "Valuation Multiples: P/E, EV/EBITDA and Peer Comparison"`,
   `"risk-aversion": "Risk Aversion, Utility and the Optimal Complete Portfolio"`,
   `"performance-measures": "Sharpe, Treynor, Jensen's Alpha and Information Ratio"`,
   `immunization: "Bond Immunization and Duration Matching Explained"`,
   `"callable-bonds": "Callable Bonds, Yield to Call and Negative Convexity"`,
   `"sde-simulation": "Euler–Maruyama Scheme: Simulating SDEs Step by Step"`,
   `"probability-spaces": "Probability Spaces, Sigma-Algebras and Random Variables"`,
   `filtrations: "Filtrations, Adapted Processes and Stopping Times"`,
   `martingales: "Conditional Expectation and Martingales Explained"`,
   `"brownian-properties": "Properties of Brownian Motion: Scaling, Reflection and Time Inversion"`,
   `"reflection-principle": "Reflection Principle and the Maximum of Brownian Motion"`,
   `"brownian-bridge": "Brownian Bridge: Definition, Mean and Variance"`,
   `"ito-integral": "The Itô Integral and the Itô Isometry Explained"`,
   `"feynman-kac": "Feynman–Kac Formula: From SDEs to PDEs"`.
   Check the real titles in `GuideStochasticTheory.ts` / `Guide.ts` first and keep the search phrasing close to them.
2. `Guide.ts` / `Guide.hu.ts` track descriptions, one sentence each naming the span, e.g. derivatives
   "From payoffs and no-arbitrage, through binomial trees and Black–Scholes, to the Greeks, implied and stochastic
   volatility, American and exotic options."; fixed income "Bond prices, duration and immunization, the yield curve,
   bond futures, swaps, callable bonds and credit risk."; stochastic "Probability spaces, filtrations and
   martingales; Brownian motion and its properties; Itô calculus, Girsanov, Feynman–Kac, Monte Carlo, mean reversion
   and jumps."; portfolio and corporate likewise (add risk aversion, performance measures, factor models, VaR;
   annuities, multiples, real options).
3. `Seo.ts` / `Seo.hu.ts`: update the five `seoDescGuide*` strings to mention the added topics (keep ≤ 160 chars);
   titles may stay if still accurate.
4. `guide.meta.ts`: `immunization` → `labs: ["immunization", "duration-convexity", "bond-pricing"]`.
   `immunization.ts`: change the final `lab("/duration-convexity", …)` to `lab("/immunization", …)` in EN and HU and
   adjust the link text to name the immunization lab (EN "Try it in the Immunization Lab", HU „Próbáld ki az
   Immunizációs laborban”).
5. `docs/GUIDES_PLAN.md`: rewrite the five curriculum tables from `guideLessons` order (number rows 1…n, drop the
   "b" suffixes), keep Owner where known (`earlier`, `my-app-1b`, `my-app-6c`, `my-app-46`; the 7 stochastic
   additions are `my-app-1b`), Status `done`, Figure = the lesson's first figure id. Update the intro line "Three
   Claude sessions…" with one sentence: "Since 2026-10-20 the tables are kept in sync by
   `scripts/guide-audit.test.mjs` (plan `docs/plans/guides-audit`)." Append one Log line.
6. Remove the three allowlists' entries in `scripts/guide-audit.test.mjs` (leave the empty arrays).

## Acceptance criteria
- `npm run test:guide-audit` passes with `NO_SEO_TITLE`, `NOT_IN_GUIDES_PLAN`, `LAB_WITHOUT_LESSON` empty.
- `/guide/fixed-income` (EN and HU) shows the new description; `/hu/guide/fixed-income/immunization` ends with a
  link to `/hu/immunization`.
- Smoke command reports no problems.

## Verification
```bash
npm run test:guide-audit && npm run test:guide-graph && npm run test:seo-schema
npx tsc -b && npx eslint src/features/guide src/Language
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/fixed-income,/guide/fixed-income/immunization,/hu/guide/stochastic,/hu/guide/fixed-income/immunization" --prefix /hu
```
Stop the preview server afterwards and check port 4173 is free.

## Pitfalls
- `Seo.ts` strings are also used for structured data (`test:seo-schema`); keep them plain text, no quotes.
- The HU title tables are merged in `guideTitles.hu.ts`; no new file is created here, so nothing to register.
- The GUIDES_PLAN tables are parsed by the harness regex `| n | id | title | owner | status | figure |`: keep
  exactly six cells per row and no trailing spaces inside cells beyond one.

## Findings (fill in during execution)
- HU strings written (for owner review): the five `guideTrack*Desc` in `Guide.hu.ts`; `seoDescGuideDerivatives`, `seoDescGuidePortfolio`, `seoDescGuideFixedIncome`, `seoDescGuideCorporate`, `seoDescGuideStochastic` in `Seo.hu.ts`; the immunization lab link text „Próbáld ki az Immunizációs laborban”.
- Deviations and why: SEO title "Properties of Brownian Motion: Scaling, Reflection and Time Inversion" would be 68 characters, so it became "Brownian Motion Properties: Scaling and Time Inversion". Several SEO descriptions were over 160 characters after the refresh and were shortened; the SEO track titles stayed as they were. Track-table figure column uses each lesson's first figure. `NO_CHECKS`/`NO_WORKED` still contain ids that plans 03-05 empty; another session removed some while this ran.

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`). Read `CLAUDE.md`, `docs/plans/guides-audit/README.md`
> (section 4) and `docs/plans/guides-audit/02-metadata-and-docs-sync.md`, and confirm plan 01 is marked done in
> the README (stop and report if not). Implement plan 02: add the 15 missing SEO titles, refresh the five track
> descriptions and SEO track texts in EN and HU, point the immunization lesson at the immunization lab, rewrite
> the GUIDES_PLAN curriculum tables from the registry order, and empty the three allowlists. Run the plan's
> verification commands (including the smoke test) and make them pass. Fill in Findings (list every Hungarian
> string you wrote), set plan 02 to `done` in the README table, and summarise.
