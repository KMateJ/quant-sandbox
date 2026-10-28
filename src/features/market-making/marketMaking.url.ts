import { urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";
import { DEFAULT_MM_PARAMS } from "./marketMaking.types";

export const MKM_MODES = ["simulate", "predict", "challenge"] as const;
export type MkmMode = (typeof MKM_MODES)[number];

export type MkmUrlState = { mode: MkmMode; lambda: number; k: number; informed: number; sigma: number; imbalance: number; seed: number };

/// Query-string schema of the market making lab (rounds played stay in the session only).
export const MKM_URL: UrlSchema<MkmUrlState> = {
  mode: urlEnum(MKM_MODES, "simulate"),
  lambda: urlNumber(DEFAULT_MM_PARAMS.lambda, 1, 10, 1),
  k: urlNumber(DEFAULT_MM_PARAMS.k, 0.2, 1.5, 2),
  informed: urlNumber(DEFAULT_MM_PARAMS.informed, 0, 0.5, 2),
  sigma: urlNumber(DEFAULT_MM_PARAMS.sigma, 0.2, 3, 1),
  imbalance: urlNumber(DEFAULT_MM_PARAMS.imbalance, -0.5, 0.5, 2),
  seed: urlNumber(1, 1, 9999, 0),
};
