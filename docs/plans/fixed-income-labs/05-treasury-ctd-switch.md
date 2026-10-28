# 05 — Treasury: yield-shift CTD switch + predict the CTD

Status: done (2026-10-28) · Depends on: 01, 03 · Suggested model: Sonnet · Est. size: M

## Why
The core intuition of bond futures is that the cheapest-to-deliver **switches** when yields move (high
duration bonds become cheapest when yields rise above the notional coupon, low duration when they fall).
Today the lab only lets you drag F; the switch is never felt.

## Current state (verified 2026-10-19, re-check after plan 03)
- After plan 03: `useTreasuryFutures.ts` (state), `basket.math.ts` (patching), `treasuryFutures.math.ts`
  (`deliveryEconomics(bonds, futures)`, `cheapestBond(results)`, conversion factors, yield→price helpers
  around L77 that take `yieldRate`), `components/DeliveryChart.tsx` (net basis vs F, draggable F markers via
  ScatterChart's frozen domain), `components/BondBasket.tsx`.
- Scenarios: `bund` (no market prices → no CTD), `amortizing`, others in `scenarios.ts` (incl.
  "five-bonds" used in earlier verification). CTD logic is skipped when `data.id === "bund"`.
- Primitives: `DragHandles`, `usePredictReveal`/`PredictReveal`/`PredictExplain`, `LineChart` with `layer`.

## Goal
1. **Yield-shift explorer** (new panel, non-bund scenarios): a parallel yield shift Δy (−200…+200 bp)
   re-prices every basket bond from its current yield (solve each bond's yield from its clean price once,
   then reprice at y+Δy), keeps F consistent (F = min over bonds of price/CF at the shifted prices, i.e.
   zero net basis for the CTD, so the switch is pure), and draws **net basis of each bond vs Δy** as lines.
   The lower envelope is the CTD; switch points are marked with vertical dotted lines and labels
   ("Bond C → Bond A at +63 bp"). A draggable `x` handle sets Δy; the CTD highlight in the metrics, table
   and factor strip follows live.
2. **Predict the CTD**: before revealing the chart, "If yields rise 150 bp, which bond is cheapest to
   deliver?" — choose a bond (segmented buttons with bond ids) → reveal → explain step (options: highest
   duration / highest coupon / lowest CF / shortest maturity) with feedback.
3. One-line live explanation next to the readout, i18n, e.g. "Above the 6% notional yield long-duration
   bonds fall most in price relative to their conversion factor."

## Non-goals
Delivery options timing (wild card), repo/carry; changing scenario data.

## Steps
1. Math in `treasuryFutures.math.ts` (or new `ctdSwitch.math.ts`):
   ```ts
   /// Yield implied by a bond's clean price (Newton/bisection over existing price function).
   export function impliedYield(bond: DeliverableBond, delivery: number): number
   /// Net basis for every bond on a grid of parallel shifts, with F re-derived per shift.
   export function ctdSwitchCurve(bonds: DeliverableBond[], delivery: number, shiftsBp: number[]):
     { shiftBp: number; futures: number; basis: Record<string, number>; ctd: string }[]
   /// Shifts (bp) where the CTD changes, linearly interpolated between grid points.
   export function ctdSwitchPoints(curve: ReturnType<typeof ctdSwitchCurve>): { shiftBp: number; from: string; to: string }[]
   ```
   Reuse the existing pricing function used by `recalculateDeliveryBond`; don't write a second bond pricer.
   Tests in `scripts/treasury-futures.test.mjs`: with two bonds (low/high duration) priced off a flat 6%
   yield, CTD switches near 0 bp; at +200 the high-duration bond is CTD.
2. Components: `CtdSwitchPanel.tsx` (LineChart + DragHandles x handle + switch markers via `layer`),
   `CtdPredict.tsx` (usePredictReveal with discrete truth; PredictExplain). Hook `useCtdSwitch.ts`
   (memoised grid of 81 shifts, current shift).
3. Wire into the treasury view under the existing chart for non-bund scenarios. The current-shift CTD id
   feeds the existing highlight (`is-ctd` row class, metric) — pass `ctdOverride` from the hook rather than
   recomputing in components.
4. Strings EN + HU draft (`tfSwitch*`, `tfPredict*`).

## Acceptance criteria
- Dragging Δy (pointer and arrow keys) moves the CTD highlight across chart, metrics, table in sync.
- Switch-point labels never collide (use `placeLabels` from plan 02) — audit green at 360 and 1280.
- Predict round hides the switch chart until reveal.
- Bund scenario unchanged (no panel).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:treasury-futures
npm run build && (npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/layout-audit.mjs --base http://localhost:4173 --paths "/treasury-futures,/hu/treasury-futures" \
  --after "(async()=>{const s=document.querySelector('.tf-scenario select');s.value=s.options[s.options.length-1].value;s.dispatchEvent(new Event('change',{bubbles:true}));await new Promise(r=>setTimeout(r,600));return true})()"
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --paths "/treasury-futures"
```

## Pitfalls
- Some scenario bonds amortise (`principalPayments` with several entries) — implied yield must use the
  full cash-flow schedule, i.e. the same pricer.
- Keep the DeliveryChart's F drag working: when Δy ≠ 0 show F from the switch curve read-only, or reset Δy
  to 0 when the user drags F. Choose the latter (simpler mental model) and note it in Findings.

## Findings (fill in during execution)
- Current state had moved: logic lives in `useTreasuryFutures.ts`/`basket.math.ts`; new files are `ctdSwitch.math.ts` (impliedYield, ctdSwitchCurve, ctdSwitchPoints, ctdTraits, formatBp), `useCtdSwitch.ts`, `components/{CtdSwitchPanel,CtdPredict,CtdExplorer,CtdSwitchLayer,bondColors}`. Pricing reuses `cashFlowsAfterDelivery` (via `cleanPriceAtYield`), accrued held fixed.
- Instead of a `ctdOverride`, the hook swaps in a repriced basket and derived F when dy != 0, so `results`/`ctd`/`ranked` (metrics, table, factor strip) follow dy automatically; `lab.futures` is the displayed F and `lab.chartCtd` keeps the DeliveryChart highlight on the unshifted basket. Dragging F (or changing scenario) resets dy to 0 (as the plan chose). Note: at dy=0 the user's own F is shown, at dy!=0 the derived F (min price/CF).
- Predict round asks for +150 bp; chart is hidden until reveal (retry hides it again). Predict state is the numeric `usePredictReveal` with the bond index as discrete truth; own result markup because `PredictReveal` formats numbers. Explain options are data-driven (`ctdTraits`): each is marked right only if the CTD is the strict extreme of the basket, plus a "none of these" option.
- Switch labels use `placeLabels` in the chart layer; tick labels are unit-free (`+50`) to avoid collisions; full "Bond C -> Bond A at +63 bp" text is in a list below the chart.
- None of the shipped scenarios has a CTD switch within +-200 bp (verified); switches appear after editing the basket (e.g. five-bonds + Bond F with CF 0.65 -> D -> F at +57 bp). Math unit tests cover the switch.
- Fixed a pre-existing overlap: `.tf-chart-wrap` had a fixed height so the drag hint overlapped the explanation in non-bund scenarios (audit with scenario switch); now only its first child is sized.
- Audit (scenario switched + predict revealed) green at 360/768/1280, light and dark, EN and HU. 1024 px shows pre-existing top-nav overflow (`topnav-controls`), unrelated. cdp-smoke clean apart from the `_vercel` 404. Build printed no prerender errors in my run.
- New HU strings for review: all `tfSwitch*`, `tfPredict*`, `tfExplain*` in `TreasuryFutures.hu.ts`.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/fixed-income-labs/README.md`
> (section 4) and `docs/plans/fixed-income-labs/05-treasury-ctd-switch.md`; confirm plans 01 and 03 are
> done (stop if not). Implement plan 05: CTD switch math with tests, a yield-shift panel with a draggable
> Δy handle and switch markers driving the CTD highlight, and a predict-the-CTD round. Run the verification
> commands, fill in Findings, set plan 05 to done in the README table, and summarise.
