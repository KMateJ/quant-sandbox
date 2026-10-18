import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { factorRows, parameterCount, singleIndexVol } from "../../guide.wave3.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { pct } from "./figureFormat";

const SIGMA_M = 0.18;

/// Equal-weighted portfolio volatility falling toward the systematic floor βσ_M as stocks are added.
export default function FactorVarianceFigure() {
  const { t } = useI18n();
  const [beta, setBeta] = useState(1);
  const [specific, setSpecific] = useState(0.3);
  const [N, setN] = useState(20);
  // Volatilities are plotted in percent.
  const rows = useMemo(
    () => factorRows(beta, SIGMA_M, specific).map((row) => ({ N: row.N, vol: row.vol * 100, floor: row.floor * 100 })),
    [beta, specific]
  );
  const at = singleIndexVol(N, beta, SIGMA_M, specific);
  const params = parameterCount(N);

  return (
    <GuideFigure title={t("gfW3FvTitle")} labId="capm">
      <div className="gf-sliders">
        <SliderField label={t("gfW3FieldBeta")} min={0.5} max={1.5} step={0.05} value={beta} onChange={setBeta} formatValue={(v) => v.toFixed(2)} />
        <SliderField label={t("gfW3FieldSpecific")} min={0.1} max={0.6} step={0.01} value={specific} onChange={setSpecific} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfW3FieldN")} min={1} max={100} step={1} value={N} onChange={setN} formatValue={(v) => v.toFixed(0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW3FvAria")}>
        <LineChart
          data={rows}
          xKey="N"
          series={[
            { key: "vol", label: t("gfW3PortfolioVol"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "floor", label: t("gfW3Floor"), color: SERIES_PALETTE[1], strokeWidth: 1.75, dash: "6 3" },
          ]}
          yDomain={[0, Math.ceil(Math.sqrt((beta * SIGMA_M) ** 2 + specific ** 2) * 100 + 2)]}
          referenceLines={[{ axis: "x", value: N, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => `N = ${x.toFixed(0)}`}
          valueFormat={(v) => `${v.toFixed(2)}%`}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW3PortfolioVol"), value: pct(at.vol, 2), tone: "accent" },
          { label: t("gfW3Floor"), value: pct(at.floor, 2) },
          { label: t("gfW3SystematicShare"), value: pct(at.systematicShare) },
          { label: t("gfW3Params"), value: `${params.full} / ${params.singleIndex}` },
        ]}
      />
    </GuideFigure>
  );
}
