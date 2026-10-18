import { useMemo, useState } from "react";
import { SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import GeometryCurveChart from "./GeometryCurveChart";
import GuidedExperiments from "../../components/GuidedExperiments";
import GeometryPathChart from "./GeometryPathChart";
import GeometrySimControls from "./GeometrySimControls";
import RunningMaxPrediction from "./RunningMaxPrediction";
import TimeCursorControl from "./TimeCursorControl";
import { densityRows, expectedMax, extremaUpTo, maxDensity, runningMax, runningMin, sampleMean } from "./pathGeometry.math";
import { curve, curvesExtent, marker } from "./pathGeometry.overlays";
import { pathPoints } from "./brownianFundamentals.math";
import { masked, withRevealEffect } from "./predictRound";
import { RUNNING_MAX_URL_SCHEMA } from "./stochStudio.url";
import { usePathGeometry } from "./usePathGeometry";
import { useTimeCursor } from "./useTimeCursor";

export default function RunningMaxExplore() {
  const { t } = useI18n();
  const sim = usePathGeometry(RUNNING_MAX_URL_SCHEMA);
  const { cloud } = sim;
  const cursor = useTimeCursor(cloud.steps);
  const [path, setPath] = useState(0);
  const shownPath = path % cloud.pathCount;
  const { step, time } = cursor;
  const round = usePredictReveal({ truth: expectedMax(1), tolerance: 0.05 });
  const show = (v: number) => masked(round.revealed, v.toFixed(3));

  const points = useMemo(() => pathPoints(cloud, shownPath), [cloud, shownPath]);
  const overlays = useMemo(() => {
    const visible = points.slice(0, step + 1);
    const [lo, hi] = curvesExtent(points);
    return [
      curve("max", runningMax(visible), SERIES_ROLE.reference, 2.5),
      curve("min", runningMin(visible), SERIES_ROLE.candidate, 2.5),
      curve("path", visible, SERIES_ROLE.estimate, 2),
      marker("now", time, lo, hi, SERIES_ROLE.estimate),
    ];
  }, [points, step, time]);

  const extrema = useMemo(() => extremaUpTo(cloud, step), [cloud, step]);
  const meanMax = sampleMean(extrema.max);
  const meanRange = meanMax - sampleMean(extrema.min);
  const density = useMemo(() => {
    const hi = 3.5 * Math.sqrt(time);
    const absW = cloud.values.slice(step * cloud.pathCount, (step + 1) * cloud.pathCount).map(Math.abs);
    const maxRows = densityRows(extrema.max, 0, hi, 35, (m) => maxDensity(m, time));
    const absRows = densityRows(absW, 0, hi, 35, () => 0);
    return maxRows.map((row, i) => ({ ...row, absW: absRows[i].empirical }));
  }, [cloud, extrema, step, time]);

  const series: ChartSeries[] = [
    { key: "empirical", label: t("pgMaxEmpirical"), color: SERIES_ROLE.empirical, strokeWidth: 1.5, area: true, areaColor: SERIES_ROLE.empirical },
    { key: "absW", label: t("pgAbsWEmpirical"), color: SERIES_ROLE.estimate, strokeWidth: 1.5, dash: "2 3" },
    { key: "theory", label: t("pgMaxTheory"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
  ];

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <GeometrySimControls sim={sim}>
          <TimeCursorControl cursor={cursor} steps={cloud.steps} labelKey="pgObsTime" hintKey="pgObsTimeHint" />
          <button className="preset-btn" type="button" onClick={() => setPath(shownPath + 1)}>
            {t("pgNextPath")}
          </button>
        </GeometrySimControls>
        <RunningMaxPrediction state={withRevealEffect(round, () => cursor.setStep(cloud.steps))} />
        <Panel title={t("pgMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("pgMeanMaxEmp")} value={show(meanMax)} />
            <StatCard label={t("pgMeanMaxTheory")} value={show(expectedMax(time))} />
            <StatCard label={t("pgMeanRangeEmp")} value={show(meanRange)} />
            <StatCard label={t("pgMeanRangeTheory")} value={show(2 * expectedMax(time))} />
          </div>
          <p className="stoch-metric-note">{t("pgMaxObservation")}</p>
          <IntuitionTrigger sectionId="pg-running-max" variant="button" />
        </Panel>
        <GuidedExperiments keys={["pgMaxTry1", "pgMaxTry2", "pgMaxTry3"]} />
      </aside>
      <div className="stoch-stage">
        <GeometryPathChart
          cloud={cloud}
          overlays={overlays}
          visibleSteps={step + 1}
          title={t("pgMaxPathChart")}
          caption={t("pgMaxPathCaption")}
          actions={<span className="stoch-chart-readout">t = {time.toFixed(2)}</span>}
          legend={[
            { color: SERIES_ROLE.estimate, label: t("pgHighlightedPath") },
            { color: SERIES_ROLE.reference, label: t("pgRunningMax") },
            { color: SERIES_ROLE.candidate, label: t("pgRunningMin") },
          ]}
        />
        <GeometryCurveChart
          data={density}
          series={series}
          xLabel="m"
          title={t("pgMaxDensityChart")}
          caption={t("pgMaxDensityCaption")}
        />
      </div>
    </div>
  );
}
