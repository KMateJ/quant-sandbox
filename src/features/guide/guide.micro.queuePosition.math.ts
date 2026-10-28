import { makeRng, nextExponential, nextPoisson } from "../../lib/math/random";
import { normCdf } from "../../lib/stats/distributions";

/// Size of the reader's resting order, in shares.
export const MY_SIZE = 400;
/// Mean size of one market sell order; sizes are exponential, so E[S²] = 2·mean².
export const MEAN_SELL_SIZE = 100;

export type QueueFlow = {
  /// Market sell orders per minute.
  lambda: number;
  meanSize: number;
  /// Shares cancelled ahead of the order per minute.
  cancelRate: number;
};

export type QueueState = { ahead: number; filled: number };

/// Expected minutes until the shares ahead are gone, treating sells and cancels as constant rates.
export function expectedWait(ahead: number, sellRate: number, cancelRate: number): number {
  const rate = sellRate + cancelRate;
  return rate > 0 ? ahead / rate : Infinity;
}

/// Market sell orders per minute that give `sellRate` shares per minute at the mean order size.
export const lambdaFromVolume = (sellRate: number, meanSize = MEAN_SELL_SIZE) => sellRate / meanSize;

/// Normal approximation to P(the first share of the order fills within `horizon` minutes): sell volume is a
/// compound Poisson sum with mean λhμ and variance λhE[S²], cancels remove cancelRate·h shares ahead.
export function fillProbability(args: {
  ahead: number;
  lambda: number;
  meanSize: number;
  horizon: number;
  cancelRate: number;
  secondMoment?: number;
}): number {
  const { ahead, lambda, meanSize, horizon, cancelRate, secondMoment = 2 * meanSize * meanSize } = args;
  const mean = lambda * horizon * meanSize + cancelRate * horizon;
  const sd = Math.sqrt(lambda * horizon * secondMoment);
  if (sd === 0) return mean >= ahead + 1 ? 1 : 0;
  return 1 - normCdf((ahead + 1 - mean) / sd);
}

/// Fill probability over a grid of queue positions, for the curve in the figure.
export function fillCurve(flow: QueueFlow, horizon: number, maxAhead: number, points = 41) {
  return Array.from({ length: points }, (_, i) => {
    const ahead = (maxAhead * i) / (points - 1);
    return { ahead, p: fillProbability({ ahead, horizon, ...flow }) };
  });
}

/// One minute of the queue: cancels ahead (constant rate) then market sells with Poisson arrivals and
/// exponential sizes eat the front; sells beyond the shares ahead fill the order, up to `size`.
export function simulateMinute(state: QueueState, flow: QueueFlow, seed: number, size = MY_SIZE): QueueState {
  const rng = makeRng(seed);
  let sold = 0;
  for (let i = nextPoisson(rng, flow.lambda); i > 0; i--) sold += nextExponential(rng, 1 / flow.meanSize);
  const ahead = Math.max(0, state.ahead - flow.cancelRate);
  const reached = Math.max(0, sold - ahead);
  return { ahead: Math.max(0, ahead - sold), filled: Math.min(size, state.filled + reached) };
}
