import type { Matrix } from "../../lib/math/matrix";
import type { PortfolioMission, PortfolioState } from "./engine/portfolio.types";

/// One row of the positions table: weight, value, last month's return, return since month 0, EWMA vs calm vol, risk share.
export type PositionRow = { weight: number; value: number; month: number; sinceStart: number; vol: number; longRunVol: number; share: number };

/// Position rows for the five risky assets plus cash (last); returns are compounded over the realised months.
export function positionRows(
  state: PortfolioState,
  R: number[][],
  S: Matrix,
  mission: PortfolioMission,
  shares: number[],
  fundSize: number
): PositionRow[] {
  const realised = R.slice(0, state.month);
  const last = state.month > 0 ? R[state.month - 1] : null;
  const risky = state.w.map((w, i) => ({
    weight: w,
    value: w * state.nav * fundSize,
    month: last ? last[i] : 0,
    sinceStart: realised.reduce((acc, r) => acc * (1 + r[i]), 1) - 1,
    vol: Math.sqrt(S[i][i] * 12),
    longRunVol: mission.calm.sigma[i],
    share: shares[i],
  }));
  const cash = 1 - state.w.reduce((a, b) => a + b, 0);
  const rfMonth = mission.riskFree / 12;
  const cashRow: PositionRow = {
    weight: cash,
    value: cash * state.nav * fundSize,
    month: state.month > 0 ? rfMonth : 0,
    sinceStart: (1 + rfMonth) ** state.month - 1,
    vol: 0,
    longRunVol: 0,
    share: 0,
  };
  return [...risky, cashRow];
}

/// Last `n` realised months, oldest first, with each asset's and the fund's monthly return.
export function recentReturns(state: PortfolioState, R: number[][], n = 12) {
  const from = Math.max(0, state.month - n);
  const months = Array.from({ length: state.month - from }, (_, k) => from + k + 1);
  const assetCount = state.w.length;
  return {
    months,
    assets: Array.from({ length: assetCount }, (_, i) => months.map((m) => R[m - 1][i])),
    fund: months.map((m) => state.hist[m].rp),
  };
}
