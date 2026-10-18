import { useMemo } from "react";
import SliderField from "../../components/SliderField";
import { SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { ControlGroup, StatCard, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import GeometryCurveChart from "./GeometryCurveChart";
import GuidedExperiments from "../../components/GuidedExperiments";
import GeometryPathChart from "./GeometryPathChart";
import FirstPassagePrediction from "./FirstPassagePrediction";
import FirstPassageRange from "./FirstPassageRange";
import GeometrySimControls from "./GeometrySimControls";
import {
  densityRows,
  finiteMedian,
  firstPassageDensity,
  firstPassageMedian,
  firstPassageTimes,
  hitFraction,
  maxTailProbability,
  stoppedCloud,
} from "./pathGeometry.math";
import { level } from "./pathGeometry.overlays";
import { masked } from "./predictRound";
import { FIRST_PASSAGE_URL_SCHEMA } from "./stochStudio.url";
import { usePathGeometry } from "./usePathGeometry";

const formatTime = (value: number | undefined) => (value === undefined || value > 1 ? "> 1" : value.toFixed(3));

export default function FirstPassageExplore() {
  const { t } = useI18n();
  const sim = usePathGeometry(FIRST_PASSAGE_URL_SCHEMA);
  const { cloud } = sim;
  const barrier = sim.url.a;
  const round = usePredictReveal({ truth: maxTailProbability(barrier, 1), tolerance: 0.03 });

  const stopped = useMemo(() => stoppedCloud(cloud, barrier), [cloud, barrier]);
  const overlays = useMemo(() => [level("barrier", barrier, SERIES_ROLE.candidate)], [barrier]);
  const times = useMemo(() => firstPassageTimes(cloud, barrier), [cloud, barrier]);
  const density = useMemo(
    () => densityRows(times, 0, 1, 40, (tau) => firstPassageDensity(tau, barrier)),
    [times, barrier]
  );
  const theoryMedian = firstPassageMedian(barrier);

  const series: ChartSeries[] = [
    { key: "empirical", label: t("pgFpEmpiricalSeries"), color: SERIES_ROLE.empirical, strokeWidth: 1.5, area: true, areaColor: SERIES_ROLE.empirical },
    { key: "theory", label: t("pgFpTheorySeries"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
  ];

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <GeometrySimControls sim={sim}>
          <ControlGroup label={t("pgBarrier")} hint={<span className="stoch-control-hint">{t("pgFpBarrierHint")}</span>}>
            <SliderField label="a" min={0.2} max={2.5} step={0.05} value={barrier} onChange={(a) => sim.setUrl({ a })} formatValue={(v) => v.toFixed(2)} />
          </ControlGroup>
        </GeometrySimControls>
        <FirstPassagePrediction state={round} barrier={barrier} />
        <Panel title={t("pgMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("pgFpHitEmp")} value={masked(round.revealed, hitFraction(times, 1).toFixed(3))} />
            <StatCard label={t("pgFpHitTheory")} value={masked(round.revealed, maxTailProbability(barrier, 1).toFixed(3))} />
            <StatCard label={t("pgFpMedianEmp")} value={formatTime(finiteMedian(times))} />
            <StatCard label={t("pgFpMedianTheory")} value={theoryMedian.toFixed(3)} />
          </div>
          <p className="stoch-metric-note">{t("pgFpObservation")}</p>
          <IntuitionTrigger sectionId="pg-first-passage" variant="button" />
        </Panel>
        <FirstPassageRange barrier={barrier} />
        <GuidedExperiments keys={["pgFpTry1", "pgFpTry2", "pgFpTry3"]} />
      </aside>
      <div className="stoch-stage">
        <GeometryPathChart
          cloud={stopped}
          overlays={overlays}
          cloudOpacity={0.3}
          title={t("pgFpPathChart")}
          caption={t("pgFpPathCaption")}
          actions={<span className="stoch-chart-readout">a = {barrier.toFixed(2)}</span>}
        />
        <GeometryCurveChart
          data={density}
          series={series}
          xLabel="τ"
          xDomain={[0, 1]}
          title={t("pgFpDensityChart")}
          pinLabel={`a = ${barrier.toFixed(2)}`}
          caption={t("pgFpDensityCaption")}
        />
      </div>
    </div>
  );
}
