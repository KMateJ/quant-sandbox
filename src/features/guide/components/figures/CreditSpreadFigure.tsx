import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { cdsSpread, creditRows, riskyZero } from "../../guide.wave3.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

/// Risk-free vs defaultable zero yields across maturities for a constant hazard rate.
export default function CreditSpreadFigure() {
  const { t } = useI18n();
  const [lambda, setLambda] = useState(0.02);
  const [R, setR] = useState(0.4);
  const [r, setRate] = useState(0.03);
  // Yields are plotted in percent.
  const rows = useMemo(
    () => creditRows(r, lambda, R).map((row) => ({ T: row.T, riskFree: row.riskFree * 100, risky: row.risky * 100 })),
    [r, lambda, R]
  );
  const five = riskyZero(r, lambda, R, 5);

  return (
    <GuideFigure title={t("gfW3CrTitle")} labId="bond-pricing">
      <div className="gf-sliders">
        <SliderField label={t("gfW3FieldHazard")} min={0} max={0.1} step={0.0025} value={lambda} onChange={setLambda} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfW3FieldRecovery")} min={0} max={0.8} step={0.05} value={R} onChange={setR} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("guideFieldRate")} min={0} max={0.08} step={0.0025} value={r} onChange={setRate} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW3CrAria")}>
        <LineChart
          data={rows}
          xKey="T"
          series={[
            { key: "riskFree", label: t("gfW3RiskFree"), color: SERIES_PALETTE[1], strokeWidth: 2 },
            { key: "risky", label: t("gfW3Risky"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          yDomain={[0, Math.ceil((r + lambda) * 100 + 1)]}
          curve="linear"
          tooltipLabel={(x) => `T = ${x.toFixed(2)}`}
          valueFormat={(v) => `${v.toFixed(3)}%`}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW3Survival5"), value: pct(five.survival, 2) },
          { label: t("gfW3Spread5"), value: pct(five.spread, 2), tone: "accent" },
          { label: t("gfW3Cds"), value: pct(cdsSpread(lambda, R), 2) },
          { label: t("gfW3RiskyPrice5"), value: fmt(five.price, 4) },
        ]}
      />
    </GuideFigure>
  );
}
