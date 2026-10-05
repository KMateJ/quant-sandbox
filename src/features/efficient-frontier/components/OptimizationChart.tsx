import { useMediaQuery } from "../../../components/useMediaQuery";
import { ScatterChart } from "../../../components/charts";
import type { ChartReferenceLine, ScatterAnnotation, ScatterSeries } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { Asset } from "../../portfolio-lab/portfolioLab.types";
import type { OptPoint } from "../portfolioOptimization.types";
import type { useOptimization } from "../useOptimization";

type Props = { model: ReturnType<typeof useOptimization> };

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// Risk/return scatter: feasible set, unconstrained & constrained frontiers,
/// reference portfolios, assets, the CML and the draggable selected portfolio.
export default function OptimizationChart({ model }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { assets, branch, unconBranch, cloud, gmv, tangency, selected, cml, constraints, objective } = model;

  const rows = (p: OptPoint) =>
    assets
      .map((a, i) => ({ label: a.name, value: pct(p.weights[i]), color: a.color, w: p.weights[i] }))
      .filter((r) => Math.abs(r.w) >= 0.005)
      .sort((a, b) => b.w - a.w)
      .map(({ label, value, color }) => ({ label, value, color }));

  const frontierPts = branch.map((p) => ({ x: p.vol, y: p.ret, tooltipRows: rows(p) }));

  const series: ScatterSeries[] = [
    { key: "feasible", label: t("optFeasible"), color: "#64748b", radius: 2, opacity: 0.22, points: cloud.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "unconstrained", label: t("optFrontierUnconstrained"), color: "#64748b", line: true, dash: "5 4", strokeWidth: 1.75, points: unconBranch.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "constrained", label: t("optFrontierConstrained"), color: "#3b82f6", line: true, strokeWidth: 3, points: branch.map((p) => ({ x: p.vol, y: p.ret })) },
    { key: "fpts", label: t("optFrontierConstrained"), color: "#3b82f6", radius: 3, opacity: 0.55, legend: false, points: frontierPts },
    ...(constraints.useRiskFree && cml.length
      ? [{ key: "cml", label: t("optCml"), color: "#22c55e", line: true, dash: "6 4", strokeWidth: 2, points: cml.map((p) => ({ x: p.vol, y: p.ret })) } as ScatterSeries]
      : []),
    { key: "assets", label: t("optAssets"), color: "#94a3b8", radius: 6, points: assets.map((a: Asset) => ({ x: a.sigma, y: a.mu, color: a.color, label: a.name })) },
    { key: "gmv", label: t("optGmv"), color: "#38bdf8", radius: 6, legend: false, points: [{ x: gmv.vol, y: gmv.ret, label: t("optGmv"), tooltipRows: rows(gmv) }] },
    ...(constraints.useRiskFree
      ? [{ key: "tangency", label: t("optTangency"), color: "#22c55e", radius: 6, legend: false, points: [{ x: tangency.vol, y: tangency.ret, label: t("optTangency"), tooltipRows: rows(tangency) }] } as ScatterSeries]
      : []),
    { key: "selected", label: t("optSelected"), color: "#f97316", radius: 9, draggable: true, points: [{ x: selected.vol, y: selected.ret, label: t("optSelected"), tooltipRows: rows(selected) }] },
  ];

  const referenceLines: ChartReferenceLine[] = [];
  if (objective === "targetReturn") referenceLines.push({ axis: "y", value: model.targetReturn, color: "#f59e0b", dash: "5 4" });
  if (objective === "targetVolatility") referenceLines.push({ axis: "x", value: model.targetVol, color: "#f59e0b", dash: "5 4" });

  const annotations: ScatterAnnotation[] = [
    { x: gmv.vol, y: gmv.ret, text: t("optGmv"), color: "#38bdf8", dx: 8, dy: 4, fontSize: 11 },
    { x: selected.vol, y: selected.ret, text: t("optSelected"), color: "#f97316", dx: 10, dy: -8, fontSize: 11, fontWeight: 700 },
  ];
  if (constraints.useRiskFree) annotations.push({ x: tangency.vol, y: tangency.ret, text: t("optTangency"), color: "#22c55e", dx: 8, dy: 14, fontSize: 11 });

  return (
    <div className="chart-wrap">
      <ScatterChart
        series={series}
        xDomain={[0, model.volMax]}
        yDomain={[model.retMin, model.retMax]}
        referenceLines={referenceLines}
        annotations={annotations}
        isMobile={isMobile}
        xFormat={pct}
        yFormat={pct}
        xLabel={t("optVolAxis")}
        yLabel={t("optRetAxis")}
        onDrag={(_x, y) => model.selectReturn(Math.max(model.retMin, Math.min(model.retMax, y)))}
      />
    </div>
  );
}
