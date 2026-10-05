import { mean } from "./moments";

/// Ordinary-least-squares fit of `ys ≈ slope·xs + intercept`.
export interface Regression {
  /// Fitted slope (β in a CAPM regression of excess returns).
  slope: number;
  /// Fitted intercept (Jensen's α in a CAPM regression).
  intercept: number;
  /// Coefficient of determination R² in [0, 1].
  r2: number;
}

/// Ordinary least-squares regression of `ys` on `xs`. Requires at least two equal-length points.
export function linearRegression(xs: number[], ys: number[]): Regression {
  const n = xs.length;
  if (n < 2 || ys.length !== n) {
    throw new Error("linearRegression: need at least two equal-length points");
  }
  const mx = mean(xs);
  const my = mean(ys);
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    const dx = xs[i] - mx;
    const dy = ys[i] - my;
    sxx += dx * dx;
    sxy += dx * dy;
    syy += dy * dy;
  }
  if (sxx === 0) throw new Error("linearRegression: xs has zero variance");
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = syy === 0 ? 1 : (sxy * sxy) / (sxx * syy);
  return { slope, intercept, r2 };
}
