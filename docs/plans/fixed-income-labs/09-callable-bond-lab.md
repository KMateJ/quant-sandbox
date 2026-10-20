# 09 — New lab: callable bond

Status: todo · Depends on: 01, 02 (run after 08: same shared files) · Suggested model: Sonnet · Est. size: M

## Why
Negative convexity is the counter-example that makes convexity click: the issuer's call caps the price.
Today it's only a guide figure. A lab where you drag the yield and see the price pinned under the call
price, plus a timeline showing *when* the issuer would call, teaches embedded options without option math.

## Current state (verified 2026-10-19)
- `src/features/guide/guide.interactive.callablePriceYield.math.ts`: `CALLABLE` constants,
  `PROTECTION_YEARS = [1, 3, 5]`, `straightPrice(y, m?)`, `priceToCall(y, k)`, `callValue(y, k)`,
  `callablePrice(y, k) = straightPrice − callValue`, `CallableQuote` + `callableQuote(y, k)`,
  `priceCurves(k, points)`. Test: `scripts/guide-interactive-callable-price-yield.test.mjs`.
  Read how `callValue` is modelled (likely a simple intrinsic/approximation, not a lattice) before
  extending it.
- Bond math: `src/lib/finance/bond.ts`. Primitives: `DragHandles` (x handle on yield), `usePinnedSeries`,
  `PredictReveal`, `LineChart` with `layer`, `SegmentedControl`.
- Module wiring: same as plan 07 (grep `TreasuryFutures` / `treasury-futures` outside the feature folder).

## Goal
Module `callable-bond` at `/callable-bond`:
1. Inputs: coupon, maturity, call price, call protection (years), via `BondInputs`-style controls (reuse
   `src/components/BondInputs.tsx` where fields overlap).
2. **Price–yield chart** with straight and callable curves; the gap shaded as "value of the call to the
   issuer"; a draggable yield handle; the region where effective convexity < 0 shaded with a label (placed
   with `placeLabels`). Readouts at the handle: prices, yield-to-maturity vs yield-to-call vs
   yield-to-worst, effective duration and convexity (finite differences ±25 bp).
3. **Call decision timeline**: for the current yield, a horizontal timeline of call dates after
   protection; each date coloured "call" vs "keep" by comparing refinancing at the current yield with the
   remaining coupons; the first "call" date is the expected redemption. Dragging the yield updates it live.
4. **Predict**: "Rates fall 150 bp. Does the callable gain more or less than the straight bond?" → choose →
   reveal both price changes.

## Non-goals
Lattice/OAS pricing (state in Findings if the guide model limits the lab's realism; propose a follow-up).

## Steps
1. Promote to `src/lib/finance/callable.ts`, generalised over a spec instead of the `CALLABLE` constants:
   ```ts
   export type CallableSpec = { coupon: number; maturity: number; freq: number; callPrice: number; protection: number };
   export function callablePriceAt(spec: CallableSpec, y: number): { straight: number; callable: number; call: number }
   export function yieldToWorst(spec: CallableSpec, price: number): { ytm: number; ytc: number; ytw: number; worstDate: number }
   export function effectiveRisk(spec: CallableSpec, y: number, bp = 25): { dEff: number; cEff: number }
   export function callSchedule(spec: CallableSpec, y: number): { t: number; call: boolean }[]
   ```
   The guide file wraps these with its constants; its test must pass unchanged.
2. Tests `scripts/callable-lab.test.mjs` (+ npm `test:callable-lab`): callable ≤ straight everywhere;
   `cEff < 0` at low yields; with protection = maturity the callable equals the straight bond.
3. Feature folder `src/features/callable-bond/`: `CallableView.tsx` ≤ 150, `useCallable.ts`,
   `callable.url.ts`, components `CallableInputs`, `PriceYieldPanel`, `CallTimeline`, `CallableReadout`,
   `CallablePredict`.
4. Register module, strings `src/Language/CallableBond(.hu).ts` (prefix `cb`), about (4 FAQs), SEO keys,
   `src/styles/callable.scss` with breakpoint mixins; `relatedGuides` includes the guide that hosts the
   callable figure (grep `callable-price-yield` in `src/features/guide`).

## Acceptance criteria
- Yield handle draggable by pointer and arrow keys; timeline updates in the same frame.
- Audit green at all widths/themes/langs, including with the handle dragged to the chart edges.
- Guide callable test passes.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:callable-lab && node --test scripts/guide-interactive-callable-price-yield.test.mjs && npm run test:seo
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/callable-bond,/hu/callable-bond,/callable-bond?y=0.01,/callable-bond?y=0.15"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/callable-bond,/hu/callable-bond"
```

## Pitfalls
- Yield-to-call is solved per call date; use bisection with clear bounds, never assume a root exists
  (price above all call prices).
- Shaded regions must use tokens with alpha (`color-mix` with CSS vars), readable in dark mode.

## Findings (fill in during execution)
- …

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/09-callable-bond-lab.md`; confirm plans 01, 02 and 08 are
> done (stop if not). Implement plan 09: promote callable-bond math to src/lib/finance/callable.ts with
> tests (guide keeps working), then the new `callable-bond` module with the draggable price–yield chart,
> negative-convexity region, call decision timeline and a predict round. Run the verification commands,
> fill in Findings, set plan 09 to done in the README table, and summarise.
