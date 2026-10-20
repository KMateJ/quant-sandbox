# 07 — Register the 9 new lessons as placeholders

Status: done (2026-10-20) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
Nine lessons are missing from the curriculum (see README §1 gaps 8–12). Adding a lesson touches ten
shared files (ids, order, strings, figure registry, SEO, tests). If five writer sessions each edited them,
they would collide. This plan makes every shared-file edit once, with valid placeholders, so plans 08–12
only write their own files and can run in parallel.

## Current state (verified 2026-10-20)
- `src/features/guide/guide.types.ts`: `GuideId` string-literal union (55 members). Add new ids at the end.
- `src/features/guide/guide.meta.ts`: `guideLessons` array in reading order per track (the array mixes tracks;
  `trackLessons()` filters by `track`, keeping array order). Shape:
  `{ id, track, titleKey, descKey, labs: string[] }`.
- `src/features/guide/guide.content.types.ts`: `GuideFigureId` union (63 members).
- `src/Language/guides/index.ts`: imports each lesson file and maps id → export in `guideContent`.
- `src/features/guide/components/figures/index.ts`: imports each figure component and maps id → component.
- Strings: a wave has its own pair `src/Language/GuideWaveN.ts` (exports `guideWaveNEn: Record<keyof typeof guideWaveNHu, string>`)
  and `GuideWaveN.hu.ts` (exports `guideWaveNHu`). Registration: spread `guideWaveNEn` in `src/Language/index.en.ts`
  (import at line ~44, spread at ~85), `guideWaveNHu` in `src/Language/index.hu.ts` (~44/~86) **and** in
  `src/Language/guideTitles.hu.ts` (import + spread in `guideTitleTablesHu`). The `TranslationKey` type derives from
  the EN table, so keys become valid as soon as they are spread.
- `src/features/guide/guide.seo.ts`: `guideSeoTitles`, grouped per track.
- `package.json`: `test:guide-waveN` scripts (`"test:guide-wave3": "node --test scripts/guide-wave3.test.mjs"`).
- `docs/GUIDES_PLAN.md` curriculum tables: six cells `| n | id | Title (EN) | Owner | Status | Figure |`
  (plan 02 rewrote them from the registry order). The harness (`scripts/guide-audit.test.mjs`) requires every
  lesson id to appear with the right title and figure.
- "Next lesson" pointers in closing notes that will become wrong after an insertion (grep `next lesson` /
  `következő lecke` in `src/Language/guides/`): `greeks.ts:65` → "Implied volatility and the volatility smile";
  `npvIrr.ts:81` → "The weighted average cost of capital"; `capitalStructure.ts:97` → "Discounted cash flow valuation";
  `sdeSimulation.ts:71` → "Mean reversion: Ornstein–Uhlenbeck and Vasicek". The HU twins carry the same note.
- Harness: plan 01's `scripts/guide-audit.test.mjs` has allowlists; add `PLACEHOLDER` (ids skipped by every
  per-lesson rule) that plans 08–12 empty.
- Home/README counts say "55 lessons" (`README.md` §Guides, `src/Language/Home.ts` `devItemGuides`, `Home.hu.ts`).

## Goal
Registration of these nine lessons (id · track · insert **after** · labs · figure id · component file):

| id | track | after | labs | figure id | component |
|---|---|---|---|---|---|
| `options-on-other-underlyings` | derivatives | `greeks` | `["black-scholes"]` | `dividend-yield-price` | `figures/wave4/DividendYieldPriceFigure.tsx` |
| `portfolio-constraints` | portfolio | `risk-measures` | `["efficient-frontier", "portfolio-lab"]` | `constrained-frontier` | `figures/wave4/ConstrainedFrontierFigure.tsx` |
| `input-estimation` | portfolio | `portfolio-constraints` | `["efficient-frontier", "risk-return"]` | `estimation-noise` | `figures/wave4/EstimationNoiseFigure.tsx` |
| `curve-risk` | fixed-income | `yield-curve` | `["yield-curve", "duration-convexity"]` | `key-rate-shocks` | `figures/wave4/KeyRateShocksFigure.tsx` |
| `real-rates-inflation` | fixed-income | `credit-risk` | `["bond-pricing", "tvm"]` | `fisher-real-rate` | `figures/wave4/FisherRealRateFigure.tsx` |
| `capital-budgeting-risk` | corporate | `npv-irr` | `["npv-irr", "monte-carlo"]` | `npv-distribution` | `figures/wave4/NpvDistributionFigure.tsx` |
| `dividend-policy` | corporate | `capital-structure` | `["valuation", "capital-structure"]` | `payout-ddm` | `figures/wave4/PayoutDdmFigure.tsx` |
| `law-of-large-numbers-clt` | stochastic | `random-walks` | `["stochastic-models", "monte-carlo"]` | `clt-convergence` | `figures/wave4/CltConvergenceFigure.tsx` |
| `correlated-brownian-motions` | stochastic | `sde-simulation` | `["heston", "monte-carlo"]` | `correlated-paths` | `figures/wave4/CorrelatedPathsFigure.tsx` |

Titles and descriptions (keys in `GuideWave4.ts` / `GuideWave4.hu.ts`):

| id | keys | EN title · desc | HU title · desc |
|---|---|---|---|
| options-on-other-underlyings | `guideOtherUnderlyingsTitle/Desc` | "Options on dividend-paying stocks, indices, currencies and futures" · "Black–Scholes with a continuous yield, the forward price as the common thread, Black-76 for futures and Garman–Kohlhagen for currencies." | „Opciók osztalékos részvényre, indexre, devizára és határidős ügyletre” · „Black–Scholes folytonos hozammal, a forward ár mint közös szál, Black-76 határidős ügyletekre és Garman–Kohlhagen devizára.” |
| portfolio-constraints | `guideConstraintsTitle/Desc` | "Portfolio constraints and the no-short-sales frontier" · "Why real portfolios cannot follow the unconstrained frontier: short-sale bans, position limits, and what they cost in Sharpe ratio." | „Portfóliókorlátok és a rövidre eladás nélküli hatékony front” · „Miért nem követheti egy valódi portfólió a korlátozatlan frontot: rövidre eladási tilalom, pozíciólimitek, és mibe kerülnek Sharpe-mutatóban.” |
| input-estimation | `guideEstimationTitle/Desc` | "Estimating expected returns and covariances" · "Sample moments, their standard errors, why the frontier is unstable, and shrinkage as a remedy." | „A várható hozam és a kovariancia becslése” · „Mintamomentumok, standard hibáik, miért instabil a hatékony front, és a zsugorítás mint gyógymód.” |
| curve-risk | `guideCurveRiskTitle/Desc` | "Non-parallel curve moves and key-rate durations" · "Parallel shifts, steepeners and butterflies; key-rate durations as the sensitivities of a bond to each part of the curve." | „Nem párhuzamos hozamgörbe-mozgások és kulcskamat-durációk” · „Párhuzamos eltolás, meredekedés és pillangó; a kulcskamat-durációk mint a kötvény érzékenysége a görbe egyes szakaszaira.” |
| real-rates-inflation | `guideRealRatesTitle/Desc` | "Real rates, inflation and inflation-linked bonds" · "The Fisher relation, nominal against real discounting, the breakeven inflation rate and how an inflation-linked bond is priced." | „Reálkamat, infláció és inflációkövető kötvények” · „A Fisher-összefüggés, nominális és reál diszkontálás, a kiegyenlítő (breakeven) infláció és az inflációkövető kötvény árazása.” |
| capital-budgeting-risk | `guideProjectRiskTitle/Desc` | "Project risk: sensitivity, scenarios and Monte Carlo NPV" · "Which inputs move the NPV most, break-even values, scenario analysis and the distribution of NPV from simulation." | „Projektkockázat: érzékenység, forgatókönyvek és Monte Carlo NPV” · „Mely inputok mozgatják leginkább az NPV-t, fedezeti értékek, forgatókönyv-elemzés és az NPV szimulált eloszlása.” |
| dividend-policy | `guideDividendPolicyTitle/Desc` | "Dividends, payout policy and the dividend discount model" · "The Gordon growth model, growth from retained earnings, Modigliani–Miller dividend irrelevance and when payout does matter." | „Osztalék, kifizetési politika és az osztalékdiszkont-modell” · „A Gordon-féle növekedési modell, növekedés a visszatartott nyereségből, a Modigliani–Miller-féle osztalékirrelevancia, és mikor számít mégis a kifizetés.” |
| law-of-large-numbers-clt | `guideLlnCltTitle/Desc` | "The law of large numbers and the central limit theorem" · "Why averages settle down, how fast, and why the normal distribution appears: the two theorems behind Monte Carlo and the Brownian limit." | „A nagy számok törvénye és a centrális határeloszlás-tétel” · „Miért állnak be az átlagok, milyen gyorsan, és miért bukkan fel a normális eloszlás: a Monte Carlo és a Brown-határátmenet mögötti két tétel.” |
| correlated-brownian-motions | `guideCorrelatedBmTitle/Desc` | "Correlated Brownian motions and multi-asset models" · "Building correlated Brownian motions with a Cholesky factor, the two-dimensional Itô rule, and where correlation enters Heston and basket pricing." | „Korrelált Brown-mozgások és többeszközös modellek” · „Korrelált Brown-mozgások Cholesky-faktorral, a kétdimenziós Itô-szabály, és hol lép be a korreláció a Heston-modellbe és a kosáropciók árazásába.” |

1. All shared-file edits above done once; placeholders typecheck and render.
2. `docs/GUIDES_PLAN.md` rows added (status `placeholder`, owner `guides-audit/08–12`).
3. Harness `PLACEHOLDER` allowlist holds the 9 ids; everything green.
4. Home/README counts read 64 lessons.

## Non-goals
- No real lesson text, figure maths or tests: that is plans 08–12.
- Do not reorder existing lessons.

## Constraints
- Work on a branch `guides-wave4`; **do not deploy** between this plan and plan 13 (placeholders would be live).
- Shared files are edited here only; later plans must not touch them. Say so in the GUIDES_PLAN Log line.

## Steps
1. `guide.types.ts`: append the 9 ids to `GuideId`.
2. `guide.content.types.ts`: append the 9 figure ids to `GuideFigureId`.
3. `GuideWave4.hu.ts` / `GuideWave4.ts`: the 18 title/desc keys with the texts above (HU file first; EN typed as
   `Record<keyof typeof guideWave4Hu, string>`). Plans 08–12 add their figure strings (`gfW4…`) to these same two
   files — the only shared files they may edit, additively.
4. Register the pair in `index.en.ts`, `index.hu.ts`, `guideTitles.hu.ts`.
5. Lesson placeholders `src/Language/guides/<camelCaseId>.ts` (`optionsOnOtherUnderlyings`, `portfolioConstraints`,
   `inputEstimation`, `curveRisk`, `realRatesInflation`, `capitalBudgetingRisk`, `dividendPolicy`,
   `lawOfLargeNumbersClt`, `correlatedBrownianMotions`), each:
   ```ts
   export const curveRisk: GuideLessonContent = {
     en: [p("This lesson is being written."), h("Summary"), list("Coming soon."), lab("/yield-curve", "Open the Yield Curve lab")],
     hu: [p("Ez a lecke készül."), h("Összefoglalás"), list("Hamarosan."), lab("/yield-curve", "Nyisd meg a Hozamgörbe labort")],
   };
   ```
   and the 9 entries in `guides/index.ts`.
6. `guide.meta.ts`: insert the 9 entries after the lessons named in the table (same track), with keys and labs
   as listed.
7. Figure placeholders in `src/features/guide/components/figures/wave4/<Name>Figure.tsx`:
   ```tsx
   export default function KeyRateShocksFigure() {
     const { t } = useI18n();
     return <GuideFigure title={t("gfW4KeyRateTitle")} labId="yield-curve"><p className="gf-placeholder">{t("gfW4Placeholder")}</p></GuideFigure>;
   }
   ```
   with `gfW4<Name>Title` and one shared `gfW4Placeholder` ("Figure in preparation." / „Az ábra készül.”) in the
   wave-4 string files; register the 9 in `figures/index.ts`. Check `GuideFigure`'s props in
   `src/features/guide/components/GuideFigure.tsx` before writing (title, labId).
8. `guide.seo.ts`: 9 search titles, e.g. "Black-76 and Garman–Kohlhagen: Options on Futures and Currencies",
   "Portfolio Constraints: No Short Sales and the Efficient Frontier", "Estimation Error in Portfolio Optimization",
   "Key-Rate Duration and Yield Curve Risk Explained", "Real Interest Rates, Fisher Equation and Inflation-Linked Bonds",
   "Project Risk: Sensitivity Analysis, Scenarios and Monte Carlo NPV", "Dividend Discount Model and Dividend Policy",
   "Law of Large Numbers and Central Limit Theorem Explained", "Correlated Brownian Motions and Cholesky Decomposition".
9. "Next lesson" notes: in `greeks.ts`, `npvIrr.ts`, `capitalStructure.ts`, `sdeSimulation.ts` (EN and HU) change
   "The next lesson, \"X\"" to "A later lesson, \"X\"" (HU „A következő lecke” → „Egy későbbi lecke”), keeping the
   quoted title unchanged. Nothing else in those files.
10. `package.json`: `"test:guide-wave4": "node --test scripts/guide-wave4.test.mjs"`; create
    `scripts/guide-wave4.test.mjs` with one passing placeholder test (`test("wave 4 placeholder", () => {})`); plans
    08–12 add their tests to this file **in their own `test()` blocks** (append only).
11. `scripts/guide-audit.test.mjs`: add `const PLACEHOLDER = [ …9 ids… ]` and skip the per-lesson rules (figure
    present, checks, worked, words, cites, opening) for those ids; the registry/strings/SEO/GUIDES_PLAN rules still
    apply to them.
12. `docs/GUIDES_PLAN.md`: insert the 9 rows at their positions (Title = EN title above, Owner `guides-audit`,
    Status `placeholder`, Figure = id above); append a Log line naming this plan and the rule "shared files frozen
    until plan 13". `README.md`, `Home.ts`, `Home.hu.ts`: 55 → 64.
13. Run everything; smoke one placeholder in EN and HU.

## Acceptance criteria
- `npx tsc -b`, `npm run build` pass; 9 new routes pre-rendered (build log page count +18 with HU).
- `npm run test:guide-audit`, `test:guide-graph`, `test:guide-checks`, `test:guide-wave4` pass.
- `/guide/fixed-income` lists 10 lessons with `curve-risk` at position 5 and `real-rates-inflation` last.
- Smoke: no problems on `/guide/portfolio/input-estimation` and `/hu/guide/corporate/dividend-policy`.

## Verification
```bash
npx tsc -b && npx eslint src/features/guide src/Language scripts/guide-wave4.test.mjs
npm run test:guide-audit && npm run test:guide-graph && npm run test:guide-checks && npm run test:guide-wave4
npm run build && (npx vite preview --port 4173 &)
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --paths "/guide/fixed-income,/guide/portfolio/input-estimation,/hu/guide/corporate/dividend-policy,/guide/graph" --prefix /hu
```
Stop the server; check port 4173 is free.

## Pitfalls
- The graph test asserts every lesson title exists in both languages and that the graph connects all lessons:
  placeholders with no citations are still connected by sequence edges, so it passes; do not add fake citations.
- `GuideId` order does not matter; `guideLessons` order does.
- `guideTitles.hu.ts` must include the new HU table or HU citations to the new titles will never link.
- Camel-case file names must match the export names used in `guides/index.ts`.

## Findings (fill in during execution)
- Files touched: `guide.types.ts`, `guide.content.types.ts`, `guide.meta.ts`, `guide.seo.ts`, `Language/GuideWave4.ts` + `.hu.ts` (new), `index.en.ts`, `index.hu.ts`, `guideTitles.hu.ts`, `Language/guides/index.ts` + 9 placeholder lesson files, `figures/index.ts` + 9 files in `figures/wave4/`, `greeks.ts`, `npvIrr.ts`, `capitalStructure.ts`, `sdeSimulation.ts` (next-lesson wording only), `package.json`, `scripts/guide-wave4.test.mjs` (new), `scripts/guide-audit.test.mjs` (`PLACEHOLDER`), `docs/GUIDES_PLAN.md`, `README.md`, `Home.ts`, `Home.hu.ts`, and `stochasticModels.curriculum.ts` (the two stochastic ids added to chapters 1 and 5, because plan 06's audit rule requires every stochastic lesson to be linked from a Studio chapter).
- HU strings written (for owner review): the 18 titles/descriptions from the plan, `gfW4Placeholder`, and the nine `gfW4<Name>Title` figure titles ("Ábra: <HU title>").
- Deviations and why: no `guides-wave4` branch was created (several sessions share one working tree); nothing was committed or deployed. Placeholder lessons include the `figure()` block so the audit's "every figure id is used" rule holds. Placeholder lab link text is generic ("Open the lab").
- Open: the audit's `NO_CHECKS` / `NO_WORKED` allowlists currently fail as stale because plans 03–05 added content but have not pruned their entries yet; `strategies.ts` has pre-existing lint errors (`no-useless-escape`).

## Prompt to hand off
> You are working in the Quant Sandbox repo (`my-app`), on branch `guides-wave4`. Read `CLAUDE.md`,
> `docs/plans/guides-audit/README.md` (section 4) and `docs/plans/guides-audit/07-register-new-lessons.md`, and
> confirm plans 01 and 02 are marked done in the README (stop and report if not). Implement plan 07: register the
> nine lessons and figure ids with the exact titles, positions, labs and placeholders from the plan, the wave-4
> string files, SEO titles, the `PLACEHOLDER` allowlist, the GUIDES_PLAN rows, and the "next lesson" wording fixes.
> Run the verification commands (including the smoke test) and make them pass. Fill in Findings, set plan 07 to
> `done` in the README table, and summarise.
