import { couponCashflows, KEY_RATES, priceOnCurve, type ZeroPoint } from "../../../lib/finance/curveRisk";
import { bump } from "./curve.math";
import type { BookBond, FutureQuote, FutureSpec } from "./rates.types";

const NOTIONAL_YIELD = 0.06;

/// Price per 100 face of an annual-coupon bond off the zero curve.
export function bondPrice(coupon: number, maturity: number, zeros: ZeroPoint[]): number {
  return priceOnCurve(couponCashflows(coupon, maturity), zeros);
}

/// Accrued coupon per 100 face: the part of the current annual period already elapsed.
export function accrued(coupon: number, maturity: number): number {
  const toNext = maturity - Math.floor(maturity);
  return toNext > 1e-9 ? 100 * coupon * (1 - toNext) : 0;
}

/// Quoted (clean) price per 100 face: full price minus accrued coupon.
export const cleanPrice = (coupon: number, maturity: number, zeros: ZeroPoint[]) => bondPrice(coupon, maturity, zeros) - accrued(coupon, maturity);

/// Market value of a book bond in dollars.
export const bondValue = (b: BookBond, zeros: ZeroPoint[]) => (b.face * bondPrice(b.coupon, b.maturity, zeros)) / 100;

/// Conversion factor: clean price per 1 face at a flat 6% annual yield, rounded to 4 dp.
export function conversionFactor(coupon: number, maturity: number): number {
  const p = couponCashflows(coupon, maturity).reduce((s, c) => s + c.cf / Math.pow(1 + NOTIONAL_YIELD, c.t), 0) - accrued(coupon, maturity);
  return Math.round(p * 100) / 1e4;
}

/// Futures price per 100: the cheapest clean P/CF in the basket, plus any calendar spread for a back contract.
export function futureQuote(spec: FutureSpec, zeros: ZeroPoint[]): FutureQuote {
  const prices = spec.basket.map(([c, m]) => cleanPrice(c, m, zeros));
  const cfs = spec.basket.map(([c, m]) => conversionFactor(c, m));
  let ctd = 0;
  prices.forEach((p, i) => {
    if (p / cfs[i] < prices[ctd] / cfs[ctd]) ctd = i;
  });
  return { F: prices[ctd] / cfs[ctd] + (spec.calendarSpread ?? 0), ctd, prices, cfs };
}

/// Dollar value lost per contract for a +1 bp parallel move (basket re-priced, so the CTD may change).
export function futureDv01(spec: FutureSpec, zeros: ZeroPoint[]): number {
  return (-spec.size / 100) * (futureQuote(spec, bump(zeros, "parallel", 1)).F - futureQuote(spec, zeros).F);
}

/// Key-rate DV01s per contract, one per `KEY_RATES` node.
export function futureKrd(spec: FutureSpec, zeros: ZeroPoint[]): number[] {
  const F0 = futureQuote(spec, zeros).F;
  return KEY_RATES.map((_, k) => (-spec.size / 100) * (futureQuote(spec, bump(zeros, k, 1)).F - F0));
}
