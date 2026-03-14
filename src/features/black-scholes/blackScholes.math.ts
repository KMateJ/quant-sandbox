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