import { linearInterp } from "../math/interpolate";

/// Bootstrap annual discount factors from par (coupon) yields for maturities 1…n years.
/// Assumes annual coupons, bonds priced at par, and `parRates[i]` is the par yield at year `i + 1`.
export function bootstrapDiscountFactors(parRates: number[]): number[] {
  const n = parRates.length;
  const df = new Array<number>(n);
  let cumDf = 0;
  for (let i = 0; i < n; i++) {
    const c = parRates[i];
    df[i] = (1 - c * cumDf) / (1 + c);
    cumDf += df[i];
  }
  return df;
}

/// Annual-compounded spot (zero) rate implied by a discount factor at time `t`: DF^(−1/t) − 1.
export function spotFromDiscountFactor(df: number, t: number): number {
  if (df <= 0 || t <= 0) throw new Error("spotFromDiscountFactor: df and t must be positive");
  return Math.pow(df, -1 / t) - 1;
}

/// Discount factor for an annual-compounded spot rate `r` at time `t`: 1 / (1 + r)^t.
export function discountFactorFromSpot(r: number, t: number): number {
  return 1 / Math.pow(1 + r, t);
}

/// Bootstrap the annual spot-rate curve from par yields for maturities 1…n years.
/// Returns spot rates aligned to `times` (defaults to 1, 2, …, n).
export function bootstrapSpotRates(parRates: number[], times?: number[]): number[] {
  const df = bootstrapDiscountFactors(parRates);
  const ts = times ?? parRates.map((_, i) => i + 1);
  if (ts.length !== df.length) {
    throw new Error("bootstrapSpotRates: times length must match parRates length");
  }
  return df.map((d, i) => spotFromDiscountFactor(d, ts[i]));
}

/// Linearly interpolate a spot rate at maturity `t` from a known curve (`times`, `spots`).
/// Clamps to the nearest endpoint outside the curve's range.
export function interpolateSpotRate(
  times: number[],
  spots: number[],
  t: number
): number {
  return linearInterp(times, spots, t);
}
