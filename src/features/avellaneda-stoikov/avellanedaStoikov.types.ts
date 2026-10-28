/// Avellaneda–Stoikov (2008) market: mid s₀, horizon T, volatility σ, step dt, arrivals A·e^{−kδ}, risk aversion γ.
export type AsParams = { s0: number; T: number; sigma: number; dt: number; gamma: number; k: number; A: number; qMax: number };

/// The paper's defaults.
export const DEFAULT_AS_PARAMS: AsParams = { s0: 100, T: 1, sigma: 2, dt: 0.005, gamma: 0.1, k: 1.5, A: 140, qMax: 25 };

/// A quoting rule. `symmetric` quotes mid ± the AS half-spread at the same γ (the paper's comparison);
/// `drawn` shifts the centre by an offset read off a curve over q, fading linearly to 0 at the close like AS.
export type Policy =
  | { kind: "as"; gamma: number }
  | { kind: "symmetric"; gamma: number }
  | { kind: "drawn"; qs: number[]; offsets: number[]; halfSpread: number };

export type DayPoint = { t: number; s: number; bid: number; ask: number; q: number };
export type DayResult = { pnl: number; finalQ: number; path?: DayPoint[] };

export type PolicyStats = { pnl: number[]; finalQ: number[]; mean: number; sd: number; ce: number; qSd: number };
export type FrontierPoint = { gamma: number; mean: number; sd: number };

/// What the tournament worker returns: one entry per policy, in the order sent.
export type TournamentResult = { days: number; seed: number; stats: PolicyStats[]; frontier: FrontierPoint[] };
