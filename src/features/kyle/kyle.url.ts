import { urlEnum, urlNumber, type UrlSchema } from "../../lib/urlState";
import { DEFAULT_KYLE_PARAMS } from "./kyle.types";

export const KYLE_MODES = ["simulate", "predict", "challenge"] as const;
export type KyleMode = (typeof KYLE_MODES)[number];
export const KYLE_VIEWS = ["insider", "maker"] as const;
export type KyleView = (typeof KYLE_VIEWS)[number];
export const KYLE_PLAYS = ["plan", "live"] as const;
export type KylePlay = (typeof KYLE_PLAYS)[number];

export type KyleUrlState = { mode: KyleMode; view: KyleView; play: KylePlay; n: number; s: number; seed: number };

/// Query-string schema of the Kyle lab.
export const KYLE_URL: UrlSchema<KyleUrlState> = {
  mode: urlEnum(KYLE_MODES, "simulate"),
  view: urlEnum(KYLE_VIEWS, "insider"),
  play: urlEnum(KYLE_PLAYS, "plan"),
  n: urlNumber(DEFAULT_KYLE_PARAMS.n, 1, 20, 0),
  s: urlNumber(DEFAULT_KYLE_PARAMS.s, 200, 4000, 0),
  seed: urlNumber(1, 1, 9999, 0),
};
