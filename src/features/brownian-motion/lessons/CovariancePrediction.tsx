import { PredictReveal } from "../../../components/ui";
import type { PredictRevealState } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { explainSpec } from "../../../components/lesson/predictRound";

type Props = { state: PredictRevealState; s: number; t: number };

const fmt = (v: number) => v.toFixed(3);

/// "What is Cov(W(s), W(t))?" for the current window; the matrix keeps the off-diagonal hidden until revealed.
export default function CovariancePrediction({ state, s, t: time }: Props) {
  const { t } = useI18n();
  const vars = { s: s.toFixed(2), t: time.toFixed(2), st: (s * time).toFixed(3), min: Math.min(s, time).toFixed(2) };
  return (
    <PredictReveal
      state={state}
      prompt={t("stochCovPredictPrompt", vars)}
      format={fmt}
      step={0.01}
      min={-1}
      max={1}
      explain={explainSpec(t, "stochCovEx", 2, vars)}
    />
  );
}
