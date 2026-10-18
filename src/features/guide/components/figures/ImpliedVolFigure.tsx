import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { blackScholesVega } from "../../../black-scholes/blackScholes.math";
import { impliedVol, priceBounds, priceVsVolRows } from "../../guide.wave2.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const S0 = 100;
const R = 0.05;

/// Black–Scholes call price against σ; the quoted price cuts the curve at the implied volatility.
export default function ImpliedVolFigure() {
  const { t } = useI18n();
  const [price, setPrice] = useState(12);
  const [K, setK] = useState(100);
  const [T, setT] = useState(1);
  const rows = useMemo(() => priceVsVolRows("call", S0, K, T, R), [K, T]);
  const iv = impliedVol("call", price, S0, K, T, R);
  const bounds = priceBounds("call", S0, K, T, R);
  const vega = Number.isFinite(iv) ? blackScholesVega(S0, K, T, R, iv) : NaN;

  return (
    <GuideFigure title={t("gfW2IvTitle")} labId="black-scholes">
      <div className="gf-sliders">
        <SliderField label={t("gfW2QuotedPrice")} min={0.5} max={60} step={0.25} value={price} onChange={setPrice} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("guideFieldStrike")} min={60} max={140} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldMaturity")} min={0.1} max={2} step={0.05} value={T} onChange={setT} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW2IvAria", { price: price.toFixed(2) })}>
        <LineChart
          data={rows}
          xKey="sigma"
          series={[{ key: "price", label: t("gfBlackScholesPrice"), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
          referenceLines={[
            { axis: "y", value: price, color: SERIES_PALETTE[1], width: 2 },
            ...(Number.isFinite(iv) ? [{ axis: "x" as const, value: iv, color: "var(--muted)", dash: "4 4" }] : []),
          ]}
          curve="linear"
          tooltipLabel={(x) => `σ = ${pct(x)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW2ImpliedVol"), value: Number.isFinite(iv) ? pct(iv, 2) : "–", tone: "accent" },
          { label: t("gfW2VegaAtIv"), value: fmt(vega, 2) },
          { label: t("gfW2LowerBound"), value: fmt(bounds.lower) },
          { label: t("gfW2UpperBound"), value: fmt(bounds.upper) },
        ]}
      />
    </GuideFigure>
  );
}
