import { useMemo } from "react";
import { SERIES_ROLE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { IntuitionTrigger } from "../../components/intuition";
import { Panel } from "../../components/layout";
import { StatCard, usePredictReveal } from "../../components/ui";
import { useI18n } from "../../i18n";
import GeometryCurveChart from "./GeometryCurveChart";
import GuidedExperiments from "../../components/GuidedExperiments";
import GeometryPathChart from "./GeometryPathChart";
import HittingControls from "./HittingControls";
import HittingPrediction from "./HittingPrediction";
import { curve, level } from "./pathGeometry.overlays";
import { masked } from "./predictRound";
import { useHittingExperiment } from "./useHittingExperiment";

export default function HittingExplore() {
  const { t } = useI18n();
  const e = useHittingExperiment();
  const round = usePredictReveal({ truth: e.stats.discrete, tolerance: 0.03 });

  const overlays = useMemo(
    () => [
      level("barrier", e.barrier, SERIES_ROLE.candidate),
      curve("fine", e.finePath, SERIES_ROLE.estimate, 1.25),
      curve("monitored", e.coarsePath, SERIES_ROLE.reference, 2.25),
    ],
    [e.barrier, e.finePath, e.coarsePath]
  );

  const series: ChartSeries[] = [
    { key: "empirical", label: t("pgHitEmpiricalSeries", { n: e.monitoring }), color: SERIES_ROLE.empirical, strokeWidth: 2 },
    { key: "continuous", label: t("pgHitContinuousSeries"), color: SERIES_ROLE.reference, strokeWidth: 2, dash: "6 4" },
    { key: "bgk", label: t("pgHitBgkSeries"), color: SERIES_ROLE.estimate, strokeWidth: 2, dash: "2 3" },
  ];

  return (
    <div className="stoch-experiment">
      <aside className="stoch-sidebar">
        <HittingControls e={e} />
        <HittingPrediction state={round} e={e} />
        <Panel title={t("pgMetrics")}>
          <div className="stoch-metric-grid">
            <StatCard label={t("pgHitDiscreteEmp", { n: e.monitoring })} value={masked(round.revealed, e.stats.discrete.toFixed(3))} />
            <StatCard label={t("pgHitFineEmp")} value={e.stats.fine.toFixed(3)} />
            <StatCard label={t("pgHitContinuous")} value={e.stats.continuous.toFixed(3)} />
            <StatCard label={t("pgHitBgk")} value={masked(round.revealed, e.stats.bgk.toFixed(3))} />
          </div>
          <p className="stoch-metric-note">{t("pgHitObservation")}</p>
          <IntuitionTrigger sectionId="pg-discrete-monitoring" variant="button" />
        </Panel>
        <GuidedExperiments keys={["pgHitTry1", "pgHitTry2", "pgHitTry3"]} />
      </aside>
      <div className="stoch-stage">
        <GeometryPathChart
          cloud={e.coarse}
          overlays={overlays}
          cloudOpacity={0.08}
          title={t("pgHitPathChart")}
          caption={t("pgHitPathCaption")}
          actions={<span className="stoch-chart-readout">{t(e.isMissed ? "pgHitMissedReadout" : "pgHitNoMissReadout")}</span>}
          legend={[
            { color: SERIES_ROLE.estimate, label: t("pgHitFineLegend") },
            { color: SERIES_ROLE.reference, label: t("pgHitMonitoredLegend") },
            { color: SERIES_ROLE.candidate, label: t("pgBarrierLegend") },
          ]}
        />
        <GeometryCurveChart
          data={e.timeRows}
          series={series}
          xLabel="t"
          xDomain={[0, 1]}
          yDomain={[0, 1]}
          title={t("pgHitTimeChart")}
          caption={t("pgHitTimeCaption")}
        />
        <GeometryCurveChart
          data={e.levelRows}
          series={series}
          xLabel="a"
          xDomain={[0, 3]}
          yDomain={[0, 1]}
          referenceLines={[{ axis: "x", value: e.barrier, color: SERIES_ROLE.candidate, dash: "4 4" }]}
          title={t("pgHitLevelChart")}
          pinLabel={`μ = ${e.drift.toFixed(2)}, n = ${e.monitoring}`}
          caption={t("pgHitLevelCaption")}
        />
      </div>
    </div>
  );
}
