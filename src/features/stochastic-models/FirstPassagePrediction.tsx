import { PredictReveal } from "../../components/ui";
import type { PredictRevealState } from "../../components/ui";
import { useI18n } from "../../i18n";
import { maxTailProbability, terminalTailProbability } from "./pathGeometry.math";
import { explainSpec } from "./predictRound";

const fmt = (v: number) => v.toFixed(3);

/// "Which share of paths reaches a by t = 1?" — the reflection principle, committed before the hit cards show.
export default function FirstPassagePrediction({ state, barrier }: { state: PredictRevealState; barrier: number }) {
  const { t } = useI18n();
  const vars = { a: barrier.toFixed(2), end: fmt(terminalTailProbability(barrier, 1)), hit: fmt(maxTailProbability(barrier, 1)) };
  return (
    <PredictReveal
      state={state}
      prompt={t("pgFpPredictPrompt", vars)}
      format={fmt}
      step={0.01}
      min={0}
      max={1}
      explain={explainSpec(t, "pgFpEx", 1, vars)}
    />
  );
}
