import { useMemo } from "react";
import { LineChart } from "../../components/charts";
import type { ChartDatum, ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { envelopeCoefficient } from "./scalingLaws.math";

const CLOUD_COLOR = "color-mix(in srgb, var(--primary) 22%, transparent)";
const TRUE_COLOR = "#10b981";
const CANDIDATE_COLOR = "#f59e0b";

type Props = {
  data: ChartDatum[];
  renderedPaths: number;
  steps: number;
  alpha: number;
};

/// Hero view: a translucent cloud of walks with the ±√n "typical spread" envelope
/// and an adjustable ±c·nᵃ candidate. Only α = 1/2 hugs the cloud at every step.
export default function EnvelopeChart({ data, renderedPaths, steps, alpha }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const rows = useMemo<ChartDatum[]>(() => {
    const c = envelopeCoefficient(steps, alpha);
    return data.map((row) => {
      const step = Number(row.step);
      const tru = Math.sqrt(step);
      const cand = c * step ** alpha;
      return {
        ...row,
        trueUpper: tru,
        trueLower: -tru,
        candUpper: cand,
        candLower: -cand,
      };
    });
  }, [data, steps, alpha]);

  const cloud: ChartSeries[] = Array.from({ length: renderedPaths }, (_, index) => ({
    key: `p${index}`,
    label: `p${index}`,
    color: CLOUD_COLOR,
    strokeWidth: 0.8,
  }));

  const envelopes: ChartSeries[] = [
    { key: "trueUpper", label: t("stochSqrtTrueEnvelope"), color: TRUE_COLOR, strokeWidth: 2.5 },
    { key: "trueLower", label: "", color: TRUE_COLOR, strokeWidth: 2.5 },
    { key: "candUpper", label: t("stochSqrtCandidateEnvelope"), color: CANDIDATE_COLOR, strokeWidth: 2.5, dash: "5 4" },
    { key: "candLower", label: "", color: CANDIDATE_COLOR, strokeWidth: 2.5, dash: "5 4" },
  ];

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochSqrtEnvelopeChart")}
      actions={<span className="stoch-chart-readout">α = {alpha.toFixed(2)}</span>}
    >
      <div className="stoch-path-chart">
        <LineChart
          data={rows}
          xKey="step"
          series={[...cloud, ...envelopes]}
          xDomain={[0, steps]}
          isMobile={isMobile}
          legend={false}
          tooltip={false}
          valueFormat={(value) => value.toFixed(1)}
        />
      </div>
      <ul className="stoch-path-legend stoch-envelope-legend" aria-hidden="true">
        <li><span style={{ backgroundColor: TRUE_COLOR }} />{t("stochSqrtTrueEnvelope")}</li>
        <li><span style={{ backgroundColor: CANDIDATE_COLOR }} />{t("stochSqrtCandidateEnvelope")}</li>
      </ul>
      <p className="stoch-chart-caption">{t("stochSqrtEnvelopeCaption")}</p>
    </ChartContainer>
  );
}
