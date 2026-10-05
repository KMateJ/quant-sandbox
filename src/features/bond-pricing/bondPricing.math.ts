import {
  bondPrice,
  macaulayDuration,
  modifiedDuration,
  convexity,
} from "../../lib/finance/bond";
import type { PriceYieldPoint } from "./bondPricing.types";

export { bondPrice, macaulayDuration, modifiedDuration, convexity };

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
