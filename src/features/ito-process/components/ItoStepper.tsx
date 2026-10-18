import { useMemo } from "react";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../components/charts";
import { useI18n, type TranslationKey } from "../../../i18n";
import { itoStepPath } from "../itoProcess.math";

type Stage = 1 | 2 | 3;
/// `stage` / `onStage` make the step controlled (e.g. kept in the URL by the lab).
type Props = { s0: number; drift: number; vol: number; horizon: number; seed: number; isMobile: boolean; stage: Stage; onStage: (stage: Stage) => void };

const STEPS = 50;
const TITLE: Record<Stage, TranslationKey> = { 1: "itoStep1Title", 2: "itoStep2Title", 3: "itoStep3Title" };

/// Itô's lemma in three steps on one coarse path: draw dW, square it (Σ(dW)² ≈ t), see the −½σ² drift correction in ln S.
export default function ItoStepper({ s0, drift, vol, horizon, seed, isMobile, stage, onStage: setStage }: Props) {
  const { t } = useI18n();
  const rows = useMemo(() => itoStepPath(s0, drift, vol, horizon, STEPS, seed), [s0, drift, vol, horizon, seed]);
  const last = rows[rows.length - 1];
  const gap = 0.5 * vol * vol * horizon;
  const f3 = (v: number) => v.toFixed(3);

  const series: Record<Stage, ChartSeries[]> = {
    1: [
      { key: "w", label: t("itoStepW"), color: SERIES_PALETTE[0], strokeWidth: 2 },
      { key: "dw", label: t("itoStepDw"), color: SERIES_PALETTE[1], strokeWidth: 1.25, dash: "3 3" },
    ],
    2: [
      { key: "sq", label: t("itoStepSq"), color: SERIES_PALETTE[0], strokeWidth: 2 },
      { key: "t", label: t("itoStepT"), color: "var(--text)", strokeWidth: 1.5, dash: "6 4" },
    ],
    3: [
      { key: "ln", label: t("itoStepLn"), color: SERIES_PALETTE[0], strokeWidth: 1.75 },
      { key: "correct", label: t("itoProcessCorrectLabel"), color: "#22c55e", strokeWidth: 2.5 },
      { key: "naive", label: t("itoProcessNaiveLabel"), color: "#f59e0b", strokeWidth: 2, dash: "6 4" },
    ],
  };
  const text: Record<Stage, string> = {
    1: t("itoStep1Text", { n: STEPS, dt: (horizon / STEPS).toFixed(3) }),
    2: t("itoStep2Text"),
    3: t("itoStep3Text", { gap: f3(gap) }),
  };
  const readout: Record<Stage, [string, string][]> = {
    1: [[t("itoStepWT"), f3(last.w)]],
    2: [[t("itoStepSqT"), f3(last.sq)], ["T", f3(horizon)]],
    3: [[t("itoStepGap"), f3(gap)], [t("itoProcessCorrectedDrift"), f3(drift - 0.5 * vol * vol)]],
  };

  return (
    <div className="ito-stepper">
      <div className="ito-stepper-head">
        <strong>{t(TITLE[stage])}</strong>
        <span className="lp-ensemble-hint">{t("itoStepOf", { k: stage })}</span>
      </div>
      <p className="ito-stepper-text" aria-live="polite">{text[stage]}</p>
      <div className="chart-wrap">
        <LineChart data={rows} xKey="t" series={series[stage]} xDomain={[0, horizon]} isMobile={isMobile} curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`} valueFormat={f3} />
      </div>
      <dl className="lp-ensemble-readout">
        {readout[stage].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
      <div className="seed-compact">
        <button type="button" className="lp-btn" disabled={stage === 1} onClick={() => setStage((stage - 1) as Stage)}>← {t("itoStepPrev")}</button>
        <button type="button" className="lp-btn lp-btn--primary" disabled={stage === 3} onClick={() => setStage((stage + 1) as Stage)}>{t("itoStepNext")} →</button>
      </div>
    </div>
  );
}
