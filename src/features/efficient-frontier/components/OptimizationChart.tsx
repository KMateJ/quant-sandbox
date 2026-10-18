import { useMediaQuery } from "../../../components/useMediaQuery";
import { DragHandles, ScatterChart } from "../../../components/charts";
import type { DragHandle, PlotFrame } from "../../../components/charts";
import { useI18n } from "../../../i18n";
import type { FrontierBrush } from "../useFrontierBrush";
import type { useFrontierSeries } from "../useFrontierSeries";
import type { useOptimization } from "../useOptimization";
import FrontierBrushLayer from "./FrontierBrushLayer";
import { TARGET_COLOR, pct1 } from "./frontierChart.style";

type Props = {
  model: ReturnType<typeof useOptimization>;
  chart: ReturnType<typeof useFrontierSeries>;
  brush: FrontierBrush;
};

const TARGET_STEP = 0.0025;

/// Risk/return scatter: feasible set, unconstrained & constrained frontiers (plus a pinned ghost),
/// reference portfolios, assets and the CML. The frontier is brushable and the target line draggable.
export default function OptimizationChart({ model, chart, brush }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { objective, retMin, retMax, volMax } = model;

  const handles: DragHandle[] =
    objective === "targetReturn"
      ? [{ id: "target", axis: "y", y: model.targetReturn, min: Math.max(-0.5, retMin), max: Math.min(1, retMax), step: TARGET_STEP, label: t("optTargetReturnLabel"), format: pct1, color: TARGET_COLOR }]
      : objective === "targetVolatility"
        ? [{ id: "target", axis: "x", x: model.targetVol, min: 0, max: Math.min(1, volMax), step: TARGET_STEP, label: t("optTargetVolLabel"), format: pct1, color: TARGET_COLOR }]
        : [];

  const layer = (frame: PlotFrame) => (
    <>
      <FrontierBrushLayer frame={frame} brush={brush} />
      {handles.length > 0 && (
        <DragHandles
          frame={frame}
          handles={handles}
          onChange={(_id, { x, y }) => {
            if (objective === "targetReturn" && y !== undefined) model.setTargetReturn(y);
            if (objective === "targetVolatility" && x !== undefined) model.setTargetVol(x);
          }}
        />
      )}
    </>
  );

  return (
    <div className="chart-wrap">
      <ScatterChart
        series={chart.series}
        xDomain={[0, volMax]}
        yDomain={[retMin, retMax]}
        annotations={chart.annotations}
        isMobile={isMobile}
        xFormat={pct1}
        yFormat={pct1}
        xLabel={t("optVolAxis")}
        yLabel={t("optRetAxis")}
        layer={layer}
      />
    </div>
  );
}
