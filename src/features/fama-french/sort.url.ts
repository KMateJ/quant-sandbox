import { urlEnum, urlNumber } from "../../lib/urlState";

/// Query keys of the build-the-factors tab; breakpoints are universe percentiles in whole percent (steps of 5).
export const SORT_URL_SCHEMA = {
  sseed: urlNumber(1, 1, 9999, 0),
  ssz: urlNumber(50, 5, 95, 0),
  slo: urlNumber(30, 5, 90, 0),
  shi: urlNumber(70, 10, 95, 0),
  sw: urlEnum(["equal", "value"] as const, "equal"),
};

/// Smallest gap in percent between the low and high book-to-market cuts.
export const MIN_BM_GAP = 10;
export const PERCENT_STEP = 5;
