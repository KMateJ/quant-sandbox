import { covariance, varianceSample } from "../stats/moments";
import { linearRegression, type Regression } from "../stats/regression";

/// Sharpe ratio: risk-adjusted excess return (E[r] − rf) / σ.
export function sharpeRatio(
  expectedReturn: number,
  riskFree: number,
  volatility: number
): number {
  if (volatility <= 0) throw new Error("sharpeRatio: volatility must be positive");
  return (expectedReturn - riskFree) / volatility;
}

/// Market beta of an asset: Cov(asset, market) / Var(market).
export function beta(assetReturns: number[], marketReturns: number[]): number {
  const varM = varianceSample(marketReturns);
  if (varM === 0) throw new Error("beta: market returns have zero variance");
  return covariance(assetReturns, marketReturns) / varM;
}

/// CAPM expected return: rf + β·(E[rm] − rf).
export function capmExpectedReturn(
  riskFree: number,
  assetBeta: number,
  marketReturn: number
): number {
  return riskFree + assetBeta * (marketReturn - riskFree);
}

/// Jensen's alpha: realised return minus the CAPM-predicted return.
export function jensenAlpha(
  actualReturn: number,
  riskFree: number,
  assetBeta: number,
  marketReturn: number
): number {
  return actualReturn - capmExpectedReturn(riskFree, assetBeta, marketReturn);
}

/// Estimate β (slope) and α (intercept) by OLS of asset excess returns on market excess returns.
/// `slope` is β, `intercept` is Jensen's α per period.
export function capmRegression(
  assetReturns: number[],
  marketReturns: number[],
  riskFree = 0
): Regression {
  const n = assetReturns.length;
  if (marketReturns.length !== n) {
    throw new Error("capmRegression: series must be equal length");
  }
  const xMarket = marketReturns.map((r) => r - riskFree);
  const yAsset = assetReturns.map((r) => r - riskFree);
  return linearRegression(xMarket, yAsset);
}
