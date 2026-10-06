import {
  bondPrice,
  macaulayDuration,
  modifiedDuration,
  convexity,
} from "../../lib/finance/bond";
import type {
  BondAnalytics,
  BondInputs,
  BondState,
  CashFlowRow,
  PriceYieldPoint,
} from "./bondPricing.types";

export { bondPrice, macaulayDuration, modifiedDuration, convexity };

/// Discount factor applied to the cash flow in period `t` at the given per-period yield.
export function discountFactor(ytm: number, freq: number, period: number): number {
  return 1 / Math.pow(1 + ytm / freq, period);
}

/// Dated cash-flow schedule with per-payment discount factors and present values.
export function bondSchedule({ face, couponRate, ytm, years, freq }: BondInputs): CashFlowRow[] {
  const nPeriods = Math.max(1, Math.round(years * freq));
  const couponAmt = (face * couponRate) / freq;
  const rows: CashFlowRow[] = [];
  for (let t = 1; t <= nPeriods; t++) {
    const principal = t === nPeriods ? face : 0;
    const cashflow = couponAmt + principal;
    const df = discountFactor(ytm, freq, t);
    rows.push({
      period: t,
      time: t / freq,
      coupon: couponAmt,
      principal,
      cashflow,
      discountFactor: df,
      presentValue: cashflow * df,
    });
  }
  return rows;
}

/// Bundle the schedule with price, duration and convexity for a single input set.
export function analyzeBond(inputs: BondInputs): BondAnalytics {
  const { face, couponRate, ytm, years, freq } = inputs;
  return {
    rows: bondSchedule(inputs),
    price: bondPrice(face, couponRate, ytm, years, freq),
    macaulay: macaulayDuration(face, couponRate, ytm, years, freq),
    modified: modifiedDuration(face, couponRate, ytm, years, freq),
    convexity: convexity(face, couponRate, ytm, years, freq),
  };
}

/// Price–yield curve: bond price across yields from 0 to `maxYtm`, in `steps` increments.
export function priceYieldCurve(
  face: number,
  couponRate: number,
  years: number,
  freq: number,
  maxYtm: number,
  steps: number
): PriceYieldPoint[] {
  const points: PriceYieldPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ytm = (i / steps) * maxYtm;
    points.push({ ytm, price: bondPrice(face, couponRate, ytm, years, freq) });
  }
  return points;
}

/// First-order (duration) price estimate around `y0`: P ≈ P₀·(1 − Dmod·Δy).
/// This is the straight tangent line to the price–yield curve at the current yield.
export function durationApprox(price0: number, modified: number, y0: number, y: number): number {
  return price0 * (1 - modified * (y - y0));
}

/// Second-order (duration + convexity) price estimate around `y0`:
/// P ≈ P₀·(1 − Dmod·Δy + ½·C·Δy²); a curved correction to the tangent line.
export function durationConvexityApprox(
  price0: number,
  modified: number,
  convexity: number,
  y0: number,
  y: number
): number {
  const dy = y - y0;
  return price0 * (1 - modified * dy + 0.5 * convexity * dy * dy);
}

/// Tangent-line (duration) approximation sampled across [0, maxYtm] for overlay plotting.
export function durationApproxCurve(
  price0: number,
  modified: number,
  y0: number,
  maxYtm: number,
  steps: number
): PriceYieldPoint[] {
  const points: PriceYieldPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ytm = (i / steps) * maxYtm;
    points.push({ ytm, price: durationApprox(price0, modified, y0, ytm) });
  }
  return points;
}

/// Duration + convexity approximation sampled across [0, maxYtm] for overlay plotting.
export function durationConvexityApproxCurve(
  price0: number,
  modified: number,
  convexity: number,
  y0: number,
  maxYtm: number,
  steps: number
): PriceYieldPoint[] {
  const points: PriceYieldPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const ytm = (i / steps) * maxYtm;
    points.push({ ytm, price: durationConvexityApprox(price0, modified, convexity, y0, ytm) });
  }
  return points;
}

/// Approximate percentage price change for a yield shift `dYield`, both as a pure
/// duration estimate and with the convexity correction added.
export function priceChangePct(
  modified: number,
  convexity: number,
  dYield: number
): { duration: number; withConvexity: number } {
  const duration = -modified * dYield;
  const withConvexity = -modified * dYield + 0.5 * convexity * dYield * dYield;
  return { duration: duration * 100, withConvexity: withConvexity * 100 };
}

/// Classify a bond as trading at a premium, at par, or at a discount to face value.
/// `tol` is the relative band around par treated as "at par" (default 0.5%).
export function bondState(price: number, face: number, tol = 0.005): BondState {
  const diff = (price - face) / face;
  if (Math.abs(diff) <= tol) return "par";
  return diff > 0 ? "premium" : "discount";
}
