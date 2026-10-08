export function normalPdf(x: number): number {
  return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
}

export function normalCdf(x: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);

  const p =
    1 -
    d *
      t *
      (0.3193815 +
        t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

  return x >= 0 ? p : 1 - p;
}

function getD1D2(S: number, K: number, T: number, r: number, sigma: number) {
  const sqrtT = Math.sqrt(T);
  const d1 =
    (Math.log(S / K) + (r + 0.5 * sigma * sigma) * T) / (sigma * sqrtT);
  const d2 = d1 - sigma * sqrtT;

  return { d1, d2, sqrtT };
}

export function blackScholesCall(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return Math.max(S - K, 0);
  if (S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, d2 } = getD1D2(S, K, T, r, sigma);
  return S * normalCdf(d1) - K * Math.exp(-r * T) * normalCdf(d2);
}

export function blackScholesPut(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return Math.max(K - S, 0);
  if (S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, d2 } = getD1D2(S, K, T, r, sigma);
  return K * Math.exp(-r * T) * normalCdf(-d2) - S * normalCdf(-d1);
}

export function blackScholesDelta(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return S > K ? 1 : 0;
  if (S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1 } = getD1D2(S, K, T, r, sigma);
  return normalCdf(d1);
}

export function blackScholesPutDelta(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0) return S < K ? -1 : 0;
  if (S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1 } = getD1D2(S, K, T, r, sigma);
  return normalCdf(d1) - 1;
}

export function blackScholesGamma(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, sqrtT } = getD1D2(S, K, T, r, sigma);
  return normalPdf(d1) / (S * sigma * sqrtT);
}

export function blackScholesVega(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, sqrtT } = getD1D2(S, K, T, r, sigma);
  return S * normalPdf(d1) * sqrtT;
}

export function blackScholesTheta(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, d2, sqrtT } = getD1D2(S, K, T, r, sigma);

  return (
    (-S * normalPdf(d1) * sigma) / (2 * sqrtT) -
    r * K * Math.exp(-r * T) * normalCdf(d2)
  );
}

export function blackScholesPutTheta(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d1, d2, sqrtT } = getD1D2(S, K, T, r, sigma);

  return (
    (-S * normalPdf(d1) * sigma) / (2 * sqrtT) +
    r * K * Math.exp(-r * T) * normalCdf(-d2)
  );
}

export function blackScholesRho(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d2 } = getD1D2(S, K, T, r, sigma);
  return K * T * Math.exp(-r * T) * normalCdf(d2);
}

export function blackScholesPutRho(
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  if (T <= 0 || S <= 0 || K <= 0 || sigma <= 0) return 0;

  const { d2 } = getD1D2(S, K, T, r, sigma);
  return -K * T * Math.exp(-r * T) * normalCdf(-d2);
}

export type BsMetric = "price" | "delta" | "gamma" | "vega" | "theta" | "rho";
export type BsOptionType = "call" | "put";

/// Dispatches a single Black–Scholes metric for the given option type so the
/// 2D curves and the 3D surface evaluate the exact same function.
export function evaluateMetric(
  metric: BsMetric,
  optionType: BsOptionType,
  S: number,
  K: number,
  T: number,
  r: number,
  sigma: number
): number {
  const isCall = optionType === "call";
  switch (metric) {
    case "delta":
      return isCall
        ? blackScholesDelta(S, K, T, r, sigma)
        : blackScholesPutDelta(S, K, T, r, sigma);
    case "gamma":
      return blackScholesGamma(S, K, T, r, sigma);
    case "vega":
      return blackScholesVega(S, K, T, r, sigma);
    case "theta":
      return isCall
        ? blackScholesTheta(S, K, T, r, sigma)
        : blackScholesPutTheta(S, K, T, r, sigma);
    case "rho":
      return isCall
        ? blackScholesRho(S, K, T, r, sigma)
        : blackScholesPutRho(S, K, T, r, sigma);
    case "price":
    default:
      return isCall
        ? blackScholesCall(S, K, T, r, sigma)
        : blackScholesPut(S, K, T, r, sigma);
  }
}

export interface MetricSurface {
  /// Spot grid (x axis), ascending, length `nS`.
  spots: number[];
  /// Maturity grid (z axis), ascending, length `nT`.
  maturities: number[];
  /// Row-major values indexed as `values[tIndex][sIndex]`.
  values: number[][];
  min: number;
  max: number;
}

export interface SurfaceRange {
  sMin: number;
  sMax: number;
  nS: number;
  tMin: number;
  tMax: number;
  nT: number;
}

function linspace(min: number, max: number, count: number): number[] {
  const n = Math.max(2, Math.round(count));
  return Array.from({ length: n }, (_, i) => min + (i / (n - 1)) * (max - min));
}

/// Samples a metric over a (spot × maturity) grid for 3D surface rendering.
export function buildMetricSurface(
  metric: BsMetric,
  optionType: BsOptionType,
  range: SurfaceRange,
  K: number,
  r: number,
  sigma: number
): MetricSurface {
  const spots = linspace(range.sMin, range.sMax, range.nS);
  const maturities = linspace(range.tMin, range.tMax, range.nT);

  let min = Infinity;
  let max = -Infinity;
  const values = maturities.map((T) =>
    spots.map((S) => {
      const v = evaluateMetric(metric, optionType, S, K, T, r, sigma);
      if (v < min) min = v;
      if (v > max) max = v;
      return v;
    })
  );

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    min = 0;
    max = 0;
  }

  return { spots, maturities, values, min, max };
}

export function makeMaturities(
  maxMaturity: number,
  curveCount: number
): number[] {
  const count = Math.max(2, Math.round(curveCount));
  const start = 0.01;

  return Array.from({ length: count }, (_, i) => {
    const ratio = i / (count - 1);
    return Number((start + ratio * (maxMaturity - start)).toFixed(2));
  });
}