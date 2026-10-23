# 01 — Demo script, pure driver, `restore` action, seed search, harness

Status: done (2026-10-23) · Depends on: – · Suggested model: Sonnet · Est. size: M

## Why
The playthrough must be exact and reversible: every step shows a known book state, the "five unhedged
days" step shows a breach, and the finale shows a passed mission. Precomputing the states with the pure
engine makes the demo deterministic, lets Back and Next restore states instantly, and lets the whole
sequence be verified with `node --test` before any UI exists.

## Current state (verified 2026-10-23)
- `src/features/hedging-desk/engine/desk.types.ts` L134–137:
  ```ts
  export type DeskAction =
    | { type: "order"; order: Order }
    | { type: "autoHedge" }
    | { type: "step"; days: number };
  ```
  `Order = { id: InstrumentId; side: Side; qty: number; tag: OrderTag }`, `OrderTag = "client" | "manual" | "auto"`,
  `BookState = { missionId, seed, day, positions, cash, costsPaid, breaches, fills, history, events, openDelta, settled }`.
- `engine/book.math.ts` L138–149 `reduceDesk(state, action, market, mission)` is a `switch (action.type)`
  with the three cases; `startBook(mission, seed, market)`, `tradeCount(state)` in the same file.
- `engine/policy.math.ts` (19 lines) `replayPolicy(mission, market, seed, every)` is the existing scripted
  loop: `while (!state.settled) { if (every > 0 && state.day % every === 0) autoHedge; step 1 }`.
- `engine/market.math.ts` `buildMarket(spec, seed): Market` (`{ spot, iv, rate, days, strikes, gapDay }`).
- `engine/risk.math.ts` `markToMarket(state, market)`, `netDelta(positions, market, day)`;
  `engine/objectives.math.ts` `evaluateObjectives(mission, state, market): ObjectiveResult[]`
  (`status: "onTrack" | "atRisk" | "pass" | "fail"`); `engine/missions.data.ts` `MISSIONS`, `missionById(id)`;
  `engine/desk.config.ts` `STOCK_ID = "STOCK"`, `DEFAULT_SEED = 7`.
- M1 (`missions.data.ts` L15–29): sold 10 × C100, 63 days, IV 22 %, RV 26 %, band ±100 sh, objectives
  `maxBreaches 3`, `pnlWithin 400`, `costsBelow 300`, cash settlement. On seed 7 the daily auto-hedge run
  ends at −$893 and fails `pnlWithin` (docs/plans/hedging-desk/08-final-qa.md Findings).
- `src/features/hedging-desk/hedgingDesk.url.ts` exports `DeskScreen = "desk" | "missions" | "debrief"`.
- Tests: `scripts/hedging-desk-engine.test.mjs` L1–14 shows the loader pattern:
  `import { importSrc } from "./lib/load-ts.mjs"; const book = await importSrc("features/hedging-desk/engine/book.math.ts");`.
  The loader resolves **relative** imports only, appending `.ts`; `import type` vanishes. `package.json`
  L30 `"test:hedging-desk": "node --test scripts/hedging-desk-*.test.mjs"` picks up new files by glob.
- No `src/features/hedging-desk/demo/` folder exists.

## Goal
1. `DeskAction` gains `{ type: "restore"; state: BookState }` and `reduceDesk` returns that state.
2. `src/features/hedging-desk/demo/` holds the types, config (`DEMO_SEED`), the script builder and the
   pure driver, with no React and no strings.
3. `DEMO_SEED` is chosen by search so the script shows what the captions will say.
4. `scripts/hedging-desk-demo.test.mjs` is green and pins the seed's properties.

## Non-goals
- No hook, components, styles or copy (plans 02 and 03).
- Do not change M1's data, the policies, or anything under `src/features/delta-hedging/`.

## Constraints
- Pure modules only (`demo/*.ts`, `engine/*.ts`): no React, no i18n, no DOM. `///` doc comments on every
  export. Files may exceed 150 lines (plain `.ts`) but keep each cohesive.
- `engine/desk.types.ts` and `engine/book.math.ts` are shared with plan 02's reading of them; make the
  smallest additive edit (one union member, one `case`).

## Steps

1. **Engine `restore`.** In `engine/desk.types.ts` append to `DeskAction`:
   ```ts
     /// Demo only: replaces the whole book (used to jump between scripted states).
     | { type: "restore"; state: BookState };
   ```
   In `engine/book.math.ts` `reduceDesk` add `case "restore": return action.state;` before the closing
   brace. Nothing else in the engine changes.

2. **`demo/demo.types.ts`** (types only):
   ```ts
   import type { BookState, DeskAction, InstrumentId, Side } from "../engine/desk.types";
   import type { DeskScreen } from "../hedgingDesk.url";
   /// Element a step points at; the DOM gives each one `id="hd-<anchor>"` (plan 02).
   export type DemoAnchor =
     | "quotes" | "tabs" | "mission" | "risk" | "blotter" | "price" | "delta" | "pnl" | "matrix" | "profile"
     | "positions" | "ticket" | "submit" | "chain" | "keys"
     | "debrief-banner" | "debrief-attribution" | "debrief-history" | "debrief-policies";
   export const DEMO_ANCHORS: readonly DemoAnchor[] = [ /* every member above, same order */ ];
   /// What the order ticket shows during a step (UI only; the book is driven by `actions`).
   export type DemoTicket = { id: InstrumentId; side: Side; qty: number };
   export type DemoStep = {
     /// Caption keys are `hdDemo<Id>Title` / `hdDemo<Id>Body` with the id capitalised (plan 03).
     id: string;
     screen: DeskScreen;
     anchor: DemoAnchor;
     /// Engine actions applied on entering the step, on top of the previous step's state.
     actions: DeskAction[];
     ticket?: DemoTicket;
     /// Auto-play dwell time before the next step.
     holdMs: number;
   };
   export type DemoRun = { steps: DemoStep[]; states: BookState[] };
   ```
   (`DEMO_ANCHORS` is a value, so it may live in `demo.types.ts` only if the file stays types-plus-one-
   constant; otherwise put it in `demo.config.ts`. Either is fine; say which in Findings.)

3. **`demo/demo.config.ts`**: `export const DEMO_MISSION = "M1";`, `export const DEMO_SEED = <found in
   step 6>;`, `export const DEMO_HOLD_MS = 7000;`, `export const DEMO_HOLD_LONG_MS = 10000;`.

4. **`demo/demo.script.ts`**: `export function buildDemoScript(mission: MissionDef, market: Market): DemoStep[]`.
   It computes `start = startBook(mission, DEMO_SEED, market)` and `q = Math.round(-start.openDelta)`
   (≈ 500 for 10 short ATM calls), then returns these steps in order (`holdMs` = `DEMO_HOLD_MS` unless noted):

   | # | id | screen | anchor | actions | ticket |
   |---|---|---|---|---|---|
   | 1 | `welcome` | desk | quotes | – | – |
   | 2 | `clientFill` | desk | blotter | – | – |
   | 3 | `positions` | desk | positions | – | – |
   | 4 | `riskBand` | desk | risk | – | – |
   | 5 | `objectives` | desk | mission | – | – |
   | 6 | `ticket` | desk | ticket | – | `{ STOCK, buy, q }` |
   | 7 | `firstFill` | desk | price | `order { STOCK, buy, q, tag: "manual" }` | `{ STOCK, buy, q }` |
   | 8 | `dayStep` | desk | delta | `step 1` | – |
   | 9 | `drift` | desk | risk | `step 5` (long hold) | – |
   | 10 | `autoHedge` | desk | keys | `autoHedge` | – |
   | 11 | `scenarios` | desk | matrix | – | – |
   | 12 | `chain` | desk | chain | – | `{ C105, buy, 5 }` |
   | 13 | `toExpiry` | desk | pnl | for every remaining day: `autoHedge`, `step 1` (generated until the folded state is settled; long hold) | `{ STOCK, buy, q }` |
   | 14 | `attribution` | debrief | debrief-attribution | – (long hold) | – |
   | 15 | `policies` | debrief | debrief-policies | – (long hold) | – |
   | 16 | `yourTurn` | desk | tabs | – | – |

   Build step 13's action list by folding: start from the state after step 12 and push `autoHedge`,
   `step 1` pairs until `settled` (use `reduceDesk`; do not hard-code 57). The option id for step 12 is
   `optionId("C", 105)` from `engine/instruments.math.ts`.

5. **`demo/demo.math.ts`**:
   - `export function demoStates(steps: DemoStep[], start: BookState, market: Market, mission: MissionDef): BookState[]`
     → `states[k]` = fold of `steps[0..k].actions` through `reduceDesk` from `start` (so `states[0] === start`
     when step 1 has no actions). Pure, no mutation.
   - `export function runDemo(mission: MissionDef, market: Market): DemoRun` → builds the script, computes
     the states, returns `{ steps, states }`.
   - `export function demoMarket(mission: MissionDef): Market` → `buildMarket(mission.market, DEMO_SEED)`.
   - `export function stepIndexById(steps: DemoStep[], id: string): number`.

6. **Seed search** (one-off, not committed as a script; paste it into Findings): with the loader
   (`node -e` is awkward with ESM; write `scripts/tmp-demo-seed.mjs`, run it, delete it), for `seed` 1…400:
   build the market, run the script with that seed (temporarily parameterise `buildDemoScript` by seed, or
   set `DEMO_SEED` and re-import), and accept the first seed where **all** hold:
   - states after `drift` have `breaches === 1` and states after `dayStep` have `breaches === 0`;
   - final state: `settled`, `evaluateObjectives(M1, final, market)` all `"pass"`;
   - `300 <= q <= 700`;
   - `Math.abs(markToMarket(final, market)) <= 250` (a comfortable pass, so a later copy tweak cannot flip it).
   Record the chosen seed, `q`, the drift-step net delta, final P&L, costs and trade count in Findings and
   write the seed into `demo.config.ts`. If no seed satisfies all four, relax `|P&L| <= 250` to `<= 400`,
   then "exactly one breach" to "at least one", and say so in Findings.

7. **Harness `scripts/hedging-desk-demo.test.mjs`** (load with `importSrc`; `D = "features/hedging-desk/demo/"`):
   1. `restore` round-trip: `reduceDesk(any, { type: "restore", state: s }, market, M1) === s`.
   2. Every step's `anchor` is in `DEMO_ANCHORS`; ids are unique; `screen` ∈ desk/missions/debrief; `holdMs > 0`.
   3. `states.length === steps.length`; `states[k].day` is non-decreasing; `states[0]` deep-equals `startBook`.
   4. After `firstFill`: `positions.STOCK === q`, one manual fill, `|netDelta| < 100`.
   5. After `dayStep`: `breaches === 0`; after `drift`: `breaches === 1` (or the relaxed rule) and one
      `breach` event.
   6. After `autoHedge`: `|netDelta| <= 0.5` and one `auto` fill on that day.
   7. Final: `settled === true`, all objectives `"pass"`, `|pnl| <= 250` (or the relaxed bound), an `expiry`
      event exists once.
   8. Determinism: `runDemo` twice is deep-equal; building the market with `DEMO_SEED + 1` changes
      `states.at(-1).cash`.
   9. `stepIndexById(steps, "toExpiry")` is 12 and `stepIndexById(steps, "nope")` is −1.

## Acceptance criteria
- `npm run test:hedging-desk` passes (49+ tests); changing `DEMO_SEED` by one makes tests 5 or 7 fail.
- `grep -rn "react\|i18n\|components/" src/features/hedging-desk/demo/` prints nothing.
- `npx tsc -b` and `npm run lint` clean (no new lint errors).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:hedging-desk && npm run test:labs
grep -rn "react\|i18n\|components/" src/features/hedging-desk/demo/ src/features/hedging-desk/engine/ && echo LEAK || echo pure
```
(No browser check: this plan has no UI. The standard build/smoke block in README §4 is optional here.)

## Pitfalls
- **`restore` must stay demo-only.** The reducer accepts any state; the UI must never dispatch it outside
  `useDemo` (plan 03). Say so in the doc comment.
- **Loader limits.** Only relative imports with `.ts` appended resolve; `demo/*` must import the engine as
  `../engine/x.math` and the URL type as `import type` (type-only, so the React-free rule holds).
- **Do not freeze the step count in tests** except where the script defines it (16 steps, `toExpiry` at
  index 12); plan 03's captions are keyed by `id`, not by index.
- **`openDelta` sign.** `startBook` sets `openDelta` (shares) negative for short calls; `q = round(−openDelta)`
  is positive.
- **Seed search cost.** 400 seeds × 63 days is cheap (< 2 s); do not add a dependency or a worker.

## Findings (fill in during execution)
- Baseline / measurements: `DEMO_SEED = 49` (the first seed in 1…400 that meets all four rules, so no
  relaxing was needed), `q = 549`, drift-step net Δ = −86 sh (1 breach during the drift), final P&L =
  −$111, costs = $74.78, trades = 54 (manual + auto). The next qualifying seeds were 55 (−$229), 62 (−$183),
  71 (−$105) and 72 (+$72).
  `test:hedging-desk` passes 49/49, `test:labs` 59/59. Setting `DEMO_SEED = 50` fails tests 5 and 7.
- Seed-search snippet used (run from the scratchpad, not committed):
  ```js
  for (let seed = 1; seed <= 400; seed++) {
    const mk = demo.demoMarket(M1, seed);
    const { steps, states } = demo.runDemo(M1, mk, seed);
    const at = (id) => states[demo.stepIndexById(steps, id)];
    const fin = states.at(-1), q = steps[5].ticket.qty, pnl = risk.markToMarket(fin, mk);
    const pass = evaluateObjectives(M1, fin, mk).every((o) => o.status === "pass");
    if (at("dayStep").breaches === 0 && at("drift").breaches === 1 && pass && q >= 300 && q <= 700 && Math.abs(pnl) <= 250) found.push(seed);
  }
  ```
- Deviations and why:
  - Instead of temporarily parameterising for the search, `buildDemoScript`, `runDemo` and `demoMarket`
    take an optional `seed` (default `DEMO_SEED`). The search and the "seed + 1" test use it; the UI
    calls them without it.
  - `DEMO_ANCHORS` lives in `demo.config.ts`, so `demo.types.ts` stays types-only.
  - `applyActions(state, actions, market, mission)` is exported from `demo.script.ts`. The script needs it
    to fold up to expiry, and `demo.math.ts` imports it from there. Putting it in `demo.math.ts` would
    create a script↔math import cycle, which the test loader cannot resolve.
  - The verification grep over `demo/` now also matches plan 03's `useDemo.ts` / `demoCopy.ts`, which are
    React by design. Plan 01's files (`demo.types/config/script/math.ts`) and `engine/` are pure.
- Items awaiting owner approval: –