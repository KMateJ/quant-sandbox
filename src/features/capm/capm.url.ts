import { urlEnum, urlNumber } from "../../lib/urlState";
import { RETURN_RANGE } from "./capm.math";

export const CAPM_TABS = ["sml", "assets", "beta"] as const;

/// Largest beta on the SML / Assets x axis and the β slider.
export const MAX_BETA = 2;

/// Query-string state of the CAPM lab, so a configuration can be shared or linked from a guide.
export const CAPM_URL_SCHEMA = {
  rf: urlNumber(0.03, 0, 0.1, 4),
  rm: urlNumber(0.09, ...RETURN_RANGE, 4),
  beta: urlNumber(1.1, 0, MAX_BETA, 2),
  ret: urlNumber(0.1, ...RETURN_RANGE, 4),
  tab: urlEnum(CAPM_TABS, "sml"),
  disp: urlNumber(0.03, 0.005, 0.08, 3),
  seed: urlNumber(1, 1, 9999, 0),
};
