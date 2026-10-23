import type { Costs } from "./desk.types";

export const TRADING_DAYS = 252;
export const CALENDAR_DAYS = 365;
export const CONTRACT_MULT = 100;
export const STOCK_ID = "STOCK";
export const DEFAULT_COSTS: Costs = { stockHalfSpread: 0.01, optionHalfSpread: 0.05, ticketFee: 0 };
export const DEFAULT_SEED = 7;
