import { makeRng } from "../../lib/math/random";
import type { GmParams, GmStep, QuoteOutcome, Trade, YourQuote } from "./glostenMilgrom.types";

/// Probability that the next trader buys when the asset is worth `v`; informed share `pi`, noise 50/50.
export const pBuy = (v: 0 | 1, pi: number): number => (v ? pi + (1 - pi) / 2 : (1 - pi) / 2);

/// Probability that the next trader sells when the asset is worth `v`.
export const pSell = (v: 0 | 1, pi: number): number => 1 - pBuy(v, pi);

const posterior = (mu: number, l1: number, l0: number): number => {
  const den = mu * l1 + (1 - mu) * l0;
  return den > 0 ? (mu * l1) / den : mu;
};

/// Zero-profit ask: E[V | buy] given belief `mu` = P(V = 1).
export const askAt = (mu: number, pi: number): number => posterior(mu, pBuy(1, pi), pBuy(0, pi));

/// Zero-profit bid: E[V | sell] given belief `mu`.
export const bidAt = (mu: number, pi: number): number => posterior(mu, pSell(1, pi), pSell(0, pi));

/// Belief after observing `trade`: the ask after a buy, the bid after a sell.
export const update = (mu: number, trade: Trade, pi: number): number =>
  trade === "B" ? askAt(mu, pi) : bidAt(mu, pi);

/// Quotes and belief before and after each trade, starting from `prior`.
export function gmPath(trades: readonly Trade[], pi: number, prior: number): GmStep[] {
  const out: GmStep[] = [];
  let mu = prior;
  for (const trade of trades) {
    const next = update(mu, trade, pi);
    out.push({ trade, mu, ask: askAt(mu, pi), bid: bidAt(mu, pi), next });
    mu = next;
  }
  return out;
}

/// Seeded trade sequence: each trader is informed with prob `pi` (trades toward `trueV`), else buys 50/50.
export function drawTrades(params: GmParams, seed: number): Trade[] {
  const rng = makeRng(seed);
  const toward: Trade = params.trueV ? "B" : "S";
  return Array.from({ length: params.n }, () => {
    const informed = rng() < params.pi;
    const coin = rng();
    if (informed) return toward;
    return coin < 0.5 ? "B" : "S";
  });
}

/// First trade index after which the belief in the true value reaches `level`, or null.
export function tradesToConfidence(path: readonly GmStep[], trueV: 0 | 1, level = 0.9): number | null {
  const i = path.findIndex((s) => (trueV ? s.next : 1 - s.next) >= level);
  return i < 0 ? null : i + 1;
}

/// Expected log-likelihood gain per trade about V (≈ 2π² for small π).
export const infoPerTrade = (pi: number): number => (pi >= 1 ? Infinity : pi * Math.log((1 + pi) / (1 - pi)));

/// Flips trade `k` (B ↔ S); only steps from `k` on change in `gmPath`.
export const flipTrade = (trades: readonly Trade[], k: number): Trade[] =>
  trades.map((tr, i) => (i === k ? (tr === "B" ? "S" : "B") : tr));

/// Resolves your quote against a Bayes rival for one trade: a buyer lifts the lower ask, a seller hits the
/// higher bid; ties go to nobody. `error` is the mean absolute gap of your two quotes from Bayes.
export function resolveQuote(you: YourQuote, step: GmStep): QuoteOutcome {
  const won = step.trade === "B" ? you.ask < step.ask : you.bid > step.bid;
  const price = step.trade === "B" ? you.ask : you.bid;
  return { trade: step.trade, won, price, error: (Math.abs(you.bid - step.bid) + Math.abs(you.ask - step.ask)) / 2 };
}

/// Your P&L once V is known: you sold to buyers at `price` (gain price − V), bought from sellers (gain V − price).
export const quotePnl = (outcomes: readonly QuoteOutcome[], v: 0 | 1): number =>
  outcomes.reduce((a, o) => (o.won ? a + (o.trade === "B" ? o.price - v : v - o.price) : a), 0);

/// Mean absolute quote error over the revealed trades (0 before the first).
export const meanQuoteError = (outcomes: readonly QuoteOutcome[]): number =>
  outcomes.length ? outcomes.reduce((a, o) => a + o.error, 0) / outcomes.length : 0;

/// Challenge hit: a full round with mean quote error ≤ `limit`.
export const QUOTE_ERROR_LIMIT = 0.03;
