import { urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";

export type DeltaHedgingUrlState = {
  s0: number;
  k: number;
  T: number;
  r: number;
  sigma: number;
  /// Rebalances per year, one of the lab's fixed choices.
  freq: "4" | "12" | "52" | "252";
  seed: number;
};

/// Query-string schema of the delta-hedging lab (module-level so the object stays stable).
export const DELTA_HEDGING_URL: UrlSchema<DeltaHedgingUrlState> = {
  s0: urlNumber(100, 10, 300, 0),
  k: urlNumber(100, 10, 300, 0),
  T: urlNumber(1, 0.25, 3, 2),
  r: urlNumber(0.03, 0, 0.1, 4),
  sigma: urlNumber(0.2, 0.05, 0.6, 2),
  freq: urlEnum(["4", "12", "52", "252"] as const, "52"),
  seed: urlNumber(7, 1, 9999, 0),
};
