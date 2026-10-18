import { urlEnum, urlNumber } from "../../lib/urlState";

export const MAX_DEBT_RATIO = 0.8;
export const WACC_MODES = ["constant", "realistic"] as const;
export type WaccMode = (typeof WACC_MODES)[number];

/// Query-string schema of the WACC lab (defaults are left out). In realistic mode `ke` / `kd` hold rU and rf.
export const WACC_URL_SCHEMA = {
  mode: urlEnum(WACC_MODES, "constant"),
  ke: urlNumber(0.11, 0, 0.3, 4),
  kd: urlNumber(0.05, 0, 0.2, 4),
  tax: urlNumber(0.21, 0, 0.5, 2),
  dv: urlNumber(0.4, 0, MAX_DEBT_RATIO, 2),
};
