/// A simulated time step: `t`, the theoretical mean `mean`, and one value per path key.
export type GbmPoint = Record<string, number>;

/// Result of a GBM simulation: the path keys and the per-step data rows.
export type GbmResult = {
  keys: string[];
  data: GbmPoint[];
};
