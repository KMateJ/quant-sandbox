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
  BrokenAxis,
  CashFlowRow,
  PriceYieldPoint,
} from "./bondPricing.types";

export { bondPrice, macaulayDuration, modifiedDuration, convexity };

/// Discount factor applied to the cash flow in period `t` at the given per-period yield.
export function discountFactor(ytm: number, freq: number, period: number): number {
  return 1 / Math.pow(1 + ytm / freq, period);
}

/// Dated cash-flow schedule with per-payment discount factors and present values.
export function bondSchedule(inputs: BondInputs): CashFlowRow[] {
  return streamSchedule(bondFlows(inputs), regularCoupon(inputs), inputs.ytm, inputs.freq);
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

/// Build a broken vertical axis for the cash-flow timeline. The lower band resolves
/// values up to just above `couponMax` at full scale; a pixel gap then precedes a
/// compressed upper band reaching `totalMax`. With no large outlier (e.g. a
/// zero-coupon bond) it falls back to a single linear band.
export function brokenCashflowAxis(opts: {
  couponMax: number;
  totalMax: number;
  top: number;
  innerH: number;
  lowerFrac?: number;
  gap?: number;
}): BrokenAxis {
  const { couponMax, totalMax, top, innerH } = opts;
  const base = top + innerH;
  const lowerMax = couponMax > 0 ? couponMax * 1.3 : Math.max(totalMax, 1);
  const needBreak = couponMax > 0 && totalMax > lowerMax * 1.8;

  if (!needBreak) {
    const span = totalMax > 0 ? totalMax : 1;
    return {
      hasBreak: false,
      base,
      gapBottomY: base,
      gapTopY: base,
      lowerMax: span,
      upperMax: span,
      y: (v) => base - (v / span) * innerH,
      invert: (py) => ((base - py) / innerH) * span,
    };
  }

  const gap = opts.gap ?? 16;
  const lowerH = innerH * (opts.lowerFrac ?? 0.58);
  const upperH = innerH - lowerH - gap;
  const upperMax = totalMax * 1.05;
  const gapBottomY = base - lowerH;
  const gapTopY = base - lowerH - gap;

  return {
    hasBreak: true,
    base,
    gapBottomY,
    gapTopY,
    lowerMax,
    upperMax,
    y: (v: number) => {
      if (v <= lowerMax) return base - (v / lowerMax) * lowerH;
      const frac = Math.min(1, Math.max(0, (v - lowerMax) / (upperMax - lowerMax)));
      return gapTopY - frac * upperH;
    },
    invert: (py: number) => {
      if (py >= gapBottomY) return ((base - py) / lowerH) * lowerMax;
      if (py > gapTopY) return lowerMax;
      return lowerMax + ((gapTopY - py) / upperH) * (upperMax - lowerMax);
    },
  };
}

/// Zigzag SVG path across [x0, x1] at height `y`, used to mark a broken axis.
export function zigzagPath(x0: number, x1: number, y: number, amp = 3, step = 9): string {
  let d = `M ${x0} ${y}`;
  let up = true;
  for (let x = x0 + step; x < x1; x += step) {
    d += ` L ${x} ${y + (up ? -amp : amp)}`;
    up = !up;
  }
  return `${d} L ${x1} ${y}`;
}

/// Coupon offset of the two companion bonds drawn next to the current one on the pull-to-par chart.
export const PULL_TO_PAR_SPREAD = 0.02;

/// Clean price at each coupon date as time passes at a constant yield (one row per period, t = years elapsed),
/// for the bond itself and for companions with a coupon PULL_TO_PAR_SPREAD above and below. All end at face value.
export function pullToParPath({ face, couponRate, ytm, years, freq }: BondInputs) {
  const periods = Math.round(years * freq);
  const priceLeft = (coupon: number, periodsLeft: number) =>
    periodsLeft === 0 ? face : bondPrice(face, Math.max(coupon, 0), ytm, periodsLeft / freq, freq);
  return Array.from({ length: periods + 1 }, (_, k) => ({
    t: k / freq,
    bond: priceLeft(couponRate, periods - k),
    higher: priceLeft(couponRate + PULL_TO_PAR_SPREAD, periods - k),
    lower: priceLeft(couponRate - PULL_TO_PAR_SPREAD, periods - k),
  }));
}

// #region Arbitrary cash-flow streams

/// Coupon paid each period by the standard bond.
export function regularCoupon({ face, couponRate, freq }: BondInputs): number {
  return (face * couponRate) / freq;
}

/// The standard bond as a plain stream: one cash flow per period, the last one carrying the face value.
export function bondFlows(inputs: BondInputs): number[] {
  const n = Math.max(1, Math.round(inputs.years * inputs.freq));
  const coupon = regularCoupon(inputs);
  return Array.from({ length: n }, (_, k) => coupon + (k === n - 1 ? inputs.face : 0));
}

/// Schedule for any stream, flow k paid at (k+1)/freq years. Each flow is split into a coupon part
/// (up to the regular `coupon`) and principal (the rest), so the timeline keeps its two colours.
export function streamSchedule(flows: number[], coupon: number, ytm: number, freq: number): CashFlowRow[] {
  return flows.map((cashflow, k) => {
    const df = discountFactor(ytm, freq, k + 1);
    const couponPart = Math.min(cashflow, coupon);
    return {
      period: k + 1,
      time: (k + 1) / freq,
      coupon: couponPart,
      principal: cashflow - couponPart,
      cashflow,
      discountFactor: df,
      presentValue: cashflow * df,
    };
  });
}

/// Price of a stream: Σ CF_k / (1 + y/f)^k.
export function streamPrice(flows: number[], ytm: number, freq: number): number {
  return flows.reduce((sum, cf, k) => sum + cf * discountFactor(ytm, freq, k + 1), 0);
}

/// Price, Macaulay / modified duration and convexity of a stream (same conventions as the bond formulas).
/// A stream worth nothing has no meaningful duration; those readouts are 0.
export function analyzeStream(flows: number[], coupon: number, ytm: number, freq: number): BondAnalytics {
  const rows = streamSchedule(flows, coupon, ytm, freq);
  const price = rows.reduce((s, r) => s + r.presentValue, 0);
  const g = 1 + ytm / freq;
  const weighted = rows.reduce((s, r) => s + r.time * r.presentValue, 0);
  const curv = rows.reduce((s, r) => s + r.period * (r.period + 1) * r.presentValue, 0) / (freq * freq);
  const macaulay = price > 0 ? weighted / price : 0;
  return {
    rows,
    price,
    macaulay,
    modified: macaulay / g,
    convexity: price > 0 ? curv / (price * g * g) : 0,
  };
}

/// Yield to maturity of a stream bought at `price` (bisection on [-0.99·f, 10]); NaN when no yield fits.
export function streamYtm(flows: number[], price: number, freq: number, tol = 1e-10): number {
  let lo = -0.99 * freq;
  let hi = 10;
  const gap = (y: number) => streamPrice(flows, y, freq) - price;
  if (gap(lo) < 0 || gap(hi) > 0) return NaN;
  for (let i = 0; i < 200 && hi - lo > tol; i++) {
    const mid = (lo + hi) / 2;
    if (gap(mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/// Price–yield curve of a stream across [0, maxYtm].
export function streamPriceYieldCurve(flows: number[], freq: number, maxYtm: number, steps: number): PriceYieldPoint[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const ytm = (i / steps) * maxYtm;
    return { ytm, price: streamPrice(flows, ytm, freq) };
  });
}

/// Copy of `flows` with flow `index` set to `value`.
export function withFlow(flows: number[], index: number, value: number): number[] {
  return flows.map((cf, k) => (k === index ? value : cf));
}

// #endregion
