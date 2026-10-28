import { cashFlowsAfterDelivery, TfInputError, type DeliverableBond } from "./treasuryFutures.math";

export type CtdPoint = { shiftBp: number; futures: number; prices: Record<string, number>; basis: Record<string, number>; ctd: string };
export type CtdSwitch = { shiftBp: number; from: string; to: string };

/// Parallel shifts of the explorer, in bp: −200…+200 in 5 bp steps.
export const SHIFT_GRID_BP: number[] = Array.from({ length: 81 }, (_, i) => -200 + 5 * i);

const YIELD_LOW_FRACTION = 0.999;
const YIELD_HIGH = 1;

/// Clean price when the post-delivery cash flows are discounted at `yieldRate`; accrued interest is held fixed.
export function cleanPriceAtYield(bond: DeliverableBond, delivery: number, yieldRate: number): number {
  return cashFlowsAfterDelivery(bond, delivery, yieldRate).reduce((sum, flow) => sum + flow.presentValue, 0) - bond.accruedInterest;
}

/// Yield implied by a bond's clean price (bisection over the same cash-flow pricer as the lab's scenarios).
export function impliedYield(bond: DeliverableBond, delivery: number): number {
  let lo = -bond.frequency * YIELD_LOW_FRACTION;
  let hi = YIELD_HIGH;
  if (cleanPriceAtYield(bond, delivery, lo) < bond.cleanPrice || cleanPriceAtYield(bond, delivery, hi) > bond.cleanPrice) {
    throw new TfInputError("impliedYield", "Clean price is outside the range of prices reachable by a yield.");
  }
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (cleanPriceAtYield(bond, delivery, mid) > bond.cleanPrice) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/// Net basis of every bond for each parallel yield shift. Bonds are repriced from their implied yields and
/// the futures price is re-derived as min(price / CF), so the CTD's net basis is exactly zero and the
/// switch is purely a relative-price effect.
export function ctdSwitchCurve(bonds: DeliverableBond[], delivery: number, shiftsBp: number[] = SHIFT_GRID_BP): CtdPoint[] {
  const yields = bonds.map((bond) => impliedYield(bond, delivery));
  return shiftsBp.map((shiftBp) => {
    const prices: Record<string, number> = {};
    bonds.forEach((bond, i) => { prices[bond.id] = cleanPriceAtYield(bond, delivery, yields[i] + shiftBp / 1e4); });
    const futures = Math.min(...bonds.map((bond) => prices[bond.id] / bond.conversionFactor));
    const basis: Record<string, number> = {};
    let ctd = bonds[0].id;
    for (const bond of bonds) {
      basis[bond.id] = prices[bond.id] - futures * bond.conversionFactor;
      if (basis[bond.id] < basis[ctd] - 1e-12) ctd = bond.id;
    }
    return { shiftBp, futures, prices, basis, ctd };
  });
}

/// Shifts (bp) where the CTD changes, interpolated linearly between grid points.
export function ctdSwitchPoints(curve: CtdPoint[]): CtdSwitch[] {
  const out: CtdSwitch[] = [];
  for (let i = 1; i < curve.length; i++) {
    const a = curve[i - 1], b = curve[i];
    if (a.ctd === b.ctd) continue;
    const d0 = a.basis[a.ctd] - a.basis[b.ctd];
    const d1 = b.basis[a.ctd] - b.basis[b.ctd];
    const share = d1 === d0 ? 0.5 : Math.min(1, Math.max(0, -d0 / (d1 - d0)));
    out.push({ shiftBp: a.shiftBp + (b.shiftBp - a.shiftBp) * share, from: a.ctd, to: b.ctd });
  }
  return out;
}

export type CtdTraits = { highestDuration: boolean; highestCoupon: boolean; lowestFactor: boolean; shortestMaturity: boolean };

const isExtreme = (values: number[], index: number, pick: "max" | "min") => {
  const best = pick === "max" ? Math.max(...values) : Math.min(...values);
  return Math.abs(values[index] - best) < 1e-9 && Math.abs(Math.max(...values) - Math.min(...values)) > 1e-9;
};

/// Which simple bond attributes single out `ctdId` (an attribute counts only when the basket differs on it).
/// Duration is the numeric price sensitivity per bp around each bond's implied yield.
export function ctdTraits(bonds: DeliverableBond[], delivery: number, ctdId: string): CtdTraits {
  const index = bonds.findIndex((bond) => bond.id === ctdId);
  const duration = bonds.map((bond) => {
    const y = impliedYield(bond, delivery);
    return (cleanPriceAtYield(bond, delivery, y - 1e-4) - cleanPriceAtYield(bond, delivery, y + 1e-4)) / (2e-4 * Math.max(bond.cleanPrice + bond.accruedInterest, 1e-9));
  });
  return {
    highestDuration: isExtreme(duration, index, "max"),
    highestCoupon: isExtreme(bonds.map((b) => b.couponRate), index, "max"),
    lowestFactor: isExtreme(bonds.map((b) => b.conversionFactor), index, "min"),
    shortestMaturity: isExtreme(bonds.map((b) => b.maturity), index, "min"),
  };
}

/// Signed shift label such as "+63 bp" or "−150 bp" (true minus sign).
export const formatBp = (bp: number) => `${bp > 0 ? "+" : bp < 0 ? "−" : ""}${Math.abs(Math.round(bp))} bp`;

/// Signed shift without the unit, for compact axis ticks.
export const formatShiftTick = (bp: number) => `${bp > 0 ? "+" : bp < 0 ? "−" : ""}${Math.abs(Math.round(bp))}`;
