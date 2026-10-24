# 07 — Rates desk engine + 5 missions

Status: done (2026-10-24) · Depends on: 01 · Suggested model: Sonnet · Est. size: L (two phases)

## Why
The rates desk teaches hedging a government bond book with note futures while the curve moves day by day:
DV01, key-rate risk, the cheapest-to-deliver bond and contract rolls. No lab has a stochastic curve path,
futures priced off a curve or key-rate DV01, so this plan builds a pure engine from existing pieces.

## Current state (verified 2026-10-23, commit `73f67d7`)
- `src/features/yield-curve/yieldCurve.math.ts` L105 `factorLoadings(t) → { level: 1, slope: (1−e^−x)/x, curvature: slope − e^−x }`
  with x = 0.6·t (Nelson–Siegel shape); `yieldCurve.types.ts` `Factors = { level; slope; curvature }`.
  Used today only as deterministic nudges on par nodes.
- `src/features/guide/guide.wave4.math.ts` from ~L157: `ZeroPoint = { t; z }`, `CashFlow = { t; cf }`,
  `CURVE_ZEROS`, `KEY_RATES = [2, 5, 10, 30]`, `zeroAt(zeros, t)` (linear), `shockCurve`, `priceOnCurve(cashflows, zeros)`,
  `curveDuration`, `keyWeight(keys, k, t)` (triangular), `keyRateDurations(cashflows, zeros, keys)` (±1 bp),
  `bulletCashflows(coupon, years)`, `barbellCashflows`. Tested by `npm run test:guide-wave4`.
- `src/features/treasury-futures/treasuryFutures.math.ts`: `generalizedConversionFactor(bond, delivery, notionalCoupon = 0.06, accruedOverride?)`
  (time-based, per 100), `cheapestBond`, `switchingPoints`; types `DeliverableBond`, `DeliveryEconomics`.
  No contract specs and no pricing from a curve.
- `src/lib/finance/immunization.ts` `pricePerFace(coupon, maturity, y)` (annual coupons, flat yield).
- `src/lib/math/matrix.ts` `inverse(m)` (Gauss–Jordan). `src/lib/math/random.ts` `makeRng`, `nextNormal`.
- Kit (plan 01): `src/lib/game/*` (`MissionBase`, `ObjectiveResult`, `GameEventBase`, `capStatus`,
  `countStatus`, `bandAtSettle`, `floorStatus`, `subSeed`).
- The canvas prototype `RatesDesk.dc.html` holds a working reference of this whole model (NS factors,
  baskets, F = min P/CF, key-rate hedge by a 3×3 solve); use it for behaviour, not code.

## Goal
1. `src/lib/finance/curveRisk.ts` holding the curve-risk helpers (moved from the guide file, which re-exports them).
2. `src/features/rates-desk/engine/` with the API below; five missions R1–R5; calibration; tests.

## Non-goals
- No React/copy/styles. No edits to yield-curve, treasury-futures or duration-convexity files (another
  pack owns them); only import their pure functions.

## Constraints
- Moving the guide helpers: copy them to `src/lib/finance/curveRisk.ts`, then make
  `guide.wave4.math.ts` import and re-export them (same names). `npm run test:guide-wave4` must pass
  unchanged. Re-read the guide file first (other sessions may have edited it).
- Engine pure, immutable updates, `///` docs.

## Steps

### Phase 1 — curve, instruments, risk (tests green before Phase 2)
1. `src/lib/finance/curveRisk.ts`: the moved helpers, plus `couponCashflows(coupon, maturity): CashFlow[]`
   (annual coupons per 100, supports fractional maturity: flows at `maturity, maturity−1, …> 0`).
2. `engine/rates.types.ts`:
   ```ts
   export type CurveFactors = { level: number; slope: number; curvature: number };
   export type FactorShock = { sigma: CurveFactors; drift: CurveFactors };   // per day, in rate units
   export type BookBond = { id: string; coupon: number; maturity: number; face: number };
   export type FutureSpec = { id: string; size: number; basket: [coupon: number, maturity: number][]; expiryDay?: number; calendarSpread?: number };
   export type RatesObjective =
     | { kind: "dv01Misses"; band: number; allowed: number }
     | { kind: "krdMisses"; limit: number; allowed: number }
     | { kind: "pnlWithin"; limit: number } | { kind: "pnlAbove"; target: number }
     | { kind: "costsBelow"; limit: number };
   export type RatesMission = MissionBase<RatesObjective> & { days: number; start: CurveFactors; shock: FactorShock;
     book: BookBond[]; futures: FutureSpec[]; opening: number[]; costPerContract: number };
   export type RatesEvent = GameEventBase & ( { kind: "start" } | { kind: "move"; d2: number; d10: number } | { kind: "fill"; future: string; qty: number; price: number; tag: "manual" | "auto" }
     | { kind: "dv01Miss"; net: number } | { kind: "krdMiss"; node: number; value: number } | { kind: "ctdSwitch"; future: string; to: number }
     | { kind: "expired"; future: string; qty: number; price: number } | { kind: "end"; pnl: number } );
   export type RatesState = { missionId: string; seed: number; day: number; contracts: number[]; futPnl: number; costs: number; traded: number;
     misses: number; krdMisses: number; book0: number; hist: { day: number; hedged: number; naked: number }[]; events: RatesEvent[]; settled: boolean };
   export type RatesAction = { type: "trade"; future: number; qty: number; tag: "manual" | "auto" } | { type: "dv01Hedge"; future: number }
     | { type: "krdHedge" } | { type: "step"; days: number } | { type: "restore"; state: RatesState };
   ```
3. `engine/curve.math.ts`: `factorPath(mission, seed): CurveFactors[]` (length `days + 1`, normal daily steps
   `drift + sigma·z` from `makeRng(seed)`), `zeroRate(f, t)` = `level + slope·L1(t) + curvature·L2(t)` using
   `factorLoadings`, `zeroGrid(f): ZeroPoint[]` on `[0.25, 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30]`,
   `bump(zeros, node | "parallel", bp)` using `keyWeight` for key nodes `[2, 5, 10, 30]`.
4. `engine/pricing.math.ts`: `bondPrice(b, zeros)` per 100 via `priceOnCurve(couponCashflows(...))`;
   `conversionFactor(coupon, maturity)` = price at a flat 6% annual yield per 1 face (use `pricePerFace`
   if it handles fractional maturities, else discount `couponCashflows` at 6%), rounded to 4 dp;
   `futureQuote(spec, zeros) → { F, ctd, prices, cfs }` with `F = min(P_i / CF_i)` (plus `calendarSpread`
   for back contracts); `futureDv01(spec, zeros)` and `futureKrd(spec, zeros)` per contract
   (`size/100 × ΔF` for +1 bp).
5. `engine/risk.math.ts`: `ratesRisk(state, mission, zeros) → { bookValue, bookDv01, futDv01, net, kBook[4], kFut[4], kNet[4] }`,
   `dv01HedgeQty(state, mission, zeros, future)`, `krdHedgeQty(state, mission, zeros): number[]` (solve the
   3×3 system: buckets 2y, 5y, 10y+30y against the first three contracts with `inverse`; skip expired
   contracts), `curveScenarios(state, mission, zeros)` (parallel ±25, steepener 2y −15/30y +15, flattener,
   belly +20 at 5y → `{ id, naked, hedged }`), `ctdSwitchBp(spec, zeros)` (smallest |parallel bp| within
   ±300 in 5 bp steps that changes the CTD, or `null`).
6. Tests Phase 1 (`scripts/rates-desk-curve.test.mjs`): curve-risk helpers identical to the guide's (guide
   test still green); key-rate DV01s sum to parallel DV01 within 1%; `F` equals the minimum of P/CF; CF of a
   6% bond ≈ 1; `krdHedgeQty` leaves |each bucket| small; determinism of `factorPath`.

### Phase 2 — book, objectives, policies, missions
7. `engine/book.math.ts`: `startRates(mission, seed)` (contracts = `opening`), `reduceRates(state, action, mission, path)`:
   `trade` (cost `|qty| × costPerContract`, `fill` event; reject trades in expired contracts), `dv01Hedge`,
   `krdHedge`, `step` (for each day: check DV01 band and key-rate limit at the close (misses + events),
   move to the next day's factors, futures P&L `Σ qty·size/100·ΔF`, log `move`, `ctdSwitch`; at a
   contract's `expiryDay` close the position at F with an `expired` event; settle at `days` with `end`),
   `restore`. `hist` records hedged (`naked + futPnl − costs`) and naked P&L each day.
8. `engine/objectives.math.ts`: `evaluateRates(mission, state, zeros)` with kit helpers; exhaustive switch.
9. `engine/policy.math.ts`: `replayRates(mission, seed, policy: "dv01Daily10Y" | "dv01Weekly10Y" | "krdDaily" | "none")`
   through `reduceRates` → `{ pnl, misses, krdMisses, traded, costs, series }`.
10. `engine/missions.data.ts` (`RATES_MISSIONS`, `ratesMissionById`); default book
    `[{2y 4.00% 20m}, {7y 4.25% 15m}, {10y 4.50% 10m}, {25y 4.75% 6m}]`; futures 2Y (size 200k, basket
    `[0.04,1.8],[0.045,1.9],[0.0375,2.0]`), 5Y (100k, `[0.04,4.2],[0.0425,4.6],[0.045,5.0]`), 10Y (100k,
    `[0.0425,6.6],[0.045,7.5],[0.0475,9.0],[0.05,9.8]`); start factors `{ level: 0.045, slope: −0.010, curvature: 0.005 }`;
    base sigma `{ level: 0.0005, slope: 0.0004, curvature: 0.0004 }`; cost 15.

    | Id | Theme | Changes from default | Objectives |
    |---|---|---|---|
    | R1 | DV01-neutral fortnight | days 20 | dv01Misses 1,000 / 2; pnlWithin 75,000; costsBelow 12,000 |
    | R2 | Survive a steepener | slope drift −0.0002/day (short rates fall vs long) | krdMisses 2,000 / 2; pnlWithin 60,000 |
    | R3 | Cheapest-to-deliver switch | level drift chosen so the 10Y CTD switches between days 8 and 12 (calibrate) | dv01Misses 1,000 / 1; pnlWithin 50,000 |
    | R4 | Put on a curve trade | empty book; slope drift −0.00015/day | dv01Misses 1,000 / 2; pnlAbove +15,000; costsBelow 8,000 |
    | R5 | Roll the hedge | futures: 2Y, 5Y, 10Y front (`expiryDay: 10`), 10Y back (`calendarSpread: −0.15`); `opening` short front contracts sized to hedge DV01 | dv01Misses 1,000 / 1; costsBelow 15,000 |

11. Calibration: run the four policies for seeds 1–20 per mission; record pass rates; adjust drifts or
    limits so each mission is winnable with a sensible strategy and not passed by `none`. Record R3's level
    drift and the switch day distribution.
12. Tests Phase 2 (`scripts/rates-desk-engine.test.mjs`): accounting (`hedged = naked + futPnl − costs`
    each day); `dv01Hedge` brings |net| < one contract's DV01; R5 auto-closes the front contract at day 10
    with an `expired` event; R3 logs a `ctdSwitch` on the calibrated seed; objectives per kind; policy
    replays deterministic; immutability. `package.json`: `"test:rates-desk": "node --test scripts/rates-desk-*.test.mjs",`.

## Acceptance criteria
- `npm run test:rates-desk` and `npm run test:guide-wave4` pass; `guide.wave4.math.ts` exports the same names.
- Findings hold the calibration table and R3 drift.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:rates-desk && npm run test:guide-wave4 && npm run test:game-kit
grep -rn "react\|i18n" src/features/rates-desk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Slope sign:** `L1(t)` is ≈1 at the short end and → 0 at the long end, so a *negative* change in the
  slope factor lowers short rates relative to long rates: a steepener.
- **CTD switching** makes F piecewise: compute DV01 and key-rate DV01 by re-pricing the whole basket under
  the bump (take the min again), never by holding the CTD fixed.
- **Expired contracts** must drop out of the key-rate solve, or the 3×3 system becomes singular.
- **Units:** DV01 in dollars for +1 bp; futures P&L uses `size/100` because F is per 100.

## Findings (fill in during execution)
- Calibration (seeds 1–20 × policies; passes out of 20):

  | Mission | dv01Daily10Y | dv01Weekly10Y | krdDaily | none | Notes |
  |---|---|---|---|---|---|
  | R1 | 19 | 19 | 0 (costs ~46k) | 0 | |
  | R2 | 0 | 0 | 15 | 0 | pnlWithin widened 60k → 100k: the key-rate hedge trades ~3,000 contracts (5Y/10Y futures nearly collinear), ~46k costs |
  | R3 | 15 | 8 | 9 | 0 | |
  | R4 | 0 | 0 | 0 | 0 | intended: needs a curve trade. Long 100 2Y + DV01-neutral 10Y short, re-neutralised daily: 14/20 (80 lots 11/20, 60 lots 9/20) |
  | R5 | 20 | 20 | 0 | 0 | roll is easy for a 10Y DV01 rule (owner may want a tighter cost limit) |
- R3 level drift and switch days: start level raised 0.045 → 0.055 (10Y CTD switch then +50 bp away instead of +150) and level drift +0.0003/day. 10Y CTD switch day on seeds 1–20 (no hedging): 16,12,–,12,10,4,11,17,8,9,–,–,16,19,13,20,10,20,–,15 (median ≈ 12; seed 5 → day 10, used in the test). A 15 bp/day drift would be needed at the default level.
- Deviations:
  - The curve-shock helpers (`shockCurve`, `shockReturn`, `CURVE_ZEROS`) stay in the guide file because they depend on the yield-curve feature; only the pure helpers moved to `src/lib/finance/curveRisk.ts`, and the guide re-exports them under the same names.
  - Key-rate misses are checked on the hedgeable buckets 2y / 5y / 10y+30y (the same buckets `krdHedgeQty` solves). Per-node checks failed every day because no contract hedges the 30y node. `krdMiss.node` is a bucket index.
  - Futures use clean prices (`cleanPrice` = full − accrued) for both P and CF, so a 6% bond has CF ≈ 1 at fractional maturities. Book values stay dirty (full). Conversion factors use their own 6% flat discount instead of `generalizedConversionFactor` (which needs delivery dates).
  - Steepener and flattener scenarios move all four key rates linearly (−15/−5/+5/+15 bp) instead of only 2y and 30y.
  - Maturities do not roll down day by day (20-day missions; no carry or roll-down in P&L).
  - Extra exports: `GRID`, `shiftKeys`, `accrued`, `cleanPrice`, `bondValue`, `bookValue`, `isExpired`, `bucketsOf`, `hedgedPnl`, `tenYearContract`; `objectiveLimits` lives in `engine/limits.math.ts` to avoid a book ↔ objectives import cycle. `startRates(mission, seed, path)` takes the path (for `book0`). R5 opening is −481 front 10Y contracts (DV01 hedge at day 0).

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/07-rates-engine.md`; confirm plan 01 is done. Implement plan
> 07 in two phases: move the curve-risk helpers to `src/lib/finance/curveRisk.ts` (guide re-exports), then
> the pure rates engine with missions R1–R5, calibration and tests (`test:rates-desk`). Run the verification
> block, record calibration in Findings, append DONE (and CONTRACT if the API differs) to LOG.md, set plan 07
> to `done`, and summarise.
