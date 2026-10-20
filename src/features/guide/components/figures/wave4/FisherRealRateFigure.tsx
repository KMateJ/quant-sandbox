import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE, markerLine } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { breakeven, fisher, linkerPrice, nominalBondRealValue } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";

const YEARS = 10;
const INFLATIONS = Array.from({ length: 17 }, (_, i) => i * 0.005);

/// A nominal bond and an inflation-linked bond, both worth 100 at the expected inflation: the real value of the nominal one falls when inflation runs higher.
export default function FisherRealRateFigure() {
  const { t } = useI18n();
  const [real, setReal] = useState(0.01);
  const [expected, setExpected] = useState(0.03);
  const [realised, setRealised] = useState(0.05);
  const linker = linkerPrice(real, YEARS, real);
  const rows = useMemo(
    () => INFLATIONS.map((pi) => ({ pi, nominal: nominalBondRealValue(real, expected, YEARS, pi), linker })),
    [real, expected, linker],
  );
  const nominalYield = fisher(real, expected).nominalExact;

  return (
    <GuideFigure title={t("gfW4FisherRealRateTitle")} labId="bond-pricing">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldRealRate")} min={-0.01} max={0.04} step={0.0025} value={real} onChange={setReal} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfW4FieldExpectedInflation")} min={0} max={0.08} step={0.0025} value={expected} onChange={setExpected} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfW4FieldRealisedInflation")} min={0} max={0.08} step={0.0025} value={realised} onChange={setRealised} formatValue={(v) => pct(v, 2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4FisherAria")}>
        <LineChart
          data={rows}
          xKey="pi"
          series={[
            { key: "nominal", label: t("gfW4NominalBond"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "linker", label: t("gfW4Linker"), color: SERIES_PALETTE[1], strokeWidth: 2.5 },
          ]}
          referenceLines={[markerLine(realised)]}
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `π = ${pct(x, 1)}`}
          valueFormat={(v) => fmt(v, 2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4NominalYield"), value: pct(nominalYield, 2) },
          { label: t("gfW4Breakeven"), value: pct(breakeven(nominalYield, real).exact, 2) },
          { label: t("gfW4NominalValue"), value: fmt(nominalBondRealValue(real, expected, YEARS, realised)), tone: "strong" },
          { label: t("gfW4LinkerValue"), value: fmt(linker), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
