import { PredictReveal, usePredictReveal } from "../../../components/ui";
import { useI18n } from "../../../i18n";

type Props = {
  /// Share of paths touching the barrier by T, in [0, 1] (theory when μ = 0, otherwise the simulated share).
  truth: number;
  /// Offer the reflection-principle "why" step (only meaningful without drift).
  explain: boolean;
  barrier: number;
  horizon: number;
};

/// "What share of paths touch the barrier?" with a reflection-principle explanation step.
export default function BarrierPredict({ truth, explain, barrier, horizon }: Props) {
  const { t } = useI18n();
  const state = usePredictReveal({ challengeId: "barrier-hit", truth: truth * 100, tolerance: 5, resetKey: `${barrier}|${horizon}` });
  const options = [
    { text: t("bmExplainSame"), feedback: t("bmExplainSameFb") },
    { text: t("bmExplainRight"), feedback: t("bmExplainRightFb"), correct: true },
    { text: t("bmExplainHalf"), feedback: t("bmExplainHalfFb") },
    { text: t("bmExplainTime"), feedback: t("bmExplainTimeFb") },
  ];
  return (
    <PredictReveal
      state={state}
      prompt={t("bmPredictPrompt", { b: barrier.toFixed(2), T: horizon.toFixed(2) })}
      format={(v) => `${v.toFixed(1)}%`}
      step={1}
      min={0}
      max={100}
      explain={explain ? { question: t("bmExplainQuestion"), options } : undefined}
    />
  );
}
