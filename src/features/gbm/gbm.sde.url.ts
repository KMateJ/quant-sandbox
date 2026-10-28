import { urlNumber } from "../../lib/urlState";

/// Query-string state of the GBM lab's SDE sub-pages; with the seed included, a link reproduces the same paths.
export const EULER_URL_SCHEMA = {
  mu: urlNumber(0.08, -0.3, 0.3, 2),
  sigma: urlNumber(0.4, 0.1, 0.8, 2),
  n: urlNumber(8, 4, 256, 0),
  seed: urlNumber(7, 1, 9999, 0),
};

export const OU_URL_SCHEMA = {
  kappa: urlNumber(1.5, 0.1, 6, 1),
  theta: urlNumber(0.03, -0.02, 0.1, 3),
  sigma: urlNumber(0.02, 0.005, 0.06, 3),
  x0: urlNumber(0.01, -0.05, 0.1, 3),
  seed: urlNumber(7, 1, 9999, 0),
};

export const JUMPS_URL_SCHEMA = {
  sigma: urlNumber(0.15, 0.05, 0.5, 2),
  lambda: urlNumber(8, 0, 30, 0),
  jumpMean: urlNumber(-0.04, -0.2, 0.1, 2),
  jumpSd: urlNumber(0.06, 0.01, 0.2, 2),
  seed: urlNumber(7, 1, 9999, 0),
};

export const CORR_URL_SCHEMA = {
  rho: urlNumber(0.7, -0.99, 0.99, 2),
  steps: urlNumber(300, 50, 1000, 0),
  seed: urlNumber(7, 1, 9999, 0),
};

export const DEFINITION_URL_SCHEMA = {
  mu: urlNumber(0.08, -0.3, 0.3, 2),
  sigma: urlNumber(0.35, 0.05, 0.8, 2),
  horizon: urlNumber(3, 0.5, 10, 1),
  seed: urlNumber(7, 1, 9999, 0),
};
