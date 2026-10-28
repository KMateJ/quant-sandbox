import { urlNumber } from "../../lib/urlState";

/// Query-string state of the Random Walk lab; with the seed included, a link reproduces the same walkers.
export const RANDOM_WALK_URL_SCHEMA = {
  /// Probability of an up-step.
  p: urlNumber(0.5, 0.05, 0.95, 2),
  /// Steps per walker.
  n: urlNumber(100, 10, 200, 0),
  /// Step size h.
  h: urlNumber(1, 0.25, 2, 2),
  seed: urlNumber(7, 1, 9999, 0),
};
