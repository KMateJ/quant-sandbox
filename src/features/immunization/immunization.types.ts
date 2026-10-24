import type { Holding } from "../../lib/finance/immunization";

/// A flat curve with a tilt: the yield at `τ` years is `level + slope·(τ − 7)/10`.
export type Curve = { level: number; slope: number };

/// A yearly curve shock in basis points: a parallel move and a twist (long end up, short end down).
export type Shock = { parallelBp: number; twistBp: number };

/// A bond held in one of the tenor slots; `slot` indexes `TENORS`.
export type Position = Holding & { slot: number };

/// What one round did to the surplus (assets − PV of the liability), in currency units; the parts sum to the change.
export type Attribution = { carry: number; rate: number; convexity: number; cost: number };

export type RoundResult = { round: number; shock: Shock; surplus: number; assets: number; liability: number; attribution: Attribution };

export type GameConfig = {
  liability: number;
  /// Years until the liability is due; the game lasts this many rounds.
  years: number;
  level0: number;
  /// Cost of trading, in bp of the value moved.
  costBp: number;
  maxParallelBp: number;
  maxTwistBp: number;
  /// Further payments of `amount` at game year `year`, part of the liability from round `from` on.
  extraLiabilities?: ExtraLiability[];
};

export type ExtraLiability = { amount: number; year: number; from: number };

export type GameState = {
  seed: number;
  round: number;
  curve: Curve;
  cash: number;
  positions: Position[];
  /// Cost paid by rebalancing since the last round (a positive amount).
  pendingCost: number;
  history: RoundResult[];
};
