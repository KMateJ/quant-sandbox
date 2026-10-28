import type { PredictExplainSpec, PredictRevealState } from "../ui";
import type { TranslationKey } from "../../i18n";

type T = (key: TranslationKey, options?: Record<string, string | number>) => string;

/// Lessons with a predict–observe–explain round; each owns `<prefix>Q`, `<prefix>A0…A2` and `<prefix>F0…F2`.
export type ExplainPrefix = "stochCltEx" | "stochSqrtEx" | "stochCovEx" | "stochTrEx" | "pgMaxEx" | "pgFpEx" | "pgHitEx";

const OPTIONS = [0, 1, 2] as const;

/// The "why?" step of a round from its i18n keys; `correct` marks the right reason, `vars` fill the texts.
export function explainSpec(t: T, prefix: ExplainPrefix, correct: 0 | 1 | 2, vars?: Record<string, string | number>): PredictExplainSpec {
  return {
    question: t(`${prefix}Q`, vars),
    options: OPTIONS.map((i) => ({ text: t(`${prefix}A${i}`, vars), feedback: t(`${prefix}F${i}`, vars), correct: i === correct })),
  };
}

/// Same round, but committing a guess also runs `effect` (e.g. moves the experiment to the asked configuration).
export function withRevealEffect(state: PredictRevealState, effect: () => void): PredictRevealState {
  return {
    ...state,
    reveal: () => {
      if (state.guess === null || state.revealed) return;
      state.reveal();
      effect();
    },
  };
}

/// A readout that would give the answer away stays hidden until the round is revealed.
export const masked = (revealed: boolean, value: string) => (revealed ? value : "?");
