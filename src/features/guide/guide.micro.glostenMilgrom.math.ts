import { askAt, bidAt, drawTrades, flipTrade, gmPath, tradesToConfidence } from "../glosten-milgrom/glostenMilgrom.math";
import type { GmStep, Trade } from "../glosten-milgrom/glostenMilgrom.types";

export const GM_FIGURE_TRADES = 40;
export const GM_FIGURE_PRIOR = 0.5;
export const GM_FIGURE_SEED = 7;

export type GmLearningInput = {
  pi: number;
  trueV: 0 | 1;
  seed: number;
  /// Tile indices the reader has flipped (B ↔ S) on top of the seeded sequence.
  flips: readonly number[];
};

export type GmLearningRow = { x: number; ask: number; bid: number; mu: number };

export type GmLearning = {
  trades: Trade[];
  path: GmStep[];
  /// Row i holds the belief after i trades and the quotes that belief implies; row 0 is the prior.
  rows: GmLearningRow[];
  belief: number;
  spread: number;
  /// Trades until the belief in the true value first reaches 90%, or null.
  confident: number | null;
};

/// Seeded sequence with the reader's flips applied; flipping a tile twice restores it.
export const flippedTrades = (pi: number, trueV: 0 | 1, seed: number, flips: readonly number[]): Trade[] =>
  flips.reduce<Trade[]>((acc, k) => flipTrade(acc, k), drawTrades({ pi, prior: GM_FIGURE_PRIOR, trueV, n: GM_FIGURE_TRADES }, seed));

/// Quotes and belief after each of the trades, for the Glosten–Milgrom learning figure.
export function gmLearning({ pi, trueV, seed, flips }: GmLearningInput): GmLearning {
  const trades = flippedTrades(pi, trueV, seed, flips);
  const path = gmPath(trades, pi, GM_FIGURE_PRIOR);
  const quotes = (mu: number) => ({ ask: askAt(mu, pi), bid: bidAt(mu, pi), mu });
  const rows = [{ x: 0, ...quotes(GM_FIGURE_PRIOR) }, ...path.map((s, i) => ({ x: i + 1, ...quotes(s.next) }))];
  const last = rows[rows.length - 1];
  return { trades, path, rows, belief: last.mu, spread: last.ask - last.bid, confident: tradesToConfidence(path, trueV) };
}
