import { forwardPayoff, optionPayoff } from "../../lib/finance/options";
import { getLegPayoff } from "../payoff-lab/payoff.math";
import type { PresetKey, StrategyLeg } from "../payoff-lab/payoff.types";

export type PayoffInstrument = "call" | "put" | "forward";

/// Payoff at maturity of a long call, put or forward with strike / delivery price K.
export function instrumentPayoff(kind: PayoffInstrument, stockPrice: number, strike: number): number {
  return kind === "forward" ? forwardPayoff(stockPrice, strike) : optionPayoff(stockPrice, strike, kind);
}

/// Payoff sampled on [sMin, sMax], with K itself included so the kink is exact.
export function payoffSeries(
  kind: PayoffInstrument,
  strike: number,
  sMin: number,
  sMax: number,
  points = 41,
): { S: number; payoff: number }[] {
  const step = (sMax - sMin) / (points - 1);
  const xs = Array.from({ length: points }, (_, i) => sMin + i * step);
  if (strike > sMin && strike < sMax && !xs.includes(strike)) xs.push(strike);
  return xs.sort((a, b) => a - b).map((S) => ({ S, payoff: instrumentPayoff(kind, S, strike) }));
}

/// Presets shown by the strategy figure, in display order.
export const STRATEGY_FIGURE_PRESETS = [
  "bull-call-spread",
  "bear-put-spread",
  "long-straddle",
  "long-strangle",
  "long-call-butterfly",
  "synthetic-long-forward",
] as const satisfies readonly PresetKey[];

export type StrategyFigurePreset = (typeof STRATEGY_FIGURE_PRESETS)[number];

/// Each leg's maturity payoff (`leg0`, `leg1`, …) and their sum, against S_T.
export function strategyRows(legs: StrategyLeg[], sMin = 50, sMax = 150, points = 51) {
  const step = (sMax - sMin) / (points - 1);
  const xs = Array.from({ length: points }, (_, i) => sMin + i * step);
  legs.forEach((leg) => leg.strike !== undefined && !xs.includes(leg.strike) && xs.push(leg.strike));
  return xs.sort((a, b) => a - b).map((S) => {
    const row: Record<string, number> = { S, total: 0 };
    legs.forEach((leg, i) => {
      row[`leg${i}`] = getLegPayoff(leg, S);
      row.total += row[`leg${i}`];
    });
    return row;
  });
}
