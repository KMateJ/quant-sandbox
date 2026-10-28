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

// #region Predict rounds and the equal-duration twin

/// Zero-coupon maturity (years) whose modified duration at `ytm` with `freq` equals `dMod`.
export function zeroWithDuration(dMod: number, ytm: number, freq: number): number {
  return dMod * (1 + ytm / freq);
}

/// Exact price change (%) of a zero-coupon bond of `years` (any real, i.e. a fractional period count) for a shock in bp.
export function zeroPriceChangePct(years: number, ytm: number, freq: number, dyBp: number): number {
  const n = years * freq;
  const ratio = (1 + ytm / freq) / (1 + Math.max(ytm + dyBp / BP, 1e-6) / freq);
  return (Math.pow(ratio, n) - 1) * 100;
}

/// Convexity (years²) of the same zero-coupon bond.
export function zeroConvexity(years: number, ytm: number, freq: number): number {
  const n = years * freq;
  return (n * (n + 1)) / (freq * freq * Math.pow(1 + ytm / freq, 2));
}

/// Exact and approximate relative price changes (%) for a shock; the same numbers `shockResult` reports.
export function shockOutcomes(p: BondParams, shockBp: number): { exact: number; duration: number; durConvex: number } {
  const r = shockResult(p, bondMeasures(p), shockBp);
  return { exact: r.exactPct, duration: r.durationPct, durConvex: r.durConvexPct };
}

/// Seeded shock draw in bp: a multiple of 25 with |shock| in [50, 250], either sign.
export function drawShock(seed: number): number {
  let s = Math.imul(seed | 0, 0x9e3779b1) >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const size = 50 + 25 * Math.floor(next() * 9);
  return next() < 0.5 ? -size : size;
}
// #endregion
