import { urlEnum, urlNumber } from "../../lib/urlState";

/// Query-string state of the Itô sub-pages.
export const INTEGRAL_URL_SCHEMA = {
  T: urlNumber(1, 0.25, 5, 2),
  seed: urlNumber(7, 1, 9999, 0),
};

export const LEMMA_URL_SCHEMA = {
  fn: urlEnum(["square", "exp", "sin"] as const, "square"),
  n: urlEnum(["4", "16", "64", "256", "1024"] as const, "64"),
  T: urlNumber(1, 0.25, 5, 2),
  seed: urlNumber(7, 1, 9999, 0),
};

export const MARTINGALE_URL_SCHEMA = {
  strategy: urlEnum(["constant", "doubling", "stop"] as const, "doubling"),
  rounds: urlNumber(100, 10, 200, 0),
  seed: urlNumber(7, 1, 9999, 0),
};

export const GIRSANOV_URL_SCHEMA = {
  theta: urlNumber(0.8, 0, 3, 2),
  T: urlNumber(1, 0.25, 5, 2),
  seed: urlNumber(7, 1, 9999, 0),
};
