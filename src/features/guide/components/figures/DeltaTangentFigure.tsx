import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { deltaTangent } from "../../guide.pricing.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const K = 100;
const R = 0.05;

/// Call value against S with its tangent at S₀: delta is the slope, the gap to the curve is gamma's doing.
export default function DeltaTangentFigure() {
  const { t } = useI18n();
  const [S0, setS0] = useState(100);
  const [sigma, setSigma] = useState(0.25);
  const [T, setT] = useState(0.5);
  const model = useMemo(() => deltaTangent(S0, K, T, R, sigma), [S0, sigma, T]);

  return (
    <GuideFigure title={t("gfDeltaTitle")} labId="delta-hedging">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldSpot")} min={60} max={140} step={1} value={S0} onChange={setS0} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldSigma")} min={0.05} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfFieldMaturity")} min={0.05} max={2} step={0.05} value={T} onChange={setT} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfDeltaAria", { s: S0 })}>
        <LineChart
          data={model.rows}
          xKey="S"
          series={[
            { key: "payoff", label: t("gfPayoffAtMaturity"), color: SERIES_PALETTE[2], strokeWidth: 1.25, dash: "4 4" },
            { key: "value", label: t("gfCallValue"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "tangent", label: t("gfTangent"), color: SERIES_PALETTE[1], strokeWidth: 1.5, dash: "6 3" },
          ]}
          yDomain={[-5, 65]}
          referenceLines={[markerLine(S0)]}
          curve="linear"
          tooltipLabel={(x) => `S = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfCallValue"), value: fmt(model.value) },
          { label: "Δ", value: fmt(model.delta, 3), tone: "accent" },
          { label: "Γ", value: fmt(model.gamma, 4) },
          { label: t("gfHedgeError"), value: `${fmt(model.errorDown)} / ${fmt(model.errorUp)}` },
        ]}
      />
    </GuideFigure>
  );
}
