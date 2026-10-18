import { urlBool, urlNumber, type UrlSchema } from "../../lib/urlState";

/// Allowed parameter ranges, shared by the inputs, the drag clamps and the URL schema.
export const RR_RANGES = {
  mu: [0, 0.5],
  sigma: [0.01, 0.6],
  riskFree: [0, 0.15],
  weight: [0, 2.5],
  riskAversion: [1, 10],
} as const satisfies Record<string, readonly [number, number]>;

export type RiskReturnState = {
  mu: number;
  sigma: number;
  rf: number;
  w: number;
  cmp: boolean;
  muB: number;
  sigmaB: number;
  A: number;
};

const num = (fallback: number, [min, max]: readonly [number, number], decimals: number) =>
  urlNumber(fallback, min, max, decimals);

/// Query-string schema of the lab, so a configuration can be linked (module-level, stable object).
export const RR_URL_SCHEMA: UrlSchema<RiskReturnState> = {
  mu: num(0.09, RR_RANGES.mu, 4),
  sigma: num(0.18, RR_RANGES.sigma, 4),
  rf: num(0.03, RR_RANGES.riskFree, 4),
  w: num(1, RR_RANGES.weight, 2),
  cmp: urlBool(false),
  muB: num(0.12, RR_RANGES.mu, 4),
  sigmaB: num(0.3, RR_RANGES.sigma, 4),
  A: num(3, RR_RANGES.riskAversion, 1),
};
