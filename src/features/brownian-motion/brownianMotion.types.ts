/// A simulated time step: `t` plus one value per path key (`p0`, `p1`, …).
export type BrownianPoint = Record<string, number>;

/// Result of a Brownian-motion simulation: the path keys and the per-step data rows.
export type BrownianResult = {
  keys: string[];
  data: BrownianPoint[];
};
