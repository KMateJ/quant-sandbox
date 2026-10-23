# 01 — Trading engine core + unit harness

Status: done (2026-10-23) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
Every screen of the Hedging Desk (desk, missions, debrief) reads the same state: a book of stock and
option positions, cash, fills with a bid/ask spread, a day clock, band breaches, Greeks and mission
objectives. Building that as a pure, tested TypeScript engine first lets four UI plans run in parallel
and be checked by numbers instead of by eye.

## Current state (verified 2026-10-23)
- No `src/features/hedging-desk/` folder exists yet.
- Black–Scholes in `src/features/black-scholes/blackScholes.math.ts`:
  `blackScholesCall | blackScholesPut | blackScholesDelta | blackScholesPutDelta | blackScholesGamma |
  blackScholesVega | blackScholesTheta | blackScholesPutTheta`, all `(S, K, T, r, sigma) => number`.
  When `T <= 0`, price returns intrinsic value and delta returns `S > K ? 1 : 0` (call) or `S < K ? -1 : 0`
  (put); gamma, vega and theta return 0. **Theta is per year; vega is per 1.00 of volatility.**
- RNG in `src/lib/math/random.ts`: `makeRng(seed): Rng`, `nextNormal(rng)`, `normals(n, rng)`.
- Stats in `src/lib/stats/moments.ts`: `mean(xs)`, `stdDev(xs)` (sample).
- Test loader: `scripts/lib/load-ts.mjs` exports `importSrc(pathUnderSrc)` (used by
  `scripts/chart-layout.test.mjs` L5). It transpiles a TS file and its **relative** imports with
  `typescript.transpileModule`, appending `.ts` to each specifier. Type-only imports vanish. Folder
  imports (`../../lib/math`) and path aliases do **not** resolve, so import files directly
  (`../../../lib/math/random`).
- `package.json` scripts L10–40: each suite is `"test:<name>": "node --test scripts/<name>.test.mjs"`.
  `test:labs` runs `scripts/lab-*.test.mjs`.

## Goal
1. `src/features/hedging-desk/engine/` with pure modules (no React, no i18n, no DOM) implementing the
   API below.
2. Mission M1 defined as data, with objective evaluation.
3. `scripts/hedging-desk-engine.test.mjs` + `"test:hedging-desk"` script, green.

## Non-goals
- No React hook, components, routes or styles (plan 02 onwards).
- No M2–M5 mechanics (gap events, IV schedules, ticket fees, physical settlement: plan 07). Leave the
  extension points named in Steps.
- Do not touch `src/features/delta-hedging/**`.

## Constraints
- Engine files never produce user-facing text. Events and objectives are structured data; the UI
  formats them through i18n.
- Immutable updates: every function returns new objects/arrays; never mutate the input state.
- `///` doc comments on every exported function and type. Files may exceed 150 lines (plain `.ts`), but
  keep each cohesive.

## Steps

### Files to create (all under `src/features/hedging-desk/engine/`)

**`desk.types.ts`** (types only):
```ts
export type OptionType = "C" | "P";
/// "STOCK" or an option id such as "C100" / "P97.5" (type letter + strike).
export type InstrumentId = string;
export type Side = "buy" | "sell";
export type OrderTag = "client" | "manual" | "auto";
export type Order = { id: InstrumentId; side: Side; qty: number; tag: OrderTag };
export type Fill = Order & { day: number; price: number; cost: number };
export type MarketSpec = {
  s0: number; rate: number; impliedVol: number; realizedVol: number; days: number; strikes: number[];
  /// One overnight jump of ±size (fraction) on a day drawn from [from, to] (plan 07 implements).
  gap?: { from: number; to: number; size: number };
  /// Implied vol changes to `iv` from `day` on (plan 07 implements).
  ivSchedule?: { day: number; iv: number }[];
};
/// Spot and implied vol for days 0..days (length days + 1).
export type Market = { spot: number[]; iv: number[]; rate: number; days: number; strikes: number[]; gapDay: number | null };
export type Costs = { stockHalfSpread: number; optionHalfSpread: number; ticketFee: number };
export type Quote = { mid: number; bid: number; ask: number; half: number; mult: number; delta: number; gamma: number; vega: number; theta: number };
export type DayRecord = { day: number; openDelta: number; closeDelta: number; sharesHeld: number; sharesNeeded: number; gamma: number; vega: number; pnl: number; breach: boolean };
/// Every event kind the desk can ever emit. M1 uses only fill/breach/expiry/start; the rest are
/// produced by plan 07's mechanics, but are declared now so UI switches are exhaustive from day one.
export type DeskEvent =
  | { day: number; kind: "fill"; fill: Fill }
  | { day: number; kind: "breach"; delta: number }
  | { day: number; kind: "expiry" }
  | { day: number; kind: "start" }
  | { day: number; kind: "gap"; move: number }
  | { day: number; kind: "ivShift"; iv: number }
  | { day: number; kind: "rejected"; reason: "tradeLimit" }
  | { day: number; kind: "assignment"; id: InstrumentId; shares: number };
export type BookState = {
  missionId: string; seed: number; day: number;
  positions: Record<InstrumentId, number>; // shares for STOCK, contracts for options
  cash: number; costsPaid: number; breaches: number;
  fills: Fill[]; history: DayRecord[]; events: DeskEvent[]; // events newest first
  openDelta: number; settled: boolean;
};
export type Greeks = { delta: number; gamma: number; vega: number; theta: number; dollarDelta: number; dollarGamma1pct: number };
/// Every objective kind any mission uses (M1 uses the first three).
export type ObjectiveDef =
  | { kind: "maxBreaches"; limit: number }
  | { kind: "pnlWithin"; limit: number }
  | { kind: "costsBelow"; limit: number }
  | { kind: "maxTrades"; limit: number }
  | { kind: "pnlAbove"; limit: number }
  | { kind: "gammaLimitFrom"; limit: number; fromDay: number }
  | { kind: "gapLoss"; limit: number }
  | { kind: "vegaLimitBy"; limit: number; byDay: number }
  | { kind: "beatPolicy"; every: number }
  | { kind: "flatStock" };
export type ObjectiveStatus = "onTrack" | "atRisk" | "pass" | "fail";
export type ObjectiveResult = { def: ObjectiveDef; status: ObjectiveStatus; value: number };
export type MissionDef = {
  id: string; greeks: ("delta" | "gamma" | "vega")[];
  market: MarketSpec; costs: Costs; band: number;
  /// Opening trades executed at day 0 (e.g. the client buying calls from you).
  opening: Order[];
  objectives: ObjectiveDef[];
  instruments: "stock" | "all";
  /// Manual + auto trades allowed over the run (plan 07 enforces).
  maxTrades?: number;
  /// How options settle at expiry (plan 07 implements "physical").
  settlement: "cash" | "physical";
  unlockAfter?: string;
};
export type PolicyResult = { pnl: number; breaches: number; trades: number; costs: number; series: number[] };
export type DeskAction =
  | { type: "order"; order: Order }
  | { type: "autoHedge" }
  | { type: "step"; days: number };
```

**`desk.config.ts`**: `TRADING_DAYS = 252`, `CALENDAR_DAYS = 365`, `CONTRACT_MULT = 100`,
`STOCK_ID = "STOCK"`, `DEFAULT_COSTS: Costs = { stockHalfSpread: 0.01, optionHalfSpread: 0.05, ticketFee: 0 }`,
`DEFAULT_SEED = 7`.

**`instruments.math.ts`**:
- `optionId(type: OptionType, strike: number): InstrumentId` → `"C100"`, `"P97.5"`.
- `parseInstrument(id): { kind: "stock" } | { kind: "option"; type: OptionType; strike: number }`.
- `isStock(id): boolean`.

**`pricing.math.ts`**:
- `quoteInstrument(id, S, tau, iv, rate, costs): Quote`. Stock: mid `S`, mult 1, delta 1, other Greeks 0,
  `half = costs.stockHalfSpread`. Options: the Black–Scholes functions above with `T = tau` (years);
  mult `CONTRACT_MULT`; `vega` divided by 100 (per vol point); `theta` divided by `CALENDAR_DAYS`
  (per calendar day); `half = tau > 0 ? costs.optionHalfSpread : 0`; `bid = max(mid − half, 0)`,
  `ask = mid + half`.
- `tauAt(day, days): number` = `(days − day) / TRADING_DAYS`.

**`market.math.ts`**:
- `buildMarket(spec: MarketSpec, seed: number): Market`: GBM on the daily grid,
  `S[i+1] = S[i]·exp((rate − ½σ²)·dt + σ·√dt·z)` with `σ = spec.realizedVol`, `dt = 1/TRADING_DAYS`,
  `z = nextNormal(makeRng(seed))` drawn in order; `iv` filled with `spec.impliedVol`; `gapDay: null`.
  Leave `gap` and `ivSchedule` unimplemented (plan 07 applies them here, using a **second** RNG so M1's
  path never changes).

**`risk.math.ts`**:
- `netDelta(positions, market, day): number` (shares).
- `bookGreeks(state, market): Greeks` at `state.day` (`dollarDelta = delta·S`,
  `dollarGamma1pct = ½·gamma·(0.01·S)²`).
- `positionValue(positions, S, tau, iv, rate): number` = Σ qty·mult·mid (no cash).
- `markToMarket(state, market): number` = `state.cash + positionValue(...)` at the current day. With the
  accounting below this is the book P&L, since the book starts at 0.
- `scenarioGrid(state, market, spotShocks: number[], volShifts: number[]): number[][]`: rows = vol
  shifts, cols = spot shocks; each cell = value at `S·(1+shock)`, `iv + shift` minus value now
  (positions and tau unchanged).
- `riskProfile(state, market, points = 41, span = 0.2): { spot: number; now: number; expiry: number }[]`:
  spots from `S·(1−span)` to `S·(1+span)`; `now` = cash + value at today's tau; `expiry` = cash +
  value at tau 0.
- `realizedVol(spot: number[], day: number, window = 20): number | null`: sample stdev of the last
  `window` log returns up to `day`, ×√252; `null` when fewer than 2 returns.

**`book.math.ts`**:
- `startBook(mission, seed, market): BookState`: empty positions `{ STOCK: 0 }`, cash 0, then apply
  each `mission.opening` order through `applyOrder`, then prepend a `{ kind: "start" }` event and
  set `openDelta`.
- `applyOrder(state, market, mission, order): BookState`: no-op if `state.settled`, `day >= days`, or
  `qty` not a positive integer. Fill price = `ask` for buys, `bid` for sells. `cash −= sign·qty·price·mult`;
  `costsPaid += qty·half·mult`; position `+= sign·qty`; push the fill; prepend a fill event.
- `autoHedgeOrder(state, market): Order | null`: `q = round(−netDelta)`; `null` when 0; otherwise a
  STOCK order with tag `"auto"`.
- `advanceDays(state, market, mission, n): BookState`: for each day until `n` or expiry:
  1. `closeDelta = netDelta(...)`; push a `DayRecord` (`sharesHeld = positions.STOCK`,
     `sharesNeeded = sharesHeld − closeDelta`, `gamma`/`vega` from `bookGreeks`, `pnl = markToMarket`,
     `breach = |closeDelta| > band`);
     on breach `breaches++` and prepend a breach event.
  2. `day++`; cash accrues `cash·= exp(rate/TRADING_DAYS)`.
  3. If `day === days`: cash-settle every option at intrinsic value (`cash += qty·mult·intrinsic`, set
     its position to 0), `settled = true`, prepend an expiry event. (Extension point for plan 07:
     physical settlement.)
  4. `openDelta = netDelta(...)` at the new day.
- `reduceDesk(state, action, market, mission): BookState`: dispatches `DeskAction`
  (`autoHedge` = `applyOrder(autoHedgeOrder(...))` when not null).
- `tradeCount(state): number`: fills with tag `manual` or `auto`.

**`policy.math.ts`**:
- `replayPolicy(mission, market, seed, every: number): PolicyResult`: start a book, then for each day
  dispatch `autoHedge` when `every > 0 && day % every === 0`, then `step 1`, until settled. Drive
  `reduceDesk` only, so later mechanics (fees, trade limits, settlement) are included automatically.
  `series` = P&L at each close. Used by the `beatPolicy` objective and by plan 06's debrief.

**`missions.data.ts`**: `export const MISSIONS: MissionDef[]` with M1:
```ts
{ id: "M1", greeks: ["delta"],
  market: { s0: 100, rate: 0.03, impliedVol: 0.22, realizedVol: 0.26, days: 63,
            strikes: [90, 92.5, 95, 97.5, 100, 102.5, 105, 107.5, 110] },
  costs: DEFAULT_COSTS, band: 100,
  opening: [{ id: "C100", side: "sell", qty: 10, tag: "client" }],
  objectives: [{ kind: "maxBreaches", limit: 3 }, { kind: "pnlWithin", limit: 400 }, { kind: "costsBelow", limit: 300 }],
  instruments: "all", settlement: "cash" }
```
plus `missionById(id): MissionDef | undefined`.

**`objectives.math.ts`**: `evaluateObjectives(mission, state, market): ObjectiveResult[]`:
- `maxBreaches`: value = breaches; `fail` if > limit, else `pass` if settled, else `atRisk` if == limit,
  else `onTrack`.
- `pnlWithin`: value = markToMarket; settled → `pass` if |value| ≤ limit else `fail`; live → `onTrack`
  if |value| ≤ limit else `atRisk`.
- `costsBelow`: value = costsPaid; `fail` if > limit, else `pass` if settled, else `atRisk` if
  > 0.8·limit, else `onTrack`.
- Implement the other kinds too (no mission uses them until plan 07, but the switch must be complete,
  with a `never` check):
  - `maxTrades`: value = `tradeCount`; same rule shape as `costsBelow` (at risk from limit − 2).
  - `pnlAbove`: value = P&L; settled → pass if ≥ limit; live → atRisk when below.
  - `gammaLimitFrom`: value = max |gamma| over history records with `day ≥ fromDay`; fail as soon as
    one exceeds the limit; pass when settled.
  - `gapLoss`: value = P&L change from the record before `market.gapDay` to the gap day's record
    (0 until the gap has happened); fail if < −limit; pass when settled.
  - `vegaLimitBy`: value = |vega| at the close of day `byDay − 1`; onTrack before that day; then
    pass or fail.
  - `beatPolicy`: value = P&L − `replayPolicy(mission, market, state.seed, every).pnl`; judged only
    when settled (pass if ≥ 0); live → onTrack.
  - `flatStock`: value = `positions.STOCK` after settlement; pass if 0; live → onTrack.

### Harness
Create `scripts/hedging-desk-engine.test.mjs`. Load modules with the shared loader (do **not** copy the
older inline `load()` helper): `import { importSrc } from "./lib/load-ts.mjs";` then
`const book = await importSrc("features/hedging-desk/engine/book.math.ts");` and so on. Add to
`package.json` after the `test:labs` line:
`"test:hedging-desk": "node --test scripts/hedging-desk-*.test.mjs",` (Node 24 expands the glob
itself, as `test:labs` already relies on). Later plans add their own `scripts/hedging-desk-<area>.test.mjs`
files, so nobody edits this one after you.
Tests (each a `test(...)`):
1. Determinism: `buildMarket(M1.market, 7)` twice is deep-equal; seed 8 differs; `spot.length === 64`.
2. Quotes: call mid equals `blackScholesCall`; `ask − bid === 2·half`; at `tau = 0` mid = intrinsic,
   half 0; put–call parity holds for mids within 1e-9.
3. Opening trade: M1 `startBook` cash = `10·100·bid(C100)` > 0, costs = 50, positions.C100 = −10,
   `openDelta` ≈ `−1000·Δcall`.
4. Accounting identity: after random orders and full stepping, `markToMarket` equals
   `cash + positions.STOCK·S_T` (options are settled) and the expiry event exists once.
5. Daily auto-hedge policy (auto-hedge then step 1, 63 times) on seed 7: `breaches === 0`, final P&L finite.
6. No-hedge policy on seed 7: `breaches > 0`.
7. Orders after expiry, zero or fractional quantities are no-ops (state is `===` unchanged or deep-equal).
8. `scenarioGrid` centre cell (0 shock, 0 shift) is 0 within 1e-9; `riskProfile` `now` at the middle
   point equals `markToMarket` within 1e-6.
9. Objectives: fresh M1 → all `onTrack`; 4 breaches → `fail`; after settlement with |P&L| ≤ 400 →
   `pass`.
10. Immutability: `Object.freeze`-deep the state before `applyOrder`/`advanceDays`; no throw.
11. `replayPolicy(M1, market, 7, 1)` equals the daily policy of test 5 (same P&L, breaches, trades).
12. Each objective kind has at least one status assertion on a hand-built state.

## Acceptance criteria
- `npm run test:hedging-desk` passes; breaking the bid/ask choice in `applyOrder` (swap bid and ask)
  makes test 3 fail.
- No file under `engine/` imports React, `i18n` or anything from `src/components`.
- `npx tsc -b` and `npm run lint` are clean.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
grep -rn "react\|i18n\|components/" src/features/hedging-desk/engine/ && echo "LEAK" || echo "pure"
```

## Pitfalls
- **Units.** Black–Scholes theta is per year and vega per 1.00 of vol; the desk shows $/calendar day and
  $/vol point. Convert once, in `quoteInstrument`.
- **Test loader.** Only relative specifiers with `.ts` appended resolve. Use `import type` for
  `desk.types.ts` so it vanishes at transpile time; never import from a folder `index`.
- **Strike ids with decimals.** `"P97.5"`: parse with `Number(id.slice(1))`, not `parseInt`.
- **Sign of `sharesNeeded`.** It is the stock holding that makes net delta zero:
  `sharesHeld − closeDelta`.
- **Breaches are judged at the close**, after the user's trades for that day, not at the open.
- **RNG order.** Draw normals in day order from one `makeRng(seed)`, so plan 07 can add events without
  changing M1's path.

## Findings (fill in during execution)
- Baseline / measurements: M1 seed 7 daily auto-hedge final P&L = −893.41, costs = 71.54, breaches 0,
  trades 49. No hedge: P&L −18,547.86, 63 breaches.
- Deviations and why: `scenarioGrid` uses the shifted vol as given (no floor); `objectives.math.ts` has a
  shared `capStatus` helper for the "stay under a limit" kinds. Two sessions claimed 01 at once (my-app-6a,
  my-app-c3); the final engine is 6a's except `risk.math.ts`, and the tests are c3's. Both pass all checks.
  `npm run lint` has 11 pre-existing errors outside this pack; `engine/` and the test file lint clean.
- Items awaiting owner approval: on seed 7, daily hedging ends at −893, which fails M1's `pnlWithin 400`
  (realized vol 26% > implied 22% makes the short call lose money). Decide whether that is intended
  (the player must do better than mechanical daily hedging) or whether the limit or vols should change.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/hedging-desk/README.md`
> (section 4) and `docs/plans/hedging-desk/01-engine-core.md`. Implement plan 01: create the pure
> trading engine under `src/features/hedging-desk/engine/` (types, config, instruments, pricing, market,
> risk, book, missions data with M1, objectives) exactly as specified, plus
> `scripts/hedging-desk-engine.test.mjs` and the `test:hedging-desk` npm script. Run
> `npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs` and make them pass. Fill in
> the plan's Findings (record M1 seed 7 numbers), set plan 01 to `done` in the README table, and
> summarise what changed. Do not touch `src/features/delta-hedging/`.
