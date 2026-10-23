# 07 — Missions M2–M5 + market events

Status: done (2026-10-23) · Depends on: 01, 02 · Suggested model: Sonnet · Est. size: M

## Why
M1 teaches the basic delta hedge. The next four missions each isolate one more real desk problem:
paying per ticket, a price gap that delta hedging cannot catch, an implied-vol regime change, and pin
risk at expiry. The types and UI already know about these mechanics (plan 01 declared them); this plan
implements them in the engine and adds the missions.

## Current state (verified 2026-10-23, after plans 01–02)
- Engine in `src/features/hedging-desk/engine/` (plan 01). Already declared but **not implemented**:
  - `MarketSpec.gap?: { from; to; size }`, `MarketSpec.ivSchedule?: { day; iv }[]`, `Market.gapDay`
    (always `null` today) in `desk.types.ts`.
  - `Costs.ticketFee` (0 in `DEFAULT_COSTS`), `MissionDef.maxTrades?`, `MissionDef.settlement`
    (`"cash"` only is implemented).
  - `DeskEvent` kinds `gap`, `ivShift`, `rejected`, `assignment` (never emitted yet).
  - All ten `ObjectiveDef` kinds are evaluated in `objectives.math.ts`, including `gapLoss`,
    `gammaLimitFrom`, `vegaLimitBy`, `beatPolicy`, `flatStock`, `maxTrades`, `pnlAbove`.
- `buildMarket` in `market.math.ts` draws normals in day order from `makeRng(seed)`.
- `applyOrder` and `advanceDays` in `book.math.ts`; settlement is the cash branch in `advanceDays`.
- `MISSIONS` in `missions.data.ts` holds M1 only.
- Copy: `src/Language/HedgingDeskMissions.ts` / `.hu.ts` (plan 02) holds M1 copy and all objective
  labels. Key pattern: `hdMission{Id}Title`, `hdMission{Id}Tagline`, `hdMission{Id}Brief`.
- UI that already handles these mechanics once they exist: blotter event text (plan 03), "Trades
  left" in the ticket (plan 03), briefing setup rows (plan 05), policy replay and attribution
  (plan 06, `replayPolicy` in `policy.math.ts`).
- Design reference: canvas board `Missions.dc.html` (mission list and briefings for M2–M5).

## Goal
Implement the mechanics in the engine, then add four missions:

| Id | Title (EN) | Market / book | Mechanics | Objectives | Unlock |
|---|---|---|---|---|---|
| M2 | Rebalance on a budget | as M1 | `ticketFee: 15`, `maxTrades: 10`, stock only | `pnlWithin 600`, `maxTrades 10`, `beatPolicy every 5` | after M1 |
| M3 | Gamma before the gap | short 20 × C100, 45 days, IV 22%, RV 24% | `gap: { from: 25, to: 35, size: 0.08 }` | `gammaLimitFrom 40 from 25`, `gapLoss 1500`, `maxBreaches 3` | after M2 |
| M4 | Volatility regime shift | long 15 × C105, short 5 × P95, 40 days | `ivSchedule: [{ day: 20, iv: 0.30 }]` | `vegaLimitBy 1500 by 20`, `maxBreaches 3`, `pnlAbove −500` | after M3 |
| M5 | Pin risk at expiry | short 10 × C100, 10 days, s0 100.20 | `settlement: "physical"` | `flatStock`, `maxBreaches 2`, `pnlWithin 300` | after M4 |

## Non-goals
- No new `DeskEvent` or `ObjectiveDef` kinds, and no type changes in `desk.types.ts`. If you find one is
  truly needed, stop and report: the UI plans' exhaustive switches depend on the current unions.
- No UI component edits; the UI already reads these fields. (Exception: if a plan 03/05/06 file
  renders something wrong for a new mission, note it in Findings rather than fixing it here.)

## Constraints
- **M1's path and results must not change.** Event draws use a second RNG,
  `makeRng((seed ^ 0x9e3779b9) >>> 0)`, never the path RNG.
- Pure engine code, `///` docs on new exports.
- Copy: append an M2–M5 block at the **end** of `HedgingDeskMissions.ts` / `.hu.ts` (re-read first; keep
  other plans' lines). HU is a draft.

## Steps
1. **Gap** in `buildMarket`: if `spec.gap`, draw `gapDay` uniformly in `[from, to]` and a sign (±) from
   the event RNG; multiply `spot[gapDay..]` by `1 + sign·size` (apply the jump between `gapDay − 1` and
   `gapDay`, then continue the diffusion from the jumped level). Set `market.gapDay`.
2. **IV schedule** in `buildMarket`: `iv[d] = latest schedule entry with day ≤ d`, else `impliedVol`.
3. **Events while stepping** (`advanceDays`): on arriving at `gapDay`, prepend
   `{ kind: "gap", move: sign·size·100 }`; on arriving at a schedule day, prepend `{ kind: "ivShift", iv }`.
4. **Ticket fee** in `applyOrder`: for `manual`/`auto` orders, `cash −= ticketFee`,
   `costsPaid += ticketFee` (not on the `client` opening trade).
5. **Trade limit** in `applyOrder`: when `mission.maxTrades` is set and `tradeCount(state) >= maxTrades`,
   do not fill; prepend `{ kind: "rejected", reason: "tradeLimit" }` (return a new state with only that
   event added).
6. **Stock-only missions**: `applyOrder` rejects non-stock manual orders when `instruments === "stock"`
   (no event needed; the UI already disables them).
7. **Physical settlement** in `advanceDays` at expiry: for each in-the-money option position, deliver
   shares instead of cash: calls `stock += qty·100`, `cash −= qty·100·K`; puts `stock −= qty·100`,
   `cash += qty·100·K` (signs follow `qty`, so short calls deliver shares out); prepend an
   `assignment` event per option; out-of-the-money options expire worthless. The P&L identity must still
   hold.
8. **Missions** in `missions.data.ts`: add M2–M5 per the table (strikes as M1; `costs` spread from
   `DEFAULT_COSTS` with overrides; `unlockAfter` chain).
9. **Copy**: titles, taglines and briefs (from the canvas `Missions.dc.html`), e.g.
   M3 brief "Delta hedging alone will not save you from a jump. Buy back gamma with options before the
   gap, without overpaying in theta."
10. **Tests** in a new `scripts/hedging-desk-missions-m2-m5.test.mjs` (via `importSrc`):
    - M1 market and the daily-policy result for seed 7 are unchanged (compare against values computed
      from the same functions with `gap`/`ivSchedule` absent; and record the numbers in Findings).
    - M3: `gapDay` in [25, 35], `|spot[gapDay]/spot[gapDay−1] − 1| ≥ 0.07`; deterministic per seed;
      gap event emitted once.
    - M4: `iv[19] = 0.22`, `iv[20] = 0.30`; vega objective judged at D19's close.
    - M2: 11th trade is rejected; each trade adds $15 to costs; `beatPolicy` is evaluated only when settled.
    - M5: after expiry with S > K, `positions.STOCK` changes by −1000 for the short calls; `flatStock`
      passes only if the user pre-hedged with +1000 shares; P&L identity holds.

## Acceptance criteria
- `npm run test:hedging-desk` passes, including the M1-unchanged test.
- `/delta-hedging/desk?m=M3` plays with a visible GAP event in the blotter; `?m=M4` shows an IV event and
  the OMON header IV changes from 22.00 to 30.00 at D20; `?m=M5` ends with ASGN events.
- The Missions screen lists five missions with the right unlock chain.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk
npm run build
(npx vite preview --port 4173 --strictPort &) && sleep 4
MSYS_NO_PATHCONV=1 node scripts/cdp-smoke.mjs --base http://localhost:4173 --ignore "_vercel" \
  --paths "/delta-hedging/desk?m=M2,/delta-hedging/desk?m=M3,/delta-hedging/desk?m=M4,/delta-hedging/desk?m=M5,/delta-hedging/desk?screen=missions"
```
Stop the server and confirm port 4173 is free.

## Pitfalls
- **RNG coupling.** Drawing the gap day from the path RNG would shift every later normal and change
  M1's path. Use the separate event RNG.
- **Gap application.** Scale all later spots, or re-simulate from the jumped level; do not change only
  `spot[gapDay]` (that would be a one-day spike that reverts).
- **`url.m` deep links** to locked missions still work by design (plan 05), so the engine must not assume
  progress.
- **Theta vs fee interplay in M2:** with $15 tickets, daily hedging costs about $945; the mission is meant
  to be solvable with about 6–10 well-timed trades. Record the auto-hedge every-5 P&L for seed 7 in
  Findings so the owner can tune limits.
- **Physical settlement at exactly S = K**: treat as out of the money (no assignment), matching the
  Black–Scholes `T <= 0` delta rule (`S > K`).

## Findings (fill in during execution)
- Engine and copy done 2026-10-23 (my-app-6a). `test:hedging-desk` 29/29 pass. Browser checks on vite preview,
  seed 7: `?m=M3` blotter shows "Overnight gap −8.0%" (GAP); `?m=M4` chain header goes from IV 22.00% to
  30.00% at D21; `?m=M5` ends with "QSBX 100C exercised: −1,000 shares" (ASGN); `?m=M2` shows
  "Stock only in this mission" and "Trades left: 10" with the chain disabled; the Missions screen lists
  M1–M5. Smoke clean on all five paths.
- Baseline / measurements, seed 7, policy P&L $ / costs $ / breaches / trades
  (auto-hedge every 1 / 5 / 21 days / never):
  | Mission | every 1 | every 5 | every 21 | never |
  |---|---|---|---|---|
  | M1 | −893 / 72 / 0 / 49 | −141 / 61 / 8 / 11 | −1234 / 60 / 16 / 3 | −18548 / 50 / 63 / 0 |
  | M2 | −8427 / 210 / 52 / 10 | −382 / 211 / 8 / 10 | −1279 / 105 / 16 / 3 | −18548 / 50 / 63 / 0 |
  | M3 (gap D35) | −2440 / 159 / 0 / 45 | −56 / 132 / 23 / 9 | −634 / 119 / 31 / 3 | +5218 / 100 / 45 / 0 |
  | M4 | +1668 / 140 / 0 / 40 | −50 / 117 / 17 / 8 | +1583 / 112 / 28 / 2 | +11852 / 100 / 40 / 0 |
  | M5 | −1818 / 69 / 0 / 10 | +557 / 58 / 6 / 2 | +1089 / 55 / 9 / 1 | +569 / 50 / 10 / 0 |
  M1 is unchanged from plan 01 (−893.41 / 71.54 / 0 / 49); a test locks it.
  M2 daily hedging uses up its 10 trades by D9, then sits unhedged.
- Deviations and why:
  - On the gap day the price move is the jump alone (±8% exactly), not jump × that day's diffusion.
    With both, a diffusion move against the jump could leave less than the 7% the test requires. That
    day's normal is still drawn, so later days keep their draws.
  - `gapEvent(spec, seed)` and `ivOnDay(spec, day)` are new exports in `market.math.ts`.
    `advanceDays` re-derives the gap's sign from them, because `Market` has no field for it and types
    are frozen.
  - The ticket fee is included in `Fill.cost` as well as `costsPaid`, so the sum of fill costs equals
    `costsPaid`.
  - Stock-only and trade-limit checks apply only to `manual`/`auto` orders; `client` opening trades
    bypass them.
  - M2 sets `instruments: "stock"` (the table says "stock only"). M4 keeps M1's realized vol of 26%.
    M5 runs 10 days on M1's strikes.
- Items awaiting owner approval:
  - Mission limits on seed 7. M2's `pnlWithin 600` is narrow when every-5 hedging scores −382. M3's
    gap fell on D35, the last day of its window. M4's `pnlAbove −500` is easy, since the book is long
    gamma with realized vol above implied.
  - HU drafts: `hdMissionM2Title/Tagline/Brief` … `hdMissionM5Title/Tagline/Brief` (12 keys) in
    `src/Language/HedgingDeskMissions.hu.ts`. "Rés" for gap and "pin-kockázat" need review.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/07-missions-m2-m5.md`, and confirm plans 01 and 02 are marked
> done (stop and report if not). Implement plan 07: gap and IV-schedule events, ticket fees, trade
> limits, stock-only enforcement and physical settlement in the engine, missions M2–M5 in
> `missions.data.ts`, their EN/HU copy appended to `HedgingDeskMissions.ts`, and the new test file. Do
> not change `desk.types.ts` or M1's results. Run the verification block and make it pass. Fill in
> Findings (policy numbers per mission, HU drafts), set plan 07 to `done` in the README table, and
> summarise.
