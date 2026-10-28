/// Tape generator settings; `S` and `sigma` in cents, `alpha` = informed share of the spread, `n` trades.
export type SpeParams = { S: number; sigma: number; alpha: number; n: number };

/// One trade print in cents: price `p`, true side `q`, and the efficient price `m` just before the trade.
export type Print = { t: number; p: number; q: 1 | -1; m: number };

export type RollResult = { s: number; cov: number; defined: boolean };
export type HuangStoll = { halfSpread: number; adverseShare: number };
export type ConvergencePoint = { n: number; roll: number; effective: number };
export type SpeMode = "simulate" | "predict" | "challenge";
export type SpeTab = "tape" | "slope" | "split";
