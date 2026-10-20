import { macaulay, matchWeights, pricePerFace } from "../../lib/finance/immunization";

/// A single liability funded by a short and a long coupon bond, all priced at a flat annually compounded yield.
export const IMMUNIZATION = {
  liability: 1_000_000,
  liabilityYears: 7,
  yield0: 0.05,
  short: { coupon: 0.05, years: 2 },
  long: { coupon: 0.05, years: 12 },
  /// Shock range of the drag track, in decimal yield.
  maxShock: 0.03,
};

export type BondSpec = { coupon: number; years: number };
export type Portfolio = "matched" | "short" | "long";

/// Price of a bond with face 100 and annual coupons at yield `y`.
export function bondPrice({ coupon, years }: BondSpec, y: number): number {
  return 100 * pricePerFace(coupon, years, y);
}

/// Macaulay duration of the same bond, in years.
export function bondDuration({ coupon, years }: BondSpec, y: number): number {
  return macaulay(coupon, years, y);
}

/// Present value of the liability at yield `y`.
export const liabilityValue = (y: number) => IMMUNIZATION.liability / (1 + y) ** IMMUNIZATION.liabilityYears;

/// Share of the initial money placed in the short bond so that the asset duration equals the liability's.
export function matchedShortWeight(): number {
  const { yield0, short, long, liabilityYears } = IMMUNIZATION;
  return matchWeights([bondDuration(short, yield0), bondDuration(long, yield0)], liabilityYears)[0];
}

/// Face amounts held in each bond, fixed at the start: the initial value equals the liability's PV at `yield0`.
export function holdings(portfolio: Portfolio): { shortFace: number; longFace: number } {
  const { yield0, short, long } = IMMUNIZATION;
  const pv = liabilityValue(yield0);
  const w = portfolio === "matched" ? matchedShortWeight() : portfolio === "short" ? 1 : 0;
  return { shortFace: (w * pv) / bondPrice(short, yield0), longFace: ((1 - w) * pv) / bondPrice(long, yield0) };
}

export type ShockState = { assets: number; liability: number; surplus: number; assetDuration: number; liabilityDuration: number };

/// Asset value, liability value, surplus and durations right after a parallel yield shock `shock`.
export function afterShock(portfolio: Portfolio, shock: number): ShockState {
  const { yield0, short, long, liabilityYears } = IMMUNIZATION;
  const y = yield0 + shock;
  const h = holdings(portfolio);
  const vS = h.shortFace * bondPrice(short, y);
  const vL = h.longFace * bondPrice(long, y);
  const assets = vS + vL;
  const liability = liabilityValue(y);
  const assetDuration = (vS * bondDuration(short, y) + vL * bondDuration(long, y)) / assets;
  return { assets, liability, surplus: assets - liability, assetDuration, liabilityDuration: liabilityYears };
}

/// Surplus against the shock on a grid, for the trace under the bars.
export function surplusCurve(portfolio: Portfolio, points = 61): { shock: number; surplus: number }[] {
  const { maxShock } = IMMUNIZATION;
  return Array.from({ length: points }, (_, i) => {
    const shock = -maxShock + (2 * maxShock * i) / (points - 1);
    return { shock, surplus: afterShock(portfolio, shock).surplus };
  });
}
