# 10 — Market Making Desk engine + 5 missions

Status: done (2026-10-28, opus-02) · Depends on: 02 · Suggested model: Sonnet · Est. size: L

## Why
The desk is the area's capstone game (the mockups' dense market-making terminal): you keep a bid and an
ask resting in a live order book for ten simulated minutes, earn the spread, fight for queue priority,
manage inventory against a limit, survive informed flow and a news jump, and are scored against robot
makers on the same market. This plan builds the pure engine and the five missions; plans 11–12 build the
screens on the existing game kit.

## Current state (verified 2026-10-28, commit `a4b1706`)
- After plan 02, `src/lib/market/`: `Book`, `Fill` (`makerOwner`, `taker: "you" | "crowd" | "noise" |
  "informed"`, aggressor `side`), `FlowSpec`, `DEFAULT_FLOW`, `seedBook`, `fairPath`, `flowSchedule` (pre-drawn
  per tick, independent of the player), `applyTick`, `addLimit`, `cancel`, `cancelOwner`, `ordersOf`,
  `queueAhead`, `marketOrder`, `bestBid/bestAsk/midTicks`; `maker.ts` (`Ledger`, `emptyLedger`, `applyFill`,
  `pnlTotal`, `decompose` → `{ spread, adverse, inventory, fees, total }`); `quotes.ts` (`asQuotes`,
  `asTotalSpread`). Read plan 02's Findings and the `CONTRACT` lines in `LOG.md` for the final signatures.
- Game kit (`src/lib/game/`): `MissionBase<D>`, `ObjectiveResult<D>`, `GameEventBase`, `capStatus(value,
  limit, warnFrom, settled)`, `floorStatus(value, floor, warnBelow, settled)`, `countStatus(misses, allowed,
  settled)`, `bandAtSettle`, `allPassed`, `subSeed`, `createProgressStore(deskId, better)`, `higherIsBetter`.
- Reference engine to mirror (folder layout, reducer style, policy replay, calibration table):
  `src/features/portfolio-desk/engine/` (`portfolio.types.ts`, `market.math.ts`, `book.math.ts`
  `reducePortfolio`, `objectives.math.ts`, `policy.math.ts` `replayPortfolio`, `missions.data.ts`) and
  `docs/plans/game-desks/10-portfolio-engine.md`.
- Plan 01 defines `npm run test:micro-desk` (`scripts/micro-desk-*.test.mjs`); without it run
  `node --test scripts/micro-desk-*.test.mjs`.

## Goal
1. `src/features/market-making-desk/engine/` (pure) with the API below, missions MM1–MM5, four robot
   policies, a calibration table, and tests.

## Non-goals
- No React, copy or styles (plans 11–12). No edits to `src/lib/market` (if a helper is missing, add it in
  `engine/` and append a `DEVIATION` line to LOG.md).

## Constraints
- Pure, immutable, `///` docs, deterministic per (mission, seed, actions). Tick = 1 simulated second.
  Prices in integer ticks inside the engine; money in $ (tick 0.01).

## Steps
1. `engine/mm.types.ts`:
   ```ts
   export type MmPolicyId = "join" | "wide" | "as" | "flatten";
   export type MmObjective =
     | { kind: "pnlFloor"; floor: number } | { kind: "inventoryCap"; limit: number; allowed: number }
     | { kind: "adverseCap"; limit: number } | { kind: "maxDrawdown"; limit: number }
     | { kind: "beatPolicy"; policy: MmPolicyId };
   export type MmMission = MissionBase<MmObjective> & { seconds: number; flow: FlowSpec; quoteSize: number;
     rebate: number /* $/share earned as maker */; takerFee: number /* $/share paid as taker */; markout: number;
     limit: number; gamma: number; k: number; news?: { t: number; announced: boolean } };
   export type MmQuote = { bidOffset: number; askOffset: number /* ticks from mid, ≥ 0.5 */; size: number; live: boolean; auto: boolean };
   export type MmEvent = GameEventBase & ({ kind: "start" } | { kind: "fill"; side: Side; price: number; size: number }
     | { kind: "hedge"; side: Side; size: number; avg: number } | { kind: "limitBreach"; inventory: number }
     | { kind: "news"; jump: number } | { kind: "requote" } | { kind: "pulled" } | { kind: "end"; pnl: number });
   export type MmHist = { t: number; mid: number; inv: number; pnl: number; bid: number | null; ask: number | null };
   export type MmState = { missionId: string; seed: number; t: number; book: Book; ledger: Ledger; quote: MmQuote;
     peak: number; mdd: number; breaches: number; informedFills: number; hist: MmHist[]; events: MmEvent[]; settled: boolean };
   export type MmAction = { type: "setQuote"; quote: Partial<MmQuote> } | { type: "pull" } | { type: "hedge"; size: number }
     | { type: "step"; ticks: number } | { type: "restore"; state: MmState };
   export type MmMarket = { fair: number[]; schedule: TickDraws[]; book0: Book };
   ```
2. `engine/market.math.ts`: `mmMarket(mission, seed): MmMarket` from `fairPath`, `flowSchedule`, `seedBook`
   (with `mission.news` mapped to `flow.jump`). Pure and cached by the caller (`useMemo`).
3. `engine/book.math.ts`: `startMm(mission, seed, market)`; `reduceMm(state, action, mission, market)`:
   - `setQuote`: merge, then (if `live`) cancel your orders and place new ones: bid at `floor(mid − bidOffset)`,
     ask at `ceil(mid + askOffset)`, size `quote.size` each (re-placing loses queue priority — that is the point).
   - `pull`: cancel your orders, `live = false`, event `pulled`.
   - `hedge`: `marketOrder` for `size` toward flat (taker "you"), ledger fill with fee `−takerFee·size`, event.
   - `step`: for each tick: `applyTick`; every fill with `makerOwner === "you"` becomes a ledger fill (maker
     side = opposite of the aggressor side, `mid` = mid before the tick, fee `+rebate·size`); count
     `taker === "informed"` fills (hidden during play, shown in the debrief); if `auto` and the touch moved so
     your quotes are > 1 tick from their target, re-place them (event `requote`); if a side filled completely
     and `auto`, re-place it; inventory over `limit` → `breaches += 1` once per crossing (event
     `limitBreach`); stop quoting a side that would push |inventory| above `1.5 × limit`; update peak and
     max drawdown on `pnlTotal`; append `hist` every tick; `news` event at `news.t`; `end` at `seconds`
     (`settled = true`, no more actions except `restore`).
   - `restore`.
4. `engine/objectives.math.ts`: `evaluateMm(mission, state, policyPnl?: number)` with the kit helpers
   (`floorStatus` for P&L, `countStatus` for breaches, `capStatus` for adverse loss magnitude from
   `decompose(...).adverse` and drawdown, `beatPolicy` = final P&L > policy P&L, onTrack until settled);
   exhaustive switch.
5. `engine/policy.math.ts`: `policyActions(id, state, mission, market): MmAction[]` per tick — `join`
   (offsets 0.5, auto), `wide` (offsets 3, auto), `as` (offsets from `asQuotes` with σ = `flow.sigmaTicks`,
   q in units of `quoteSize`, `gamma`, `k`, tLeft = (seconds − t)/seconds; clamp ≥ 0.5; re-set every 5 ticks),
   `flatten` (`join` + hedge to zero when |inventory| > 0.6 × limit); `replayMm(mission, seed, id) →
   { state, pnl }` via `reduceMm` (deterministic).
6. `engine/missions.data.ts` (`MM_MISSIONS`, `mmMissionById`). Defaults: `seconds` 600, `flow` =
   `DEFAULT_FLOW`, `quoteSize` 200, `rebate` 0.002, `takerFee` 0.003, `markout` 10, `limit` 2,000, `gamma`
   0.05, `k` 1.5. Starting limits below are **guesses to calibrate** (step 7):

   | Id | Theme | Changes from defaults | Objectives |
   |---|---|---|---|
   | MM1 | Earn the spread | – | pnlFloor +$20; inventoryCap 2,000 / 0 breaches |
   | MM2 | One-way street | `buyShare` 0.65 (customers keep buying from you) | inventoryCap 1,500 / 1; pnlFloor $0 |
   | MM3 | Toxic flow | `informedShare` 0.3 | adverseCap $30; pnlFloor $0 |
   | MM4 | News at 10:05 | `news { t: 300, announced: true }`, jump 8 ticks | maxDrawdown $40; pnlFloor −$10 |
   | MM5 | Beat the robot | `informedShare` 0.15 | beatPolicy `as`; inventoryCap 2,000 / 0 |

7. **Calibration**: replay the four policies for seeds 1–20 per mission; record full and per-objective pass
   rates in Findings (table like `docs/plans/game-desks/10-portfolio-engine.md`). Adjust limits so each
   mission is winnable by a sensible policy (≥ 30% of seeds) but not by doing nothing, and MM3/MM4 are not
   passed by `join`. MM5's `beatPolicy` excludes the `as` policy itself.
8. Tests `scripts/micro-desk-engine.test.mjs`: determinism (same seed + actions ⇒ deep-equal state);
   the crowd schedule is unchanged by player actions; re-quoting puts you at the back of the queue
   (`queueAhead` grows); maker fills update the ledger with rebate and correct side; `decompose` identity on a
   finished replay; hedge pays the taker fee; breaches counted once per crossing; side stops quoting beyond
   1.5 × limit; news jump applied at t = 300; objectives per kind; `replayMm` runs 600 ticks < 300 ms;
   immutability (input state unchanged after `reduceMm`).

## Acceptance criteria
- `npm run test:micro-desk` passes; Findings hold the calibration table and final limits.
- `grep` shows no React/i18n/DOM in `engine/`.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:micro-desk && npm run test:microstructure && npm run test:game-kit
grep -rnE "react|i18n|document|window|Math\.random|Date\.now" src/features/market-making-desk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Mid before vs after the tick:** record a fill's `mid` as the mid *before* the tick that filled it, or the
  spread-capture term is contaminated by the move that caused the fill.
- **Auto re-quote churn:** re-placing every tick destroys your queue position; only re-place when the target
  price changed by ≥ 1 tick.
- **Policy fairness:** policies replay on the same `MmMarket`; never rebuild it with a different seed.
- **Performance:** `applyTick` per tick plus your two orders; keep `hist` flat objects; no deep clones.

## Findings (fill in during execution)
- Calibration (seeds 1–20; full passes / 20, per-objective in brackets; "none" = never quote):

  | Mission | join | wide | as | flatten | none |
  |---|---|---|---|---|---|
  | MM1 | 4 [19,4] | 10 [11,17] | 20 [20,20] | 17 [17,20] | 0 [0,20] |
  | MM2 | 2 [2,18] | 14 [16,17] | 15 [15,20] | 4 [20,4] | 0 [20,0] |
  | MM3 | 3 [3,17] | 7 [20,7] | 10 [10,20] | 3 [4,16] | 0 [20,0] |
  | MM4 | 3 [3,19] | 6 [6,18] | 20 [20,20] | 6 [6,19] | 0 [20,0] |
  | MM5 | 6 [11,8] | 3 [3,20] | – (benchmark) | 9 [9,20] | 0 [0,20] |

  Median session P&L of a quoting robot is about $140–310; a 600-tick replay takes about 35 ms.
- Limits changed from the table (owner to review): MM1 pnlFloor $20 → $150; MM2 pnlFloor $0 → $100; MM3 adverseCap $30 → $40 and pnlFloor $0 → $30; MM4 pnlFloor −$10 → +$50 (doing nothing passed every $0/−$10 floor). `gamma` 0.05 → 0.005. Desk flow `DESK_FLOW = { ...DEFAULT_FLOW, depthPerLevel: 250, marketRate: 1.5, meanMarketSize: 250, sigmaTicks: 0.5, horizon: 10 }`: with the lab default, quotes 3 ticks out never filled and informed flow barely mattered.
- Deviations and extra exports: `news` carries `sizeTicks` (8 in MM4); `MmMarket.jump` (signed news jump, ticks); `missionFlow(mission)`; `mmPnl`, `mmPnlParts`, `midAtFrom` in `objectives.math.ts`; `MM_POLICIES`; `policyActions(id, s, mission)` has no market argument (unused); `replayMm(mission, seed, id, market?)` accepts a pre-built market. Quote targets use the crowd mid (your own orders excluded) so quotes do not chase themselves. The AS robot scales σ to the whole session (`sigmaTicks·√seconds`) because tLeft runs 1 → 0. Hedging cancels your resting order on the side it would hit (no self-trade). Settling cancels your orders. `inventoryCap` with `allowed: 0` reads `atRisk` while live (kit `countStatus` semantics).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/market-making/README.md`
> (sections 2 and 4), `LOG.md` and `docs/plans/market-making/10-desk-engine.md`; confirm plan 02 is done and
> read its Findings/CONTRACT lines. Implement plan 10: the pure Market Making Desk engine
> (`src/features/market-making-desk/engine/`) with the reducer, objectives, four robot policies, missions
> MM1–MM5, calibration and tests (`test:micro-desk`). Run the verification block, record calibration in
> Findings, append DONE to LOG.md, set plan 10 to `done`, and summarise.
