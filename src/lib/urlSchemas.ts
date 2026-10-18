import type { BondSpec } from "./finance/bond";
import { urlNumber, type UrlSchema } from "./urlState";

/// Query-string schema for a bond definition, so every bond lab shares the same keys and ranges.
/// Call it once at module level (the result must be a stable object).
export function bondUrlSchema(defaults: BondSpec): UrlSchema<BondSpec> {
  return {
    face: urlNumber(defaults.face, 1, 100_000, 2),
    couponRate: urlNumber(defaults.couponRate, 0, 0.3, 4),
    ytm: urlNumber(defaults.ytm, 0.001, 0.3, 4),
    years: urlNumber(defaults.years, 1, 30, 0),
    freq: urlNumber(defaults.freq, 1, 4, 0),
  };
}
