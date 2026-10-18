import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { DELIVERY_BASKET, deliveryAt, deliveryRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const bondLabel = (b: { id: string; coupon: number; years: number }) => `${b.id}: ${pct(b.coupon, 0)} / ${b.years}y`;

/// Net delivery cost of three deliverable bonds against the yield: the cheapest-to-deliver switches at the notional 6%.
export default function CtdSwitchFigure() {
  const { t } = useI18n();
  const [y, setY] = useState(0.06);
  const data = useMemo(() => deliveryRows(), []);
  const at = deliveryAt(y);

  return (
    <GuideFigure title={t("gfCtdTitle")} labId="treasury-futures">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldMarketYield")} min={0.02} max={0.1} step={0.0025} value={y} onChange={setY} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfCtdAria")}>
        <LineChart
          data={data}
          xKey="y"
          series={DELIVERY_BASKET.map((b, i) => ({ key: b.id, label: bondLabel(b), color: SERIES_PALETTE[i], strokeWidth: 2 }))}
          referenceLines={[markerLine(y)]}
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `y = ${pct(x, 2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfCtd"), value: bondLabel(at.ctd), tone: "strong" },
          { label: t("gfFuturesPrice"), value: fmt(at.futures) },
          ...at.costs.map((b) => ({ label: `${b.id}: CF · ${t("gfNetCost")}`, value: `${fmt(b.cf, 4)} · ${fmt(b.net)}` })),
        ]}
      />
    </GuideFigure>
  );
}
