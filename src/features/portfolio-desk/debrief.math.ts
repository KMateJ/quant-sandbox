import type { PortfolioMission, PortfolioState } from "./engine/portfolio.types";
import { replayPortfolio, PORTFOLIO_POLICIES, type PortfolioPolicy } from "./engine/policy.math";
import { realizedVol } from "./engine/risk.math";

/// NAV change split into each asset class, cash interest and trading costs (all in NAV units, base 1).
export type Attribution = { assets: number[]; cash: number; costs: number; total: number };

/// Start-of-month NAV (after costs) × weights held × month returns per asset, plus cash at rf/12, minus costs; sums exactly to NAV − 1.
export function attribution(state: PortfolioState, R: number[][], mission: PortfolioMission): Attribution {
  const assets = state.w.map(() => 0);
  let cash = 0;
  for (let k = 1; k < state.hist.length; k++) {
    const { nav, rp, w } = state.hist[k];
    // NAV the month started from, after any rebalance cost paid at its start.
    const nav0 = nav / (1 + rp);
    w.forEach((wi, i) => {
      assets[i] += nav0 * wi * R[k - 1][i];
    });
    cash += (nav0 * (1 - w.reduce((a, b) => a + b, 0)) * mission.riskFree) / 12;
  }
  return { assets, cash, costs: -state.costs, total: state.nav - 1 };
}

export type PolicyRow = { policy: PortfolioPolicy | "you"; nav: number; vol: number; mdd: number; costsBp: number };

const rowOf = (policy: PolicyRow["policy"], s: PortfolioState): PolicyRow => ({
  policy,
  nav: s.nav,
  vol: realizedVol(s.hist),
  mdd: s.mdd,
  costsBp: s.costs * 1e4,
});

/// The four simple policies replayed on the same path, then the player's run.
export function policyRows(mission: PortfolioMission, seed: number, own: PortfolioState): PolicyRow[] {
  return [...PORTFOLIO_POLICIES.map((p) => rowOf(p, replayPortfolio(mission, seed, p))), rowOf("you", own)];
}
