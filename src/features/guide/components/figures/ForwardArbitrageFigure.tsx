import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { forwardArbitrage, forwardArbitrageRows } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const S0 = 100;

/// A mispriced forward quote and the trade that locks in the difference whatever S_T turns out to be.
export default function ForwardArbitrageFigure() {
  const { t } = useI18n();
  const [r, setR] = useState(0.05);
  const [T, setT] = useState(1);
  const [quote, setQuote] = useState(110);
  const deal = forwardArbitrage(S0, r, T, quote);
  const data = useMemo(() => forwardArbitrageRows(S0, r, T, quote), [r, T, quote]);
  const fair = Math.abs(deal.profit) < 0.005;
  const strategy = fair ? t("gfNoArbitrage") : t(deal.sign > 0 ? "gfCashAndCarry" : "gfReverseCashAndCarry");

  return (
    <GuideFigure title={t("gfForwardArbTitle")}>
      <div className="gf-sliders">
        <SliderField label={t("guideFieldRate")} min={0} max={0.15} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfFieldMaturity")} min={0.25} max={5} step={0.25} value={T} onChange={setT} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfFieldQuote")} min={80} max={140} step={0.5} value={quote} onChange={setQuote} formatValue={(v) => v.toFixed(1)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfForwardArbAria")}>
        <LineChart
          data={data}
          xKey="S"
          series={[
            { key: "stock", label: t(deal.sign > 0 ? "gfLegStockLoan" : "gfLegShortStockDeposit"), color: SERIES_PALETTE[1], strokeWidth: 1.25, dash: "5 3" },
            { key: "forward", label: t(deal.sign > 0 ? "gfLegShortForward" : "gfLegLongForward"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "5 3" },
            { key: "total", label: t("gfTotalAtMaturity"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[{ axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          tooltipLabel={(x) => `S_T = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfFairForward"), value: fmt(deal.fair) },
          { label: t("gfQuotedForward"), value: fmt(quote) },
          { label: t("gfStrategy"), value: strategy },
          { label: t("gfLockedProfit"), value: fmt(deal.profit), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
