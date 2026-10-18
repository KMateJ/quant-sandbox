import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { girsanovRows } from "../../guide.simulation.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

/// Log return under ℙ and ℚ, and ℙ-samples reweighted by dℚ/dℙ landing on the ℚ density.
export default function GirsanovShiftFigure() {
  const { t } = useI18n();
  const [mu, setMu] = useState(0.1);
  const [r, setR] = useState(0.03);
  const [sigma, setSigma] = useState(0.2);
  const model = useMemo(() => girsanovRows(mu, r, sigma), [mu, r, sigma]);

  return (
    <GuideFigure title={t("gfGirsanovTitle")} labId="gbm">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldMuDrift")} min={0} max={0.2} step={0.005} value={mu} onChange={setMu} formatValue={(v) => pct(v)} />
        <SliderField label={t("guideFieldRate")} min={0} max={0.08} step={0.0025} value={r} onChange={setR} formatValue={(v) => pct(v, 2)} />
        <SliderField label={t("gfFieldSigma")} min={0.1} max={0.4} step={0.01} value={sigma} onChange={setSigma} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfGirsanovAria")}>
        <LineChart
          data={model.rows}
          xKey="x"
          series={[
            { key: "p", label: t("gfDensityP"), color: SERIES_PALETTE[1], strokeWidth: 2 },
            { key: "q", label: t("gfDensityQ"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
            { key: "reweighted", label: t("gfReweighted"), color: SERIES_PALETTE[2], strokeWidth: 1.5, dash: "3 3" },
          ]}
          curve="linear"
          xFormat={(v) => pct(v, 0)}
          tooltipLabel={(x) => `ln(S_T/S₀) = ${pct(x, 1)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: "θ = (μ − r)/σ", value: fmt(model.theta, 3), tone: "accent" },
          { label: t("gfMeanUnderP"), value: pct(model.meanP, 2) },
          { label: t("gfMeanUnderQ"), value: pct(model.meanQ, 2), tone: "strong" },
          { label: t("gfReweightedMean"), value: pct(model.reweightedMean, 2) },
        ]}
      />
    </GuideFigure>
  );
}
