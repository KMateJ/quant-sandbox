import { urlEnum, urlNumber, type UrlField } from "../../lib/urlState";
import { YC_SCHEMA } from "../yield-curve/yieldCurve.url";

export const FREQS = ["1", "2", "4"] as const;
export const SIDES = ["payer", "receiver"] as const;

/// Locked fixed rate in percent, or null while the swap floats at par.
const lockedRate: UrlField<number | null> = {
  parse: (raw) => {
    const v = raw === null || raw === "" ? NaN : Number(raw);
    return Number.isFinite(v) && v >= 0 && v <= 20 ? v : null;
  },
  serialize: (v) => (v === null ? null : String(Number(v.toFixed(4)))),
};

/// Swap terms, the curve (preset or custom quotes, as in the yield curve lab) and, once locked,
/// the fixed rate `k` and the curve it was locked on `lk`, so a shared link keeps its MTM.
export const SWAP_SCHEMA = {
  notional: urlNumber(10_000_000, 100_000, 1_000_000_000, 0),
  tenor: urlNumber(5, 1, 10, 0),
  freq: urlEnum(FREQS, "2"),
  side: urlEnum(SIDES, "payer"),
  preset: YC_SCHEMA.preset,
  n: YC_SCHEMA.n,
  k: lockedRate,
  lk: YC_SCHEMA.n,
};
