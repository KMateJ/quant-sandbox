import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { parityPrices, parityRows } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const S0 = 100;
const R = 0.05;

/// Long call + short put has the forward's payoff, so C₀ − P₀ = S₀ − Ke^{−rT} for any model.
export default function ParityFigure() {
  const { t } = useI18n();
  const [K, setK] = useState(100);
  const [sigma, setSigma] = useState(0.25);
  const [T, setT] = useState(1);
  const data = useMemo(() => parityRows(K), [K]);
  const prices = parityPrices(S0, K, T, R, sigma);

  return (
    <GuideFigure title={t("gfParityTitle")} labId="payoff">
      <div className="gf-sliders">
        <SliderField label={t("guideFieldStrike")} min={60} max={140} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.8} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfFieldMaturity")} min={0.1} max={5} step={0.1} value={T} onChange={setT} formatValue={(v) => v.toFixed(1)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfParityAria", { k: K })}>
        <LineChart
          data={data}
          xKey="S"
          series={[
            // A wide band with a thin contrasting line inside it: the two payoffs coincide.
            { key: "forward", label: t("gfForwardPayoff"), color: SERIES_PALETTE[1], strokeWidth: 9 },
            { key: "combo", label: t("gfCallMinusPut"), color: SERIES_PALETTE[2], strokeWidth: 2 },
          ]}
          referenceLines={[markerLine(K), { axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          tooltipLabel={(x) => `S_T = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: "C₀", value: fmt(prices.call) },
          { label: "P₀", value: fmt(prices.put) },
          { label: "C₀ − P₀", value: fmt(prices.lhs), tone: "accent" },
          { label: "S₀ − Ke^(−rT)", value: fmt(prices.rhs), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
