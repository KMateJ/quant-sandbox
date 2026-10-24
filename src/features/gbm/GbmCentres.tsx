import { useMemo } from "react";
import { PredictReveal, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import { terminalValues } from "../../lib/stats/ensemble";
import GbmCentresChart, { type CentreMarker } from "./GbmCentresChart";
import { gbmCentres, gbmTerminalLaw, sampleCentres } from "./gbm.math";

type Props = {
  s0: number;
  drift: number;
  vol: number;
  horizon: number;
  setVol: (sigma: number) => void;
  cloud: Float64Array;
  pathCount: number;
  stepCount: number;
};

const SIGMA_RANGE: [number, number] = [0.05, 0.8];

/// Mean vs median vs mode of S_T: drag σ and the median and mode slide left while the mean stays put.
export default function GbmCentres({ s0, drift, vol, horizon, setVol, cloud, pathCount, stepCount }: Props) {
  const { t } = useI18n();
  const c = gbmCentres(s0, drift, vol, horizon);
  const law = useMemo(() => gbmTerminalLaw(s0, drift, vol, horizon), [s0, drift, vol, horizon]);
  const sample = useMemo(() => sampleCentres(terminalValues(cloud, pathCount, stepCount), c.mean), [cloud, pathCount, stepCount, c.mean]);
  const pr = usePredictReveal({ challengeId: "gbm-median", truth: c.median, tolerance: 0.03 * s0, resetKey: `${s0}|${drift}|${vol}|${horizon}` });
  // The median and mode stay hidden until the reader has committed a first guess.
  const shown = pr.revealed || pr.attempts > 0;
  const num = (v: number) => v.toFixed(2);
  const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

  const markers: CentreMarker[] = [
    { key: "mean", value: c.mean, label: t("gbmCentreMean"), color: "var(--text)" },
    ...(shown ? [
      { key: "median", value: c.median, label: t("gbmCentreMedian"), color: "var(--primary)" },
      { key: "mode", value: c.mode, label: t("gbmCentreMode"), color: "var(--warning-title)", dash: "5 3" },
    ] : []),
  ];
  const samples: CentreMarker[] = [
    { key: "smean", value: sample.mean, label: `${t("gbmCentreSampleMean")} ${num(sample.mean)}`, color: "var(--text)" },
    ...(shown ? [{ key: "smedian", value: sample.median, label: `${t("gbmCentreSampleMedian")} ${num(sample.median)}`, color: "var(--primary)" }] : []),
  ];
  const stats: [string, string][] = [
    [t("gbmCentreMean"), num(c.mean)],
    [t("gbmCentreMedian"), shown ? num(c.median) : "?"],
    [t("gbmCentreMode"), shown ? num(c.mode) : "?"],
    [t("gbmCentreGap"), shown ? num(c.gap) : "?"],
    [t("gbmCentreBelowMean"), `${pct(sample.shareBelow)} (${t("gbmCentreTheory")} ${pct(c.shareBelowMean)})`],
  ];

  return (
    <div className="lp-section-body">
      <p className="control-hint">{t("gbmCentreHint")}</p>
      <GbmCentresChart pdf={law.pdf} xMax={Math.max(2.4 * c.mean, 1.2 * s0)} markers={markers} samples={samples} sigma={vol}
        sigmaRange={SIGMA_RANGE} onSigma={setVol} sigmaLabel="σ" ariaLabel={t("gbmCentreAria")} />
      <div className="stats-grid">
        {stats.map(([label, value]) => (
          <div key={label} className="stat-card"><div className="stat-title">{label}</div><div className="stat-value">{value}</div></div>
        ))}
      </div>
      <PredictReveal state={pr} prompt={t("gbmCentrePrompt", { mean: num(c.mean) })} format={num} step={1} min={0}
        explain={{
          question: t("gbmExplainQuestion"),
          options: [
            { text: t("gbmExplainDrag"), feedback: t("gbmExplainDragFb"), correct: true },
            { text: t("gbmExplainEqual"), feedback: t("gbmExplainEqualFb") },
            { text: t("gbmExplainNoise"), feedback: t("gbmExplainNoiseFb") },
          ],
        }} />
    </div>
  );
}
