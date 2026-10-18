import { useMemo, useState } from "react";
import { LineChart, SERIES_PALETTE } from "../../../../components/charts";
import SliderField from "../../../../components/SliderField";
import { useI18n } from "../../../../i18n";
import { mertonDensityRows, mertonMoments, mertonTail } from "../../guide.wave3.math";
import GuideFigure from "../GuideFigure";
import FigureReadout from "./FigureReadout";
import { fmt, pct } from "./figureFormat";

const SIGMA = 0.15;
const THRESHOLD = -0.3;

/// Merton 1-year log-return density against the normal with the same mean and variance.
export default function JumpDensityFigure() {
  const { t } = useI18n();
  const [lambda, setLambda] = useState(0.5);
  const [muJ, setMuJ] = useState(-0.1);
  const [sigmaJ, setSigmaJ] = useState(0.15);
  const rows = useMemo(() => mertonDensityRows(SIGMA, lambda, muJ, sigmaJ), [lambda, muJ, sigmaJ]);
  const m = mertonMoments(SIGMA, lambda, muJ, sigmaJ);
  const tail = mertonTail(SIGMA, lambda, muJ, sigmaJ, THRESHOLD);

  return (
    <GuideFigure title={t("gfW3JdTitle")} labId="monte-carlo">
      <div className="gf-sliders">
        <SliderField label={t("gfW3FieldLambda")} min={0} max={3} step={0.1} value={lambda} onChange={setLambda} formatValue={(v) => v.toFixed(1)} />
        <SliderField label={t("gfW3FieldMuJ")} min={-0.3} max={0.1} step={0.01} value={muJ} onChange={setMuJ} formatValue={(v) => pct(v, 0)} />
        <SliderField label={t("gfW3FieldSigmaJ")} min={0} max={0.3} step={0.01} value={sigmaJ} onChange={setSigmaJ} formatValue={(v) => pct(v, 0)} />
      </div>
      <div className="gf-chart" role="img" aria-label={t("gfW3JdAria")}>
        <LineChart
          data={rows}
          xKey="x"
          series={[
            { key: "normal", label: t("gfW3NormalSameVar"), color: SERIES_PALETTE[1], strokeWidth: 2 },
            { key: "jump", label: t("gfW3Merton"), color: SERIES_PALETTE[0], strokeWidth: 2.5 },
          ]}
          referenceLines={[{ axis: "x", value: THRESHOLD, color: "var(--muted)", dash: "4 4" }]}
          curve="linear"
          tooltipLabel={(x) => `${t("gfW3LogReturn")} = ${pct(x)}`}
          valueFormat={(v) => v.toFixed(3)}
        />
      </div>
      <FigureReadout
        items={[
          { label: t("gfW3JumpShare"), value: pct(m.jumpShare) },
          { label: t("gfW3Skew"), value: fmt(m.skewness) },
          { label: t("gfW3ExKurt"), value: fmt(m.excessKurtosis) },
          { label: t("gfW3TailMerton"), value: pct(tail.jump, 2), tone: "accent" },
          { label: t("gfW3TailNormal"), value: pct(tail.normal, 2) },
        ]}
      />
    </GuideFigure>
  );
}
