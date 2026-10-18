import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { nelsonSiegel, yieldCurveRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";

/// A smooth three-parameter spot curve and the instantaneous forward curve it implies.
export default function SpotForwardFigure() {
  const { t } = useI18n();
  const [level, setLevel] = useState(0.04);
  const [slope, setSlope] = useState(-0.02);
  const [hump, setHump] = useState(0.01);
  const data = useMemo(() => yieldCurveRows(level, slope, hump), [level, slope, hump]);
  const spot = (years: number) => nelsonSiegel(level, slope, hump, years).spot;

  return (
    <GuideFigure title={t("gfSpotForwardTitle")} labId="yield-curve">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldLevel")} min={0} max={0.08} step={0.0025} value={level} onChange={setLevel} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldSlope")} min={-0.04} max={0.04} step={0.0025} value={slope} onChange={setSlope} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldHump")} min={-0.04} max={0.04} step={0.0025} value={hump} onChange={setHump} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfSpotForwardAria")}>
        <LineChart
          data={data}
          xKey="t"
          series={[
            { key: "spot", label: t("gfSpotCurve"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "forward", label: t("gfForwardCurve"), color: SERIES_PALETTE[2], strokeWidth: 1.75, dash: "6 3" },
          ]}
          yFormat={(v) => pct(v, 1)}
          tooltipLabel={(x) => `t = ${x.toFixed(1)}`}
          valueFormat={(v) => pct(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          ...[2, 10, 30].map((years) => ({ label: t("gfSpotAt", { years }), value: pct(spot(years), 2) })),
          { label: t("gfSpread10s2s"), value: `${((spot(10) - spot(2)) * 10000).toFixed(0)} bp`, tone: "accent" as const },
        ]}
      />
    </GuideFigure>
  );
}
