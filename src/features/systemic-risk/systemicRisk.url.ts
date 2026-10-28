import { urlEnum, urlNumber, urlString } from "../../lib/urlState";

export const NETWORK_SHAPES = ["core-periphery", "complete", "ring", "random", "starter"] as const;

/// Query-string keys every Systemic Risk page shares, so a network built on one page opens on the others.
/// Pages add their own keys in their own schema files; `edits` is an encoded edit list defined by plan 05.
export const SYSTEMIC_URL_SCHEMA = {
  net: urlEnum(NETWORK_SHAPES, "core-periphery"),
  seed: urlNumber(3, 1, 9999, 0),
  edits: urlString(""),
};
