import { usePredictReveal } from "../../components/ui";
import type { DcModel } from "./useDurationConvexity";

/// A guess within this many percentage points of the true price change counts as a hit.
const TOLERANCE_PCT = 0.5;

/// One predict round on the current (drawn) shock: the reader guesses ΔP/P in %, the exact repricing is the truth.
export function useDurationPredict(model: DcModel) {
  const state = usePredictReveal({ truth: model.result.exactPct, tolerance: TOLERANCE_PCT, resetKey: model.round });
  const { history } = state;
  const meanAbsError = history.length ? history.reduce((sum, h) => sum + Math.abs(h.error), 0) / history.length : null;
  return { ...state, rounds: history.length, meanAbsError };
}

export type DurationPredict = ReturnType<typeof useDurationPredict>;
