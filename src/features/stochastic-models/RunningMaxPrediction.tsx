import { PredictReveal } from "../../components/ui";
import type { PredictRevealState } from "../../components/ui";
import { useI18n } from "../../i18n";
import { expectedMax } from "./pathGeometry.math";
import { explainSpec } from "./predictRound";

const fmt = (v: number) => v.toFixed(3);

/// "What is the average running maximum at t = 1?" — committed before the E[M(t)] cards are shown.
export default function RunningMaxPrediction({ state }: { state: PredictRevealState }) {
  const { t } = useI18n();
  const vars = { mean: fmt(expectedMax(1)) };
  return (
    <PredictReveal
      state={state}
      prompt={t("pgMaxPredictPrompt")}
      format={fmt}
      step={0.05}
      min={0}
      max={3}
      explain={explainSpec(t, "pgMaxEx", 2, vars)}
    />
  );
}
