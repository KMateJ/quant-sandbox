import { urlEnum, urlNumber } from "../../lib/urlState";
import { EXOTIC_PAYOFFS } from "./monteCarloExotic.math";

export const MC_VIEWS = ["plain", "race"] as const;

/// Query-string state of the Monte Carlo lab; with the seed included, a link reproduces the same estimates.
export const MC_URL_SCHEMA = {
  s0: urlNumber(100, 10, 300, 0),
  K: urlNumber(100, 10, 300, 0),
  T: urlNumber(1, 0.25, 3, 2),
  r: urlNumber(0.03, 0, 0.1, 4),
  sigma: urlNumber(0.2, 0.05, 0.6, 2),
  n: urlNumber(5000, 200, 20000, 0),
  seed: urlNumber(7, 1, 100, 0),
  view: urlEnum(MC_VIEWS, "plain"),
  exotic: urlEnum(EXOTIC_PAYOFFS, "barrier"),
  B: urlNumber(130, 50, 400, 0),
};
