import { CALENDAR_DAYS, TRADING_DAYS } from "./engine/desk.config";
import type { InstrumentId, Quote, Side } from "./engine/desk.types";
import { parseInstrument } from "./engine/instruments.math";

/// What a ticket would do if sent now.
export type TicketPreview = {
  mid: number;
  fill: number;
  notional: number;
  cost: number;
  deltaImpact: number;
  gammaImpact: number;
  netAfter: number;
  inBand: boolean;
};

/// Ticker shown on the desk: `"QSBX US"` for the stock, `"QSBX 100C"` for options.
export function instrumentLabel(id: InstrumentId): string {
  const inst = parseInstrument(id);
  return inst.kind === "stock" ? "QSBX US" : `QSBX ${inst.strike}${inst.type}`;
}

/// Ticket quantity as a positive integer, or 0 when the text is not one (no order).
export function parseQty(qty: string): number {
  const n = Number(qty);
  return Number.isInteger(n) && n > 0 ? n : 0;
}

/// Fill, notional, cost and Greek impact of trading `qty` at `quote`; `fee` is the per-ticket fee.
export function ticketPreview(
  quote: Quote,
  side: Side,
  qty: number,
  netDelta: number,
  band: number,
  fee = 0,
): TicketPreview {
  const sign = side === "buy" ? 1 : -1;
  const fill = sign > 0 ? quote.ask : quote.bid;
  const units = qty * quote.mult;
  const deltaImpact = sign * units * quote.delta;
  const netAfter = netDelta + deltaImpact;
  return {
    mid: quote.mid,
    fill,
    notional: units * fill,
    cost: qty > 0 ? units * quote.half + fee : 0,
    deltaImpact,
    gammaImpact: sign * units * quote.gamma,
    netAfter,
    inBand: Math.abs(netAfter) <= band,
  };
}

/// Daily spot move at which gamma losses equal theta income for a short-gamma book, or null when
/// the book is not short gamma and long theta. Theta is per calendar day, converted to a trading day.
export function breakevenMove(gamma: number, thetaPerDay: number): number | null {
  if (!(gamma < 0 && thetaPerDay > 0)) return null;
  return Math.sqrt((2 * thetaPerDay * CALENDAR_DAYS) / TRADING_DAYS / -gamma);
}

/// The strike closest to `S` (first one on a tie).
export function nearestStrike(strikes: number[], S: number): number {
  return strikes.reduce((best, k) => (Math.abs(k - S) < Math.abs(best - S) ? k : best), strikes[0]);
}
