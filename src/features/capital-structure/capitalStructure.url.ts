import { urlEnum, urlNumber } from "../../lib/urlState";

export const MAX_DE = 3;
export const CAPITAL_WORLDS = ["noTax", "tax", "tradeoff"] as const;

/// Query-string schema of the capital-structure lab (defaults are left out).
export const CAPITAL_URL_SCHEMA = {
  ru: urlNumber(0.1, 0, 0.3, 4),
  kd: urlNumber(0.05, 0, 0.2, 4),
  tax: urlNumber(0.21, 0, 0.5, 2),
  de: urlNumber(1, 0, MAX_DE, 2),
  world: urlEnum(CAPITAL_WORLDS, "tax"),
};
