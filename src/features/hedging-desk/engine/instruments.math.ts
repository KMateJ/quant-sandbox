import { STOCK_ID } from "./desk.config";
import type { InstrumentId, OptionType } from "./desk.types";

/// Option id from type and strike, e.g. `"C100"`, `"P97.5"`.
export function optionId(type: OptionType, strike: number): InstrumentId {
  return `${type}${strike}`;
}

/// Splits an instrument id into stock or option type + strike.
export function parseInstrument(
  id: InstrumentId,
): { kind: "stock" } | { kind: "option"; type: OptionType; strike: number } {
  if (id === STOCK_ID) return { kind: "stock" };
  return { kind: "option", type: id[0] as OptionType, strike: Number(id.slice(1)) };
}

/// True for the underlying stock.
export function isStock(id: InstrumentId): boolean {
  return id === STOCK_ID;
}
