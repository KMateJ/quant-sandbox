import { urlNumber } from "../../lib/urlState";

/// Query-string state of the Brownian motion lab; with the seed included, a link reproduces the same paths.
export const BROWNIAN_URL_SCHEMA = {
  mu: urlNumber(0.05, -0.5, 0.5, 2),
  sigma: urlNumber(0.3, 0.05, 1, 2),
  T: urlNumber(1, 0.25, 5, 2),
  /// Cloud size; legacy links used 1–8 sample paths and snap to the nearest size.
  paths: urlNumber(400, 1, 2000, 0),
  seed: urlNumber(7, 1, 9999, 0),
  /// Barrier of the first-passage panel.
  b: urlNumber(0.5, -2, 2, 2),
};
