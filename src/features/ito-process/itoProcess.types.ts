/// A simulated step in log-space: `t`, the corrected and naive drift lines, and one value per path key.
export type ItoPoint = Record<string, number>;

/// Result of a log-GBM simulation: the path keys and the per-step data rows.
export type ItoResult = {
  keys: string[];
  data: ItoPoint[];
};
