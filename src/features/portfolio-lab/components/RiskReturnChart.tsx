import { useMemo } from "react";
import { ScatterChart } from "../../../components/charts";
import type { ChartReferenceLine, ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import type { usePortfolioModel } from "../usePortfolioModel";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Props = {
  m: ReturnType<typeof usePortfolioModel>;
};

/// Risk vs return scatter: random cloud, efficient frontier, CML and reference portfolios.
export default function RiskReturnChart({ m }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { assets, current } = m;

  const cloudPoints = useMemo(
    () =>
      m.cloud.map((p) => ({
        x: p.vol,
        y: p.ret,
        tooltipRows: assets
          .map((a, i) => ({ label: a.name, value: pct(p.weights[i]), color: a.color, w: p.weights[i] }))
          .filter((r) => r.w >= 0.005)
          .sort((a, b) => b.w - a.w)
          .map(({ label, value, color }) => ({ label, value, color })),
      })),
    [m.cloud, assets]
  );
  const assetPoints = useMemo(
    () => assets.map((a) => ({ x: a.sigma, y: a.mu, color: a.color, label: a.name })),
    [assets]
  );

  const series: ScatterSeries[] = [
    { key: "cloud", label: t("portfolioCloudLabel"), color: "#64748b", radius: 2.5, opacity: 0.35, legend: true, points: cloudPoints },
    { key: "frontier", label: t("portfolioFrontierLabel"), color: "#3b82f6", line: true, strokeWidth: 3, points: m.frontier.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "cml", label: t("portfolioCmlLabel"), color: "#22c55e", line: true, dash: "6 4", strokeWidth: 2, points: m.cml.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "assets", label: t("portfolioAssetPointsLabel"), color: "#94a3b8", radius: 6, legend: true, points: assetPoints },
    { key: "cash", label: t("portfolioCashLabel"), color: "#94a3b8", radius: 5, legend: false, points: [{ x: 0, y: m.riskFree, label: t("portfolioCashLabel") }] },
    { key: "gmv", label: t("portfolioGmvLabel"), color: "#38bdf8", radius: 6, legend: false, points: [{ x: m.gmv.vol, y: m.gmv.ret, label: t("portfolioGmvLabel") }] },
    { key: "tangency", label: t("portfolioTangencyLabel"), color: "#22c55e", radius: 6, legend: false, points: [{ x: m.tangency.vol, y: m.tangency.ret, label: t("portfolioTangencyLabel") }] },
    { key: "current", label: t("portfolioCurrentLabel"), color: "#f97316", radius: 9, points: [{ x: current.vol, y: current.ret, label: t("portfolioCurrentLabel") }] },
  ];
  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: current.vol, color: "#64748b", dash: "4 4" },
    { axis: "y", value: current.ret, color: "#64748b", dash: "4 4" },
  ];

  return (
    <ChartContainer title={t("portfolioChartTitle")}>
      <div className="chart-wrap">
        <ScatterChart
          series={series}
          xDomain={[0, m.volMax]}
          yDomain={[m.retMin, m.retMax]}
          referenceLines={referenceLines}
          isMobile={isMobile}
          xFormat={pct}
          yFormat={pct}
          xLabel={t("portfolioVolAxis")}
          yLabel={t("portfolioRetAxis")}
        />
      </div>
    </ChartContainer>
  );
}
