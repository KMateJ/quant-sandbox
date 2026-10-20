# 06 — Yield curve: animated shocks, bootstrap stepper, linkable state

Status: done (2026-10-19) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
The yield curve lab already has draggable par nodes, sketching and a forward brush. What's missing is
*process* and *events*: seeing a steepener happen (not just the after-state), and watching bootstrapping
peel discount factors one maturity at a time. Also, the tab isn't in the URL, so guides can't link to it.

## Current state (verified 2026-10-19)
- `src/features/yield-curve/YieldCurveView.tsx` (42 lines): `useState<Tab>("curve")`, tabs curve /
  bootstrap / forwards / factors.
- `useYieldCurve.ts` (102 lines): `nodes: CurveNode[]` (par quotes, source of truth), `preset`,
  `selected`, `before` (pre-edit snapshot), `commit(next, preset)` validates 0 ≤ rate ≤ 12%,
  `beginEdit/endEdit`, `sketchRates`.
- `components/FactorsView.tsx` (96 lines): scenario shocks `FactorScenario = "parallel" | "steepen" |
  "flatten" | "curvature"` (`yieldCurve.types.ts:30`), math in `effects.math.ts` (55 lines).
- `components/BootstrapView.tsx` (109 lines) + `bootstrap.ts` (83 lines): a stepper exists (check how
  steps are represented; LABS_PLAN calls autoplay the missing piece).
- Playback primitive: `src/components/playback` → `usePlayback({ steps, initial?, durationMs?, loop? })`
  returns `{ step, time (0..1), playing, setStep, play, pause, toggle, stepBy, reset }`, and
  `PlaybackControls`. Reduced motion: `play` jumps to the end. Example use:
  `src/features/bond-pricing/Components/PullToPar.tsx` (54 lines).
- URL state: `src/components/useUrlState.ts`, `src/lib/urlState.ts` (`urlEnum`, `urlNumber`, …). Example
  schema: `src/features/bond-pricing/bondPricing.url.ts`.
- Tests: `scripts/yield-curve.test.mjs`, `scripts/yield-forward-brush.test.mjs`.

## Goal
1. **Animated shocks** in Factors: choosing a scenario and size animates the par curve from before → after
   over ~1.2 s (`usePlayback`, interpolate node rates by `time`), with the zero and forward curves updating
   each frame and a ghost of the start curve. A "Play history" mini-sequence chains 3 shocks
   (e.g. +100 parallel → steepen 50 → curvature −30) with step-back/forward.
   Plus a **"Which shock was it?"** predict round: lab applies a hidden random shock, reader picks one of 4
   scenarios, reveal + explain (PredictReveal + PredictExplain).
2. **Bootstrap autoplay**: PlaybackControls on BootstrapView; each step highlights the current maturity's
   par bond, its known (already-bootstrapped) discount factors in one colour and the solved DF in another,
   with the equation for that step rendered with KaTeX using the actual numbers.
3. **URL**: `tab`, `preset`, and custom nodes (`n=2.9,3,3.1,…` only when custom) via `useUrlState`.

## Non-goals
Historical replay (needs data; owner decision). New curve models (Nelson–Siegel).

## Steps
1. Math (pure): in `effects.math.ts`
   ```ts
   /// Linear interpolation between two node sets (same maturities) at t∈[0,1].
   export function lerpNodes(a: CurveNode[], b: CurveNode[], t: number): CurveNode[]
   /// Seeded random scenario + size (bp, multiples of 10) for the predict round.
   export function drawScenario(seed: number): { scenario: FactorScenario; sizeBp: number }
   ```
   Bootstrap step detail in `bootstrap.ts` if not present:
   `bootstrapStep(nodes, i) → { knownDf: number[]; couponSum: number; solvedDf: number }`.
   Tests added to `scripts/yield-curve.test.mjs`.
2. Animation: frames must **not** call `commit` (that sets `before` and validates per frame). Add to
   `useYieldCurve` a `preview: CurveNode[] | null` overlay state used by the views while animating; commit
   the final nodes once at the end (and on pause, commit the current frame). The derived `term` must use
   `preview ?? nodes`.
3. Components (each ≤ 150 lines): `ShockPlayer.tsx`, `ShockPredict.tsx`, `BootstrapPlayer.tsx`
   (or extend BootstrapView if it stays ≤ 150 — likely split `BootstrapEquation.tsx`).
4. URL schema file `yieldCurve.url.ts`; parse custom nodes with validation (fall back to preset on any
   invalid value). `useYieldCurve` takes initial nodes from it; writes on commit (not per frame).
5. Strings EN + HU draft (`yc*`).

## Acceptance criteria
- Reduced motion (`--after` can't set it; use CDP `Emulation.setEmulatedMedia` prefers-reduced-motion in
  a quick extra run, or state the manual check in Findings): play jumps to the end.
- Reloading `/yield-curve?tab=bootstrap&preset=inverted` restores tab and preset.
- During animation the layout doesn't jump (audit run with `--after` that starts play and waits 600 ms).
- Existing yield-curve tests pass unchanged.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:yield-curve && node --test scripts/yield-forward-brush.test.mjs
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 \
  --paths "/yield-curve?tab=factors,/yield-curve?tab=bootstrap,/hu/yield-curve?tab=bootstrap"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 \
  --after "/yield-curve?tab=bootstrap|(async()=>{document.querySelector('.playback-controls button')?.click();await new Promise(r=>setTimeout(r,1500));return location.search})()"
```
(Adjust the `.playback-controls` selector to the real class in `PlaybackControls.tsx`.)

## Pitfalls
- `before` drives the "before latest edit → now" readout; an animated shock should set `before` to the
  start curve exactly once.
- Rates must stay within the 0–12 % validity window during interpolation (they will, if endpoints are valid).
- The tab bar is plain-text tabs (`Tabs` without `segmented`): keep it, no pills.

## Findings
- Done 2026-10-19 (session 327feecb). Plans 01/02 were not finished, so `layout-audit.mjs` was **not run**; checked with headless Chrome instead (360 and 1280 px, EN and HU): no horizontal overflow, no console errors, `cdp-smoke` clean on the built site. Plan 01 landed afterwards: `layout-audit` on `/yield-curve?tab=factors` at 360 px light reports only `svg-text-collision` (3M/6M ticks, `Yield %` vs y ticks: the width-blind ticks of plan 02) and tap-target warnings; it then crashes writing the screenshot because the `?` in the path is an invalid Windows filename (audit-script bug, plan 01). Re-run after plan 02.
- **Existing bug fixed:** "Steepen" in Factors actually flattened the curve (the slope loading is large at short maturities, so +slope raises the short end). `scenarioDelta` now has steepen = −slope, flatten = +slope and takes a size in bp.
- **Existing bug fixed:** the Bootstrap equation showed coupon-date discount factors interpolated toward the *unsolved* maturity, so it did not match the solved DF. `bootstrapStep` / `couponDiscounts` (in `yieldCurve.math.ts`, shared with `buildTermStructure`) use only solved nodes.
- **Shared primitive fix:** `usePlayback` could produce a negative step on the first frame (rAF timestamp earlier than `performance.now()`); now clamped at 0.
- **Deviation:** the animation preview is local to the shock player (`useShockPlayer` derives the frame and its term structure) instead of a `preview` overlay in `useYieldCurve`. An effect-driven overlay re-rendered the whole lab twice per frame and tripped React's "Maximum update depth" warning. Nothing is committed per frame; reaching the end commits once (`model.load`), `Undo shocks` restores the start. Pausing or scrubbing only previews.
- Predict round reuses `PredictExplain` (4 scenarios as options) since `PredictReveal` is numeric.
- URL: `tab`, `preset`, and `n` (par quotes in %, only for a custom curve; invalid → preset) via `useYieldCurveUrl`; the URL is written only after a committed change.
- New HU strings (draft, owner review): `ycShock*`, `ycPredict*`, `ycBootstrapKnown`, `ycBootstrapDepositNote` in `YieldCurve.hu.ts`. Unused `ycPrev/ycNext/ycStep` removed.
- Reduced-motion jump-to-end not tried in a browser (covered by `usePlayback`).
- Tests: 7 new in `scripts/yield-curve.test.mjs` (13 total pass).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/06-yield-curve-shocks-and-bootstrap.md`; confirm plans 01
> and 02 are done (stop if not). Implement plan 06: animated factor shocks with a preview overlay, a
> "which shock was it" predict round, bootstrap autoplay with the per-step equation, and URL state for tab,
> preset and custom nodes. Run the verification commands, fill in Findings, set plan 06 to done in the
> README table, and summarise.
