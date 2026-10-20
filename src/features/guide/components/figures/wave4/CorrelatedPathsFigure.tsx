import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../../components/charts";
import SliderField from "../../../../../components/SliderField";
import { useI18n } from "../../../../../i18n";
import { cholesky, correlatedPaths, incrementCorrelation } from "../../../guide.wave4.math";
import GuideFigure from "../../GuideFigure";
import FigureReadout from "../FigureReadout";
import { fmt } from "../figureFormat";

const STEPS = 250;
const T = 1;
const SEED = 3;

/// Two Brownian paths built from one set of independent shocks, with the correlation ρ set by a slider.
export default function CorrelatedPathsFigure() {
  const { t } = useI18n();
  const [rho, setRho] = useState(-0.7);
  const paths = useMemo(() => correlatedPaths(rho, STEPS, T, SEED), [rho]);
  const l22 = cholesky([[1, rho], [rho, 1]])?.[1][1] ?? NaN;

  return (
    <GuideFigure title={t("gfW4CorrelatedPathsTitle")} labId="heston">
      <div className="gf-sliders">
        <SliderField label={t("gfFieldRho")} min={-0.95} max={0.95} step={0.05} value={rho} onChange={setRho} formatValue={(v) => v.toFixed(2)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW4CorrelatedAria", { rho: rho.toFixed(2) })}>
        <LineChart
          data={paths}
          xKey="t"
          series={[
            { key: "w1", label: "W₁", color: SERIES_PALETTE[0], strokeWidth: 2 },
            { key: "w2", label: "W₂", color: SERIES_PALETTE[1], strokeWidth: 2 },
          ]}
          curve="linear"
          tooltipLabel={(x) => `t = ${x.toFixed(2)}`}
          valueFormat={(v) => v.toFixed(2)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW4SampleRho"), value: fmt(incrementCorrelation(paths), 2) },
          { label: t("gfW4CholeskyL22"), value: fmt(l22, 3), tone: "strong" },
          { label: t("gfW4Covariation"), value: fmt(rho * T, 2), tone: "accent" },
        ]}
      />
    </GuideFigure>
  );
}
