import { useMemo } from "react";
import { InlineMath } from "react-katex";
import SectionCard from "../../../../components/SectionCard";
import { useMediaQuery } from "../../../../components/useMediaQuery";
import { LineChart, SERIES_PALETTE, type ChartSeries } from "../../../../components/charts";
import { CHART_COLORS } from "../../../../components/charts/chart.theme";
import { IntuitionTrigger } from "../../../../components/intuition";
import { useI18n } from "../../../../i18n";
import type { ReplicationModel } from "../useReplication";

/// Risk-neutral density recovered from call prices, against the flat-vol lognormal when skewed.
export default function DensityChart({ model }: { model: ReplicationModel }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { density, market, xMax, bl } = model;

  const series = useMemo<ChartSeries[]>(() => {
    const list: ChartSeries[] = [
      { key: "density", label: t(market.skew !== 0 ? "replDensitySkew" : "replDensityFlat"), color: SERIES_PALETTE[0], strokeWidth: 2.5, area: true },
    ];
    if (market.skew !== 0) {
      list.push({ key: "flat", label: t("replDensityFlat"), color: SERIES_PALETTE[1], strokeWidth: 1.5, dash: "5 4" });
    }
    return list;
  }, [market.skew, t]);

  return (
    <SectionCard
      className="chart-card"
      title={t("replDensityTitle")}
      subtitle={t("replDensitySubtitle")}
      headerRight={<IntuitionTrigger sectionId="breeden-litzenberger" />}
    >
      <div className="repl-density-head">
        <InlineMath math={"q(K)=e^{rT}\\,\\frac{\\partial^2 C}{\\partial K^2}"} />
        <span className="repl-density-mass">
          {t("replDensityMass")}: <strong>{bl.mass.toFixed(4)}</strong>
        </span>
      </div>
      <div className="chart-wrap repl-density-wrap">
        <LineChart
          data={density}
          xKey="S"
          series={series}
          xDomain={[0, xMax]}
          referenceLines={[{ axis: "x", value: market.spot, color: CHART_COLORS.axis, dash: "4 4" }]}
          isMobile={isMobile}
          tooltipLabel={(x) => `K = ${x.toFixed(1)}`}
          valueFormat={(v) => v.toFixed(5)}
        />
      </div>
    </SectionCard>
  );
}
