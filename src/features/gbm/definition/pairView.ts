import { abmLaw, gbmLaw, type AbmGbmPair } from "../gbm.definition.math";

export const MODEL_COLOR = { abm: "var(--chart-3)", gbm: "var(--chart-1)" } as const;

/// Everything the comparison charts share: the simulated pair, grid, exact laws and one y-range for both models.
export type PairView = {
  pair: AbmGbmPair;
  paths: number;
  steps: number;
  dt: number;
  horizon: number;
  /// Path highlighted in both models: the one whose GBM end value is the median.
  hero: number;
  yDomain: [number, number];
  laws: { abm: ReturnType<typeof abmLaw>; gbm: ReturnType<typeof gbmLaw> };
};

/// Shared range: ABM's ±3σ and GBM's upper 99.5% quantile, always including 0 so the zero line is visible.
export function pairDomain(s0: number, mu: number, sigma: number, horizon: number): [number, number] {
  const abm = abmLaw(s0, mu, sigma, horizon);
  const gbmHi = s0 * Math.exp((mu - 0.5 * sigma * sigma) * horizon + 2.6 * sigma * Math.sqrt(horizon));
  return [Math.min(0, abm.mean - 3 * abm.sd), Math.max(abm.mean + 3 * abm.sd, gbmHi)];
}
