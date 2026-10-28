import { useMemo } from "react";
import { mean, stdDev, valuesAtStep } from "../../../lib/stats";
import { useI18n } from "../../../i18n";
import { brownianTerminalLaw } from "../brownianMotion.math";

type Props = { values: Float64Array; pathCount: number; steps: number; horizon: number; drift: number; vol: number; cursor: number };

const f3 = (v: number) => v.toFixed(3);
const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Empirical vs theoretical mean, standard deviation and share above zero at the cursor time.
export default function BrownianMetrics({ values, pathCount, steps, horizon, drift, vol, cursor }: Props) {
  const { t } = useI18n();
  const step = Math.round((cursor / horizon) * steps);
  const sample = useMemo(() => valuesAtStep(values, pathCount, steps + 1, step), [values, pathCount, steps, step]);
  const law = brownianTerminalLaw(drift, vol, Math.max(cursor, 1e-9));
  const above = sample.filter((v) => v > 0).length / pathCount;
  const rows = [
    { key: "mean", label: t("brownianMotionTerminalMean"), emp: f3(mean(Array.from(sample))), th: f3(law.mean) },
    { key: "sd", label: t("brownianMotionTerminalSd"), emp: f3(stdDev(Array.from(sample))), th: f3(law.sd) },
    { key: "pos", label: t("brownianMotionAboveZero"), emp: pct(above), th: pct(1 - law.cdf(0)) },
  ];
  return (
    <div className="bro-metrics">
      <dl className="lp-ensemble-readout" aria-label={t("brownianMotionMetricsLabel")}>
        <div><dt>{t("brownianMotionCursor")}</dt><dd>t = {cursor.toFixed(2)}</dd></div>
        {rows.map((r) => (
          <div key={r.key}><dt>{r.label}</dt><dd>{r.emp} <span className="bro-theory">/ {r.th}</span></dd></div>
        ))}
      </dl>
      <p className="lp-ensemble-hint">{t("brownianMotionEmpTheory")}</p>
    </div>
  );
}
