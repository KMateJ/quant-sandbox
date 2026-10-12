import { useMemo } from "react";
import { PathCloudChart, SERIES_ROLE } from "../../components/charts";
import type { PathOverlay } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { envelopeCoefficient, envelopeCurve } from "./scalingLaws.math";

type Props = {
  positions: Int16Array;
  pathCount: number;
  steps: number;
  alpha: number;
};

const mirror = (points: { x: number; y: number }[]) => points.map((p) => ({ x: p.x, y: -p.y }));

/// Hero view: a translucent cloud of walks with the ±√n "typical spread" envelope
/// and an adjustable ±c·nᵃ candidate. Only α = 1/2 hugs the cloud at every step.
export default function EnvelopeChart({ positions, pathCount, steps, alpha }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const overlays = useMemo<PathOverlay[]>(() => {
    const truth = envelopeCurve(steps, 1, 0.5);
    const guess = envelopeCurve(steps, envelopeCoefficient(steps, alpha), alpha);
    const line = (key: string, points: PathOverlay["points"], color: string, dash?: string) => ({
      key, points, color, dash, strokeWidth: 2.5,
    });
    return [
      line("trueUpper", truth, SERIES_ROLE.reference),
      line("trueLower", mirror(truth), SERIES_ROLE.reference),
      line("candUpper", guess, SERIES_ROLE.candidate, "5 4"),
      line("candLower", mirror(guess), SERIES_ROLE.candidate, "5 4"),
    ];
  }, [steps, alpha]);

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochSqrtEnvelopeChart")}
      actions={<span className="stoch-chart-readout">α = {alpha.toFixed(2)}</span>}
    >
      <div className="stoch-path-chart">
        <PathCloudChart
          values={positions}
          pathCount={pathCount}
          stepCount={steps + 1}
          overlays={overlays}
          isMobile={isMobile}
          ariaLabel={t("stochSqrtEnvelopeChart")}
        />
      </div>
      <ul className="stoch-path-legend stoch-envelope-legend" aria-hidden="true">
        <li><span style={{ backgroundColor: SERIES_ROLE.reference }} />{t("stochSqrtTrueEnvelope")}</li>
        <li><span style={{ backgroundColor: SERIES_ROLE.candidate }} />{t("stochSqrtCandidateEnvelope")}</li>
      </ul>
      <p className="stoch-chart-caption">{t("stochSqrtEnvelopeCaption")}</p>
    </ChartContainer>
  );
}
