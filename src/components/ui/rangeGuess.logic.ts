/// One finished calibration round: the reader's interval, the realised outcome, whether it fell inside, and the score.
export type RangeRound = { lo: number; hi: number; outcome: number; hit: boolean; score: number };

/// Calibration verdict: too few rounds, intervals too narrow (overconfident), too wide, or consistent with the nominal level.
export type CalibrationVerdict = "pending" | "tooNarrow" | "tooWide" | "calibrated";

/// Rounds needed before a verdict is given.
export const MIN_VERDICT_ROUNDS = 5;
/// One-sided 95% normal quantile used for the calibration band.
const Z_BAND = 1.64;

/// Interval (Winkler) score of a central (1 − α) interval: width + (2/α)·distance of `outcome` outside it. Lower is better.
export function intervalScore(lo: number, hi: number, outcome: number, alpha: number): number {
  const penalty = (2 / alpha) * (Math.max(0, lo - outcome) + Math.max(0, outcome - hi));
  return hi - lo + penalty;
}

/// Share of rounds whose outcome fell inside the interval; NaN when there are no rounds.
export function hitRate(rounds: readonly { hit: boolean }[]): number {
  if (rounds.length === 0) return NaN;
  return rounds.filter((r) => r.hit).length / rounds.length;
}

/// Mean interval score over the rounds; NaN when there are no rounds.
export function meanScore(rounds: readonly { score: number }[]): number {
  if (rounds.length === 0) return NaN;
  return rounds.reduce((s, r) => s + r.score, 0) / rounds.length;
}

/// Binomial check of `hits` out of `n` against the nominal coverage p: outside p ± 1.64·√(p(1−p)/n) is miscalibrated.
export function calibrationVerdict(hits: number, n: number, nominal: number, minRounds = MIN_VERDICT_ROUNDS): CalibrationVerdict {
  if (n < minRounds) return "pending";
  const band = Z_BAND * Math.sqrt((nominal * (1 - nominal)) / n);
  const rate = hits / n;
  if (rate < nominal - band) return "tooNarrow";
  if (rate > nominal + band) return "tooWide";
  return "calibrated";
}

/// Scores a revealed round: inside test plus the interval score at α = 1 − nominal.
export function scoreRound(lo: number, hi: number, outcome: number, nominal: number): RangeRound {
  return { lo, hi, outcome, hit: outcome >= lo && outcome <= hi, score: intervalScore(lo, hi, outcome, 1 - nominal) };
}

/// Position of `v` on a [min, max] track as a fraction in [0, 1].
export function trackFraction(v: number, min: number, max: number): number {
  if (max <= min) return 0;
  return Math.min(1, Math.max(0, (v - min) / (max - min)));
}
