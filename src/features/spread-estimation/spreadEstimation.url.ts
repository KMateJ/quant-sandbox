import { urlEnum, urlNumber } from "../../lib/urlState";
import { DEFAULT_SPE } from "./spreadEstimation.math";

export const SPE_MODES = ["simulate", "predict", "challenge"] as const;
export const SPE_TABS = ["tape", "slope", "split"] as const;

/// Query-string state of the spread estimation lab.
export const SPE_URL_SCHEMA = {
  mode: urlEnum(SPE_MODES, "simulate"),
  tab: urlEnum(SPE_TABS, "tape"),
  S: urlNumber(DEFAULT_SPE.S, 2, 20, 0),
  sigma: urlNumber(DEFAULT_SPE.sigma, 0, 10, 1),
  alpha: urlNumber(DEFAULT_SPE.alpha, 0, 0.9, 2),
  n: urlNumber(DEFAULT_SPE.n, 30, 640, 0),
  seed: urlNumber(1, 1, 9999, 0),
};
