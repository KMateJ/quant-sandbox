const SQRT_2PI = Math.sqrt(2 * Math.PI);
const SQRT_2 = Math.SQRT2;

/// Standard normal probability density function φ(x).
export function normPdf(x: number): number {
  return Math.exp((-x * x) / 2) / SQRT_2PI;
}

/// Error function approximation (Abramowitz–Stegun 7.1.26), max abs error ~1.5e-7.
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

/// Standard normal cumulative distribution function Φ(x), max abs error ~1e-7.
/// Sanity checks: Φ(0) = 0.5, Φ(1.96) ≈ 0.975.
export function normCdf(x: number): number {
  return 0.5 * (1 + erf(x / SQRT_2));
}

const A = [
  -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
  1.38357751867269e2, -3.066479806614716e1, 2.506628277459239e0,
];
const B = [
  -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
  6.680131188771972e1, -1.328068155288572e1,
];
const C = [
  -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838e0,
  -2.549732539343734e0, 4.374664141464968e0, 2.938163982698783e0,
];
const D = [
  7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996e0,
  3.754408661907416e0,
];
const P_LOW = 0.02425;
const P_HIGH = 1 - P_LOW;

/// Inverse standard normal CDF (quantile) via Acklam's algorithm, abs error ~1.15e-9.
/// Returns -Infinity for p <= 0 and +Infinity for p >= 1.
export function normInv(p: number): number {
  if (Number.isNaN(p)) return NaN;
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;

  let x: number;
  if (p < P_LOW) {
    const q = Math.sqrt(-2 * Math.log(p));
    x =
      (((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
      ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  } else if (p <= P_HIGH) {
    const q = p - 0.5;
    const r = q * q;
    x =
      ((((((A[0] * r + A[1]) * r + A[2]) * r + A[3]) * r + A[4]) * r + A[5]) * q) /
      (((((B[0] * r + B[1]) * r + B[2]) * r + B[3]) * r + B[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x =
      -(((((C[0] * q + C[1]) * q + C[2]) * q + C[3]) * q + C[4]) * q + C[5]) /
      ((((D[0] * q + D[1]) * q + D[2]) * q + D[3]) * q + 1);
  }

  // One Halley refinement step to reach full double precision.
  const e = normCdf(x) - p;
  const u = e * SQRT_2PI * Math.exp((x * x) / 2);
  x = x - u / (1 + (x * u) / 2);
  return x;
}
