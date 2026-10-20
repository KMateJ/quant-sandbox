import { useMemo, useState } from "react";
import { ScatterChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { ESTIMATION_TRUTH as T, momentStandardErrors, quartiles, resampledFrontiers, resampledTangencies, twoAssetFrontier } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt, pct } from "../figureFormat";
import { curveSeries } from "../figureSeries";

const SAMPLES = 20;
const keep = (f: { sigma: number; mu: number }[]) => f.filter((p) => p.mu >= -0.02 && p.mu <= 0.18);

/// The true two-asset frontier against 20 frontiers estimated from short samples: the fewer months, the wilder the picture.
export default function EstimationNoiseFigure() {
  const { t } = useI18n();
  const [months, setMonths] = useState(60);
  const [shrink, setShrink] = useState(0);
  const truth = useMemo(() => twoAssetFrontier(T.mu, T.sigma, T.rho), []);
  const noisy = useMemo(() => resampledFrontiers(months, shrink, SAMPLES), [months, shrink]);
  const stats = useMemo(() => resampledTangencies(months, shrink, SAMPLES), [months, shrink]);
  const q = quartiles(stats.w);
  const lost = stats.lost.reduce((s, v) => s + v, 0) / stats.lost.length;
  const se = momentStandardErrors(T.sigma[1], months / 12).mean;

  return (
    <GuideFigure title={t("gfW4EstimationNoiseTitle")} labId="efficient-frontier">
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldMonths")} min={12} max={600} step={12} value={months} onChange={setMonths} formatValue={(v) => v.toFixed(0)} />
        <SliderField label={t("gfW4FieldShrink")} min={0} max={1} step={0.05} value={shrink} onChange={setShrink} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4EstimationAria")}>
        <ScatterChart
          series={[
            ...noisy.map((f, i) => ({ ...curveSeries(`s${i}`, i === 0 ? t("gfW4Samples") : "", keep(f), SERIES_PALETTE[1]), strokeWidth: 1, legend: i === 0 })),
            curveSeries("truth", t("gfW4TrueFrontier"), truth, SERIES_PALETTE[0]),
          ]}
          xDomain={[0, 0.34]}
          yDomain={[-0.02, 0.18]}
          xFormat={(v) => pct(v, 0)}
          yFormat={(v) => pct(v, 0)}
          xLabel={t("gfAxisVolatility")}
          yLabel={t("gfAxisExpectedReturn")}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4SeMean"), value: pct(se, 1) },
          { label: t("gfW4WeightSpread"), value: `${pct(q.q1, 0)} to ${pct(q.q3, 0)}`, tone: "accent" },
          { label: t("gfW4TrueWeight"), value: pct(stats.trueW, 0) },
          { label: t("gfW4SharpeLost"), value: fmt(lost, 3), tone: "strong" },
        ]}
      />
    </GuideFigure>
  );
}
