import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { bsmPrice, dividendYieldSeries, forwardPrice } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import { markerLine } from "../figureSeries";

const K = 100;
const S0 = 100;
const SIGMA = 0.2;
const SPOTS = Array.from({ length: 81 }, (_, i) => 60 + i);

/// Call price against spot with and without a continuous dividend yield, with the forward price at the marked spot.
export default function DividendYieldPriceFigure() {
  const { t } = useI18n();
  const [q, setQ] = useState(0.03);
  const [r, setR] = useState(0.05);
  const data = useMemo(() => dividendYieldSeries(K, r, q, SIGMA, 1, SPOTS).map((d) => ({ ...d, payoff: Math.max(d.S - K, 0) })), [q, r]);

  return (
    <GuideFigure title={t("gfW4DividendYieldPriceTitle")} labId="black-scholes">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldYield")} min={0} max={0.08} step={0.005} value={q} onChange={setQ} formatValue={(v) => pct(v)} />
        <SliderField label={t("guideFieldRate")} min={0} max={0.08} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4DividendYieldAria")}>
        <LineChart
          data={data}
          xKey="S"
          series={[
            { key: "payoff", label: t("gfW4Payoff"), color: SERIES_PALETTE[1], strokeWidth: 1.25, dash: "4 4" },
            { key: "call0", label: t("gfW4CallNoYield"), color: SERIES_PALETTE[2], strokeWidth: 2 },
            { key: "callQ", label: t("gfW4CallYield"), color: SERIES_PALETTE[0], strokeWidth: 2.25 },
          ]}
          referenceLines={[markerLine(S0)]}
          curve="linear"
          tooltipLabel={(x) => `S = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4CallYield"), value: fmt(bsmPrice(S0, K, r, q, SIGMA, 1, "call")), tone: "accent" },
          { label: t("gfW4CallNoYield"), value: fmt(bsmPrice(S0, K, r, 0, SIGMA, 1, "call")) },
          { label: t("gfW4PutYield"), value: fmt(bsmPrice(S0, K, r, q, SIGMA, 1, "put")) },
          { label: t("gfW4Forward"), value: fmt(forwardPrice(S0, r, q, 1)) },
        ]}
      />
    </GuideFigure>
  );
}
