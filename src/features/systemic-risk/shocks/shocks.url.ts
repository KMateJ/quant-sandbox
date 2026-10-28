import { urlEnum, urlNumber, urlString, type UrlField } from "../../../lib/urlState";
import { SYSTEMIC_URL_SCHEMA } from "../systemicRisk.url";
import { ALL_CHANNELS, formatDrops, parseDrops } from "./shocks.math";

export const SHOCK_MODES = ["simulate", "rescue", "fragile"] as const;
export type ShockMode = (typeof SHOCK_MODES)[number];

const ZERO_DROPS = "0,0,0,0";

/// Four price drops in percent, `gov,corp,mbs,equity`; invalid lists read as zeros.
const urlDrops: UrlField<number[]> = {
  parse: (raw) => parseDrops(raw),
  serialize: (v) => (formatDrops(v) === ZERO_DROPS ? null : formatDrops(v)),
};

/// Shared network keys plus this page's own: `fail` (institution id, `none`, or empty = most systemic),
/// `drop`, `shape`, `ch` (channel bitmask) and `mode`.
export const SHOCKS_URL_SCHEMA = {
  ...SYSTEMIC_URL_SCHEMA,
  fail: urlString(""),
  drop: urlDrops,
  shape: urlEnum(["instant", "gradual"] as const, "instant"),
  ch: urlNumber(ALL_CHANNELS, 0, ALL_CHANNELS, 0),
  mode: urlEnum(SHOCK_MODES, "simulate"),
};
