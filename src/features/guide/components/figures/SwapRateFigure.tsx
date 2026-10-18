import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { parSwap, swapRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const NOTIONAL = 1_000_000;
const BP = 0.0001;

/// Zero curve and par swap rates by maturity: the swap rate is a discount-weighted average of the curve.
export default function SwapRateFigure() {
  const { t } = useI18n();
  const [level, setLevel] = useState(0.04);
  const [slope, setSlope] = useState(0.01);
  const data = useMemo(() => swapRows(level, slope), [level, slope]);
  const five = parSwap(level, slope, 5);

  return (
    <GuideFigure title={t("gfSwapTitle")} labId="yield-curve">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldShortLevel")} min={0} max={0.08} step={0.0025} value={level} onChange={setLevel} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldLongMinusShort")} min={-0.02} max={0.03} step={0.0025} value={slope} onChange={setSlope} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfSwapAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            { key: "zero", label: t("gfZeroRate"), color: SERIES_PALETTE[1], strokeWidth: 2, dash: "6 3" },
            { key: "swap", label: t("gfParSwapRate"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          curve="linear"
          yFormat={(v) => pct(v, 1)}
          tooltipLabel={(x) => `${x.toFixed(0)}y`}
          valueFormat={(v) => pct(v, 3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfSwapRateAt", { years: 5 }), value: pct(five.rate, 3), tone: "strong" },
          { label: t("gfAnnuity5"), value: fmt(five.annuity, 4) },
          { label: t("gfDv01"), value: fmt(five.annuity * BP * NOTIONAL), tone: "accent" },
          { label: t("gfSwapRateAt", { years: 10 }), value: pct(parSwap(level, slope, 10).rate, 3) },
        ]}
      />
    </GuideFigure>
  );
}
