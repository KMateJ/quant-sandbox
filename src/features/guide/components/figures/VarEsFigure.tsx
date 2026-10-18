import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { lossDensityRows, varEsComparison } from "../../guide.wave2.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const POSITION = 100;
const DAILY_SIGMA = 0.012;

/// Loss distribution of a position of 100 under a normal and a fat-tailed model with the same volatility.
export default function VarEsFigure() {
  const { t } = useI18n();
  const [alpha, setAlpha] = useState(0.99);
  const [days, setDays] = useState(1);
  const [nu, setNu] = useState(4);
  const cmp = useMemo(() => varEsComparison(POSITION, DAILY_SIGMA, days, alpha, nu), [alpha, days, nu]);
  const rows = useMemo(() => lossDensityRows(POSITION * cmp.sigma, nu), [cmp.sigma, nu]);

  return (
    <GuideFigure title={t("gfW2VarTitle")} labId="risk-return">
      <div className="gf-sliders">
        <SliderField label={t("gfW2FieldConfidence")} min={0.9} max={0.995} step={0.005} value={alpha} onChange={setAlpha} formatValue={(v) => pct(v)} />
        <SliderField label={t("gfW2FieldDays")} min={1} max={20} step={1} value={days} onChange={setDays} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfW2FieldNu")} min={3} max={30} step={1} value={nu} onChange={setNu} formatValue={(v) => v.toFixed(0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW2VarAria", { days })}>
        <LineChart
          data={rows}
          xKey="loss"
          series={[
            { key: "normal", label: t("gfW2Normal"), color: SERIES_PALETTE[0], strokeWidth: 2.25 },
            { key: "fat", label: t("gfW2Fat"), color: SERIES_PALETTE[1], strokeWidth: 2.25 },
          ]}
          referenceLines={[
            { axis: "x", value: cmp.normal.var, color: SERIES_PALETTE[0], dash: "none", width: 1.5 },
            { axis: "x", value: cmp.fat.var, color: SERIES_PALETTE[1], dash: "none", width: 1.5 },
          ]}
          curve="linear"
          tooltipLabel={(x) => `${t("gfW2Loss")} = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(4)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW2VarNormal"), value: fmt(cmp.normal.var) },
          { label: t("gfW2EsNormal"), value: fmt(cmp.normal.es) },
          { label: t("gfW2VarFat"), value: fmt(cmp.fat.var) },
          { label: t("gfW2EsFat"), value: fmt(cmp.fat.es), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
