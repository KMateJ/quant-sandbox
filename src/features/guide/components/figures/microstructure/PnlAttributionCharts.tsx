import { LineChart, SERIES_PALETTE, WaterfallChart, type WaterfallStep } from "../../../../../components/charts";
import { useI18n } from "../../../../../i18n";
import type { PnlParts } from "../../../../../lib/market/maker";

type Props = { parts: PnlParts; markouts: { h: number; markout: number }[]; horizon: number };

/// Waterfall of the P&L parts beside the average markout curve; the vertical line marks the chosen horizon.
export default function PnlAttributionCharts({ parts, markouts, horizon }: Props) {
  const { t } = useI18n();
  const steps: WaterfallStep[] = [
    { key: "spread", label: t("gfMsPnlSpread"), value: parts.spread, kind: "delta" },
    { key: "adverse", label: t("gfMsPnlAdverse"), value: parts.adverse, kind: "delta" },
    { key: "inventory", label: t("gfMsPnlInventory"), value: parts.inventory, kind: "delta" },
    { key: "fees", label: t("gfMsPnlFees"), value: parts.fees, kind: "delta" },
    { key: "total", label: t("gfMsPnlTotal"), value: parts.total, kind: "total" },
  ];
  return (
    <div className="gf-ms-market-making-pnl">
      <WaterfallChart steps={steps} ariaLabel={t("gfMsPnlWaterfallAria")} valueFormat={(v) => v.toFixed(1)} height={240} />
      <div className="gf-chart" role="img" aria-label={t("gfMsPnlMarkoutAria")}>
        <LineChart
          data={markouts}
          xKey="h"
          xDomain={[1, 30]}
          series={[{ key: "markout", label: t("gfMsPnlMarkout"), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
          referenceLines={[{ axis: "y", value: 0, color: SERIES_PALETTE[2], dash: "4 4" }, { axis: "x", value: horizon, color: SERIES_PALETTE[1], width: 1.5 }]}
          curve="linear"
          tooltipLabel={(x) => `h = ${x} s`}
          valueFormat={(v) => `${v.toFixed(2)}¢`}
          xFormat={(v) => `${v} s`}
          yFormat={(v) => v.toFixed(1)}
        />
      </div>
    </div>
  );
}
