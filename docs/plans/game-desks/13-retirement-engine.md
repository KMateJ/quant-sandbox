# 13 — Retirement desk engine + 5 missions

Status: done (2026-10-24, session retirement-engine) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The retirement desk lets the player run a 1,000,000 pension pot for thirty years, one year at a time:
choose this year's withdrawal and the equity share, see the success odds re-run from today, and live with
the returns as they arrive. It teaches sequence risk, withdrawal rates and guardrail spending. Nothing in
`src` simulates stochastic retirement paths yet: `src/features/tvm/tvm.math.ts` `sequenceWealth` (L137) is
deterministic and works on a fixed 15-return list.

## Current state (verified 2026-10-24, commit `349c0ca`)
- `src/features/tvm/tvm.math.ts`: `SEQUENCE_RETURNS` L130, `SEQUENCE_START` L131, `sequenceWealth(returns,
  start, withdrawal)` L137, `presetOrder` L153. Lab-only; **do not edit** and do not import its constants
  (the desk has its own model).
- `src/lib/math/random.ts`: `makeRng(seed)`, `nextNormal(rng)` (standard normal). Use these; the canvas
  prototype's own RNG (`mulberry32` + Box–Muller) must **not** be copied.
- Kit (plan 01): `src/lib/game/game.types.ts` (`MissionBase`, `ObjectiveResult`, `GameEventBase`),
  `objectives.ts` (`capStatus`, `floorStatus`, `bandAtSettle`, `countStatus`, `allPassed`), `seed.ts`
  (`subSeed`, `nextSeed`).
- Canvas board `RetirementDesk.dc.html` (README "Design reference") holds the reference model. Its numbers,
  which this plan adopts: 30 years, start wealth 1,000,000, target spend 40,000 (real), equity real return
  μ 5% σ 17%, bond real μ 1% σ 6%, correlation 0.1, yearly return floored at −90%, 400 Monte Carlo paths
  for the odds, a "spending cut" = taking less than 90% of last year's amount, guardrails rule: keep last
  year's amount, ×0.9 when the withdrawal rate is above 4.8%, ×1.1 below 3.2%.
- Test loader: `scripts/lib/load-ts.mjs` → `importSrc("features/retirement-desk/engine/x.ts")`; relative
  imports only, `.ts` appended; no folder `index` imports.

## Goal
`src/features/retirement-desk/engine/` with the API below, missions T1–T5, calibration recorded in Findings,
tests in `scripts/retirement-desk-engine.test.mjs`, script `test:retirement-desk`.

## Non-goals
- No React, copy or styles (plans 14–15). No edits to `src/features/tvm/**`.

## Constraints
- Pure and immutable; `///` docs on every export; no `Math.random`, no `Date.now`.
- All amounts are real (today's money); no inflation input.

## Steps
1. `engine/retirement.types.ts`:
   ```ts
   export type RetirementObjective =
     | { kind: "moneyLasts" }                         // wealth > 0 through the last year
     | { kind: "avgSpendAtLeast"; amount: number }
     | { kind: "cutsAtMost"; allowed: number }        // cuts of 10% or more
     | { kind: "legacyAtLeast"; amount: number }      // wealth left at the end
     | { kind: "oddsNeverBelow"; floor: number };     // odds at every decision
   export type SpendRule = "fixed" | "fixedLow" | "pctWealth" | "guardrails";
   export type RetirementMission = MissionBase<RetirementObjective> & {
     years: number; start: number; target: number; equity0: number; // 0..1
     muE: number; sigmaE: number; muB: number; sigmaB: number; rho: number;
     forced: { year: number; equity: number }[];     // scripted equity real returns (e.g. a bad first decade)
     paths: number; equityLocked: boolean;
   };
   export type RetirementEvent = GameEventBase & (
     | { kind: "start" } | { kind: "take"; amount: number; equity: number; tag: "manual" | "auto" }
     | { kind: "cut"; amount: number; pct: number } | { kind: "bigYear"; r: number }
     | { kind: "broke" } | { kind: "end"; wealth: number } );
   export type YearRow = { y: number; start: number; take: number; equity: number; r: number; end: number; odds: number };
   export type RetirementState = { missionId: string; seed: number; year: number; wealth: number; equity: number;
     last: number | null; cuts: number; broke: boolean; minOdds: number; rows: YearRow[]; events: RetirementEvent[]; settled: boolean };
   export type RetirementAction =
     | { type: "take"; amount: number; equity: number; tag: "manual" | "auto" }
     | { type: "auto"; years: number; rule: SpendRule } | { type: "restore"; state: RetirementState };
   ```
2. `engine/market.math.ts`:
   - `yearShocks(mission, seed): [number, number][]` — `years` pairs of standard normals from `makeRng(seed)`
     drawn in year order (z1 then z2).
   - `portfolioReturn(mission, equity, z1, z2, year): number` — `re = forced equity for year ?? muE + sigmaE·z1`,
     `rb = muB + sigmaB·(rho·z1 + √(1−rho²)·z2)`, result `max(−0.9, e·re + (1−e)·rb)`.
   - `portfolioStats(mission, equity) → { mu, vol }` (annual, closed form).
3. `engine/rules.math.ts`: `nextWithdrawal(rule, mission, last: number | null, wealth): number` — `fixed` =
   `target`; `fixedLow` = `0.875 × target` (35,000 at defaults); `pctWealth` = `0.04 × wealth`;
   `guardrails` = `target` when `last === null`, else the rail rule above. `withdrawalRate(amount, wealth)`
   (1 when wealth ≤ 0).
4. `engine/odds.math.ts`: `successOdds(mission, seed, year, wealth, first, equity, rule = "guardrails"): number`
   — share of `paths` futures where wealth lasts to `years`; year `year` withdraws `first`, later years follow
   `rule`; RNG `makeRng(subSeed(seed, 1000 + year))` so the odds never disturb the main path and are
   identical for the same inputs. Forced returns do **not** apply inside the Monte Carlo (the player does
   not know the script). Ran-out rule: a withdrawal ≥ wealth ends the path as failed unless the amount is 0.
5. `engine/book.math.ts`: `startRetirement(mission, seed): RetirementState` and
   `reduceRetirement(state, action, mission, shocks)`:
   - `take`: ignored when settled; `equity` ignored (kept) when `equityLocked`; odds for the decision stored on
     the row and folded into `minOdds`; `take = min(amount, wealth)`; `broke = amount ≥ wealth && amount > 0`;
     `end = broke ? 0 : (wealth − take)(1 + r)`; cut when `last !== null && take < 0.9·last` (event with pct);
     `bigYear` when |r| > 12%; `broke` / `end` events; `settled` when broke or `year === years`.
   - `auto`: `years` takes using `nextWithdrawal(rule, …)` and the current equity, tag `auto`.
   - `restore`: returns the given state.
6. `engine/objectives.math.ts`: `evaluateRetirement(mission, state, oddsNow): ObjectiveResult<RetirementObjective>[]`
   with the kit helpers; exhaustive switch with a `never` check. `moneyLasts`: fail when broke, pass when
   settled, `atRisk` when `oddsNow < 0.7`. `avgSpendAtLeast`: `floorStatus(avg, amount, amount, settled)`, and
   fail if broke. `cutsAtMost`: `countStatus`. `legacyAtLeast`: `floorStatus(wealth, amount, amount·1.2, settled)`.
   `oddsNeverBelow`: `floorStatus(minOdds, floor, floor + 0.05, settled)` with live fail as soon as `minOdds < floor`.
7. `engine/policy.math.ts`: `replayRetirement(mission, seed, rule: SpendRule)` → final state, via the reducer
   (`auto` for all years at `equity0`). Used by the debrief (plan 15).
8. `engine/missions.data.ts` (`RETIREMENT_MISSIONS`, `retirementMissionById`, `DEFAULT_RETIREMENT`). Defaults:
   years 30, start 1,000,000, target 40,000, equity0 0.6, μE 0.05, σE 0.17, μB 0.01, σB 0.06, ρ 0.1, paths 400,
   forced `[]`, equityLocked false.

   | Id | Theme | Changes | Objectives |
   |---|---|---|---|
   | T1 | Thirty years on 4% | – | moneyLasts; avgSpendAtLeast 38,000; cutsAtMost 3 |
   | T2 | Bad first decade | forced equity −18%, −12%, +2%, −9%, −6% in years 1–5 (announced as "a weak start" only) | moneyLasts; avgSpendAtLeast 34,000; cutsAtMost 4 |
   | T3 | Equity locked at 60% | `equityLocked: true` | moneyLasts; oddsNeverBelow 0.6; cutsAtMost 3 |
   | T4 | Living to 100 | years 35, target 36,000 | moneyLasts; avgSpendAtLeast 34,000 |
   | T5 | Leave a legacy | – | moneyLasts; avgSpendAtLeast 36,000; legacyAtLeast 400,000 |

9. Calibration: for seeds 1–20 per mission run the four `replayRetirement` rules plus a "guardrails at 40%
   equity" variant; record pass rates in Findings. Adjust limits so every mission is winnable by an attentive
   player on most seeds but not by `fixed` alone. Stop and record in Findings rather than inventing new
   mechanics if that is impossible.
10. Tests `scripts/retirement-desk-engine.test.mjs`: `yearShocks` determinism; correlation of the two return
    legs ≈ ρ over 20,000 draws; `portfolioStats` vs simulated mean/vol; forced returns override equity only;
    rule amounts and rails; `successOdds` deterministic, in [0, 1], 1 for zero spending, 0 when `first ≥ wealth`;
    reducer: cut detection, broke, settle at `years`, equity locked, immutability; objectives per kind;
    `replayRetirement` determinism. `package.json`: `"test:retirement-desk": "node --test scripts/retirement-desk-*.test.mjs",`
    (one line, next to the other desk scripts).

## Acceptance criteria
- `npm run test:retirement-desk` passes; calibration table in Findings; engine imports nothing from React,
  i18n or `features/tvm`.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:retirement-desk && npm run test:game-kit
grep -rn "react\|i18n\|features/tvm\|Math.random\|Date.now" src/features/retirement-desk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Odds cost:** 400 paths × up to 35 years per call; what-if (plan 15) calls it ~6 times per render. Keep
  the inner loop allocation-free; no arrays per path.
- **Odds RNG** must be sub-seeded per year, or the odds jitter when the player retypes the same amount.
- **Forced returns** apply to the main path only, never inside `successOdds`.
- **Cut rule** compares with last year's *taken* amount, not the typed amount.

## Findings (fill in during execution)
- Calibration (seeds 1–20, all objectives passed). `clampG` = an "attentive player" proxy: guardrails
  clamped to 0.85–1.3× target, played through `take` actions:

  | Mission | fixed | fixedLow | pctWealth | guardrails | guardrails @40% | clampG |
  |---|---|---|---|---|---|---|
  | T1 | 13 | 17 | 3 | 9 | 9 | 17 |
  | T2 | 6 | 12 | 1 | 2 | 2 | 12 |
  | T3 | 11 | 14 | 3 | 19 | 17 | 14 |
  | T4 | 14 | 16 | 13 | 13 | 10 | 16 |
  | T5 | 11 | 13 | 9 | 9 | 9 | 13 |

  `fixed` cannot be pushed far below ~65%: in this market (60/40, real μ 3.4%, σ 10.6%) the 4% rule lasts
  30 years on ~70% of paths, and a fixed spend fails only by going broke. Limits were set so that a flexible
  rule clearly beats `fixed` on every mission. Pure `guardrails` compounds its 10% trims, so it misses the
  average-spend floors.
- Deviations:
  - Limits changed: T1 avg 34,000 (was 38,000); T2 avg 33,000 (was 34,000); T3 odds floor 0.5 (was 0.6);
    T4 avg 30,000 (was 34,000); T5 avg 34,000 (was 36,000) and legacy 300,000 (was 400,000). With the plan's
    numbers, no rule passed T1/T4/T5 on more than about half the seeds.
  - `successOdds` default rule is `"same"` (keep taking `first` every year), not `"guardrails"`. Guardrails
    can always cut, so their odds were 1.0 at any amount; the readout would never move and T3 was trivial.
    At 60% equity the default gives 92% / 85% / 71% / 46% for 30k / 35k / 40k / 50k.
    Other rules are still accepted (`SpendRule | "same"`).
  - `replayRetirement` has an optional `equity` argument (for the 40% variant). Also exported: `mixReturn`,
    `RAIL_HIGH`/`RAIL_LOW`, `BIG_YEAR`, `CUT_RATIO`, `ODDS_WARN`, `avgSpend`.
  - Odds cost about 5 ms per call (400 paths × 30 years), with no per-path arrays.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/13-retirement-engine.md`; confirm plan 01 is done. Implement
> plan 13: the pure retirement engine (returns, rules, Monte Carlo odds, reducer, objectives, policies) with
> missions T1–T5, calibration and tests (`test:retirement-desk`). Run the verification block, record
> calibration in Findings, append DONE to LOG.md, set plan 13 to `done`, and summarise. Do not stash or check out.
