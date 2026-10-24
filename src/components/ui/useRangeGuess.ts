import { useState } from "react";
import { recordChallenge } from "../../lib/game/challengeScores";
import { calibrationVerdict, hitRate, meanScore, scoreRound, type CalibrationVerdict, type RangeRound } from "./rangeGuess.logic";

export type RangeGuessState = {
  lo: number;
  hi: number;
  /// Sets the interval (ends are sorted); ignored while a round is revealed.
  setRange: (lo: number, hi: number) => void;
  revealed: boolean;
  reveal: () => void;
  /// Starts the next round, keeping the interval and the history.
  next: () => void;
  /// The realised value once revealed.
  outcome: number | null;
  hit: boolean;
  /// Interval score of the revealed round.
  score: number | null;
  history: RangeRound[];
  hits: number;
  /// Share of rounds inside the interval; NaN before the first round.
  hitRate: number;
  meanScore: number;
  verdict: CalibrationVerdict;
  nominal: number;
  challengeId?: string;
};

type Options = {
  /// The value to cover; a function is called once per reveal, so a lab can draw a fresh random realisation.
  truth: number | (() => number);
  /// Target coverage of the interval (0.9 = a 90% range).
  nominal?: number;
  /// Starting interval of the first round.
  initial?: readonly [number, number];
  /// Track domain; the interval is clamped into it, so a lab whose domain moves never reports an off-track range.
  bounds?: readonly [number, number];
  /// A changed key (compared with Object.is, so pass a primitive) while revealed starts a new round.
  resetKey?: unknown;
  /// Kit challenge id; each reveal is saved as one round.
  challengeId?: string;
};

/// Calibration round: the reader sets an interval meant to hold the truth with probability `nominal`, reveals,
/// and across rounds sees the hit rate and interval score. History lives for the session (component state).
export function useRangeGuess({ truth, nominal = 0.9, initial = [0, 1], bounds, resetKey, challengeId }: Options): RangeGuessState {
  const [range, setRangeState] = useState<[number, number]>([initial[0], initial[1]]);
  const [outcome, setOutcome] = useState<number | null>(null);
  const [history, setHistory] = useState<RangeRound[]>([]);
  const [key, setKey] = useState(resetKey);

  // Adjust state on prop change: a new question after a reveal opens a fresh round.
  if (!Object.is(key, resetKey)) {
    setKey(resetKey);
    if (outcome !== null) setOutcome(null);
  }

  const clampTo = (v: number) => (bounds ? Math.min(bounds[1], Math.max(bounds[0], v)) : v);
  const lo = clampTo(range[0]);
  const hi = clampTo(range[1]);
  const revealed = outcome !== null;
  const last = revealed ? history[history.length - 1] : undefined;
  const hits = history.filter((r) => r.hit).length;

  const reveal = () => {
    if (revealed) return;
    const value = typeof truth === "function" ? truth() : truth;
    if (!Number.isFinite(value)) return;
    const round = scoreRound(lo, hi, value, nominal);
    setOutcome(value);
    setHistory((h) => [...h, round]);
    if (challengeId) recordChallenge(challengeId, round.hit, Date.now());
  };

  return {
    lo,
    hi,
    setRange: (a, b) => !revealed && setRangeState(a <= b ? [a, b] : [b, a]),
    revealed,
    reveal,
    next: () => setOutcome(null),
    outcome,
    hit: last?.hit ?? false,
    score: last?.score ?? null,
    history,
    hits,
    hitRate: hitRate(history),
    meanScore: meanScore(history),
    verdict: calibrationVerdict(hits, history.length, nominal),
    nominal,
    challengeId,
  };
}
