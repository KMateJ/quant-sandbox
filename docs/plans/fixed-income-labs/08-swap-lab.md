# 08 — New lab: interest rate swap

Status: todo · Depends on: 01, 02 (run after 07: same shared files) · Suggested model: Sonnet · Est. size: L

## Why
Swaps are the most traded rates instrument and today exist only as a guide figure. A lab where you drag
the curve and watch the fixed and floating legs separate makes "a swap is a long bond minus a short FRN"
and "MTM comes from the curve moving after inception" tangible.

## Current state (verified 2026-10-19)
- `src/features/guide/guide.markets.math.ts`: `parSwap(level, slope, years)` → `{ rate, … }`, `swapZero`
  (read both signatures). `src/features/guide/guide.interactive.swapTimeline.math.ts`: `SWAP_TIMELINE`
  constants, `SwapPayment` type `{ t, df, forward, fixed, floating, pvFixed, pvFloating }`,
  `contractedRate()`, `shiftedDf(t, shift)`, `swapTimeline(shift)`. Guide figure `SwapRateFigure.tsx`; test
  `scripts/guide-interactive-swap-timeline.test.mjs`.
- Yield-curve math: `src/features/yield-curve/yieldCurve.math.ts` (`buildTermStructure(nodes)` → zero rates,
  DFs, forwards from par nodes) and `src/lib/finance/yieldcurve.ts` (`bootstrapDiscountFactors`,
  `interpolateSpotRate`, …). Curve presets: `src/features/yield-curve/presets.ts`.
- Primitives: `DraggableBars` / `DragHandles` / `SketchLayer`, `WaterfallChart`, `usePinnedSeries`,
  `usePlayback`, `PredictReveal`.
- Module wiring: same as plan 07 (grep `TreasuryFutures` / `treasury-futures` outside the feature folder
  for every place a module's strings, SEO, about and styles are registered).

## Goal
Module `interest-rate-swap` at `/interest-rate-swap`:
1. **Setup**: notional, tenor (1–10 y), pay frequency (1/2/4), pay/receive fixed. Curve: par-node editor
   reused from the yield curve lab (drag nodes on a small curve chart; presets).
2. **Cash-flow ladder** (the main visual): for each payment date, fixed leg bar (constant) above the axis and
   floating leg bar (forward-implied) below, net bar in between; PV of each as a lighter inner bar. Hover a
   date → tooltip with forward, DF, both PVs (linked highlight in the table).
3. **Par rate solve**: the fixed rate is initially par (PV fixed = PV float, MTM 0). A "lock rate" action
   freezes it; afterwards dragging the curve produces an MTM; a waterfall decomposes the MTM change by
   tenor bucket (key-rate contributions) — `WaterfallChart`.
4. **DV01 / PV01** readout and a "bump each key rate 1 bp" bar chart (key-rate DV01).
5. **Predict**: after lock, "If the whole curve rises 50 bp, does the payer gain or lose, and roughly how
   much?" → guess (sign + number) → reveal vs DV01 × 50.

## Non-goals
Multi-curve (OIS vs IBOR) discounting, day-count conventions beyond year fractions, CVA.

## Steps
1. Promote math to `src/lib/finance/swap.ts` (pure, `///` docs):
   ```ts
   export type SwapSpec = { notional: number; tenor: number; freq: number; fixedRate: number; payer: boolean };
   export type Curve = { df: (t: number) => number };              // from the yield-curve term structure
   export function swapLegs(spec: SwapSpec, curve: Curve): SwapPayment[]   // reuse SwapPayment shape
   export function parSwapRate(spec: Omit<SwapSpec, "fixedRate">, curve: Curve): number
   export function swapMtm(spec: SwapSpec, curve: Curve): number
   export function keyRateDv01(spec: SwapSpec, nodes: CurveNode[], build: (n: CurveNode[]) => Curve): { tenor: number; dv01: number }[]
   ```
   Make the guide's `swapTimeline` call into it (behaviour identical; its test must pass).
   A `Curve` adapter from `buildTermStructure(nodes)` (log-linear DF interpolation between nodes) lives in
   `src/lib/finance/yieldcurve.ts` if no equivalent exists — check `interpolateSpotRate` first.
2. Tests `scripts/swap-lab.test.mjs` (+ npm `test:swap-lab`): par swap MTM = 0 within 1e-9 of notional;
   sum of key-rate DV01 ≈ parallel DV01 within 2 %; payer MTM rises when rates rise.
3. Feature folder `src/features/interest-rate-swap/`: `SwapView.tsx` (≤ 150), `useSwap.ts`, `swap.url.ts`,
   components `SwapSetup`, `CurveEditor` (reuse yield-curve `MaturityChart`/node drag if it's importable
   without pulling the whole lab; otherwise use `DragHandles` on a `LineChart` — do not copy the yield
   curve component), `LegLadder` (visx bars; place in `components/` of the feature), `MtmWaterfall`,
   `KeyRateBars`, `SwapPredict`.
4. Register module (`category: "fixed-income"`, `status: "beta"`, `relatedGuides` incl. the swaps guide id
   from `guide.meta.ts`), strings `src/Language/InterestRateSwap(.hu).ts` (prefix `irs`), about with 4 FAQs,
   SEO keys, stylesheet `src/styles/swap.scss` with the breakpoint mixins.

## Acceptance criteria
- Leg ladder readable at 360 px: bars stay ≥ 6 px wide; for > 20 payments at phone width, aggregate by
  year (state in Findings). Audit green at all widths/themes/langs.
- Hover/focus on a date highlights the same row in the table and vice versa (keyboard focusable bars).
- Guide swap test passes unchanged.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:swap-lab && node --test scripts/guide-interactive-swap-timeline.test.mjs && npm run test:seo
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/interest-rate-swap,/hu/interest-rate-swap,/interest-rate-swap?tenor=10&freq=4"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/interest-rate-swap,/hu/interest-rate-swap,/guide"
```

## Pitfalls
- Payer vs receiver sign conventions: define once in `swap.ts` (MTM to the fixed payer is PV float − PV
  fixed) and only flip in one place.
- Locking the rate must not be undone by URL re-parse; store `fixedRate` in the URL once locked.
- The yield-curve lab is a separate module: importing its components is allowed, but no changes to its
  behaviour in this plan.

## Findings (fill in during execution)
- …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/08-swap-lab.md`; confirm plans 01, 02 and 07 are done
> (stop if not). Implement plan 08: promote swap math to src/lib/finance/swap.ts with tests (guide keeps
> working), then the new `interest-rate-swap` module with the leg ladder, lock-and-MTM waterfall, key-rate
> DV01 and a predict round. Run the verification commands, fill in Findings, set plan 08 to done in the
> README table, and summarise.
