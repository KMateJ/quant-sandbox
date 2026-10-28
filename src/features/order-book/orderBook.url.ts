import { urlEnum, urlNumber } from "../../lib/urlState";

export const OBK_MODES = ["simulate", "predict", "challenge"] as const;
export const TICKETS = ["market", "limit"] as const;
export const LIQUIDITY = ["thin", "normal", "deep"] as const;
export const SIDES = ["buy", "sell"] as const;

/// Query-string state of the order book lab.
export const OBK_URL_SCHEMA = {
  mode: urlEnum(OBK_MODES, "simulate"),
  liquidity: urlEnum(LIQUIDITY, "normal"),
  ticket: urlEnum(TICKETS, "market"),
  side: urlEnum(SIDES, "buy"),
  size: urlNumber(1000, 100, 20000, 0),
  seed: urlNumber(1, 1, 9999, 0),
};
