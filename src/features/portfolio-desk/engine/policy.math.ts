import { reducePortfolio, startPortfolio } from "./book.math";
import { monthlyReturns } from "./market.math";
import { BENCH_WEIGHTS } from "./risk.math";
import type { PortfolioAction, PortfolioMission, PortfolioState } from "./portfolio.types";

export type PortfolioPolicy = "scaleQuarterly" | "parityMonthly" | "sixtyForty" | "buyHold";
export const PORTFOLIO_POLICIES: readonly PortfolioPolicy[] = ["scaleQuarterly", "parityMonthly", "sixtyForty", "buyHold"];

function policyAction(policy: PortfolioPolicy, month: number): PortfolioAction | null {
  switch (policy) {
    case "scaleQuarterly":
      return month % 3 === 0 ? { type: "scaleToTarget" } : null;
    case "parityMonthly":
      return { type: "riskParity" };
    case "sixtyForty":
      return { type: "rebalance", targets: BENCH_WEIGHTS, tag: "auto" };
    case "buyHold":
      return null;
  }
}

/// Plays a whole mission with a fixed rule through the reducer; same mission + seed ⇒ same book.
export function replayPortfolio(mission: PortfolioMission, seed: number, policy: PortfolioPolicy): PortfolioState {
  const { R } = monthlyReturns(mission, seed);
  let s = startPortfolio(mission, seed);
  while (!s.settled) {
    const a = policyAction(policy, s.month);
    if (a) s = reducePortfolio(s, a, mission, R);
    s = reducePortfolio(s, { type: "step", months: 1 }, mission, R);
  }
  return s;
}
