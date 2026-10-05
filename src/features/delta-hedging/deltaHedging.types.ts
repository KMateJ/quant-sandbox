/// A time step comparing the option's Black–Scholes value with the replicating portfolio value.
export type HedgePoint = {
  t: number;
  option: number;
  replicating: number;
};

/// Result of a discrete delta-hedging simulation over one price path.
export type HedgeResult = {
  data: HedgePoint[];
  payoff: number;
  terminalValue: number;
  hedgeError: number;
};
