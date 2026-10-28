import { urlBool, urlEnum, urlNumber, urlString } from "../../../lib/urlState";
import { SYSTEMIC_URL_SCHEMA } from "../systemicRisk.url";
import { COLOR_BY, SIZE_BY, type ViewMode } from "./network.types";

const VIEWS: readonly ViewMode[] = ["graph", "matrix"];

/// Keys owned by the network explorer; `kinds`/`types` are comma lists of the visible ones (empty = all).
export const NETWORK_URL = {
  sel: urlString(""),
  size: urlEnum(SIZE_BY, "assets"),
  color: urlEnum(COLOR_BY, "kind"),
  kinds: urlString(""),
  types: urlString(""),
  view: urlEnum(VIEWS, "graph"),
  edit: urlBool(false),
  deg: urlNumber(4, 1, 10, 0),
};

/// Shared keys (`net`, `seed`, `edits`) plus the explorer's own, read and written in one call.
export const NETWORK_SCHEMA = { ...SYSTEMIC_URL_SCHEMA, ...NETWORK_URL };

/// Reads a comma list of `all` members; an empty or unrecognised list means everything.
export function parseSet<T extends string>(csv: string, all: readonly T[]): Set<T> {
  const picked = csv.split(",").filter((x): x is T => (all as readonly string[]).includes(x));
  return new Set(picked.length ? picked : all);
}

/// Inverse of `parseSet`: everything visible is written as the empty string.
export const formatSet = <T extends string>(set: ReadonlySet<T>, all: readonly T[]) =>
  set.size === 0 || set.size === all.length ? "" : all.filter((x) => set.has(x)).join(",");
