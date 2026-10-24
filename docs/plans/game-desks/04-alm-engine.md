# 04 — ALM desk engine + 5 missions

Status: done (2026-10-24, session alm-engine) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The ALM desk turns the Immunization lab's round-based game into a mission desk: fund a pension liability
with a ladder of bonds while the curve shifts and twists each year. The Immunization lab already has the
maths; this plan wraps it in a pure, tested desk engine with five missions so the screen and help plans
can run in parallel.

## Current state (verified 2026-10-23, commit `73f67d7`)
`src/features/immunization/immunization.math.ts` (205 lines) and `immunization.types.ts` (37 lines):
- Types: `Curve = { level; slope }` (yield at τ = `level + slope·(τ−7)/10`), `Shock = { parallelBp; twistBp }`,
  `Position = Holding & { slot }`, `Attribution = { carry; rate; convexity; cost }`,
  `RoundResult = { round; shock; surplus; assets; liability; attribution }`,
  `GameConfig = { liability; years; level0; costBp; maxParallelBp; maxTwistBp }`,
  `GameState = { seed; round; curve; cash; positions: Position[]; pendingCost; history: RoundResult[] }`.
- Exports: `TENORS = [2, 5, 12]` L6, `SLOTS = 4` L7 (three bonds + cash last), `DEFAULT_CONFIG` L9
  (`liability 1_000_000, years 8, level0 0.05, costBp 5, maxParallelBp 100, maxTwistBp 50`),
  `yieldAt` L14 (clamped 0.001–0.2), `assetsValue` L19, `yearsLeft` L22, `liabilityPv` L25,
  `surplusOf` L28, `weightsOf` L31, `exposure(s) → { dMod; convexity }` L39 (cash = 0),
  `liabilityDuration` L53, `liabilityConvexity` L59, `immunisedWeights(s, c)` L65, `newGame(seed, config?)`
  L89 (invests the liability PV in the immunised mix, surplus 0), `drawShock(seed, round, config?)` L95
  (fresh `makeRng(seed*7919 + round*104729)`; uniform, 10 bp steps), `surplusAttribution(prev, next, config)`
  L115, `advance(s, shock, config?)` L135 (age one year, then shock, append `RoundResult`),
  `rebalance(s, weights, config?)` L154 (cost = `costBp/1e4 × total·Σ|Δw|/2`; changed slots re-bought as new
  par bonds), `benchmarks(seed, config?) → { buyHold; autoImmunised }` L174, `setWeight` L189, `money`,
  `moneyShort`, `bpOf`, `signedBp`.
- Bonds are **par coupon** bonds issued at the slot tenor; aging moves maturities down, coupons and
  redemptions go to cash, and cash earns the 1y yield. The game ends at `round >= years`.
- Tests: `scripts/immunization-lab.test.mjs` (`npm run test:immunization-lab`) and
  `scripts/guide-interactive-immunization-shock.test.mjs`. Both must stay green unchanged.
- Kit (plan 01): `src/lib/game/game.types.ts` (`MissionBase`, `ObjectiveResult`, `ObjectiveStatus`,
  `GameEventBase`), `objectives.ts` (`capStatus`, `floorStatus`, `countStatus`, `allPassed`), `seed.ts`.

The canvas prototype (`AlmDesk.dc.html`) used zero-coupon slots and Gaussian shocks; **ignore that model**
and keep the Immunization maths (owner-approved decision in the README).

## Goal
1. `src/features/alm-desk/engine/` with the API below, pure and deterministic.
2. Five missions A1–A5 as data.
3. Additive, default-preserving extensions in `immunization.math.ts` for A4 (a second liability).
4. `scripts/alm-desk-engine.test.mjs` + `"test:alm-desk"` script.

## Non-goals
- No React, no copy, no styles (plans 05/06). No change to Immunization defaults or its tests.

## Constraints
- Changes to `immunization.math.ts` / `.types.ts` are **additive**: a new optional `GameConfig` field and
  code paths that run only when it is set. `npm run test:immunization-lab` must pass unchanged.
- Engine imports Immunization maths by relative path (`../../immunization/immunization.math`).

## Steps
1. **Immunization extension** (additive): `GameConfig.extraLiabilities?: { amount: number; year: number; from: number }[]`
   (payment of `amount` at game year `year`, known from round `from`). When set and `round >= from`:
   `liabilityPv`, `liabilityDuration`, `liabilityConvexity` and `surplusOf` include it while `round < year`;
   during `advance`, at the round where `round` reaches `year`, pay `amount` from cash (cash may go negative,
   it then accrues at the 1y yield like positive cash). `immunisedWeights` uses the combined duration. Add
   two tests to a **new** file `scripts/alm-desk-immunization-ext.test.mjs` (not the lab's test file).
2. **`engine/alm.types.ts`**:
   ```ts
   export type AlmObjective =
     | { kind: "surplusAtEnd"; floor: number }
     | { kind: "gapMisses"; band: number; allowed: number }       // |dMod_A − dMod_L| at each year end
     | { kind: "convexityMisses"; band: number; allowed: number } // |conv_A − conv_L| at each year end
     | { kind: "costsBelow"; limit: number }
     | { kind: "maxTrades"; limit: number }
     | { kind: "surplusFloor"; floor: number };                   // surplus never below floor at a year end
   export type AlmMission = MissionBase<AlmObjective> & {
     config: Partial<GameConfig>; startWeights: number[]; maxTrades?: number;
     contributionOnAdd?: boolean; // A4: sponsor pays the new liability's PV in cash when it is announced
   };
   export type AlmEvent = GameEventBase & (
     | { kind: "start" } | { kind: "shock"; parallelBp: number; twistBp: number }
     | { kind: "rebalance"; cost: number; duration: number; tag: "manual" | "auto" }
     | { kind: "matured"; tenor: number; amount: number } | { kind: "gapMiss"; gap: number }
     | { kind: "convMiss"; gap: number } | { kind: "liabilityAdded"; amount: number; year: number; contribution: number }
     | { kind: "liabilityPaid"; amount: number } | { kind: "rejected"; reason: "tradeLimit" } | { kind: "end"; surplus: number });
   export type AlmState = { missionId: string; seed: number; game: GameState; misses: number; convMisses: number;
     trades: number; costs: number; minSurplus: number; events: AlmEvent[]; settled: boolean };
   export type AlmAction = { type: "rebalance"; weights: number[]; tag: "manual" | "auto" } | { type: "match" }
     | { type: "step" } | { type: "restore"; state: AlmState };
   ```
3. **`engine/book.math.ts`**: `startAlm(mission, seed): AlmState` (= `newGame(seed, cfg)` then an
   **uncosted** rebalance to `startWeights`; `start` event), `reduceAlm(state, action, mission): AlmState`:
   - `rebalance`: reject with a `rejected` event when `maxTrades` is reached; else `rebalance(...)`, count
     a trade, add its cost, log `rebalance` with the new asset duration.
   - `match`: `rebalance` to `immunisedWeights` with tag `auto`.
   - `step`: before aging, test the gap and convexity bands (misses + events); then
     `advance(game, drawShock(seed, round, cfg), cfg)`; log `shock`, `matured` (compare positions before
     and after), `liabilityAdded` (round reaches an extra liability's `from`; if `contributionOnAdd`, add its
     PV to cash first), `liabilityPaid`; update `minSurplus`; at `round >= years` set `settled` and log `end`.
   - `restore`: return `action.state`.
   All updates immutable.
4. **`engine/risk.math.ts`**: `almRisk(state, mission) → { assets, liability, surplus, funded, durA, durL, gap, convA, convL, dv01A, dv01L, netDv01, weights }`
   from `assetsValue`, `liabilityPv`, `exposure`, `liabilityDuration/Convexity` (DV01 = value × dMod × 1e-4).
   `surplusGrid(state, mission, parallelsBp: number[], twistsBp: number[]): number[][]` — instant shock:
   clone the game with `curve: { level + p/1e4, slope + t/1e4 }`, no aging, `surplusOf − surplus now`.
   `curvePoints(curve, maxT = 15, step = 0.25)` for the chart.
5. **`engine/objectives.math.ts`**: `evaluateAlm(mission, state): ObjectiveResult<AlmObjective>[]` using
   the kit helpers (`floorStatus`, `countStatus`, `capStatus`); exhaustive switch with a `never` check.
6. **`engine/policy.math.ts`**: `replayAlm(mission, seed, policy: "matchYearly" | "buyHold" | "matchOnce" | "none") → { surplus: number[]; costs: number; trades: number; final: number }`
   through `reduceAlm` only (no copied accounting). `matchOnce` = match at start then hold.
7. **`engine/missions.data.ts`** (`ALM_MISSIONS`, `almMissionById`):

   | Id | Theme | `config` overrides | `startWeights` [2y,5y,12y,cash] | Other | Objectives |
   |---|---|---|---|---|---|
   | A1 | Fund the pension | – | `[0, 1, 0, 0]` | – | surplusAtEnd 0; gapMisses 0.25 / 1; costsBelow 2,500 |
   | A2 | Twist season | `maxParallelBp: 30, maxTwistBp: 100` | `[0, 1, 0, 0]` | – | surplusFloor −10,000; gapMisses 0.25 / 1 |
   | A3 | Three trades only | – | `[0, 1, 0, 0]` | `maxTrades: 3` | surplusAtEnd 0; maxTrades 3 |
   | A4 | A second liability | `extraLiabilities: [{ amount: 500_000, year: 5, from: 3 }]` | `[0, 1, 0, 0]` | `contributionOnAdd: true` | surplusAtEnd 0; gapMisses 0.25 / 1 |
   | A5 | Match convexity too | – | `[0, 1, 0, 0]` | – | gapMisses 0.25 / 1; convexityMisses (band from step 9) / 1; surplusAtEnd 0 |

8. **`engine/series.math.ts`**: `surplusSeries(state)`, `benchmarkSeries(mission, seed, upTo)` (from
   `replayAlm`), `attributionTotals(state)` summing `RoundResult.attribution`.
9. **Calibrate and record**: run the four policies for seeds 1–20 per mission and record pass rates in
   Findings; choose A5's convexity band so `matchYearly` fails it on most seeds and a barbell/cash mix can
   pass. If a mission is unwinnable on most seeds, loosen its limit and record why.
10. **Tests** `scripts/alm-desk-engine.test.mjs`: determinism per seed; `startAlm` weights and zero cost;
    `match` brings |gap| ≤ 0.05; costs equal Immunization's cost formula; `step` to the end settles once
    with an `end` event; A3 rejects the 4th trade; A4 adds the liability at round 3 with surplus unchanged
    within 1 when `contributionOnAdd`; `replayAlm("matchYearly")` beats `"none"` on surplus volatility over
    seeds 1–20; every objective kind evaluates; immutability (deep-freeze input).
    `package.json`: `"test:alm-desk": "node --test scripts/alm-desk-*.test.mjs",`.

## Acceptance criteria
- `npm run test:alm-desk` and `npm run test:immunization-lab` pass; the lab page behaves as before.
- Findings hold the calibration table (pass rate per mission × policy).

## Verification
```bash
npx tsc -b && npm run lint && npm run test:alm-desk && npm run test:immunization-lab && npm run test:game-kit
grep -rn "react\|i18n" src/features/alm-desk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Duration units:** `exposure().dMod` and `liabilityDuration` are modified durations; compare like with like.
- **Shock RNG is per round** (`drawShock(seed, round)`), so replays are deterministic without carrying an RNG.
- **Matured bonds** leave a slot empty: `immunisedWeights` already falls back to cash; keep weights length 4.
- **Negative cash** (A4 payment) must not break `weightsOf` (division by total); test it.

## Findings (fill in during execution)
- Calibration (seeds 1–20, pass rate of all objectives; `barbell` = 2y/12y duration match each year):

  | Mission | matchYearly | buyHold | matchOnce | none | barbell |
  |---|---|---|---|---|---|
  | A1 | 16/20 | 0/20 | 0/20 | 0/20 | 17/20 |
  | A2 | 14/20 | 0/20 | 0/20 | 0/20 | 9/20 |
  | A3 | 17/20 | 10/20 | 14/20 | 9/20 | 14/20 |
  | A4 | 15/20 | 0/20 | 0/20 | 0/20 | 17/20 |
  | A5 | 16/20 | 0/20 | 0/20 | 0/20 | 0/20 |
- A5 convexity band chosen and why: **15** (`A5_CONVEXITY_BAND`). With only 2y/5y/12y bonds and cash, the
  5y+12y duration match is already the *least* convex mix that matches duration (its gap starts at +13.8 and
  shrinks to ~1); any barbell is more convex. So the plan's "matchYearly fails, barbell passes" cannot happen.
  A5 now teaches the reverse: match duration with the nearest tenors; the 2y/12y barbell over-shoots
  convexity and fails (0/20). Owner to confirm the lesson.
- Deviations:
  - `surplusAtEnd` floor is **−10,000** (−1% of the liability) for A1/A3/A4/A5, not 0. Twist noise moves
    a perfectly matched book by about ±10k, so a 0 floor passed only 12/20 even with perfect play.
  - `buyHold` = trade back to the start weights every year (constant mix); `none` = never trade. The plan
    did not define the difference.
  - A3 is loose: `none` passes 9/20, because A3 has no gap objective.
  - Immunization extension: `liabilityFlows` is exported; `age` takes an optional config (pays the extra
    liability). Default-config numbers are unchanged (`test:immunization-lab` green, unchanged).
  - A4 contribution is added to cash after the step's `advance`, and the round's `RoundResult` is
    recomputed so history, surplus and attribution agree.
  - `surplusSeries` starts at 0 (the book opens fully funded); `benchmarkSeries` returns
    `{ matchYearly, none }`. Also exported: `almConfig`, `bandOf`, `gapsOf`, `AlmPolicy`, `AlmRisk`, `PolicyRun`.
  - Written while plan 01 was still in progress, against its documented API; `test:game-kit` green at finish.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/04-alm-engine.md`; confirm plan 01 is done. Implement plan 04:
> the pure ALM engine in `src/features/alm-desk/engine/` wrapping `immunization.math.ts` (additive
> extension for extra liabilities), missions A1–A5, calibration, and tests with the `test:alm-desk` script.
> Run the verification block, record calibration in Findings, append DONE (and a CONTRACT line if the
> engine API differs from the plan) to LOG.md, set plan 04 to `done`, and summarise.
