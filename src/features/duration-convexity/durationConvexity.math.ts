import { bondPrice, convexity, macaulayDuration, modifiedDuration } from "../../lib/finance/bond";
import type {
  BondMeasures,
  BondParams,
  ErrorPoint,
  PriceChangePoint,
  ShockResult,
} from "./durationConvexity.types";

export { bondPrice, convexity, macaulayDuration, modifiedDuration };

const BP = 10000;

/// Current price plus the core interest-rate risk measures of a fixed-coupon bond.
export function bondMeasures(p: BondParams): BondMeasures {
  const price = bondPrice(p.face, p.couponRate, p.ytm, p.years, p.freq);
  const macaulay = macaulayDuration(p.face, p.couponRate, p.ytm, p.years, p.freq);
  const modified = modifiedDuration(p.face, p.couponRate, p.ytm, p.years, p.freq);
  const convex = convexity(p.face, p.couponRate, p.ytm, p.years, p.freq);
  return { price, macaulay, modified, convexity: convex, dv01: (modified * price) / BP };
}

/// Exact repricing against the duration-only and duration+convexity estimates,
/// expressed as a percentage price change over a symmetric yield band (±maxBp).
export function priceChangeCurve(
  p: BondParams,
  m: BondMeasures,
  maxBp: number,
  steps: number
): PriceChangePoint[] {
  const points: PriceChangePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const dyBp = -maxBp + (i / steps) * 2 * maxBp;
    const dy = dyBp / BP;
    const repriced = bondPrice(p.face, p.couponRate, Math.max(p.ytm + dy, 1e-6), p.years, p.freq);
    points.push({
      dyBp,
      exact: ((repriced - m.price) / m.price) * 100,
      duration: -m.modified * dy * 100,
      durConvex: (-m.modified * dy + 0.5 * m.convexity * dy * dy) * 100,
    });
  }
  return points;
}

/// Approximation error (estimate − exact, in %) across the same yield band.
export function errorCurve(
  p: BondParams,
  m: BondMeasures,
  maxBp: number,
  steps: number
): ErrorPoint[] {
  return priceChangeCurve(p, m, maxBp, steps).map((d) => ({
    dyBp: d.dyBp,
    durationError: d.duration - d.exact,
    durConvexError: d.durConvex - d.exact,
  }));
}

/// Exact and approximate price response at a single selected yield shock (in bp).
export function shockResult(p: BondParams, m: BondMeasures, dyBp: number): ShockResult {
  const dy = dyBp / BP;
  const newPrice = bondPrice(p.face, p.couponRate, Math.max(p.ytm + dy, 1e-6), p.years, p.freq);
  const exactPct = ((newPrice - m.price) / m.price) * 100;
  const durationPct = -m.modified * dy * 100;
  const durConvexPct = (-m.modified * dy + 0.5 * m.convexity * dy * dy) * 100;
  const durationErrPct = durationPct - exactPct;
  const durConvexErrPct = durConvexPct - exactPct;
  return {
    dyBp,
    exactPct,
    newPrice,
    durationPct,
    durationErrPct,
    durationErrBp: Math.abs(durationErrPct) * 100,
    durConvexPct,
    durConvexErrPct,
    durConvexErrBp: Math.abs(durConvexErrPct) * 100,
  };
}
