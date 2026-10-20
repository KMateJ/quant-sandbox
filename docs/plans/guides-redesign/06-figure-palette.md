# 06 — Figure palette pass

Status: done (2026-10-20) · Depends on: 01, 04 · Suggested model: Sonnet · Est. size: M

## Why
Lesson figures still draw in the lab palette (bright blue, green, yellow dashed). Inside a lesson the
owner wants the calm style: one accent for the key series, cool white and grey for the rest.

## Current state (verified 2026-10-20)
- 47 files in `src/features/guide/components/figures/`; 44 use chart colours, **all via tokens**:
  `SERIES_PALETTE[0]` (37 uses), `[1]` (27), `[2]` (27), `[3]` (2), `SERIES_ROLE.cloud` (2), from
  `src/components/charts/chart.theme.ts` where `SERIES_PALETTE[i] = "var(--chart-<i+1>)"` and
  `SERIES_ROLE = { empirical: "var(--chart-empirical)", reference: "var(--chart-reference)", candidate:
  "var(--chart-candidate)", cloud: "var(--chart-cloud)", estimate: "var(--chart-estimate)" }`.
- Shared helpers in `figures/figureSeries.ts` (`bandSeries` uses `SERIES_PALETTE[1]` dashed,
  `pathSeries` uses `SERIES_ROLE.cloud`, `curveSeries`, `markerLine`).
- No hex colours in `guide.scss`, `_guide-interactive*.scss`, `_guide-stochastic.scss`, or guide `.tsx`.
- Every figure renders inside `figure.guide-figure` (`GuideFigure.tsx`); interactive guide widgets
  (`src/styles/guide-interactive/*.scss`) render inside the lesson body `.guide-article-body`.
- Lab pages also use `--chart-*`; they must keep their palette.

## Goal
1. Inside guide lessons only, the chart tokens resolve to the lesson palette:
   | token | value inside `.guide-article-body` |
   |---|---|
   | `--chart-1` | `var(--accent)` (key series) |
   | `--chart-2` | `var(--text)` (second series) |
   | `--chart-3` | `var(--muted)` (third series) |
   | `--chart-4` | `var(--text-dim)` |
   | `--chart-cloud` | `var(--text-dim)` (sample paths, low opacity already set by figures) |
   | `--chart-empirical` / `--chart-candidate` / `--chart-estimate` | `var(--accent)` |
   | `--chart-reference` | `var(--text)` |
   Higher indices (`--chart-5…8`) map to `--muted`.
2. Every figure still distinguishes its series: where two series now look alike, add a dash
   (`dash: "5 4"`) **in that figure** only after coordinating with its owner (rule 4.3), or list it.

## Non-goals
- Lab pages, the home page and the knowledge graph keep their colours.
- No figure logic or layout changes.

## Constraints
- Do it in CSS: one scoped block in `src/styles/guide.scss`; no edits to `chart.theme.ts`.
- Figure components belong to the guide sessions (`docs/GUIDES_PLAN.md`); post the list of figures that
  need a dash in its Log rather than editing them yourself.

## Steps
1. Baseline: record in Findings, for each figure file, which palette indices it uses together in one chart
   (`grep -n "SERIES_PALETTE\[\|SERIES_ROLE\." src/features/guide/components/figures/*.tsx`).
2. Add to `guide.scss`:
   ```scss
   // Lesson figures: one accent for the key series, neutrals for the rest.
   .guide-article-body {
     --chart-1: var(--accent);
     --chart-2: var(--text);
     --chart-3: var(--muted);
     --chart-4: var(--text-dim);
     --chart-5: var(--muted); --chart-6: var(--muted); --chart-7: var(--muted); --chart-8: var(--muted);
     --chart-cloud: var(--text-dim);
     --chart-empirical: var(--accent); --chart-candidate: var(--accent); --chart-estimate: var(--accent);
     --chart-reference: var(--text);
   }
   ```
3. Check that charts pick the scoped values: visx writes `stroke="var(--chart-1)"`, which inherits from the
   nearest ancestor that sets the property — verify in the smoke step.
4. From the baseline, list figures where `[1]` and `[2]` (or `[2]` and `[3]`) are both solid lines in
   the same chart; post that list to the GUIDES_PLAN Log as a request ("add dash to series X in figure Y").

## Acceptance criteria
- On `/guide/portfolio/risk-aversion` the figure's key curve is `--accent`; on `/efficient-frontier` (a lab)
  the chart colours are unchanged.
- Findings list every figure needing a dash; the Log request is posted.

## Verification
```bash
npx tsc -b && npm run build
npx vite preview --port 4173 &
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel/insights" \
  --paths "/guide/portfolio/risk-aversion,/guide/derivatives/instruments,/efficient-frontier" \
  --after "/guide/derivatives/instruments|(()=>{const p=document.querySelector('.guide-figure svg path[stroke^=\"var(--chart\"]');return p&&getComputedStyle(p).stroke})()" \
  --after "/efficient-frontier|getComputedStyle(document.documentElement).getPropertyValue('--chart-1').trim()"
# expect: no problems; first value is the rgb() of --accent; second is the lab palette's --chart-1
```
Stop the server; check the port is free.

## Pitfalls
- Tooltips/legends may render in a portal on `document.body`, outside `.guide-article-body`; their swatches
  then show lab colours. If so, add the same block for the tooltip root class used by
  `src/components/charts/ChartTooltip.tsx` **only when it is opened from a guide** — or accept and note it.
- Light theme: `--text` is dark navy there, which is correct for lines on a light ground.

## Findings (fill in during execution)
- Baseline (indices used per figure): [0]+[1]+[2]: AmericanBoundary, CapitalMarketLine, Compounding,
  DcfTerminal, DeltaTangent, DurationConvexity, ForwardArbitrage, GirsanovShift, SecurityMarketLine,
  TwoAssetFrontier, WaccLeverage, FeynmanKac, ItoSums (+[3]); [1]+[2]: GbmPaths, Parity, ReflectionMax
  (+cloud); [0]+[1]: BlDensity, CreditSpread, ExoticPrices, FactorVariance, ImpliedVol, JumpDensity,
  RealOptionTree, SwapRate, VarEs; [0]+[2]: BlackScholesPrice, DragAssets, HedgeSimulation,
  MonteCarloConvergence, PriceYield, RealVsRiskNeutral, SpotForward, TreeConvergence, VolSmile;
  single index: GreeksProfile, NpvProfile, Payoff, Strategy, VolatilityHorizon ([0]), OuPaths ([3]),
  QuadraticVariation, BrownianBridge ([2]); figureSeries.ts: bandSeries [1] dashed, pathSeries cloud.
- Figures needing a dash (posted to GUIDES_PLAN Log): CapitalMarketLine, Compounding, Parity,
  SecurityMarketLine, TwoAssetFrontier (no dash anywhere; [1] and [2] solid). To re-check: GbmPaths,
  GirsanovShift, FeynmanKac, WaccLeverage (one dashed series only).
- Portal/tooltip behaviour: `ChartTooltip.tsx` does not portal, so tooltip swatches inherit the scoped
  tokens. Smoke: figure stroke on /guide/derivatives/instruments = rgb(143, 178, 220) (= `--accent`
  #8fb2dc); /efficient-frontier `--chart-1` = #60a5fa (lab palette unchanged).

## Prompt to hand off
> You are working in the Quant Sandbox repo (my-app). Read `CLAUDE.md`, `docs/GUIDES_PLAN.md`,
> `docs/plans/guides-redesign/README.md` (sections 0 and 4) and `docs/plans/guides-redesign/06-figure-palette.md`,
> and confirm plans 01 and 04 are done (stop if not). Implement plan 06: one scoped chart-token block in
> `guide.scss` that gives lesson figures the accent-plus-neutrals palette, leaving labs untouched, and post the
> list of figures that need a dash to the GUIDES_PLAN Log instead of editing them. Run the Verification
> commands and make them pass. Fill in Findings, set plan 06 to `done (<date>)` in the README table, and summarise.
