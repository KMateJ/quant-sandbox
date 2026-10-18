import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { price, priceYieldRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const PAR = 100;

/// Bond price against yield: falling and convex, crossing par where the yield equals the coupon.
export default function PriceYieldFigure() {
  const { t } = useI18n();
  const [c, setC] = useState(0.05);
  const [T, setT] = useState(10);
  const [y, setY] = useState(0.06);
  const data = useMemo(() => priceYieldRows(c, T), [c, T]);
  const p = price(c, y, T);
  const status = Math.abs(p - PAR) < 0.005 ? "gfAtPar" : p > PAR ? "gfPremium" : "gfDiscount";

  return (
    <GuideFigure title={t("gfPriceYieldTitle")} labId="bond-pricing">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldCoupon")} min={0} max={0.1} step={0.0025} value={c} onChange={setC} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldBondMaturity")} min={1} max={30} step={1} value={T} onChange={setT} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldYield")} min={0} max={0.15} step={0.0025} value={y} onChange={setY} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfPriceYieldAria")}>
        <LineChart
          data={data}
          xKey="y"
          series={[{ key: "price", label: t("gfBondPrice"), color: SERIES_PALETTE[0], strokeWidth: 2.5 }]}
          referenceLines={[
            markerLine(y),
            { axis: "y", value: PAR, color: SERIES_PALETTE[2], dash: "6 4" },
          ]}
          legend={false}
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `y = ${pct(x, 2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfBondPrice"), value: fmt(p), tone: "strong" },
          { label: t("gfTradesAt"), value: t(status), tone: "accent" },
          { label: t("gfCurrentYield"), value: pct((c * PAR) / p, 2) },
        ]}
      />
    </GuideFigure>
  );
}
