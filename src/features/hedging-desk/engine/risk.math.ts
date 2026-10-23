import { stdDev } from "../../../lib/stats/moments";
import { DEFAULT_COSTS, TRADING_DAYS } from "./desk.config";
import type { BookState, Greeks, InstrumentId, Market, Quote } from "./desk.types";
import { quoteInstrument, tauAt } from "./pricing.math";

/// Σ qty·mult·f(quote) over the book at a given spot, tau and vol.
function sumBook(positions: Record<InstrumentId, number>, S: number, tau: number, iv: number, rate: number, f: (q: Quote) => number): number {
  let total = 0;
  for (const [id, qty] of Object.entries(positions)) {
    if (qty === 0) continue;
    const q = quoteInstrument(id, S, tau, iv, rate, DEFAULT_COSTS);
    total += qty * q.mult * f(q);
  }
  return total;
}

/// Net delta of the book in shares at `day`.
export function netDelta(positions: Record<InstrumentId, number>, market: Market, day: number): number {
  return sumBook(positions, market.spot[day], tauAt(day, market.days), market.iv[day], market.rate, (q) => q.delta);
}

/// Book Greeks at the state's current day.
export function bookGreeks(state: BookState, market: Market): Greeks {
  const d = state.day;
  const S = market.spot[d];
  const sum = (f: (q: Quote) => number) => sumBook(state.positions, S, tauAt(d, market.days), market.iv[d], market.rate, f);
  const delta = sum((q) => q.delta);
  const gamma = sum((q) => q.gamma);
  return {
    delta, gamma,
    vega: sum((q) => q.vega),
    theta: sum((q) => q.theta),
    dollarDelta: delta * S,
    dollarGamma1pct: 0.5 * gamma * (0.01 * S) ** 2,
  };
}

/// Mid value of all positions (no cash).
export function positionValue(positions: Record<InstrumentId, number>, S: number, tau: number, iv: number, rate: number): number {
  return sumBook(positions, S, tau, iv, rate, (q) => q.mid);
}

/// Cash plus mid value at the current day; the book starts at 0, so this is its P&L.
export function markToMarket(state: BookState, market: Market): number {
  const d = state.day;
  return state.cash + positionValue(state.positions, market.spot[d], tauAt(d, market.days), market.iv[d], market.rate);
}

/// Value change per (vol shift row, spot shock column), positions and tau unchanged.
export function scenarioGrid(state: BookState, market: Market, spotShocks: number[], volShifts: number[]): number[][] {
  const d = state.day;
  const S = market.spot[d], tau = tauAt(d, market.days), iv = market.iv[d];
  const base = positionValue(state.positions, S, tau, iv, market.rate);
  return volShifts.map((dv) => spotShocks.map((ds) => positionValue(state.positions, S * (1 + ds), tau, iv + dv, market.rate) - base));
}

/// Book value (cash included) across spots, today and at expiry.
export function riskProfile(state: BookState, market: Market, points = 41, span = 0.2): { spot: number; now: number; expiry: number }[] {
  const d = state.day;
  const S = market.spot[d], tau = tauAt(d, market.days), iv = market.iv[d];
  return Array.from({ length: points }, (_, i) => {
    const spot = S * (1 - span + (2 * span * i) / (points - 1));
    return {
      spot,
      now: state.cash + positionValue(state.positions, spot, tau, iv, market.rate),
      expiry: state.cash + positionValue(state.positions, spot, 0, iv, market.rate),
    };
  });
}

/// Annualised sample vol of the last `window` log returns up to `day`; null below 2 returns.
export function realizedVol(spot: number[], day: number, window = 20): number | null {
  const rets: number[] = [];
  for (let i = Math.max(1, day - window + 1); i <= day; i++) rets.push(Math.log(spot[i] / spot[i - 1]));
  return rets.length < 2 ? null : stdDev(rets) * Math.sqrt(TRADING_DAYS);
}
