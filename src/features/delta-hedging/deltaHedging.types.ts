/// Inputs of a discrete delta-hedge simulation of one European call.
export type HedgeParams = {
  s0: number;
  strike: number;
  /// Years to expiry.
  maturity: number;
  rate: number;
  vol: number;
  /// Rebalances per year (4 = quarterly, 252 = daily); the path itself is always daily.
  freq: number;
};

/// One point of the daily grid: the market, the hedge and the mark-to-market error.
export type HedgeRow = {
  t: number;
  S: number;
  /// Black–Scholes delta right now (what a continuous hedger would hold).
  deltaTrue: number;
  /// Shares actually held, constant between rebalances.
  deltaHeld: number;
  option: number;
  replicating: number;
  /// replicating − option: what the hedger is up or down against the option.
  error: number;
  rebalanced: boolean;
};

/// Result of one hedged path.
export type HedgeResult = {
  rows: HedgeRow[];
  premium: number;
  payoff: number;
  terminalValue: number;
  hedgeError: number;
  maxAbsError: number;
  rebalances: number;
  gridSteps: number;
};

/// Terminal hedge errors of many paths at one rebalancing frequency.
export type FrequencyStudyRow = {
  freq: number;
  rebalances: number;
  errors: number[];
  sd: number;
  meanAbs: number;
};
