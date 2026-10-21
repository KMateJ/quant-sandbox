# 05 — Black–Scholes domains + URL state; Delta hedging URL state + layout

Status: done (2026-10-21) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: S

> **2026-10-21 update:** the Delta hedging lab was rebuilt by the owner's session (URL state, daily grid,
> frequency study, metric strip, tests in `scripts/lab-delta-hedging.test.mjs`). **Phase B below is done and
> must not be redone; do not edit `src/features/delta-hedging/`.** Only Phase A (Black–Scholes) remains.

## Why
Black–Scholes clips its curves at the top for small strikes or long maturities because the y-axis is
hard-coded, and its URL code duplicates `src/lib/urlState.ts`. Delta hedging is the one derivatives lab
with no shareable URL, a seed slider without "Resample", and a main column that is empty below one
chart while the metrics sit in the sidebar. Both are small, behaviour-preserving fixes.

## Current state (verified 2026-10-21)

### Black–Scholes
- `src/features/black-scholes/useBlackScholesView.ts` (330 lines):
  - L32–82 local `clamp`, `parseNumber`, `parseMetric`, `parseOptionType`, `parseView3d`, `formatNumber`;
  - L118–180 eight `useState`s mirrored to the query string: `k` 100 [20,200], `r` 0.05 [0,0.2] 3dp,
    `sigma` 0.2 [0.01,1] 2dp, `tmax` 5 [0.25,20] 2dp, `curves` 5 [2,6], `metric`
    (`price|delta|gamma|vega|theta|rho`), `type` (`call|put`), `view` (`2d|3d`);
  - L187–195 `yDomain` fixed per metric: price `[0,175]`, gamma `[0,0.12]`, vega `[0,100]`, theta
    `[-30,10]`/`[-25,15]`, rho `[0,250]`/`[-250,0]`. With `k=20` the call price at S=200 is ≈ 180 (clipped);
    with `tmax=20` vega reaches ≈ 350 (clipped);
  - L197–217 `chartData` rows `{ S, "T=…": value }` for S in [10,200], 140 points;
  - L320–327 `metricOptions` labels (`Delta`, `Gamma`, … are Greek names — keep).
- `src/features/black-scholes/BlackScholesChart.tsx` L41–49 passes `yDomain={yDomain}` to `LineChart`;
  `LineChartInner.tsx` L57 uses the given domain, else derives from data.
- `src/Language/BlackScholes.ts` L10 `blackScholesMaxMaturityLabel: "T_max"`.
- `src/features/black-scholes/blackScholes.math.ts` (276 lines, pure): `evaluateMetric`,
  `buildMetricSurface`, `makeMaturities`.

### Delta hedging
- `src/features/delta-hedging/DeltaHedgingView.tsx` (89 lines): L15–22 seven `useState`s
  (`s0` 100 [10,300] step 5, `strike` 100 [10,300] step 5, `maturity` 1 [0.25,3] step 0.25, `rate` 0.03
  [0,0.1] step 0.0025, `vol` 0.2 [0.05,0.6] step 0.01, `steps` 52 [4,252], `seed` 7 [1,100]); L24–27
  `simulateDeltaHedge(...)` (`deltaHedging.math.ts`, pure, returns `{ data, payoff, terminalValue,
  hedgeError }`); L40–71 `Panel` with seven `SliderField`s and a `ControlGroup` "Metrics" holding three
  `.stat-card`s; L73–85 `ChartContainer` with one `LineChart` (height from `.chart-wrap`, 380 px).
- Shared: `useUrlState` (`src/components/useUrlState.ts`), `urlNumber` (`src/lib/urlState.ts` L14),
  `SeedControl` (`src/components/SeedControl.tsx`: slider 1–9999 + "Resample" button, i18n keys
  `labSeed`, `labResample`), `StatCard` (`src/components/ui`), `.metric-strip`
  (`src/styles/_primitives.scss` L328–332, used by portfolio/npv labs), `.module-main`
  (`_primitives.scss` L319–324) as in `BlackScholesView.tsx` L44–51.
- Registry: `status: "beta"` (`src/modules/registry.ts` L180) — keep.

## Goal
1. Black–Scholes curves are never clipped; the familiar frame is kept for typical parameters.
2. Black–Scholes and Delta hedging state goes through `useUrlState` with the keys above (Delta hedging
   gets new keys `s0,k,T,r,sigma,steps,seed`).
3. Delta hedging: metrics strip under the chart, Resample button, view ≤ 150 lines with a hook.
4. `T_max` label reads as a sentence.

## Non-goals
New Greeks views, spot marker/tangent (reverted by the owner earlier), P&L attribution, hedging game,
histogram, 3D surface changes, status change.

## Constraints
CLAUDE.md; math stays in `*.math.ts`; `.tsx` ≤ 150 lines; i18n for every label; no hex.

## Steps
### Phase A — Black–Scholes
1. Add to `blackScholes.math.ts`:
   ```ts
   /// y-axis frame for a metric: the fixed teaching frame widened to the data when curves would clip.
   export function metricFrame(metric: MetricKey, optionType: OptionType, values: number[]): [number, number]
   ```
   where the fixed frames are the current L188–194 values and the result is
   `[Math.min(fixedMin, dataMin), Math.max(fixedMax, dataMax * 1.04)]` (price: lower bound stays 0).
   Move `MetricKey`/`OptionType` to `blackScholes.types.ts` (new) and import them in the hook/math.
2. In the hook compute `yDomain` with `metricFrame(metric, optionType, flattenedValues)` from
   `chartData`; keep `tooltipDigits`.
3. New `black-scholes/blackScholes.url.ts` with a module-level `BLACK_SCHOLES_URL` schema:
   `k: urlNumber(100, 20, 200, 0)`, `r: urlNumber(0.05, 0, 0.2, 3)`, `sigma: urlNumber(0.2, 0.01, 1, 2)`,
   `tmax: urlNumber(5, 0.25, 20, 2)`, `curves: urlNumber(5, 2, 6, 0)`, `metric: urlEnum([...], "price")`,
   `type: urlEnum(["call","put"], "call")`, `view: urlEnum(["2d","3d"], "2d")`. Replace L32–180 of the
   hook with `const [s, set] = useUrlState(BLACK_SCHOLES_URL)`; setters become `(v) => set({ k: v })`;
   `view3d = s.view === "3d"`. Return shape stays (controls, chart and view destructure it).
   Delete the local helpers.
4. `blackScholesMaxMaturityLabel` → `"T max (longest curve)"` / HU `"T max (leghosszabb lejárat)"`.

### Phase B — Delta hedging
5. New `delta-hedging/deltaHedging.url.ts`: `DELTA_HEDGING_URL` with `s0: urlNumber(100,10,300,0)`,
   `k: urlNumber(100,10,300,0)`, `T: urlNumber(1,0.25,3,2)`, `r: urlNumber(0.03,0,0.1,4)`,
   `sigma: urlNumber(0.2,0.05,0.6,2)`, `steps: urlNumber(52,4,252,0)`, `seed: urlNumber(7,1,9999,0)`.
6. New `delta-hedging/useDeltaHedging.ts`: `useUrlState(DELTA_HEDGING_URL)` + `useMemo` of
   `simulateDeltaHedge`; returns `{ state, set, result, series }` (series colours already token-based
   after plan 02).
7. Split the view: `DeltaHedgingView.tsx` (header, `Workspace`, `Panel` with
   `components/DeltaHedgingControls.tsx` — six `SliderField`s + `SeedControl` — and a `module-main`
   column with the `ChartContainer` followed by `components/DeltaHedgingMetrics.tsx`: a
   `<div className="metric-strip">` of three `StatCard`s; the hedge-error card keeps its `InfoTooltip`
   inside `label`). Remove the sidebar "Metrics" group and key `deltaHedgingMetricsLabel` if unused.
8. Format the hedge error with an explicit sign (`+0.621` / `−0.621`) using the existing `num` helper
   plus a sign prefix; no new i18n needed.

## Acceptance criteria
- `/black-scholes?k=20` and `/black-scholes?tmax=20&metric=vega`: no curve touches the top of the plot
  (audit `svg-text-clipped` 0; visually the top curve has headroom in the screenshot).
- `/black-scholes?k=120&sigma=0.3&metric=delta&type=put&view=2d` loads those values; moving the σ
  slider rewrites `sigma=` in place; defaults are omitted from the URL.
- `/delta-hedging?seed=42&steps=12` reproduces the same chart on reload; the Resample button changes
  `seed` in the URL.
- Delta hedging at 1280: the metrics strip sits directly under the chart; the sidebar ends after the
  Resample button. All derivatives `.tsx` ≤ 150 lines.
- `grep -rn "parseNumber\|formatNumber" src/features/black-scholes` → nothing.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:url-state
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 \
  --paths "/black-scholes,/hu/black-scholes,/black-scholes?k=20,/black-scholes?tmax=20&metric=vega,/delta-hedging,/hu/delta-hedging" \
  --widths 360,768,1280,1536
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/black-scholes,/delta-hedging" \
  --after "/black-scholes?k=120&sigma=0.3&metric=delta&type=put|(()=>[...document.querySelectorAll('.value-badge')].map(e=>e.textContent).join(','))()" \
  --after "/delta-hedging?seed=42|(async()=>{document.querySelector('.seed-resample-btn').click();await new Promise(r=>setTimeout(r,300));return location.search})()"
# expect: no problems; badges show 120 / 0.30; search becomes ?seed=43
```
Stop the server; confirm port 4173 is free.

## Pitfalls
- `useUrlState` omits default values when writing. Guides or the home "last lab" feature may store
  full URLs (`src/components/layout/useLastLab.ts`); they still parse. Note in Findings.
- The 3D surface (`BlackScholesChart.tsx` L15–37) depends on `surface` from the hook (`view3d &&
  buildMetricSurface(...)`); keep `surface` null when `view === "2d"` to avoid computing 48×40 grids.
- `SeedControl` range is 1–9999, wider than the old 1–100; harmless, but the URL schema must match
  (`seed: urlNumber(7, 1, 9999, 0)`).
- `.metric-strip` cards use `.stat-card` padding from `_primitives.scss`; nothing new in SCSS.
- `SliderField` steps: `rate` uses step `0.0025`; keep 4 decimals in the schema so the value survives.

## Findings (fill in during execution)
- Clipping check before/after (`k=20`, `tmax=20&metric=vega`): before, fixed frames `[0,175]` / `[0,100]`
  clipped (≈180 / ≈350). After, `metricFrame` widens to the data plus 4 % of its range; with the default
  parameters the familiar frames are unchanged. Visual check left to the joint layout-audit run.
- HU drafts: `blackScholesMaxMaturityLabel: "T max (leghosszabb lejárat)"` (only new HU string).
- Deviations: (1) the padding is 4 % of the data range on whichever side overflows (not `dataMax * 1.04`), so
  negative metrics (theta/rho put) widen correctly too. (2) `BsMetric`/`BsOptionType` already existed in the
  math file; they were replaced by `MetricKey`/`OptionType` in the new `blackScholes.types.ts` (plus
  `METRIC_KEYS`/`OPTION_TYPES` arrays, shared with the URL schema), and `BlackScholesControls.tsx` imports
  them instead of keeping its own copy. (3) Phase B skipped (already done by the owner).
- Pitfall noted: the URL now leaves out default values; older full URLs (e.g. from `useLastLab`) still parse.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/derivatives-polish/README.md`
> (section 4) and `docs/plans/derivatives-polish/05-black-scholes-and-delta-hedging.md`; confirm plans 01
> and 02 are `done` (stop if not). Implement plan 05: a `metricFrame` y-axis helper in
> `blackScholes.math.ts` so curves never clip, `useUrlState` schemas for Black–Scholes (same keys) and
> Delta hedging (new keys), a `useDeltaHedging` hook, controls + metric-strip components under the
> chart, and `SeedControl` with Resample. Run the Verification commands, fill in Findings, set plan 05
> to `done` in the README table, and summarise. Do not add new interactions.
