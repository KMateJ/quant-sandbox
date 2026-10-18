import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { realOption, realOptionRows } from "../../guide.wave3.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const V0 = 100;
const R = 0.05;
const T = 3;
const STEPS = 3;

/// Static NPV vs the value of the option to invest (expanded NPV) across investment costs.
export default function RealOptionTreeFigure() {
  const { t } = useI18n();
  const [I, setI] = useState(105);
  const [sigma, setSigma] = useState(0.3);
  const [delta, setDelta] = useState(0.04);
  const rows = useMemo(() => realOptionRows(V0, sigma, R, delta, T, STEPS), [sigma, delta]);
  const o = useMemo(() => realOption(V0, I, sigma, R, delta, T, STEPS), [I, sigma, delta]);

  return (
    <GuideFigure title={t("gfW3RoTitle")} labId="npv-irr">
      <div className="gf-sliders">
        <SliderField label={t("gfW3FieldInvestment")} min={60} max={140} step={1} value={I} onChange={setI} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldSigma")} min={0.1} max={0.6} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfW3FieldDelta")} min={0} max={0.1} step={0.005} value={delta} onChange={setDelta} formatValue={(v) => pct(v)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW3RoAria")}>
        <LineChart
          data={rows}
          xKey="I"
          series={[
            { key: "staticNpv", label: t("gfW3StaticNpv"), color: SERIES_PALETTE[1], strokeWidth: 2 },
            { key: "expanded", label: t("gfW3ExpandedNpv"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[{ axis: "x", value: I, color: "var(--muted)", dash: "4 4" }, { axis: "y", value: 0, color: "var(--border)" }]}
          curve="linear"
          tooltipLabel={(x) => `I = ${x.toFixed(0)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW3StaticNpv"), value: fmt(o.staticNpv) },
          { label: t("gfW3ExpandedNpv"), value: fmt(o.expanded), tone: "accent" },
          { label: t("gfW3Flexibility"), value: fmt(o.waitingValue) },
          { label: t("gfW3Decision"), value: t(o.investNow ? "gfW3InvestNow" : "gfW3Wait"), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
