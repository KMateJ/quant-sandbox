import {
  diffVariance,
  effectiveSpread,
  huangStoll,
  lagPairs,
  rollEstimate,
  simulateTape,
} from "../spread-estimation/spreadEstimation.math";
import type { Print } from "../spread-estimation/spreadEstimation.types";

/// Fixed seed of the lesson figure, so the text can quote its default readouts.
export const ROLL_BOUNCE_SEED = 7;
/// Trades drawn on the tape chart.
export const TAPE_SHOWN = 120;
/// Points drawn on the scatter (the estimates use the full sample).
export const SCATTER_SHOWN = 400;

export type RollBounceInput = { S: number; alpha: number; sigma: number; n: number };

/// Roll's spread from the covariance of successive price changes: 2√(−cov); NaN when cov ≥ 0.
export const rollFromCov = (cov: number) => (cov < 0 ? 2 * Math.sqrt(-cov) : NaN);

/// The value Roll's estimator converges to when a share α of the spread is informed: S·√(1 − α).
export const rollLimit = (S: number, alpha: number) => S * Math.sqrt(1 - alpha);

/// Everything the figure shows for one setting: the first trades, a thinned scatter and the estimators on all n trades.
export function rollBounce(input: RollBounceInput, seed = ROLL_BOUNCE_SEED) {
  const tape: Print[] = simulateTape(input, seed);
  const roll = rollEstimate(tape);
  const pairs = lagPairs(tape);
  const step = Math.max(1, Math.ceil(pairs.length / SCATTER_SHOWN));
  const slope = roll.cov / diffVariance(tape);
  return {
    shown: tape.slice(0, TAPE_SHOWN),
    scatter: pairs.filter((_, i) => i % step === 0),
    slope,
    roll: roll.s,
    effective: effectiveSpread(tape),
    hsAlpha: huangStoll(tape).adverseShare,
    limit: rollLimit(input.S, input.alpha),
    errorPct: roll.defined ? (roll.s / input.S - 1) * 100 : NaN,
  };
}
