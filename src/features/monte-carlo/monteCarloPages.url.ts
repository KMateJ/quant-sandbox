import { urlNumber } from "../../lib/urlState";

/// Query-string state of the variance-reduction page (the seed makes a link reproduce the same estimates).
export const VR_URL_SCHEMA = {
  s0: urlNumber(100, 10, 300, 0),
  K: urlNumber(100, 10, 300, 0),
  T: urlNumber(1, 0.25, 3, 2),
  r: urlNumber(0.03, 0, 0.1, 4),
  sigma: urlNumber(0.2, 0.05, 0.6, 2),
  n: urlNumber(5000, 200, 20000, 0),
  seed: urlNumber(7, 1, 100, 0),
};

/// Query-string state of the Feynman–Kac page: the start (t, x) of the expectation and the call's terms.
export const FK_URL_SCHEMA = {
  x: urlNumber(100, 20, 300, 0),
  t: urlNumber(0, 0, 2.95, 2),
  K: urlNumber(100, 10, 300, 0),
  T: urlNumber(1, 0.25, 3, 2),
  r: urlNumber(0.03, 0, 0.1, 4),
  sigma: urlNumber(0.2, 0.05, 0.6, 2),
  n: urlNumber(5000, 200, 20000, 0),
  seed: urlNumber(7, 1, 100, 0),
};
