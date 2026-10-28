import { urlEnum, urlNumber } from "../../lib/urlState";

export const FF_TABS = ["fund", "alpha", "sort", "cross"] as const;

/// Fewest months between the two ends of the sample period.
export const MIN_WINDOW_MONTHS = 60;
/// Period edges snap to whole years of months.
export const WINDOW_SNAP = 12;

/// Upper bound of the `to` default; clamped to the last month of the loaded data.
export const FF_END = 9999;

/// Query-string state shared by every tab: the open tab and the sample period as month indices.
/// Each tab adds its own prefixed keys with a separate schema.
export const FF_URL_SCHEMA = {
  tab: urlEnum(FF_TABS, "fund"),
  from: urlNumber(0, 0, FF_END, 0),
  to: urlNumber(FF_END, 0, FF_END, 0),
};
