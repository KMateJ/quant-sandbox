import { useCallback, useMemo } from "react";
import { usePinnedScatter } from "../../components/charts";
import type { ScatterAnnotation, ScatterSeries } from "../../components/charts";
import { useI18n } from "../../i18n";
import { SELECTED_COLOR, pct1 } from "./components/frontierChart.style";
import type { OptPoint } from "./portfolioOptimization.types";
import type { useOptimization } from "./useOptimization";

type Model = ReturnType<typeof useOptimization>;

const PINNABLE = new Set(["constrained", "cml"]);

/// Scatter series and labels for the optimization chart, plus pin & compare: a pinned frontier
/// (and CML) stays as a faded ghost while constraints change.
export function useFrontierSeries(model: Model) {
  const { t } = useI18n();
  const { assets, branch, unconBranch, cloud, gmv, tangency, selected, cml, constraints } = model;

  const series = useMemo<ScatterSeries[]>(() => {
    const rows = (p: OptPoint) =>
      assets
        .map((a, i) => ({ label: a.name, value: pct1(p.weights[i]), color: a.color, w: p.weights[i] }))
        .filter((r) => Math.abs(r.w) >= 0.005)
        .sort((a, b) => b.w - a.w)
        .map(({ label, value, color }) => ({ label, value, color }));
    const xy = (p: { vol: number; ret: number }) => ({ x: p.vol, y: p.ret });
    return [
      { key: "feasible", intuitionSectionId: "portfolio-selection", label: t("optFeasible"), color: "#64748b", radius: 2, opacity: 0.22, points: cloud.map(xy) },
      { key: "unconstrained", intuitionSectionId: "constraint-cost", label: t("optFrontierUnconstrained"), color: "#64748b", line: true, dash: "5 4", strokeWidth: 1.75, points: unconBranch.map(xy) },
      { key: "constrained", intuitionSectionId: "efficient-frontier", label: t("optFrontierConstrained"), color: "#3b82f6", line: true, strokeWidth: 3, points: branch.map(xy) },
      { key: "fpts", label: t("optFrontierConstrained"), color: "#3b82f6", radius: 3, opacity: 0.55, legend: false, points: branch.map(xy) },
      ...(constraints.useRiskFree && cml.length
        ? [{ key: "cml", intuitionSectionId: "capital-market-line", label: t("optCml"), color: "#22c55e", line: true, dash: "6 4", strokeWidth: 2, points: cml.map(xy) }]
        : []),
      { key: "assets", intuitionSectionId: "allocation", label: t("optAssets"), color: "#94a3b8", radius: 6, points: assets.map((a) => ({ x: a.sigma, y: a.mu, color: a.color, label: a.name })) },
      { key: "gmv", label: t("optGmv"), color: "#38bdf8", radius: 6, legend: false, points: [{ ...xy(gmv), label: t("optGmv"), tooltipRows: rows(gmv) }] },
      ...(constraints.useRiskFree
        ? [{ key: "tangency", label: t("optTangency"), color: "#22c55e", radius: 6, legend: false, points: [{ ...xy(tangency), label: t("optTangency"), tooltipRows: rows(tangency) }] }]
        : []),
      { key: "selected", intuitionSectionId: "portfolio-selection", label: t("optSelected"), color: SELECTED_COLOR, radius: 9, points: [{ ...xy(selected), label: t("optSelected"), tooltipRows: rows(selected) }] },
    ];
  }, [t, assets, branch, unconBranch, cloud, gmv, tangency, selected, cml, constraints.useRiskFree]);

  const annotations = useMemo<ScatterAnnotation[]>(() => {
    const out: ScatterAnnotation[] = [
      { x: gmv.vol, y: gmv.ret, text: t("optGmv"), color: "#38bdf8", dx: 8, dy: 4, fontSize: 11 },
      { x: selected.vol, y: selected.ret, text: t("optSelected"), color: SELECTED_COLOR, dx: 10, dy: -8, fontSize: 11, fontWeight: 700 },
    ];
    if (constraints.useRiskFree) out.push({ x: tangency.vol, y: tangency.ret, text: t("optTangency"), color: "#22c55e", dx: 8, dy: 14, fontSize: 11 });
    return out;
  }, [t, gmv, selected, tangency, constraints.useRiskFree]);

  // Only what the constraints move is worth a ghost: the constrained frontier and the CML.
  const pinnable = useMemo(() => series.filter((s) => PINNABLE.has(s.key)), [series]);
  const ghostLabel = useCallback((label: string) => t("pinnedSuffix", { label }), [t]);
  const pin = usePinnedScatter(pinnable, ghostLabel);
  const ghosts = pin.series.filter((s) => !pinnable.includes(s));

  return { series: [...ghosts, ...series], annotations, pin };
}
