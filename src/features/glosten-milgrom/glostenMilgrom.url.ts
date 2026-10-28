import { urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";
import { DEFAULT_GM_PARAMS } from "./glostenMilgrom.types";

export const GM_MODES = ["simulate", "predict", "challenge"] as const;
export type GmMode = (typeof GM_MODES)[number];

export type GmUrlState = { mode: GmMode; pi: number; prior: number; trueV: "0" | "1"; n: number; seed: number };

/// Query-string schema of the Glosten–Milgrom lab (edits to the trade strip are not kept).
export const GM_URL: UrlSchema<GmUrlState> = {
  mode: urlEnum(GM_MODES, "simulate"),
  pi: urlNumber(DEFAULT_GM_PARAMS.pi, 0, 0.95, 2),
  prior: urlNumber(DEFAULT_GM_PARAMS.prior, 0.05, 0.95, 2),
  trueV: urlEnum(["0", "1"] as const, "1"),
  n: urlNumber(DEFAULT_GM_PARAMS.n, 10, 80, 0),
  seed: urlNumber(1, 1, 9999, 0),
};
