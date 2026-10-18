import { urlBool, urlEnum, urlNumber } from "../../lib/urlState";

/// Query-string state of the Itô process lab, including the step-by-step stage (1–3) and the both-sides view.
export const ITO_URL_SCHEMA = {
  s0: urlNumber(100, 10, 500, 0),
  mu: urlNumber(0.1, -0.3, 0.4, 2),
  sigma: urlNumber(0.3, 0.05, 0.8, 2),
  T: urlNumber(1, 0.25, 5, 2),
  paths: urlNumber(4, 1, 6, 0),
  seed: urlNumber(7, 1, 9999, 0),
  stage: urlNumber(1, 1, 3, 0),
  fn: urlEnum(["square", "exp", "sin"] as const, "square"),
  n: urlEnum(["4", "16", "64", "256", "1024"] as const, "64"),
  classic: urlBool(true),
};
