import { useMemo, useState } from "react";
import { Histogram } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { SegmentedControl } from "../../../../../components/ui";
import { useI18n } from "../../../../../i18n";
import { binValues, densityCurve } from "../../../../../lib/stats";
import { normCdf, normPdf } from "../../../../../lib/stats/distributions";
import { CLT_SAMPLES, CLT_SEED, normalDistance, sourceStandardError, standardisedMeans, type SourceDist } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";

const DOMAIN: [number, number] = [-4, 4];
const NORMAL = densityCurve({ pdf: normPdf, cdf: normCdf }, DOMAIN);

/// Standardised averages of n draws from a chosen source against the standard normal density.
export default function CltConvergenceFigure() {
  const { t } = useI18n();
  const [dist, setDist] = useState<SourceDist>("exponential");
  const [n, setN] = useState(10);
  const result = useMemo(() => standardisedMeans(dist, n, CLT_SAMPLES, CLT_SEED), [dist, n]);
  const bins = useMemo(() => binValues(result.z, DOMAIN, 40).bins, [result]);

  return (
    <GuideFigure title={t("gfW4CltConvergenceTitle")} labId="random-walk">
      <div className="gf-toolbar">
        <SegmentedControl<SourceDist>
          ariaLabel={t("gfW4FieldSource")}
          value={dist}
          onChange={setDist}
          options={[
            { value: "uniform", label: t("gfW4SourceUniform") },
            { value: "exponential", label: t("gfW4SourceExponential") },
            { value: "bernoulli", label: t("gfW4SourceBernoulli") },
          ]}
        />
      </div>
      <div className="gf-sliders">
        <SliderField label={t("gfW4FieldN")} min={1} max={100} step={1} value={n} onChange={setN} formatValue={(v) => v.toFixed(0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4CltAria", { n })}>
        <Histogram bins={bins} normalize="density" density={NORMAL} ariaLabel={t("gfW4CltAria", { n })} xFormat={(v) => v.toFixed(0)} />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4KolmogorovDistance"), value: fmt(normalDistance(result.z), 3), tone: "strong" },
          { label: t("gfW4SdOfAverage"), value: fmt(result.sd * sourceStandardError(dist, n), 3) },
          { label: t("gfW4TheorySe"), value: fmt(sourceStandardError(dist, n), 3), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
