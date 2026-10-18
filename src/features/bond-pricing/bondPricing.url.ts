import type { BondSpec } from "../../lib/finance/bond";
import { bondUrlSchema } from "../../lib/urlSchemas";
import { urlEnum, type UrlField } from "../../lib/urlState";
import { bondFlows } from "./bondPricing.math";

export const BOND_TABS = ["cashflows", "price-yield", "pull-to-par"] as const;
export type BondTab = (typeof BOND_TABS)[number];

/// Most periods a bond in the URL can have (30 years × 4 coupons a year).
const MAX_FLOWS = 120;

/// Comma-separated custom cash flows (`cf=2.5,2.5,40,…`, two decimals); anything malformed → none.
const urlFlows: UrlField<number[] | null> = {
  parse: (raw) => {
    if (!raw) return null;
    const flows = raw.split(",").map(Number);
    return flows.length <= MAX_FLOWS && flows.every((v) => Number.isFinite(v) && v >= 0) ? flows : null;
  },
  serialize: (flows) => (flows && flows.length ? flows.map((v) => Number(v.toFixed(2))).join(",") : null),
};

/// The bond, the open tab and (when the reader reshaped them) the custom cash flows live in the URL,
/// so a configuration can be shared or linked from a guide.
export const BOND_SCHEMA = {
  ...bondUrlSchema({ face: 100, couponRate: 0.05, ytm: 0.06, years: 10, freq: 2 }),
  tab: urlEnum(BOND_TABS, "cashflows"),
  cf: urlFlows,
};

/// Custom flows only count while they match the bond's number of periods; otherwise it's the standard bond.
export function customFlows(bond: BondSpec, cf: number[] | null): number[] | null {
  return cf && cf.length === bondFlows(bond).length ? cf : null;
}

/// The stream being priced: the custom flows if any, else the standard coupon bond.
export function activeFlows(bond: BondSpec, cf: number[] | null): number[] {
  return customFlows(bond, cf) ?? bondFlows(bond);
}

/// Editing any bond term except the yield rebuilds the standard bond, so it drops the custom flows.
export function bondPatch(patch: Partial<BondSpec>): Partial<BondSpec> & { cf?: null } {
  return Object.keys(patch).every((k) => k === "ytm") ? patch : { ...patch, cf: null };
}
