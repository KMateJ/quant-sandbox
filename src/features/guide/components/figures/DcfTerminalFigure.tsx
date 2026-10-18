import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { dcfRows, dcfSplit } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

/// DCF value split into five explicit years and the terminal value, against the growth rate g.
export default function DcfTerminalFigure() {
  const { t } = useI18n();
  const [wacc, setWacc] = useState(0.09);
  const [g, setG] = useState(0.02);
  const gMax = Math.min(0.05, wacc - 0.01);
  const growth = Math.min(g, gMax);
  const data = useMemo(() => dcfRows(wacc), [wacc]);
  const at = dcfSplit(wacc, growth);

  return (
    <GuideFigure title={t("gfDcfTitle")} labId="valuation">
      <div className="gf-sliders">
        <SliderField label="WACC" min={0.06} max={0.14} step={0.0025} value={wacc} onChange={setWacc} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldGrowth")} min={0} max={gMax} step={0.0025} value={growth} onChange={setG} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfDcfAria")}>
        <LineChart
          data={data}
          xKey="g"
          series={[
            { key: "explicit", label: t("gfPvExplicit"), color: SERIES_PALETTE[1], strokeWidth: 1.75, dash: "6 3" },
            { key: "terminal", label: t("gfPvTerminal"), color: SERIES_PALETTE[2], strokeWidth: 1.75, dash: "6 3" },
            { key: "total", label: t("gfTotalValue"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[markerLine(growth)]}
          xFormat={(v) => pct(v, 1)}
          tooltipLabel={(x) => `g = ${pct(x, 2)}`}
          valueFormat={(v) => v.toFixed(1)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfTotalValue"), value: fmt(at.total), tone: "strong" },
          { label: t("gfTerminalShare"), value: pct(at.terminal / at.total, 1), tone: "accent" },
          { label: t("gfPvExplicit"), value: fmt(at.explicit) },
        ]}
      />
    </GuideFigure>
  );
}
