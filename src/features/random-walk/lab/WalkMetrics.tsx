import { Panel } from "../../../components/layout";
import { StatCard } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import { walkLaw } from "../randomWalk.math";

type Props = { step: number; p: number; h: number; sample: { mean: number; variance: number } };

/// Sample vs theoretical E[S] and Var[S] at the current step, plus the drift per step.
export default function WalkMetrics({ step, p, h, sample }: Props) {
  const { t } = useI18n();
  const law = walkLaw(step, p, h);
  return (
    <Panel title={t("rwMetricsTitle", { s: step })}>
      <div className="stoch-metric-grid">
        <StatCard label={t("rwMeanSample")} value={sample.mean.toFixed(2)} />
        <StatCard label={t("rwMeanTheory")} value={law.mean.toFixed(2)} />
        <StatCard label={t("rwVarSample")} value={sample.variance.toFixed(2)} />
        <StatCard label={t("rwVarTheory")} value={law.variance.toFixed(2)} />
      </div>
      <p className="rw-caption">{t("rwDriftNote", { drift: (h * (2 * p - 1)).toFixed(2) })}</p>
    </Panel>
  );
}
