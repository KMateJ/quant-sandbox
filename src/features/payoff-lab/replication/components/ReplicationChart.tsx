import { useMemo } from "react";
import SectionCard from "../../../../components/SectionCard";
import { useMediaQuery } from "../../../../components/useMediaQuery";
import { ScatterChart, SERIES_PALETTE, type ScatterSeries } from "../../../../components/charts";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import { payoffYDomain } from "../replication.math";
import { legSeries, strikeLines, sumSeries, targetSeries } from "../replication.series";
import type { ReplicationModel } from "../useReplication";

/// Click-to-draw target payoff with draggable nodes, the selected portfolio's legs and their sum.
export default function ReplicationChart({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { shape, pw, tradable, xMax, selected, showLegs, setShowLegs, addNode, moveNode, market } = model;

  const yDomain = useMemo(() => payoffYDomain(pw, shape.nodes, xMax), [pw, shape.nodes, xMax]);

  const series = useMemo<ScatterSeries[]>(() => [
    ...(showLegs ? legSeries(selected, xMax, t) : []),
    targetSeries(pw, xMax, t("replChartTarget")),
    sumSeries(selected, tradable, xMax, t("replChartSum")),
    {
      key: "nodes",
      label: t("replChartNodes"),
      color: SERIES_PALETTE[0],
      points: shape.nodes.map((n) => ({ x: n.x, y: n.y })),
      draggable: true,
      radius: 7,
    },
  ], [pw, tradable, xMax, showLegs, selected, shape.nodes, t]);

  const referenceLines = useMemo(() => [
    ...strikeLines(selected),
    { axis: "x" as const, value: market.spot, color: "#94a3b8", dash: "4 4" },
    { axis: "y" as const, value: 0, color: "#64748b", dash: "4 4" },
  ], [selected, market.spot]);

  return (
    <SectionCard
      className="chart-card"
      title={t("replChartTitle")}
      subtitle={t("replShapeHint")}
      headerRight={
        <div className="chart-actions">
          <button
            type="button"
            className={showLegs ? "metric-button active" : "metric-button"}
            aria-pressed={showLegs}
            onClick={() => setShowLegs(!showLegs)}
          >
            {t("replShowLegs")}
          </button>
          <IntuitionTrigger sectionId="carr-madan" />
        </div>
      }
    >
      <div className="chart-wrap">
        <ScatterChart
          series={series}
          xDomain={[0, xMax]}
          yDomain={yDomain}
          referenceLines={referenceLines}
          isMobile={isMobile}
          xLabel="S_T"
          xFormat={(v) => v.toFixed(0)}
          yFormat={(v) => v.toFixed(1)}
          onPlotClick={addNode}
          onDrag={(x, y, index) => moveNode(index, x, y)}
        />
      </div>
    </SectionCard>
  );
}
