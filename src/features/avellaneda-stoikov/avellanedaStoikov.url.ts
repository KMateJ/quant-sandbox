import { urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";
import { DEFAULT_AS_PARAMS } from "./avellanedaStoikov.types";

export const AVS_MODES = ["simulate", "predict", "challenge"] as const;
export type AvsMode = (typeof AVS_MODES)[number];
export const AVS_TABS = ["skew", "policy", "tournament"] as const;
export type AvsTab = (typeof AVS_TABS)[number];

export type AvsUrlState = { mode: AvsMode; tab: AvsTab; gamma: number; sigma: number; k: number; seed: number };

/// Query-string schema of the Avellaneda–Stoikov lab (the drawn policy stays in the session).
export const AVS_URL: UrlSchema<AvsUrlState> = {
  mode: urlEnum(AVS_MODES, "simulate"),
  tab: urlEnum(AVS_TABS, "skew"),
  gamma: urlNumber(DEFAULT_AS_PARAMS.gamma, 0.01, 1, 2),
  sigma: urlNumber(DEFAULT_AS_PARAMS.sigma, 0.5, 4, 1),
  k: urlNumber(DEFAULT_AS_PARAMS.k, 0.5, 3, 2),
  seed: urlNumber(1, 1, 9999, 0),
};
