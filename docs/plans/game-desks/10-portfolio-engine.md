# 10 — Portfolio desk engine + 5 missions

Status: done (2026-10-24) · Depends on: 01 · Suggested model: Sonnet · Est. size: M

## Why
The portfolio manager desk runs a multi-asset fund at a 10% volatility target through 36 monthly returns,
with a hidden stress regime and a risk model that only learns from the past. Nothing in `src` simulates
correlated monthly returns, EWMA risk, risk parity or volatility targeting yet.

## Current state (verified 2026-10-23, commit `73f67d7`)
- `src/features/portfolio-lab/portfolioLab.math.ts`: `covFromCorr(sigmas, corr)` L36, `portfolioMetrics(w, mus, cov, riskFree)` L136,
  `frontierCurve(mus, cov, steps)` L207 (closed form, long/short), `riskContributions(weights, cov)` L259
  (percent shares summing to 1), `normalize` L124, `maxSharpeWeights` L183. Its universe (`DEFAULT_ASSETS`:
  AAPL, MSFT, AMZN, GOOGL, TLT) and `PortfolioUniverseContext` are the lab's; **do not use them** (the desk has
  its own asset classes and must not change the lab's shared state).
- `src/lib/finance/portfolio.ts`: `portfolioReturn`, `portfolioVariance`, `portfolioVolatility`,
  `portfolioSharpe`, `minVarianceWeights`, `tangencyWeights`. `src/lib/math/matrix.ts`: `inverse`,
  `quadraticForm`, and (plan 01) `cholesky`. `src/lib/math/random.ts`: `makeRng`, `nextNormal`.
  `src/lib/stats/moments.ts`: `mean`, `stdDev` (sample).
- Kit (plan 01): `src/lib/game/*` (`MissionBase`, `ObjectiveResult`, `GameEventBase`, `capStatus`,
  `countStatus`, `bandAtSettle`, `subSeed`).
- Canvas prototype `PortfolioDesk.dc.html` contains the reference model (numbers below come from it).

## Goal
1. Additive `riskParityWeights` and `scaleToVol` in `src/lib/finance/portfolio.ts`.
2. `src/features/portfolio-desk/engine/` with the API below; missions P1–P5; calibration; tests.

## Non-goals
- No React/copy/styles; no edits to portfolio-lab or efficient-frontier files.

## Constraints
- Pure, immutable, `///` docs. Annual inputs, monthly simulation (`/12`, `/√12`).

## Steps
1. `src/lib/finance/portfolio.ts` (append): `riskParityWeights(cov: number[][], iterations = 200): number[]`
   (equal risk contribution by fixed-point iteration on inverse-vol start, normalised to sum 1) and
   `scaleToVol(weights, cov, targetVol, periodsPerYear = 12): number[]` (scales risky weights down to the
   target; never above a total of 1; the rest is cash). Unit tests in `scripts/portfolio-desk-lib.test.mjs`.
2. `engine/portfolio.types.ts`:
   ```ts
   export type AssetClass = { id: "EQ" | "EM" | "GOV" | "CRD" | "GOLD"; mu: number; sigma: number };
   export type Regime = { mu: number[]; sigma: number[]; corr: number[][] };
   export type PortfolioObjective =
     | { kind: "realizedVolBand"; lo: number; hi: number } | { kind: "maxDrawdown"; limit: number }
     | { kind: "costsBelow"; limitBp: number } | { kind: "riskShareMisses"; limit: number; allowed: number }
     | { kind: "beatBenchmarkSharpe" };
   export type PortfolioMission = MissionBase<PortfolioObjective> & { months: number; calm: Regime; stress: Regime;
     stressStart: number | "random"; stressLength: number; start: number[]; target: number; riskFree: number; costBp: number; lambda: number };
   export type PortfolioEvent = GameEventBase & ( { kind: "start" } | { kind: "rebalance"; turnover: number; vol: number; tag: "manual" | "auto" }
     | { kind: "bigMonth"; fund: number; eq: number; gov: number } | { kind: "drawdown"; dd: number }
     | { kind: "shareMiss"; asset: string; share: number } | { kind: "end"; nav: number; bench: number } );
   export type PortfolioState = { missionId: string; seed: number; month: number; w: number[]; nav: number; bench: number; peak: number;
     mdd: number; costs: number; shareMisses: number; hist: { m: number; nav: number; bench: number; dd: number; rp: number; rb: number }[];
     events: PortfolioEvent[]; settled: boolean };
   export type PortfolioAction = { type: "rebalance"; targets: number[]; tag: "manual" | "auto" } | { type: "scaleToTarget" }
     | { type: "riskParity" } | { type: "step"; months: number } | { type: "restore"; state: PortfolioState };
   ```
3. `engine/market.math.ts`: `monthlyReturns(mission, seed) → { R: number[][]; stressStart: number }`
   (`stressStart` drawn with `makeRng(subSeed(seed, 1))` in [10, 25] when `"random"`; returns
   `exp(μ/12 − σ²/24 + (L z)_i) − 1` with `L = cholesky(covFromCorr(σ/√12, corr))` for the active regime,
   `z` from `makeRng(seed)` drawn in month order); `ewmaCov(mission, R, upTo)` (start from the calm monthly
   covariance, `S ← λS + (1−λ) r rᵀ`).
4. `engine/risk.math.ts`: `exAnteVol(w, S)` (annualised), `riskShares(w, S)` (via `riskContributions`),
   `exAnteSharpe(w, S, mission)`, `trackingError(w, bench, S)`, `realizedVol(hist)`, `frontier(S, mission)`
   (via `frontierCurve` on annualised `S`), `corrChange(S, mission)` (EWMA correlation minus calm).
5. `engine/book.math.ts`: `startPortfolio(mission, seed)`, `reducePortfolio(state, action, mission, R)`:
   rebalance cost `costBp/1e4 × NAV × Σ|Δw|/2` (cash counts), `scaleToTarget` = `scaleToVol(w, S, target)`,
   `riskParity` = `scaleToVol(riskParityWeights(S), S, target)`; `step`: fund return `Σ w r + cash·rf/12`,
   weights drift, 60/40 benchmark (60% EQ, 40% GOV, rebalanced monthly), peak and drawdown, events
   (`bigMonth` when |fund| > 3%, `drawdown` when crossing −10%), quarter-end risk-share check (months
   3, 6, …), `end` at `months`; `restore`.
6. `engine/objectives.math.ts`: `evaluatePortfolio(mission, state)`: realized vol needs ≥ 2 months
   (onTrack before), Sharpe uses `riskFree`; kit helpers; exhaustive switch.
7. `engine/policy.math.ts`: `replayPortfolio(mission, seed, "scaleQuarterly" | "parityMonthly" | "sixtyForty" | "buyHold")` via the reducer.
8. `engine/missions.data.ts` (`PORTFOLIO_MISSIONS`, `portfolioMissionById`). Defaults: calm μ
   `[0.07, 0.09, 0.035, 0.045, 0.04]`, σ `[0.16, 0.22, 0.06, 0.08, 0.15]`, corr
   `[[1,.75,-.2,.55,.05],[.75,1,-.1,.55,.15],[-.2,-.1,1,.3,.2],[.55,.55,.3,1,.1],[.05,.15,.2,.1,1]]`;
   stress μ `[-0.25,-0.35,0.06,-0.1,0.08]`, σ `[0.28,0.38,0.08,0.14,0.18]`, corr
   `[[1,.9,-.4,.8,0],[.9,1,-.3,.8,.1],[-.4,-.3,1,.1,.3],[.8,.8,.1,1,0],[0,.1,.3,0,1]]`; months 36; stress length 6;
   start `[0.55, 0.20, 0.10, 0.10, 0.05]`; target 0.10; rf 0.02; cost 10 bp; λ 0.85.

   | Id | Theme | Changes | Objectives |
   |---|---|---|---|
   | P1 | Hold the vol target | – | realizedVolBand 8.5–11.5%; maxDrawdown 15%; costsBelow 40 bp |
   | P2 | Risk parity | – | riskShareMisses 30% / 1; realizedVolBand 8.5–11.5% |
   | P3 | Correlation spike | `stressStart: 12` (announced in the briefing) | maxDrawdown 10%; realizedVolBand 7–11.5% |
   | P4 | Turnover budget | – | costsBelow 15 bp; realizedVolBand 8.5–11.5% |
   | P5 | Beat the 60/40 | – | beatBenchmarkSharpe; maxDrawdown 20% |

9. Calibration: run the four policies for seeds 1–20 per mission; record pass rates; adjust limits so each
   mission is winnable but not by `buyHold`.
10. Tests `scripts/portfolio-desk-engine.test.mjs`: Cholesky-generated returns reproduce the target
    correlation within sampling error over 20,000 draws; determinism; stress window placement; cost
    formula; `scaleToTarget` hits 10% ex-ante; `riskParity` shares within 1% of equal; drawdown tracking;
    objectives per kind; policy replay determinism; immutability.
    `package.json`: `"test:portfolio-desk": "node --test scripts/portfolio-desk-*.test.mjs",`.

## Acceptance criteria
- `npm run test:portfolio-desk` and `npm run test:portfolio-labs` pass; Findings hold the calibration table.

## Verification
```bash
npx tsc -b && npm run lint && npm run test:portfolio-desk && npm run test:portfolio-labs && npm run test:game-kit
grep -rn "react\|i18n\|PortfolioUniverse" src/features/portfolio-desk/engine && echo LEAK || echo pure
```

## Pitfalls
- **Cash in risk maths:** pass only the five risky weights to `riskContributions` and covariance maths;
  cash has zero variance.
- **Stress RNG:** draw `stressStart` from a sub-seeded RNG so changing the window never shifts the returns.
- **EWMA uses realised returns only up to the current month** (no look-ahead); test it.

## Findings (fill in during execution)
- Calibration (seeds 1–20, full passes / 20; per-objective passes in brackets):

  | Mission | scaleQuarterly | parityMonthly | sixtyForty | buyHold |
  |---|---|---|---|---|
  | P1 | 8 [13,12,20] | 2 [2,19,20] | 11 [14,12,20] | 1 [1,7,20] |
  | P2 | 0 [0,6] | 16 [17,19] | 0 [0,11] | 0 [0,0] |
  | P3 | 2 [3,14] | 14 [15,19] | 6 [6,15] | 1 [3,2] |
  | P4 | 8 [10,13] | 0 [0,2] | 14 [20,14] | 1 [20,1] |
  | P5 | 5 [8,12] | 12 [12,20] | 0 [0,15] | 5 [9,10] |
- Limits changed from the table (owner to review): P1 maxDrawdown 15% → **18%**; P2 vol band 8.5–11.5% →
  **6–11%** and allowed misses 1 → **2** (unlevered risk parity realises only ~7% vol, so 8.5% was unreachable);
  P3 maxDrawdown 10% → **12%**, vol band low 7% → **6%**. P5 "beat" is strict (edge > 1e-6), otherwise the
  60/40 policy itself passed with an edge of exactly 0.
- Deviations: `riskParityWeights` uses cyclical coordinate descent (positive root of Σᵢᵢxᵢ² + cᵢxᵢ = 1/n)
  instead of the plain fixed-point iteration, which produced NaN when a marginal risk turned negative under
  EWMA stress correlations. Extra exports: `monthlyCov`, `stressStartFor`, `inStress`, `realizedSharpe`,
  `sharpeEdge`, `BENCH_WEIGHTS`, `turnoverOf`, `shareLimit`, `PORTFOLIO_POLICIES`, `PORTFOLIO_ASSETS`,
  type `PortfolioHistPoint`, `PortfolioPath`. Quarter-end share check uses the mission's `riskShareMisses`
  limit, else 30%. Costs are reported in bp of the opening NAV.

## Prompt to hand off
> You are working in the Quant Sandbox repo. Read `CLAUDE.md`, `docs/plans/game-desks/README.md` (sections
> 2 and 4), `LOG.md` and `docs/plans/game-desks/10-portfolio-engine.md`; confirm plan 01 is done. Implement
> plan 10: `riskParityWeights`/`scaleToVol` in `src/lib/finance/portfolio.ts`, the pure portfolio engine with
> missions P1–P5, calibration and tests (`test:portfolio-desk`). Run the verification block, record
> calibration in Findings, append DONE to LOG.md, set plan 10 to `done`, and summarise.
