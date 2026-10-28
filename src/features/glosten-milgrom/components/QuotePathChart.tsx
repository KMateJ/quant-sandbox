import { ScatterChart } from "../../../components/charts";
import { ChartContainer } from "../../../components/layout";
import { useI18n } from "../../../i18n";
import type { GlostenMilgromLab } from "../useGlostenMilgromLab";
import { fmtIndex, GM_COLORS, quoteSeries } from "./gmChart";
import TradeStrip from "./TradeStrip";

/// Dominant figure: Bayes quotes and belief after each trade, the part beyond the cursor dimmed, with the tile strip.
export default function QuotePathChart({ lab }: { lab: GlostenMilgromLab }) {
  const { t } = useI18n();
  const { path, cursor, params } = lab;
  const n = path.length;
  const series = quoteSeries(path, { ask: t("glmAsk"), bid: t("glmBid"), belief: t("glmBelief") });
  return (
    <ChartContainer
      title={t("glmQuoteChartTitle")}
      actions={lab.edited ? <button type="button" className="preset-btn" onClick={lab.resetEdits}>{t("glmResetEdits")}</button> : undefined}
    >
      <div className="chart-wrap glm-quote-chart">
        <ScatterChart
          series={series}
          xDomain={[1, n]}
          yDomain={[0, 1]}
          yFormat={(v) => v.toFixed(1)}
          xFormat={fmtIndex}
          xLabel={t("glmTradeAxis")}
          yLabel={t("glmPriceAxis")}
          referenceLines={[{ axis: "y", value: params.trueV, color: GM_COLORS.truth, dash: "2 4" }]}
          bands={cursor < n ? [{ from: Math.max(1, cursor + 0.5), to: n, color: "var(--surface-muted)", opacity: 0.7 }] : []}
        />
      </div>
      <p className="glm-caption">
        {t("glmTrueValueLine", { v: params.trueV })}
        {lab.edited ? ` ${t("glmEditedNote")}` : ""}
      </p>
      <TradeStrip lab={lab} />
    </ChartContainer>
  );
}
