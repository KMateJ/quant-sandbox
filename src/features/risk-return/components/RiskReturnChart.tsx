import { DragHandles, ScatterChart, type PlotFrame } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { PinButton } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import type { RiskReturnLab } from "../useRiskReturnLab";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

/// The capital allocation line with draggable assets, the draggable portfolio and the optimal point.
export default function RiskReturnChart({ lab }: { lab: RiskReturnLab }) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { chart, pin } = lab;

  // Pointer drags of the asset handles freeze the axes until release (keyboard moves refit freely).
  const layer = (frame: PlotFrame) => (
    <g onPointerDownCapture={lab.freeze} onPointerUp={lab.unfreeze} onLostPointerCapture={lab.unfreeze}>
      <DragHandles frame={frame} handles={lab.handles} onChange={lab.onHandle} />
    </g>
  );

  return (
    <ChartContainer
      title={t("riskReturnChartTitle")}
      actions={<PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />}
    >
      <div className="chart-wrap">
        <ScatterChart
          series={chart.series}
          bands={chart.bands}
          annotations={chart.annotations}
          referenceLines={chart.referenceLines}
          onDrag={lab.onDragPortfolio}
          xDomain={chart.xDomain}
          yDomain={chart.yDomain}
          isMobile={isMobile}
          xFormat={pct}
          yFormat={pct}
          xLabel={t("riskReturnVolAxis")}
          yLabel={t("riskReturnRetAxis")}
          layer={layer}
        />
      </div>
      <p className="control-hint">{t("riskReturnAssetDragHint")}</p>
    </ChartContainer>
  );
}
