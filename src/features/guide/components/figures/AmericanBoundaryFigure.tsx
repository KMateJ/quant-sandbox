import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { americanPutRows, criticalPutPrice } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const S0 = 100;
const R = 0.05;
const T = 1;

/// European vs American put on a 100-step tree: the American value never drops below the payoff.
export default function AmericanBoundaryFigure() {
  const { t } = useI18n();
  const [K, setK] = useState(100);
  const [sigma, setSigma] = useState(0.2);
  const data = useMemo(() => americanPutRows(K, T, R, sigma), [K, sigma]);
  const critical = useMemo(() => criticalPutPrice(K, T, R, sigma), [K, sigma]);
  const today = data.find((row) => row.S === S0)!;

  return (
    <GuideFigure title={t("gfAmericanTitle")} labId="binomial">
      <div className="gf-sliders">
        <SliderField label={t("guideFieldStrike")} min={80} max={120} step={1} value={K} onChange={setK} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldSigma")} min={0.1} max={0.5} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfAmericanAria")}>
        <LineChart
          data={data}
          xKey="S"
          series={[
            { key: "payoff", label: t("gfPayoffAtMaturity"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "4 4" },
            { key: "european", label: t("gfEuropeanPut"), color: SERIES_PALETTE[1], strokeWidth: 2, dash: "6 3" },
            { key: "american", label: t("gfAmericanPut"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[markerLine(S0)]}
          curve="linear"
          tooltipLabel={(x) => `S = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfEuropeanPut"), value: fmt(today.european, 3) },
          { label: t("gfAmericanPut"), value: fmt(today.american, 3), tone: "strong" },
          { label: t("gfEarlyPremium"), value: fmt(today.american - today.european, 3), tone: "accent" },
          { label: t("gfCriticalPrice"), value: fmt(critical) },
        ]}
      />
    </GuideFigure>
  );
}
