import { useMemo } from "react";
import SectionCard from "../../../../components/SectionCard";
import { useMediaQuery } from "../../../../components/useMediaQuery";
import { ScatterChart, SERIES_PALETTE, type ScatterSeries } from "../../../../components/charts";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import { evalPiecewise, legPayoff, payoffYDomain } from "../replication.math";
import { legLabel } from "../replication.labels";
import type { ReplicationModel } from "../useReplication";

/// Click-to-draw target payoff with draggable nodes and the selected portfolio's legs underneath.
export default function ReplicationChart({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { shape, pw, xMax, selected, showLegs, setShowLegs, addNode, moveNode, market } = model;

  const yDomain = useMemo(() => payoffYDomain(pw, shape.nodes, xMax), [pw, shape.nodes, xMax]);

  const series = useMemo<ScatterSeries[]>(() => {
    const xs = [...pw.xs.filter((x) => x < xMax), xMax];
    const list: ScatterSeries[] = [];

    if (showLegs) {
      selected.legs.forEach((leg, i) => {
        const kinkXs = [0, ...(leg.strike && leg.strike < xMax ? [leg.strike] : []), xMax];
        list.push({
          key: `leg-${i}`,
          label: legLabel(leg, t),
          color: SERIES_PALETTE[(i + 1) % SERIES_PALETTE.length],
          points: kinkXs.map((x) => ({ x, y: legPayoff(leg, x) })),
          line: true,
          dash: "5 4",
          strokeWidth: 1.5,
          opacity: 0.85,
          legend: false,
        });
      });
    }

    list.push({
      key: "target",
      label: t("replChartTarget"),
      color: SERIES_PALETTE[0],
      points: xs.map((x) => ({ x, y: evalPiecewise(pw, x) })),
      line: true,
      strokeWidth: 3,
    });
    list.push({
      key: "nodes",
      label: t("replChartNodes"),
      color: SERIES_PALETTE[0],
      points: shape.nodes.map((n) => ({ x: n.x, y: n.y })),
      draggable: true,
      radius: 7,
    });
    return list;
  }, [pw, xMax, showLegs, selected, shape.nodes, t]);

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
          referenceLines={[
            { axis: "x", value: market.spot, color: "#94a3b8", dash: "4 4" },
            { axis: "y", value: 0, color: "#64748b", dash: "4 4" },
          ]}
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
