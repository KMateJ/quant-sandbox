import { useMemo } from "react";
import type { ScatterSeries } from "../../components/charts";
import { useI18n } from "../../i18n";
import type { usePortfolioModel } from "./usePortfolioModel";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Marker radius of the random-portfolio cloud (also the click target size when adopting a point).
export const CLOUD_RADIUS = 2.5;

/// Scatter series for the risk/return chart: cloud, frontier, CML, assets, reference portfolios and the current mix.
/// Built once at the view level so the pin & compare snapshot sees the same series on every tab.
export function useRiskReturnSeries(m: ReturnType<typeof usePortfolioModel>): ScatterSeries[] {
  const { t } = useI18n();
  const { assets, current } = m;

  const cloudPoints = useMemo(
    () =>
      m.cloud.map((p) => {
        let maxI = 0;
        for (let i = 1; i < p.weights.length; i++) {
          if (p.weights[i] > p.weights[maxI]) maxI = i;
        }
        return {
          x: p.vol,
          y: p.ret,
          color: assets[maxI]?.color,
          opacity: Math.max(0.1, Math.min(0.9, p.weights[maxI])),
          tooltipRows: assets
            .map((a, i) => ({ label: a.name, value: pct(p.weights[i]), color: a.color, w: p.weights[i] }))
            .filter((r) => r.w >= 0.005)
            .sort((a, b) => b.w - a.w)
            .map(({ label, value, color }) => ({ label, value, color })),
        };
      }),
    [m.cloud, assets]
  );
  const assetPoints = useMemo(
    () => assets.map((a) => ({ x: a.sigma, y: a.mu, color: a.color, label: a.name })),
    [assets]
  );

  return [
    { key: "cloud", label: t("portfolioCloudLabel"), color: "#64748b", radius: CLOUD_RADIUS, opacity: 0.35, legend: true, points: cloudPoints },
    { key: "frontier", label: t("portfolioFrontierLabel"), color: "#3b82f6", line: true, strokeWidth: 3, points: m.frontier.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "cml", label: t("portfolioCmlLabel"), color: "#22c55e", line: true, dash: "6 4", strokeWidth: 2, points: m.cml.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "assets", label: t("portfolioAssetPointsLabel"), color: "#94a3b8", radius: 6, legend: true, draggable: true, points: assetPoints },
    { key: "cash", label: t("portfolioCashLabel"), color: "#94a3b8", radius: 5, legend: false, points: [{ x: 0, y: m.riskFree, label: t("portfolioCashLabel") }] },
    { key: "gmv", label: t("portfolioGmvLabel"), color: "#38bdf8", radius: 6, legend: false, points: [{ x: m.gmv.vol, y: m.gmv.ret, label: t("portfolioGmvLabel") }] },
    { key: "tangency", label: t("portfolioTangencyLabel"), color: "#22c55e", radius: 6, legend: false, points: [{ x: m.tangency.vol, y: m.tangency.ret, label: t("portfolioTangencyLabel") }] },
    { key: "current", label: t("portfolioCurrentLabel"), color: "#f97316", radius: 9, points: [{ x: current.vol, y: current.ret, label: t("portfolioCurrentLabel") }] },
  ];
}
