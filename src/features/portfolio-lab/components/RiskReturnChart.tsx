import { ScatterChart } from "../../../components/charts";
import type { ChartReferenceLine, ScatterSeries } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { PinButton } from "../../../components/ui";
import { useMediaQuery } from "../../../components/useMediaQuery";
import { useI18n } from "../../../i18n";
import { useCloudPick } from "../useCloudPick";
import type { usePortfolioModel } from "../usePortfolioModel";

const pct = (v: number) => `${(v * 100).toFixed(1)}%`;

type Pin = { pinned: boolean; pin: () => void; clear: () => void };

type Props = {
  m: ReturnType<typeof usePortfolioModel>;
  /// Live series with any pinned ghosts already merged in (see usePinnedScatter).
  series: ScatterSeries[];
  pin: Pin;
  /// Narrow placement (beside the correlation matrix): no legend row, a one-line ghost caption instead.
  compact?: boolean;
};

/// Risk vs return scatter: random cloud (click a dot to adopt its weights), efficient frontier, CML,
/// draggable assets and the current portfolio, with pin & compare.
export default function RiskReturnChart({ m, series, pin, compact = false }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const { assets, current } = m;
  const cloudPick = useCloudPick(m.cloud, (i) => m.adoptWeights(m.cloud[i].weights));

  const referenceLines: ChartReferenceLine[] = [
    { axis: "x", value: current.vol, color: "#64748b", dash: "4 4" },
    { axis: "y", value: current.ret, color: "#64748b", dash: "4 4" },
  ];

  const onAssetDrag = (x: number, y: number, i: number) => {
    if (i < 0 || i >= assets.length) return;
    m.setAssetParam(i, "sigma", Math.min(0.6, Math.max(0.02, x)));
    m.setAssetParam(i, "mu", Math.min(0.4, Math.max(-0.05, y)));
  };

  return (
    <ChartContainer
      title={t("portfolioChartTitle")}
      actions={<PinButton pinned={pin.pinned} onPin={pin.pin} onClear={pin.clear} />}
    >
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
          onDrag={onAssetDrag}
          onSelectPoint={m.showCloud ? cloudPick.onSelectPoint : undefined}
          onPlotClick={m.showCloud ? cloudPick.onPlotClick : undefined}
          layer={cloudPick.layer}
          legend={!compact}
        />
      </div>
      {compact && pin.pinned && <p className="pl-chart-hint">{t("portfolioGhostCaption")}</p>}
      {m.showCloud && <p className="pl-chart-hint">{t("portfolioCloudPickHint")}</p>}
    </ChartContainer>
  );
}
