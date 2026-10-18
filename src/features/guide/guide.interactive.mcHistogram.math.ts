import { nextNormal, type Rng } from "../../lib/math/random";

/// European call priced by simulation: terminal prices drawn exactly from GBM under ℚ.
export type McCallSetup = { S0: number; K: number; r: number; sigma: number; T: number };

export const MC_SETUP: McCallSetup = { S0: 100, K: 100, r: 0.05, sigma: 0.2, T: 1 };

/// Fixed histogram range and bin width for terminal prices S_T.
export const MC_BINS = { min: 40, max: 220, width: 4 } as const;
export const MC_BIN_COUNT = (MC_BINS.max - MC_BINS.min) / MC_BINS.width;

/// One point of the running estimate: draws so far, estimate and its 95% band.
export type McEstimatePoint = { n: number; estimate: number; lower: number; upper: number };

/// Accumulated simulation: bin counts, payoff sums and a thinned history of the running estimate.
export type McHistogramState = {
  n: number;
  counts: number[];
  sumPayoff: number;
  sumPayoffSq: number;
  inTheMoney: number;
  /// Bin index of the most recent draw (−1 when outside the range or before the first draw).
  lastBin: number;
  lastPrice: number;
  history: McEstimatePoint[];
};

/// Empty simulation state.
export function emptyMcState(): McHistogramState {
  return { n: 0, counts: new Array(MC_BIN_COUNT).fill(0), sumPayoff: 0, sumPayoffSq: 0, inTheMoney: 0, lastBin: -1, lastPrice: NaN, history: [] };
}

/// One terminal price S_T = S₀ exp((r − σ²/2)T + σ√T Z) under ℚ.
export function drawTerminalPrice(setup: McCallSetup, rng: Rng): number {
  const { S0, r, sigma, T } = setup;
  return S0 * Math.exp((r - 0.5 * sigma * sigma) * T + sigma * Math.sqrt(T) * nextNormal(rng));
}

/// Histogram bin of a price, or −1 outside [min, max).
export function binIndex(price: number): number {
  if (price < MC_BINS.min || price >= MC_BINS.max) return -1;
  return Math.floor((price - MC_BINS.min) / MC_BINS.width);
}

/// Call payoff (S_T − K)⁺.
export const callPayoff = (price: number, K: number) => Math.max(price - K, 0);

/// Discounted estimate, standard error and in-the-money share of the draws so far.
export function mcStats(state: McHistogramState, setup: McCallSetup) {
  const { n } = state;
  const disc = Math.exp(-setup.r * setup.T);
  if (n === 0) return { estimate: NaN, se: NaN, itmShare: NaN };
  const mean = state.sumPayoff / n;
  const variance = n > 1 ? (state.sumPayoffSq - n * mean * mean) / (n - 1) : NaN;
  return { estimate: disc * mean, se: disc * Math.sqrt(Math.max(variance, 0) / n), itmShare: state.inTheMoney / n };
}

/// Draw counts at which the running estimate is recorded: every draw at first, then ~4% apart.
const shouldRecord = (n: number, lastRecorded: number) => n <= 20 || n >= lastRecorded * 1.04;

/// Adds `count` draws and returns the new state (the input state is not modified).
export function addDraws(state: McHistogramState, count: number, setup: McCallSetup, rng: Rng): McHistogramState {
  const next: McHistogramState = { ...state, counts: state.counts.slice(), history: state.history.slice() };
  for (let i = 0; i < count; i++) {
    const price = drawTerminalPrice(setup, rng);
    const payoff = callPayoff(price, setup.K);
    const bin = binIndex(price);
    if (bin >= 0) next.counts[bin] += 1;
    next.n += 1;
    next.sumPayoff += payoff;
    next.sumPayoffSq += payoff * payoff;
    if (price > setup.K) next.inTheMoney += 1;
    next.lastBin = bin;
    next.lastPrice = price;
    const lastRecorded = next.history.length ? next.history[next.history.length - 1].n : 0;
    if (next.n > 1 && shouldRecord(next.n, lastRecorded)) {
      const { estimate, se } = mcStats(next, setup);
      next.history.push({ n: next.n, estimate, lower: estimate - 1.96 * se, upper: estimate + 1.96 * se });
    }
  }
  return next;
}

/// The recorded running estimates, ending at the current draw count.
export function estimateTrail(state: McHistogramState, setup: McCallSetup): McEstimatePoint[] {
  const tail = state.history[state.history.length - 1];
  if (state.n < 2 || tail?.n === state.n) return state.history;
  const { estimate, se } = mcStats(state, setup);
  return [...state.history, { n: state.n, estimate, lower: estimate - 1.96 * se, upper: estimate + 1.96 * se }];
}

/// Draws added per animation frame while playing: one at a time at first, then faster, capped.
export function drawsPerFrame(frame: number): number {
  return Math.min(400, Math.max(1, Math.floor(1.07 ** frame)));
}
