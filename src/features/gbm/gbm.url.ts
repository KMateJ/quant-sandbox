import { urlNumber } from "../../lib/urlState";

/// Query-string state of the GBM lab; with the seed included, a link reproduces the same paths.
export const GBM_URL_SCHEMA = {
  s0: urlNumber(100, 10, 500, 0),
  mu: urlNumber(0.08, -0.3, 0.3, 2),
  sigma: urlNumber(0.25, 0.05, 0.8, 2),
  T: urlNumber(1, 0.25, 5, 2),
  paths: urlNumber(6, 1, 8, 0),
  seed: urlNumber(7, 1, 9999, 0),
};
