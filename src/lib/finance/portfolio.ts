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

/// Equal-risk-contribution weights (sum 1) by cyclical coordinate descent from inverse-vol weights: each xᵢ solves
/// Σᵢᵢxᵢ² + xᵢΣⱼ≠ᵢΣᵢⱼxⱼ = 1/n, whose positive root always exists, so negative correlations cannot break it.
export function riskParityWeights(covMatrix: Matrix, iterations = 200): Vector {
  const n = covMatrix.length;
  const x: Vector = covMatrix.map((row, i) => 1 / Math.sqrt(row[i]));
  for (let k = 0; k < iterations; k++) {
    for (let i = 0; i < n; i++) {
      const a = covMatrix[i][i];
      const c = covMatrix[i].reduce((acc, s, j) => (j === i ? acc : acc + s * x[j]), 0);
      x[i] = (-c + Math.sqrt(c * c + (4 * a) / n)) / (2 * a);
    }
  }
  const total = x.reduce((a, b) => a + b, 0);
  return x.map((v) => v / total);
}

/// Scales risky `weights` so annualised volatility √(wᵀΣw·periodsPerYear) hits `targetVol`; the total is capped at 1, the rest is cash.
export function scaleToVol(weights: Vector, covMatrix: Matrix, targetVol: number, periodsPerYear = 12): Vector {
  const vol = Math.sqrt(portfolioVariance(weights, covMatrix) * periodsPerYear);
  if (vol <= 0) return weights.slice();
  const scaled = weights.map((w) => (w * targetVol) / vol);
  const total = scaled.reduce((a, b) => a + b, 0);
  return total > 1 ? scaled.map((w) => w / total) : scaled;
}
