import { quadraticForm, type Matrix } from "../../../lib/math/matrix";
import { mean, stdDev } from "../../../lib/stats/moments";
import { frontierCurve, riskContributions } from "../../portfolio-lab/portfolioLab.math";
import type { FrontierPoint } from "../../portfolio-lab/portfolioLab.types";
import type { PortfolioHistPoint, PortfolioMission } from "./portfolio.types";

/// 60/40 benchmark weights over the five risky assets (60% EQ, 40% GOV).
export const BENCH_WEIGHTS = [0.6, 0, 0.4, 0, 0];

/// Annualised ex-ante volatility √(12·wᵀSw) of risky weights `w` under monthly covariance `S`.
export function exAnteVol(w: number[], S: Matrix): number {
  return Math.sqrt(Math.max(0, quadraticForm(w, S)) * 12);
}

/// Each risky asset's share of portfolio variance (cash carries none).
export function riskShares(w: number[], S: Matrix): number[] {
  return riskContributions(w, S);
}

/// Ex-ante Sharpe ratio from calm drifts: Σwᵢ(μᵢ − rf) / vol; 0 when the book is all cash.
export function exAnteSharpe(w: number[], S: Matrix, mission: PortfolioMission): number {
  const vol = exAnteVol(w, S);
  if (vol <= 0) return 0;
  return w.reduce((acc, wi, i) => acc + wi * (mission.calm.mu[i] - mission.riskFree), 0) / vol;
}

/// Annualised ex-ante tracking error of `w` against benchmark weights `bench`.
export function trackingError(w: number[], bench: number[], S: Matrix): number {
  return exAnteVol(w.map((wi, i) => wi - bench[i]), S);
}

const fundReturns = (hist: PortfolioHistPoint[]) => hist.slice(1).map((h) => h.rp);
const benchReturns = (hist: PortfolioHistPoint[]) => hist.slice(1).map((h) => h.rb);

/// Annualised realised volatility of the fund's monthly returns; 0 with fewer than two months.
export function realizedVol(hist: PortfolioHistPoint[]): number {
  const r = fundReturns(hist);
  return r.length < 2 ? 0 : stdDev(r) * Math.sqrt(12);
}

/// Annualised realised Sharpe ratio of monthly returns `r`; 0 with fewer than two months or no volatility.
export function realizedSharpe(r: number[], riskFree: number): number {
  if (r.length < 2) return 0;
  const sd = stdDev(r);
  return sd > 0 ? (mean(r) * 12 - riskFree) / (sd * Math.sqrt(12)) : 0;
}

/// Realised Sharpe of the fund minus that of the 60/40 benchmark.
export function sharpeEdge(hist: PortfolioHistPoint[], riskFree: number): number {
  return realizedSharpe(fundReturns(hist), riskFree) - realizedSharpe(benchReturns(hist), riskFree);
}

/// Long/short efficient frontier on calm drifts and the annualised current risk model.
export function frontier(S: Matrix, mission: PortfolioMission, steps = 40): FrontierPoint[] {
  return frontierCurve(mission.calm.mu, S.map((row) => row.map((s) => s * 12)), steps);
}

/// Current risk-model correlation minus calm correlation, entry by entry.
export function corrChange(S: Matrix, mission: PortfolioMission): number[][] {
  return S.map((row, i) => row.map((s, j) => s / Math.sqrt(S[i][i] * S[j][j]) - mission.calm.corr[i][j]));
}
