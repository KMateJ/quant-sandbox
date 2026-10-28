# 03 — Fama–French: build-the-factors sort and cross-section tabs

Status: done (2026-10-28, session ea82) · Depends on: 01 · Suggested model: Sonnet · Est. size: L

## Why
Factors are not handed down; they are built. **Sort:** the reader drags size and book-to-market breakpoints
over a universe of stocks, the six portfolios light up, and their own SMB and HML are computed live and
compared with Fama and French's. **Cross-section:** the famous test — do the factors explain the average
returns of the 25 size/value portfolios? The reader switches CAPM → FF3 → FF5 and watches the 25 points move
onto (or off) the 45° line, and clicks the 5×5 grid to find the outliers.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 01 (read its Findings): `src/features/fama-french/` with `famaFrench.types.ts` (`FactorId`,
  `ModelId`, `FfData` (`p25.labels`/`p25.returns`, 25 value-weighted portfolios, decimals), `Window`,
  `FfTabProps`), `famaFrench.math.ts` (`MODEL_FACTORS`, `slice`, `factorFit`, `premia`, `cumulative`),
  `famaFrench.url.ts` (owns `tab`, `from`, `to`), stub tabs `components/tabs/SortTab.tsx` and
  `CrossSectionTab.tsx` (yours) and `FundTab.tsx`/`AlphaTab.tsx` (plan 02's — don't touch).
  `src/lib/stats/ols.ts`; `src/lib/math/matrix.ts` (`inverse`, `matVec`, `dot`).
- Your copy table: `src/Language/FamaFrenchSort.ts`/`.hu.ts` (prefixes `ffmSort…`, `ffmCross…`); your partial
  `src/styles/_fama-french-sort.scss`.
- Primitives: `ScatterChart`, `DragHandles` (`frame`, `handles: DragHandle[]`, `onChange`, `onCommit?`; see
  `src/components/charts/dragHandle.logic.ts` for handle shape and keyboard `keyMove`), `HeatmapPicker`
  (`xValues`, `yValues`, `value(x, y)`, `onPick(x, y)`, `selected?`, `scale?: "diverging" | "sequential"`,
  `center?`, `xLabel`, `yLabel`, `valueFormat?`, `ariaLabel`), `LineChart`, `SegmentedControl`, `PredictReveal`,
  `usePredictReveal`, `PredictExplain`. Pick challenge pattern: `src/features/yield-curve/components/
  ShockPredict.tsx`. `makeRng`, `nextNormal`, `subSeed`.

## Goal
1. Sort tab: a 300-stock universe (size × B/M scatter) with draggable breakpoints, the 2×3 portfolios, your
   SMB/HML vs the official series, and a breakpoint sweep.
2. Cross-section tab: predicted vs realised average excess returns of the 25 portfolios under a chosen model,
   animated between models, a 5×5 alpha grid, mean |α| and the GRS statistic.
3. Challenge `ffm-corner` (pick).

## Non-goals
- Characteristic data for real stocks (the universe is simulated on real factors). Fund/alpha tabs.

## Steps
1. **Universe** (`sort.math.ts`): `makeUniverse(seed, n = 300)` → stocks `{ id, logSize, bm, beta, s, h, idio }`
   with `logSize ~ N(0, 1.5)`, `log bm ~ N(−0.3, 0.6)`; loadings tied to characteristics: `s = 0.9 −
   0.45·z(logSize)` (small → high SMB loading), `h = 0.5·z(log bm)`, `beta = 1 + 0.15·N(0,1)`, idio vol 30%/yr.
   `stockReturns(universe, data, w, seed)` → per stock monthly excess returns `beta·mkt + s·smb + h·hml + idio`
   using the **real** factor series in the window (characteristics are held fixed — state that simplification
   in the copy). `sortPortfolios(universe, returns, { sizeCut, bmLo, bmHi }, weighting: "equal" | "value")` →
   six portfolio series (SL, SM, SH, BL, BM, BH); `yourFactors(six)` → `smb = (SL+SM+SH)/3 − (BL+BM+BH)/3`, `hml =
   (SH+BH)/2 − (SL+BL)/2`; `factorStats(series)` → annualised mean, vol, t; `correlation` with the official series
   (`src/lib/stats/moments.ts`); `breakpointSweep(universe, returns, cutsList)` → t-stat of your HML for value
   cuts 10/90, 20/80, 30/70, 40/60.
2. **Sort hook/UI** `useSortTab.ts` + `sort.url.ts` (`sseed`, `ssz`, `slo`, `shi` as percentiles, `sw`
   weighting): `UniverseScatter.tsx` — stocks as small dots (x log size, y B/M), one vertical and two horizontal
   `DragHandles` lines (percentile-snapped to 5%), the six regions lightly tinted with labels and counts; dots
   in the region under the pointer emphasised. `YourFactorsChart.tsx` — cumulative your SMB/HML (solid) vs
   official (dashed) with correlation and t in the legend. `SweepChart.tsx` — HML t-stat vs value cut, a marker
   at the current cut. `SortTable.tsx` — six portfolios: stocks, mean, vol. Weighting `SegmentedControl`.
   `PredictExplain`: "Move the value cuts from 30/70 to 10/90. What happens to the HML t-statistic?" — the
   **correct option is whatever `breakpointSweep` shows on the default seed** (compute it in the test, record it
   in Findings, and write the copy to match: the spread grows but fewer stocks make it noisier).
3. **Cross-section maths** (`cross.math.ts`): `crossSection(data, w, model)` → for each of the 25 portfolios
   `{ label, size: 1..5, value: 1..5, realised (annual mean excess), predicted (Σ βᵢ·λᵢ annual), alpha, alphaT }`
   with time-series betas from `factorFit` and λ = window factor means; `meanAbsAlpha(rows)`; `grs(data, w, model)`
   = `(T/N)·((T − N − L)/(T − L − 1))·(α′Σ⁻¹α)/(1 + μ̄′Ω⁻¹μ̄)` with Σ the residual covariance (N×N, divide by
   T − L − 1), Ω the factor covariance (L×L), μ̄ factor means; return the statistic only and say in the copy
   "values above about 1.5 reject the model at 5% for samples this long".
4. **Cross-section hook/UI** `useCrossTab.ts` + `cross.url.ts` (`cm` model, `csel` selected cell):
   `CrossScatter.tsx` — custom SVG (or `ScatterChart` if it supports keyed transitions) with a 45° line; each
   point labelled by its grid code (S1B1…S5B5) on hover/focus; switching model moves points with a 400 ms CSS
   transform transition (none under reduced motion); the selected point ringed. `AlphaGrid.tsx` —
   `HeatmapPicker` 5×5 (rows size small→big, columns value growth→value) coloured by α (diverging, centre 0),
   `onPick` selects the point; `CrossSummary.tsx` — mean |α|, GRS, R² of predicted vs realised. Model
   `SegmentedControl` CAPM / FF3 / FF5. `PredictExplain`: "Under CAPM, do the 25 portfolios line up on the 45°
   line?" (*no: small value sits far above, small growth below*); and "FF3 fixes most of it. Which corner still
   misses?" (*small growth, S1B1*; verify with the data and record).
5. **Challenge `ffm-corner`** (pick): hide the alpha colours; "Under {{model}} on {{window}}, which portfolio has
   the largest alpha?" — the reader clicks a cell; truth = argmax α; `challengeId: "ffm-corner"`; new rounds
   draw a model (CAPM or FF3) and a 20-year window.
6. Replace the stubs `components/tabs/SortTab.tsx` and `CrossSectionTab.tsx` (compose only).
7. **Wiring**: append `{ id: "ffm-corner", area: "portfolio", moduleId: "fama-french", kind: "pick", tolerance:
   "1 of 25" }`; `sbxCh_ffm-corner` "Find the mispriced corner" / HU "Keresd a félreárazott sarkot". If plan 02 is
   already `done`, set the registry entry's `status` to `"beta"`.
8. **Tests** `scripts/ff-sort.test.mjs`: universe determinism; region counts sum to n and match percentile
   cuts; your SMB/HML correlate > 0.8 with the official series at default cuts (record the value); value vs
   equal weighting differ; `crossSection` CAPM mean |α| > FF3 mean |α| on the full sample; GRS positive and
   finite; `grs` equals a direct implementation on a tiny 3-portfolio example (write expected numbers).

## Acceptance criteria
- Dragging any breakpoint re-sorts and redraws factors within a frame (300 × ~730 months is cheap; memoise
  `stockReturns` on seed and window).
- Switching models animates the 25 points; clicking a grid cell selects the point; challenge records rounds.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:fama-french && npm run test:challenges && npm run test:sandbox
npm run build && npm run test:seo
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/fama-french?tab=sort,/fama-french?tab=cross&cm=ff3,/fama-french?tab=cross&from=480,/hu/fama-french?tab=sort"
node scripts/layout-audit.mjs   # /fama-french?tab=sort and ?tab=cross at 360/768/1280/1536, light + dark
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- **Percentile cuts, not raw values:** breakpoints are percentiles of the universe (as Fama–French use NYSE
  percentiles); convert to values for drawing only.
- **GRS needs T > N + L:** with a 60-month window and 25 portfolios it still works (60 > 31) but is noisy; show
  "too short" below 60 months.
- **Animation keys:** key points by portfolio label so React moves them instead of re-creating them.

## Findings (fill in during execution)
- Default-seed sweep (t-stat of your HML by value cut, seed 1, equal weighting, full sample): 10/90 2.55, 20/80 2.82, 30/70 2.88, 40/60 3.26. So 30/70 to 10/90 *falls* (2.88 to 2.55). The predict question computes its right option from the reader's own sweep (up / down / barely changes, band 0.15) and the feedback quotes both numbers, so it stays correct for any seed, window or weighting. Copy explains the spread-versus-noise trade-off without claiming a direction.
- Correlations with official series (seed 1, default cuts, equal weighting, full sample): SMB 0.909, HML 0.939.
- Full-sample mean |alpha| (per year): CAPM 2.31%, FF3 1.07%, FF5 1.06%. GRS: CAPM 4.17, FF3 3.67, FF5 3.21 (all above the ~1.5 line, so all rejected). CAPM corner alphas: S1B1 -6.35%, S1B5 +5.63%, S5B1 +0.26%, S5B5 +2.26%. FF3 corners: S1B1 -5.31%, S1B5 +2.41%, S5B1 +1.89%, S5B5 -1.48%; so small growth (S1B1) is the corner FF3 still misses, as the plan expected. That question's right option is also computed from the window.
- New HU keys for owner review (all in `src/Language/FamaFrenchSort.hu.ts`): every `ffmSort*`, `ffmCross*` and `ffmCh*` key, plus `sbxCh_ffm-corner` ("Keresd a félreárazott sarkot"). Removed the old `ffmSortStub` key (both languages).
- Deviations: (1) stock field is `logBm` (log book-to-market), not `bm`. (2) GRS Omega uses divisor T and Sigma divisor T (algebraically the plan's formula); the test checks it against an independent 3-portfolio, one-factor implementation. (3) Challenge uses a `const CHALLENGE` score-style round (hit = exact cell) rather than a predict hook. (4) Registry status left `planned`: plan 02 is not done yet. (5) `test:challenges` fails in the shared tree only on `syr-fragile` (plan 07's call site, not yet in CHALLENGES); `ffm-corner` is registered and used once. (6) `test:seo` not run (needs a full clean build; parallel prerender failures expected). Build, CDP smoke (EN/HU sort and cross, `cm=ff3`, `from=480`) clean; layout audit on `?tab=sort` clean at 360/768/1280 light and dark (only the pre-existing 13px radio tap-target warnings), `?tab=cross` clean at 360-1536. (7) Chart tick fix: fixed x ticks on the universe scatter avoid label collisions on phones.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/factor-and-systemic-risk/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/factor-and-systemic-risk/03-ff-sort-and-cross-section.md`;
> confirm plan 01 is done and read its Findings. Implement plan 03: the build-the-factors sort (universe on real
> factors, draggable breakpoints, your SMB/HML vs official, sweep) and the 25-portfolio cross-section (model
> switch with animated points, 5×5 alpha grid, mean |α|, GRS), the `ffm-corner` challenge and tests. Don't
> touch plan 02's tabs. Run the verification block, fill in Findings, append DONE to LOG.md, set plan 03 to
> `done`, and summarise.
