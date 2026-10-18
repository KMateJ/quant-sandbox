import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { leveredCosts, waccLeverageRows } from "../../guide.markets.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";
import { markerLine } from "./figureSeries";

/// Modigliani–Miller with taxes: cost of equity rises with leverage, WACC falls only through the tax shield.
export default function WaccLeverageFigure() {
  const { t } = useI18n();
  const [rU, setRU] = useState(0.1);
  const [rD, setRD] = useState(0.05);
  const [tax, setTax] = useState(0.25);
  const [dv, setDv] = useState(0.4);
  const data = useMemo(() => waccLeverageRows(rU, rD, tax), [rU, rD, tax]);
  const at = leveredCosts(rU, rD, tax, dv);

  return (
    <GuideFigure title={t("gfWaccTitle")} labId="capital-structure">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRU")} min={0.04} max={0.15} step={0.0025} value={rU} onChange={setRU} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldRD")} min={0.02} max={0.08} step={0.0025} value={rD} onChange={setRD} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldTax")} min={0} max={0.4} step={0.01} value={tax} onChange={setTax} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfFieldDebtRatio")} min={0} max={0.8} step={0.01} value={dv} onChange={setDv} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfWaccAria")}>
        <LineChart
          data={data}
          xKey="dv"
          series={[
            { key: "rE", label: t("gfCostOfEquity"), color: SERIES_PALETTE[2], strokeWidth: 2 },
            { key: "rDAfterTax", label: t("gfAfterTaxDebt"), color: SERIES_PALETTE[1], strokeWidth: 1.5, dash: "6 3" },
            { key: "wacc", label: "WACC", color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          yDomain={[0, 0.3]}
          referenceLines={[markerLine(dv)]}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `D/V = ${pct(x, 0)}`}
          valueFormat={(v) => pct(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfCostOfEquity"), value: pct(at.rE, 2) },
          { label: t("gfAfterTaxDebt"), value: pct(at.rDAfterTax, 2) },
          { label: "WACC", value: pct(at.wacc, 2), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
