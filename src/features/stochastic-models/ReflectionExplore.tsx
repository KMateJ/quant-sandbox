import { useMemo, useState } from "react";
import SliderField from "../../components/SliderField";
import { SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { ControlGroup, StatCard } from "../../components/ui";
import { useI18n } from "../../i18n";
import GeometryCurveChart from "./GeometryCurveChart";
import GuidedExperiments from "./GuidedExperiments";
import GeometryPathChart from "./GeometryPathChart";
import GeometrySimControls from "./GeometrySimControls";
import TimeCursorControl from "./TimeCursorControl";
import { extremaUpTo, firstPassageTimes, maxTailProbability, nextHittingPath, reflectAfterHit, tailFraction } from "./pathGeometry.math";
import { curve, curvesExtent, level, marker } from "./pathGeometry.overlays";
import { pathPoints } from "./brownianFundamentals.math";
import { usePathGeometry } from "./usePathGeometry";
import { useTimeCursor } from "./useTimeCursor";

const LEVELS = Array.from({ length: 31 }, (_, i) => i / 10);

export default function ReflectionExplore() {
  const { t } = useI18n();
  const sim = usePathGeometry(2000);
  const { cloud } = sim;
  const cursor = useTimeCursor(cloud.steps);
  const [barrier, setBarrier] = useState(1);
  const [pathCursor, setPathCursor] = useState(0);

  const times = useMemo(() => firstPassageTimes(cloud, barrier), [cloud, barrier]);
  const start = pathCursor % cloud.pathCount;
  const path = Number.isFinite(times[start]) ? start : nextHittingPath(times, start);
  const tau = times[path];

  const overlays = useMemo(() => {
    const points = pathPoints(cloud, path);
    const reflected = reflectAfterHit(points, barrier);
    const [lo, hi] = curvesExtent(points, reflected);
    const n = cursor.step + 1;
    const lines = [
      level("barrier", barrier, SERIES_ROLE.candidate),
      curve("reflected", reflected.slice(0, n), SERIES_ROLE.reference, 2, "5 3"),
      curve("path", points.slice(0, n), SERIES_ROLE.estimate, 2.25),
    ];
    if (tau <= cursor.time) lines.push(marker("tau", tau, lo, hi, SERIES_ROLE.candidate));
    return lines;
  }, [cloud, path, barrier, tau, cursor.step, cursor.time]);

  const terminal = useMemo(() => cloud.values.slice(cloud.steps * cloud.pathCount), [cloud]);
  const maxima = useMemo(() => extremaUpTo(cloud, cloud.steps).max, [cloud]);
  const curveData = useMemo(
    () => LEVELS.map((a) => ({
      x: a,
      maxTail: tailFraction(maxima, a),
      doubled: Math.min(1, 2 * tailFraction(terminal, a)),
      theory: maxTailProbability(a, 1),
    })),
    [maxima, terminal]
  );

  const series: ChartSeries[] = [
    { key: "maxTail", label: t("pgReflMaxTailSeries"), color: SERIES_ROLE.empirical, strokeWidth: 2 },
    { key: "doubled", label: t("pgReflDoubledSeries"), color: SERIES_ROLE.estimate, strokeWidth: 2, dash: "2 3" },
    { key: "theory", label: t("pgReflTheorySeries"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
  ];

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <GeometrySimControls sim={sim}>
          <ControlGroup label={t("pgBarrier")} hint={<span className="stoch-control-hint">{t("pgReflBarrierHint")}</span>}>
            <SliderField label="a" min={0.2} max={2.5} step={0.05} value={barrier} onChange={setBarrier} formatValue={(v) => v.toFixed(2)} />
          </ControlGroup>
          <TimeCursorControl cursor={cursor} steps={cloud.steps} labelKey="pgReflAnimation" />
          <button className="preset-btn" type="button" onClick={() => setPathCursor(nextHittingPath(times, path))}>
            {t("pgNextCrossingPath")}
          </button>
        </GeometrySimControls>
        <Panel title={t("pgMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("pgReflMaxTailEmp")} value={tailFraction(maxima, barrier).toFixed(3)} />
            <StatCard label={t("pgReflDoubledEmp")} value={(2 * tailFraction(terminal, barrier)).toFixed(3)} />
            <StatCard label={t("pgReflTheory")} value={maxTailProbability(barrier, 1).toFixed(3)} />
            <StatCard label={t("pgReflEndAbove")} value={tailFraction(terminal, barrier).toFixed(3)} />
          </div>
          <p className="stoch-metric-note">{t("pgReflObservation")}</p>
          <IntuitionTrigger sectionId="pg-reflection" variant="button" />
        </Panel>
        <GuidedExperiments keys={["pgReflTry1", "pgReflTry2", "pgReflTry3"]} />
      </aside>
      <div className="stoch-stage">
        <GeometryPathChart
          cloud={cloud}
          overlays={overlays}
          cloudOpacity={0.1}
          title={t("pgReflPathChart")}
          caption={t("pgReflPathCaption")}
          actions={<span className="stoch-chart-readout">{Number.isFinite(tau) ? `τₐ = ${tau.toFixed(3)}` : "τₐ > 1"}</span>}
          legend={[
            { color: SERIES_ROLE.estimate, label: t("pgReflOriginal") },
            { color: SERIES_ROLE.reference, label: t("pgReflReflected") },
            { color: SERIES_ROLE.candidate, label: t("pgBarrierLegend") },
          ]}
        />
        <GeometryCurveChart
          data={curveData}
          series={series}
          xLabel="a"
          xDomain={[0, 3]}
          yDomain={[0, 1]}
          referenceLines={[{ axis: "x", value: barrier, color: SERIES_ROLE.candidate, dash: "4 4" }]}
          title={t("pgReflCurveChart")}
          caption={t("pgReflCurveCaption")}
        />
      </div>
    </div>
  );
}
