import { urlEnum, urlNumber } from "../../lib/urlState";

export const VALUATION_TABS = ["projection", "buildup"] as const;
export type ValuationTab = (typeof VALUATION_TABS)[number];
export const EXPLORE_TABS = ["bridge", "map", "reverse"] as const;
export type ExploreTab = (typeof EXPLORE_TABS)[number];

/// Query-string schema of the DCF lab's inputs and main tab (defaults are left out).
export const VALUATION_URL_SCHEMA = {
  fcf: urlNumber(100, 10, 500, 0),
  g: urlNumber(0.08, 0, 0.2, 4),
  n: urlNumber(5, 1, 15, 0),
  tg: urlNumber(0.02, 0, 0.04, 4),
  wacc: urlNumber(0.1, 0.05, 0.2, 4),
  tab: urlEnum(VALUATION_TABS, "projection"),
};

export const REVERSE_MODES = ["growth", "wacc"] as const;

/// The "where the value comes from" panel's own tab, plus the reverse DCF's solved-for input and market value
/// (0 = not set yet: the lab starts it 25% above the current value).
export const EXPLORE_URL_SCHEMA = {
  explore: urlEnum(EXPLORE_TABS, "bridge"),
  solve: urlEnum(REVERSE_MODES, "growth"),
  mv: urlNumber(0, 0, 100_000, 0),
};
