# 02 — Fama–French: mystery fund and alpha hunt tabs

Status: done (2026-10-28) · Depends on: 01 · Suggested model: Sonnet · Est. size: L

## Why
Two hands-on uses of a factor model. **Mystery fund:** the reader drags factor loadings until a replica
tracks the fund, then reveals the regression and sees how close they got. **Alpha hunt:** a fund with an
impressive CAPM alpha; the reader adds factors one at a time and watches the alpha bar in a return
waterfall shrink until it is no longer significant — the manager was paid for a tilt anyone can buy.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01 (read its Findings): `src/features/fama-french/` has `famaFrench.types.ts` (`FactorId`,
  `ModelId`, `FfData`, `Window`, `FfTabProps`), `famaFrench.math.ts` (`MODEL_FACTORS`, `slice`, `factorFit`,
  `premia`, `cumulative`, `returnAttribution` → `WaterfallStep[]`, `syntheticFund(spec, data, seed)`,
  `FUND_SPECS` with ids `small-value`, `quality-growth`, `momentum`, `closet-indexer`, `true-alpha`),
  `useFamaFrenchData.ts`, `famaFrench.url.ts` (owns keys `tab`, `from`, `to`), `FamaFrenchView.tsx`, and stub
  tabs `components/tabs/FundTab.tsx`, `AlphaTab.tsx` (yours) and `SortTab.tsx`, `CrossSectionTab.tsx` (plan
  03's — don't touch). `src/lib/stats/ols.ts` (`ols(y, columns, intercept)` → coef/se/t/r2).
- Your copy table: `src/Language/FamaFrenchFund.ts`/`.hu.ts` (prefix `ffmFund…`/`ffmAlpha…`; one stub key);
  your partial: `src/styles/_fama-french-fund.scss` (already `@use`d).
- Primitives: `DraggableBars` (`values`, `onChange(i, v)`, `min`, `max`, `step?`, `shadows?` ghost bars,
  `xLabels?`, `barAriaLabel(i)`, `valueFormat?`, `ariaLabel`, `height?`), `WaterfallChart` (`steps`),
  `LineChart`, `DataTable`, `SegmentedControl`, `PredictReveal`, `usePredictReveal`, `PredictExplain`,
  `ChallengeRecord`, `SeedControl`. A "pick" challenge to copy: `src/features/yield-curve/components/
  ShockPredict.tsx` (`yield-shock-pick`).
- `useUrlState` keeps keys other schemas own; use only your own keys (`fund`, `fm`, `fseed`, `afund`, `am`).

## Goal
1. Fund tab: choose a fund, drag loadings to replicate it, live fit readouts, reveal OLS with standard errors.
2. Alpha tab: drag/click factor tiles into the model, the return waterfall and alpha ladder update; the
   alpha's t-stat is always shown in words.
3. Challenges `ffm-loadings` (score) and `ffm-alpha` (pick).

## Non-goals
- Sort and cross-section tabs (plan 03); no edits to `famaFrench.math.ts` beyond adding new functions at the
  end (append a `CONTRACT` line to LOG.md if you add any).

## Constraints
- README §2/§4. `.tsx` ≤ 150 lines. Factor colours from `SERIES_PALETTE` in a fixed order (mkt, smb, hml,
  rmw, cma, mom) with names next to every colour.

## Steps
1. **Fund maths** (`fund.math.ts`): `replicaReturns(loadings, data, w)` (Σ βᵢ fᵢ); `trackingError(fund, replica)`
   (annualised sd of the difference); `replicaR2(fund, replica)` (1 − SS_res/SS_tot); `fundSeries(id, data,
   seed)` → synthetic (via `syntheticFund`) or a real industry portfolio's excess return (`industries.returns[i] −
   rf`); `loadingsHit(yours, truth, tol = 0.15)`.
2. **Fund hook** `useFundTab.ts` + `fund.url.ts` (`fund`, `fm` model, `fseed`): loadings state per model
   (reset to zeros, or to 1 for mkt), `revealed`, OLS fit (`factorFit`) memoised on fund/model/window.
3. **Fund UI** (`components/fund/`): `FundPicker.tsx` (a `DataTable` of 5 synthetic funds + 3 industries —
   Consumer non-durables, Hi-tech, Utilities — rows are buttons; synthetic rows show "answer key", industries
   "no answer key"); `LoadingBars.tsx` (`DraggableBars` −1.5…1.5, step 0.05, labels = factor names, `shadows` =
   OLS loadings after reveal); `ReplicaChart.tsx` (cumulative fund vs your replica over the window, plus the
   OLS replica dashed after reveal); `FitReadout.tsx` (your R², tracking error, mean residual per year, and
   after reveal a table: factor, yours, OLS ± 2·se, t, "significant" word); `ResidualStrip.tsx` (monthly
   residual bars, sign-tinted). Buttons: Reveal, Reset, New seed (synthetic only).
   `PredictExplain`: "A fund loads +0.6 on SMB. What does it mean?" (*it moves like small stocks minus big
   stocks; a long-only fund with that loading tilts toward small caps*).
4. **Challenge `ffm-loadings`** (score): a random synthetic fund (seeded, FF3 or FF5 shown in the brief), hidden
   loadings; hit = every |yours − truth| ≤ 0.15 **and** your R² ≥ 0.9 × the OLS R²; `const CHALLENGE =
   "ffm-loadings"`, `recordChallenge(CHALLENGE, hit, Date.now())` when the reader presses Submit, then reveal;
   `ChallengeRecord`.
5. **Alpha maths** (`alpha.math.ts`): `alphaLadder(fund, data, w)` → for capm/ff3/carhart/ff5 `{ model,
   alphaAnnual, lo, hi /* ±2 se annualised */, t }`; `firstInsignificant(ladder)` (first model with |t| < 2, or
   `"none"`); `customModel(factors: FactorId[])` (always includes mkt).
6. **Alpha hook/UI** `useAlphaTab.ts` + `alpha.url.ts` (`afund`, `am` = comma list of factors): `FactorTray.tsx`
   — six square factor tiles; a tile is added/removed by click, Enter/Space, or by dragging it into the "Model"
   tray (pointer drag with a ghost; no external DnD library); preset buttons CAPM / FF3 / Carhart / FF5.
   `AttributionWaterfall.tsx` (`WaterfallChart` of `returnAttribution` for the current model; the α bar labelled
   "α +3.1%/yr · t = 2.8 · significant"); `AlphaLadder.tsx` (dots with ±2 se whiskers for the four standard
   models and the custom one, zero line, the current model highlighted with a background tint). Default fund
   `small-value` (α 0 but a large CAPM alpha); also `true-alpha` and the industries.
   `PredictExplain`: "Adding size and value turned a 3% alpha into ~0%. Was the manager skilled?" (*they
   delivered a tilt you can buy cheaply in an index fund; skill is what is left after the factors*).
7. **Challenge `ffm-alpha`** (pick): before the ladder is shown, "This fund's CAPM alpha is {{a}}%/yr. In which
   model does it first stop being significant?" options CAPM / FF3 / Carhart / FF5 / Never; truth =
   `firstInsignificant`; copy the `ShockPredict.tsx` pattern with `challengeId: "ffm-alpha"`; a new round picks
   a random fund (seeded) and a random 20-year window.
8. Replace the stubs `components/tabs/FundTab.tsx` and `AlphaTab.tsx` (compose only). Copy in
   `FamaFrenchFund.ts`/`.hu.ts`; styles in `_fama-french-fund.scss`.
9. **Wiring**: append rows `{ id: "ffm-loadings", area: "portfolio", moduleId: "fama-french", kind: "score",
   tolerance: "±0.15 each" }` and `{ id: "ffm-alpha", …, kind: "pick", tolerance: "1 of 5" }`; `sbxCh_ffm-loadings`
   "Replicate a fund" / HU "Replikálj egy alapot", `sbxCh_ffm-alpha` "Where did the alpha go?" / HU "Hová
   tűnt az alfa?". If plan 03 is already `done`, set the registry entry's `status` to `"beta"`.
10. **Tests** `scripts/ff-fund.test.mjs`: replica with OLS loadings beats any ±0.1 perturbation on R²; tracking
    error zero for an exact replica of a noise-free synthetic fund; `loadingsHit` tolerance edges; ladder
    monotone checks are **not** assumed — instead assert `small-value` has |t| ≥ 2 under CAPM and |t| < 2 under
    FF3 on the full sample, and `true-alpha` stays significant under FF5 (record numbers in Findings; if the
    real data disagrees, change the fund spec, not the test logic, and log a `DEVIATION`).

## Acceptance criteria
- Dragging a bar updates the replica chart and R² within a frame; reveal shows ghost bars and the table.
- Dragging or clicking tiles changes the waterfall; t-stats always have a word; keyboard path works.
- Both challenges record rounds; `test:challenges` green.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:fama-french && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/fama-french,/fama-french?tab=fund&fund=momentum,/fama-french?tab=alpha&am=mkt,smb,hml,/hu/fama-french?tab=alpha"
node scripts/layout-audit.mjs   # /fama-french?tab=fund and ?tab=alpha at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Monthly vs annual:** regressions run on monthly data; display α ×12 and its se ×12; premia ×12.
- **Window changes** (period brush) invalidate the reveal: reset `revealed` when the window or fund changes.
- **Industry portfolios are not excess returns** until you subtract `rf`.
- Short windows (< 60 months) make se huge; plan 01's brush enforces 60 months minimum — keep it.

## Findings (fill in during execution)
- Ladder numbers on the full sample (alpha %/yr, t; CAPM | FF3 | Carhart | FF5): small-value 3.47 (2.63) | 0.09 (0.18) | 0.10 (0.21) | 0.05 (0.11), first insignificant FF3; quality-growth -1.26 (-1.23) | 1.05 (1.47) | 1.24 (1.69) | -0.41 (-0.79); momentum 4.77 (4.55) | 5.26 (5.17) | 0.44 (0.83) | 4.91 (4.75), first insignificant Carhart; closet-indexer -0.68 (-3.58) | -0.72 (-3.74) | -0.78 (-3.99) | -0.71 (-3.62), never; true-alpha 3.17 (4.48) | 1.95 (3.87) | 1.94 (3.76) | 1.94 (3.77), never; NoDur 2.12 (1.93) | 1.36 (1.25) | 1.24 (1.12) | -1.43 (-1.49); HiTec 0.37 (0.27) | 2.79 (2.31) | 3.53 (2.88) | 4.82 (4.12); Utils 1.81 (1.24) | 0.38 (0.27) | -0.21 (-0.15) | -0.89 (-0.64). Tests in scripts/ff-fund.test.mjs (8, all pass) use small-value (CAPM |t|>=2, FF3 |t|<2) and true-alpha (significant under FF5).
- New code: fund.math.ts, alpha.math.ts, fund.types.ts, fund.url.ts (keys fund, fm, fseed, afund, am), useFundTab.ts, useAlphaTab.ts, components/fund/*, components/alpha/*, components/FactorName.tsx + factorColor.ts. famaFrench.math.ts untouched (alphaFit lives in alpha.math.ts because factorFit takes only preset models and has no alpha standard error).
- New HU keys for owner review: all ffm* keys in FamaFrenchFund.hu.ts (fund names, ffmChallengeBrief, ffmHit/ffmMiss, ffmExplain*, ffmAlphaExplain*, ffmAlphaChallenge*, ffmAlphaFeedback, ffmFactor_*, ffmTile*, ffmTray*, ffmLadder*), plus sbxCh_ffm-loadings "Replikálj egy alapot" and sbxCh_ffm-alpha "Hová tűnt az alfa?". Removed the one stub key ffmFundStub.
- Deviations: (1) The challenge fund is a row in the fund picker (id challenge, model FF3 on even seeds and FF5 on odd, Submit instead of Reveal); the alpha challenge is a self-contained block at the top of the Alpha tab with its own random 20-year window and fund, skipping rounds whose CAPM alpha is already insignificant. (2) The waterfall alpha bar is labelled "α"; the full "α +3.5%/yr · t = 2.6 · significant" sentence sits directly under the chart. (3) Registry status left "planned" because plan 03 is not done. (4) Not run: test:seo and test:home (shared tree has other plans in progress); test:challenges fails only on unknown id syr-fragile (plan 07/systemic, not mine); tsc errors in cross/ components are plan 03 in progress. (5) Smoke (EN and HU) clean; layout audit 360/768/1280/1536 light and dark: 0 failing pages, only 360 px tap-target warnings (fund-name buttons, raised to 32 px after the run; shared radio inputs).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/02-ff-fund-and-alpha.md`; confirm plan
> 01 is done and read its Findings. Implement plan 02: the mystery-fund tab (drag loadings, replica, reveal
> OLS) and the alpha-hunt tab (factor tiles, waterfall, alpha ladder), challenges `ffm-loadings` and
> `ffm-alpha`, and tests. Don't touch plan 03's tabs. Run the verification block, fill in Findings, append
> DONE to LOG.md, set plan 02 to `done`, and summarise.
