import { PredictReveal, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import { STEP_MOMENTS, sumSkewness } from "./clt.math";
import { CLT_PREDICT_N } from "../../lib/stochastic/clt.types";
import { explainSpec, withRevealEffect } from "../../components/lesson/predictRound";

const fmt = (v: number) => v.toFixed(3);

/// "How skewed is Z₃₀ for exponential steps?" — committing jumps the experiment to that configuration.
export default function CltPrediction({ onReveal }: { onReveal: () => void }) {
  const { t } = useI18n();
  const truth = sumSkewness("exponential", CLT_PREDICT_N);
  const state = usePredictReveal({ challengeId: "clt-spread", truth, tolerance: 0.05 });
  const vars = { n: CLT_PREDICT_N, gamma: STEP_MOMENTS.exponential.skewness, skew: fmt(truth) };

  return (
    <PredictReveal
      state={withRevealEffect(state, onReveal)}
      prompt={t("stochCltPredictPrompt", vars)}
      format={fmt}
      step={0.05}
      min={0}
      max={2}
      explain={explainSpec(t, "stochCltEx", 1, vars)}
    />
  );
}
