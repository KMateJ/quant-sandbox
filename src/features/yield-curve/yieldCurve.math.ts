import { bootstrapSpotRates } from "../../lib/finance/yieldcurve";
import type { YieldCurvePoint } from "./yieldCurve.types";

/// Par (coupon) yields for maturities 1…`maturities`, shaped by a level, slope and curvature.
/// `base` is the 1-year yield, `slope` the long-minus-short spread, `curvature` a mid-curve hump.
export function parRateCurve(
  base: number,
  slope: number,
  curvature: number,
  maturities: number
): number[] {
  const rates: number[] = [];
  for (let t = 1; t <= maturities; t++) {
    const x = maturities > 1 ? (t - 1) / (maturities - 1) : 0;
    rates.push(base + slope * x + curvature * Math.sin(Math.PI * x));
  }
  return rates;
}

/// Full yield curve: par yields plus the bootstrapped annual spot-rate curve, by maturity.
export function yieldCurve(
  base: number,
  slope: number,
  curvature: number,
  maturities: number
): YieldCurvePoint[] {
  const par = parRateCurve(base, slope, curvature, maturities);
  const spot = bootstrapSpotRates(par);
  return par.map((p, i) => ({ t: i + 1, par: p, spot: spot[i] }));
}
