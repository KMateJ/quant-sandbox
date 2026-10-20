import { useMemo, useState } from "react";
import { Histogram } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { binValues } from "../../../../../lib/stats";
import { PROJECT_DEFAULTS, PROJECT_SD, PROJECT_SEED, PROJECT_SIMS, npvSimulation, projectNpv } from "../../../guide.wave4.corporate.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";

const DOMAIN: [number, number] = [-3000, 5000];

/// Simulated NPVs of the default project when units sold and price are uncertain.
export default function NpvDistributionFigure() {
  const { t } = useI18n();
  const [sdUnits, setSdUnits] = useState(PROJECT_SD.units);
  const [sdPrice, setSdPrice] = useState(PROJECT_SD.price);
  const sim = useMemo(() => npvSimulation(PROJECT_DEFAULTS, { units: sdUnits, price: sdPrice }, PROJECT_SIMS, PROJECT_SEED), [sdUnits, sdPrice]);
  const bins = useMemo(() => binValues(sim.npvs, DOMAIN, 50).bins, [sim]);

  return (
    <GuideFigure title={t("gfW4NpvDistributionTitle")} labId="npv-irr">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldSdUnits")} min={0} max={40} step={1} value={sdUnits} onChange={setSdUnits} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfW4FieldSdPrice")} min={0} max={3} step={0.1} value={sdPrice} onChange={setSdPrice} formatValue={(v) => v.toFixed(1)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4NpvAria")}>
        <Histogram bins={bins} markers={[{ value: 0 }]} ariaLabel={t("gfW4NpvAria")} xFormat={(v) => v.toFixed(0)} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4BaseNpv"), value: fmt(projectNpv(PROJECT_DEFAULTS)) },
          { label: t("gfW4MeanNpv"), value: fmt(sim.mean) },
          { label: t("gfW4ProbLoss"), value: pct(sim.probLoss), tone: "accent" },
          { label: t("gfW4NpvP5"), value: fmt(sim.p5), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
