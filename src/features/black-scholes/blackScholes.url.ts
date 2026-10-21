import { urlEnum, urlNumber } from "../../lib/urlState";
import { METRIC_KEYS, OPTION_TYPES } from "./blackScholes.types";

export const BLACK_SCHOLES_URL = {
  k: urlNumber(100, 20, 200, 0),
  r: urlNumber(0.05, 0, 0.2, 3),
  sigma: urlNumber(0.2, 0.01, 1, 2),
  tmax: urlNumber(5, 0.25, 20, 2),
  curves: urlNumber(5, 2, 6, 0),
  metric: urlEnum(METRIC_KEYS, "price"),
  type: urlEnum(OPTION_TYPES, "call"),
  view: urlEnum(["2d", "3d"] as const, "2d"),
};
