import { inverse, matMul, matVec, transpose } from "../math/matrix";

/// Result of a multiple regression. With an intercept, `coef[0]` is the intercept and the
/// rest follow the order of the regressor columns; `se` and `t` use the same order.
export interface OlsResult {
  coef: number[];
  /// Standard errors √(σ²·diag((XᵀX)⁻¹)).
  se: number[];
  /// t-statistics `coef / se`.
  t: number[];
  r2: number;
  adjR2: number;
  /// Residual standard deviation √(RSS / (n − k)).
  sigma: number;
  residuals: number[];
  fitted: number[];
  n: number;
  /// Number of estimated coefficients (including the intercept).
  k: number;
}

/// Ordinary least squares of `y` on the regressor `columns` (each as long as `y`), with an
/// intercept unless `intercept` is false. Throws when n ≤ k or XᵀX is singular.
export function ols(y: number[], columns: number[][], intercept = true): OlsResult {
  const n = y.length;
  if (columns.some((c) => c.length !== n)) throw new Error("ols: columns must match y in length");
  const k = columns.length + (intercept ? 1 : 0);
  if (k === 0) throw new Error("ols: no regressors");
  if (n <= k) throw new Error("ols: need more observations than coefficients");

  const cols = intercept ? [new Array<number>(n).fill(1), ...columns] : columns;
  const x = transpose(cols);
  const xt = cols;
  const xtxInv = inverse(matMul(xt, x));
  const coef = matVec(xtxInv, matVec(xt, y));

  const fitted = matVec(x, coef);
  const residuals = y.map((v, i) => v - fitted[i]);
  const rss = residuals.reduce((s, e) => s + e * e, 0);
  const ybar = y.reduce((s, v) => s + v, 0) / n;
  const tss = y.reduce((s, v) => s + (v - ybar) ** 2, 0);
  const sigma2 = rss / (n - k);
  const se = coef.map((_, i) => Math.sqrt(sigma2 * xtxInv[i][i]));
  const t = coef.map((c, i) => (se[i] > 0 ? c / se[i] : 0));
  const r2 = tss > 0 ? 1 - rss / tss : 0;
  const dfTotal = intercept ? n - 1 : n;
  const adjR2 = tss > 0 ? 1 - (rss / (n - k)) / (tss / dfTotal) : 0;
  return { coef, se, t, r2, adjR2, sigma: Math.sqrt(sigma2), residuals, fitted, n, k };
}
