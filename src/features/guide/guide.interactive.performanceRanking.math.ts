// Risk-adjusted performance measures for the "performance-ranking" guide figure.

/// Risk-free rate and market index of the lesson's (made-up) example.
export const PERF_MARKET = { rf: 0.03, mu: 0.1, sigma: 0.18 } as const;

export type FundInput = { id: string; mu: number; sigma: number; beta: number };

/// Four made-up funds, chosen so the measures rank them differently.
export const PERF_FUNDS: FundInput[] = [
  { id: "A", mu: 0.12, sigma: 0.24, beta: 1.2 },
  { id: "B", mu: 0.09, sigma: 0.12, beta: 0.6 },
  { id: "C", mu: 0.14, sigma: 0.3, beta: 1.05 },
  { id: "D", mu: 0.11, sigma: 0.18, beta: 0.95 },
];

export type FundStats = FundInput & {
  sharpe: number;
  treynor: number;
  alpha: number;
  /// Residual (idiosyncratic) volatility σ(ε) = √(σ² − β²σ_M²), the tracking error against the beta-matched index.
  residual: number;
  info: number;
  m2: number;
};

/// Measures the figure can rank by; all are "higher is better".
export type RankKey = "mu" | "sharpe" | "treynor" | "alpha" | "info";

/// Sharpe, Treynor, Jensen's alpha, residual risk, information ratio α/σ(ε) and M² for one fund.
export function fundStats(f: FundInput, m = PERF_MARKET): FundStats {
  const excess = f.mu - m.rf;
  const alpha = f.mu - (m.rf + f.beta * (m.mu - m.rf));
  const residual = Math.sqrt(Math.max(0, f.sigma ** 2 - f.beta ** 2 * m.sigma ** 2));
  const sharpe = excess / f.sigma;
  return {
    ...f,
    sharpe,
    treynor: excess / f.beta,
    alpha,
    residual,
    info: residual > 0 ? alpha / residual : NaN,
    m2: m.rf + sharpe * m.sigma - m.mu,
  };
}

/// The market index as a row of its own (β = 1, α = 0, no residual risk).
export function marketStats(m = PERF_MARKET): FundStats {
  return { ...fundStats({ id: "M", mu: m.mu, sigma: m.sigma, beta: 1 }, m), alpha: 0, residual: 0, info: NaN, m2: 0 };
}

/// Funds sorted best first under `key`, with 1-based ranks by id.
export function rankBy(funds: FundStats[], key: RankKey): { order: FundStats[]; rank: Map<string, number> } {
  const order = [...funds].sort((a, b) => b[key] - a[key]);
  return { order, rank: new Map(order.map((f, i) => [f.id, i + 1])) };
}

/// How many funds hold a different rank under `a` than under `b`.
export function rankDisagreement(funds: FundStats[], a: RankKey, b: RankKey): number {
  const ra = rankBy(funds, a).rank;
  const rb = rankBy(funds, b).rank;
  return funds.filter((f) => ra.get(f.id) !== rb.get(f.id)).length;
}
