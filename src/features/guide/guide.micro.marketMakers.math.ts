import { makeRng, nextNormal } from "../../lib/math/random";

export type RoundTripInput = {
  /// Half-spread in cents: the maker quotes `mid ± halfSpread`.
  halfSpread: number;
  /// Standard deviation of the mid's change per step, in cents.
  sigma: number;
  seed: number;
  steps?: number;
  /// Step at which a customer buys at the ask (the maker sells).
  buyAt?: number;
  /// Step at which a customer sells at the bid (the maker buys back).
  sellAt?: number;
  size?: number;
};

export type RoundTrip = {
  mid: number[];
  bid: number[];
  ask: number[];
  fills: { buy: { step: number; price: number }; sell: { step: number; price: number } };
  /// Round-trip income in USD at an unchanged mid: `2 · halfSpread · size`.
  spreadIncome: number;
  /// USD lost (negative) or gained from the mid moving while the maker is short.
  inventoryPnl: number;
  total: number;
};

export const MID_START = 10000;
export const ROUND_TRIP_SIZE = 100;
export const ROUND_TRIP_SEED = 3;

/// A maker who re-quotes `mid ± halfSpread` every step sells to a buyer at `buyAt` and buys back from a seller at `sellAt`.
/// P&L per share is `(ask − bid) − Δm` with `Δm = mid[sellAt] − mid[buyAt]`, split into spread income and inventory P&L.
export function roundTrip({ halfSpread, sigma, seed, steps = 30, buyAt = 5, sellAt = 20, size = ROUND_TRIP_SIZE }: RoundTripInput): RoundTrip {
  const rng = makeRng(seed);
  rng(); // first output of makeRng is biased across nearby seeds
  const mid = [MID_START];
  for (let i = 1; i <= steps; i++) mid.push(mid[i - 1] + sigma * nextNormal(rng));
  const bid = mid.map((m) => m - halfSpread);
  const ask = mid.map((m) => m + halfSpread);
  const sold = ask[buyAt];
  const bought = bid[sellAt];
  const cents = (c: number) => (c * size) / 100;
  const spreadIncome = cents(2 * halfSpread);
  const inventoryPnl = cents(mid[buyAt] - mid[sellAt]);
  return {
    mid,
    bid,
    ask,
    fills: { buy: { step: buyAt, price: sold }, sell: { step: sellAt, price: bought } },
    spreadIncome,
    inventoryPnl,
    total: cents(sold - bought),
  };
}

/// Spread in basis points of the mid: `10⁴ · (ask − bid) / mid`.
export const spreadBp = (bid: number, ask: number) => (1e4 * (ask - bid)) / ((ask + bid) / 2);
