import {
  bondPrice,
  macaulayDuration,
  modifiedDuration,
  convexity,
} from "../../lib/finance/bond";
import type {
  BondAnalytics,
  BondInputs,
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
