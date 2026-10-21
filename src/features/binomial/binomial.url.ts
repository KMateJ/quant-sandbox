import { urlBool, urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";
import type { BinomialUrlState } from "./binomial.types";

/// Query-string keys of the binomial lab; defaults are left out of the URL.
export const BINOMIAL_URL: UrlSchema<BinomialUrlState> = {
  mode: urlEnum(["equity", "rates"], "equity"),
  s0: urlNumber(100, 20, 200),
  k: urlNumber(100, 20, 200),
  u: urlNumber(1.2, 1.01, 2, 2),
  d: urlNumber(0.85, 0.1, 0.99, 2),
  r: urlNumber(0.05, 0, 0.3, 2),
  q: urlNumber(0.5, 0, 1, 2),
  h: urlNumber(0.18, 0.02, 0.7, 2),
  steps: urlNumber(4, 1, 8),
  type: urlEnum(["call", "put"], "call"),
  primary: urlBool(true),
  secondary: urlBool(true),
};
