import {
  blackScholesCall,
  blackScholesDelta,
  blackScholesGamma,
  blackScholesPut,
  blackScholesPutDelta,
  blackScholesPutTheta,
  blackScholesTheta,
  blackScholesVega,
} from "../../black-scholes/blackScholes.math";
import { CALENDAR_DAYS, CONTRACT_MULT, TRADING_DAYS } from "./desk.config";
import type { Costs, InstrumentId, Quote } from "./desk.types";
import { parseInstrument } from "./instruments.math";

/// Years to expiry at `day` on a `days`-long trading-day grid.
export function tauAt(day: number, days: number): number {
  return (days - day) / TRADING_DAYS;
}

/// Bid/ask quote and per-unit Greeks; vega per vol point, theta per calendar day.
export function quoteInstrument(
  id: InstrumentId,
  S: number,
  tau: number,
  iv: number,
  rate: number,
  costs: Costs,
): Quote {
  const inst = parseInstrument(id);
  if (inst.kind === "stock") {
    const half = costs.stockHalfSpread;
    return { mid: S, bid: Math.max(S - half, 0), ask: S + half, half, mult: 1, delta: 1, gamma: 0, vega: 0, theta: 0 };
  }
  const K = inst.strike;
  const call = inst.type === "C";
  const mid = call ? blackScholesCall(S, K, tau, rate, iv) : blackScholesPut(S, K, tau, rate, iv);
  const half = tau > 0 ? costs.optionHalfSpread : 0;
  const theta = call ? blackScholesTheta(S, K, tau, rate, iv) : blackScholesPutTheta(S, K, tau, rate, iv);
  return {
    mid,
    bid: Math.max(mid - half, 0),
    ask: mid + half,
    half,
    mult: CONTRACT_MULT,
    delta: call ? blackScholesDelta(S, K, tau, rate, iv) : blackScholesPutDelta(S, K, tau, rate, iv),
    gamma: blackScholesGamma(S, K, tau, rate, iv),
    vega: blackScholesVega(S, K, tau, rate, iv) / 100,
    theta: theta / CALENDAR_DAYS,
  };
}
