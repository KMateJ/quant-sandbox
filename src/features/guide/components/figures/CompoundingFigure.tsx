import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { compoundingSeries } from "../../guide.processes.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

/// Growth of 1 under simple, annual and continuous compounding for a chosen rate and horizon.
export default function CompoundingFigure() {
  const { t } = useI18n();
  const [r, setR] = useState(0.08);
  const [years, setYears] = useState(20);
  const data = useMemo(() => compoundingSeries(r, years), [r, years]);
  const end = data[data.length - 1];

  return (
    <GuideFigure title={t("gfCompoundingTitle")} labId="tvm">
      <div className="gf-sliders">
        <SliderField label={t("guideFieldRate")} min={0} max={0.2} step={0.005} value={r} onChange={setR} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfFieldYears")} min={1} max={30} step={1} value={years} onChange={setYears} formatValue={(v) => v.toFixed(0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfCompoundingAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            { key: "simple", label: t("gfSimple"), color: SERIES_PALETTE[2], strokeWidth: 2 },
            { key: "annual", label: t("gfAnnual"), color: SERIES_PALETTE[1], strokeWidth: 2 },
            { key: "continuous", label: t("gfContinuous"), color: SERIES_PALETTE[0], strokeWidth: 2.25 },
          ]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(1)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfSimple"), value: fmt(end.simple, 3) },
          { label: t("gfAnnual"), value: fmt(end.annual, 3) },
          { label: t("gfContinuous"), value: fmt(end.continuous, 3), tone: "accent" },
          { label: t("gfDiscountFactor"), value: fmt(1 / end.continuous, 3) },
        ]}
      />
    </GuideFigure>
  );
}
