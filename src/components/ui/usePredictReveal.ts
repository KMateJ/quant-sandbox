import { useState } from "react";
import { recordChallenge } from "../../lib/game/challengeScores";

export type PredictAttempt = { guess: number; error: number; hit: boolean };

export type PredictRevealState = {
  guess: number | null;
  setGuess: (v: number | null) => void;
  revealed: boolean;
  reveal: () => void;
  retry: () => void;
  /// guess − truth once revealed.
  error: number | null;
  /// |error| ≤ tolerance once revealed.
  hit: boolean;
  attempts: number;
  history: PredictAttempt[];
  truth: number;
  tolerance: number;
  challengeId?: string;
};

type Options = {
  truth: number;
  tolerance: number;
  resetKey?: unknown;
  /// Kit challenge id; each reveal is saved as one round.
  challengeId?: string;
};

/// Predict-then-reveal round: the reader commits a guess, reveals the true value, sees the error, and retries.
/// A new `truth` or `resetKey` (e.g. the inputs changed) starts a fresh round but keeps the history.
export function usePredictReveal({ truth, tolerance, resetKey, challengeId }: Options): PredictRevealState {
  const [guess, setGuess] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [history, setHistory] = useState<PredictAttempt[]>([]);
  const [round, setRound] = useState({ truth, resetKey });

  // Reset during render when the question changes (React's "adjust state on prop change" pattern).
  // Object.is, so a NaN truth (e.g. no IRR) counts as unchanged instead of resetting on every render.
  if (!Object.is(round.truth, truth) || !Object.is(round.resetKey, resetKey)) {
    setRound({ truth, resetKey });
    setGuess(null);
    setRevealed(false);
  }

  const error = revealed && guess !== null ? guess - truth : null;
  const hit = error !== null && Math.abs(error) <= tolerance;

  const reveal = () => {
    if (guess === null || revealed) return;
    const e = guess - truth;
    const roundHit = Math.abs(e) <= tolerance;
    setRevealed(true);
    setHistory((h) => [...h, { guess, error: e, hit: roundHit }]);
    if (challengeId) recordChallenge(challengeId, roundHit, Date.now());
  };
  const retry = () => {
    setGuess(null);
    setRevealed(false);
  };

  return { guess, setGuess: (v) => !revealed && setGuess(v), revealed, reveal, retry, error, hit, attempts: history.length, history, truth, tolerance, challengeId };
}
