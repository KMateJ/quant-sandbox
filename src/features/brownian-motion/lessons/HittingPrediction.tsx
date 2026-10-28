import { PredictReveal } from "../../../components/ui";
import type { PredictRevealState } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { BGK_BETA } from "./pathGeometry.math";
import { explainSpec } from "../../../components/lesson/predictRound";
import type { HittingExperiment } from "./useHittingExperiment";

const fmt = (v: number) => v.toFixed(3);

/// "Watching only n grid points, which share of paths is seen crossing a?" — the simulation's own answer.
export default function HittingPrediction({ state, e }: { state: PredictRevealState; e: HittingExperiment }) {
  const { t } = useI18n();
  const vars = {
    n: e.monitoring,
    a: e.barrier.toFixed(2),
    mu: e.drift.toFixed(2),
    cont: fmt(e.stats.continuous),
    shift: (BGK_BETA / Math.sqrt(e.monitoring)).toFixed(3),
  };
  return (
    <PredictReveal
      state={state}
      prompt={t("pgHitPredictPrompt", vars)}
      format={fmt}
      step={0.01}
      min={0}
      max={1}
      explain={explainSpec(t, "pgHitEx", 1, vars)}
    />
  );
}
