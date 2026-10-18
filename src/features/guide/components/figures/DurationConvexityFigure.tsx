import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { durationConvexity } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

const signed = (v: number) => `${v >= 0 ? "+" : ""}${v.toFixed(2)}`;

/// True price around y₀ against the duration (tangent) and duration-plus-convexity approximations.
export default function DurationConvexityFigure() {
  const { t } = useI18n();
  const [c, setC] = useState(0.05);
  const [T, setT] = useState(10);
  const [y0, setY0] = useState(0.05);
  const model = useMemo(() => durationConvexity(c, T, y0), [c, T, y0]);
  const shock = (s: typeof model.up) => `${signed(s.actual)} · ${signed(s.duration)} · ${signed(s.convexity)}`;

  return (
    <GuideFigure title={t("gfDurationTitle")} labId="duration-convexity">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldCoupon")} min={0} max={0.1} step={0.0025} value={c} onChange={setC} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldBondMaturity")} min={1} max={30} step={1} value={T} onChange={setT} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfFieldYield0")} min={0.01} max={0.12} step={0.0025} value={y0} onChange={setY0} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfDurationAria")}>
        <LineChart
          data={model.rows}
          xKey="y"
          series={[
            { key: "price", label: t("gfBondPrice"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "duration", label: t("gfDurationApprox"), color: SERIES_PALETTE[1], strokeWidth: 1.5, dash: "6 3" },
            { key: "convexity", label: t("gfConvexityApprox"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "2 3" },
          ]}
          referenceLines={[markerLine(y0)]}
          xFormat={(v) => pct(v, 1)}
          tooltipLabel={(x) => `y = ${pct(x, 2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfMacaulay"), value: fmt(model.mac) },
          { label: t("gfModified"), value: fmt(model.mod), tone: "accent" },
          { label: t("gfConvexity"), value: fmt(model.conv, 1) },
          { label: t("gfShockUp"), value: shock(model.up) },
          { label: t("gfShockDown"), value: shock(model.down) },
        ]}
      />
    </GuideFigure>
  );
}
