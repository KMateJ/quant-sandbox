import { dot, inverse, matVec, quadraticForm, type Matrix, type Vector } from "../math/matrix";

/// Expected portfolio return: weighted sum of asset expected returns (wᵀμ).
export function portfolioReturn(weights: Vector, expectedReturns: Vector): number {
  return dot(weights, expectedReturns);
}

/// Portfolio variance from weights and a covariance matrix (wᵀΣw).
export function portfolioVariance(weights: Vector, covMatrix: Matrix): number {
  return quadraticForm(weights, covMatrix);
}

/// Portfolio volatility (standard deviation): √(wᵀΣw).
export function portfolioVolatility(weights: Vector, covMatrix: Matrix): number {
  return Math.sqrt(portfolioVariance(weights, covMatrix));
}

/// Portfolio Sharpe ratio: (wᵀμ − rf) / √(wᵀΣw).
export function portfolioSharpe(
  weights: Vector,
  expectedReturns: Vector,
  covMatrix: Matrix,
  riskFree: number
): number {
  const vol = portfolioVolatility(weights, covMatrix);
  if (vol <= 0) throw new Error("portfolioSharpe: volatility must be positive");
  return (portfolioReturn(weights, expectedReturns) - riskFree) / vol;
}

/// Global minimum-variance portfolio weights: w = Σ⁻¹1 / (1ᵀΣ⁻¹1). Weights sum to 1.
export function minVarianceWeights(covMatrix: Matrix): Vector {
  const n = covMatrix.length;
  const inv = inverse(covMatrix);
  const ones: Vector = new Array<number>(n).fill(1);
  const invOnes = matVec(inv, ones);
  const denom = dot(ones, invOnes);
  if (denom === 0) throw new Error("minVarianceWeights: degenerate covariance matrix");
  return invOnes.map((x) => x / denom);
}

/// Tangency (max-Sharpe) portfolio weights: w = Σ⁻¹(μ − rf·1) / (1ᵀΣ⁻¹(μ − rf·1)). Weights sum to 1.
export function tangencyWeights(
  covMatrix: Matrix,
  expectedReturns: Vector,
  riskFree: number
): Vector {
  const n = covMatrix.length;
  if (expectedReturns.length !== n) {
    throw new Error("tangencyWeights: expectedReturns length must match covariance size");
  }
  const inv = inverse(covMatrix);
  const excess = expectedReturns.map((mu) => mu - riskFree);
  const invExcess = matVec(inv, excess);
  const ones: Vector = new Array<number>(n).fill(1);
  const denom = dot(ones, invExcess);
  if (denom === 0) throw new Error("tangencyWeights: degenerate inputs");
  return invExcess.map((x) => x / denom);
}
