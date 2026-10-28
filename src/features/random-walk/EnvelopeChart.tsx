import { useMemo } from "react";
import { PathCloudChart, SERIES_ROLE } from "../../components/charts";
import type { PathOverlay } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import { sqrtEnvelope } from "./scalingLaws.math";

type Props = {
  positions: Int16Array;
  pathCount: number;
  steps: number;
  /// Empirical sd of Sₙ across the cloud, one point per step.
  std: { x: number; y: number }[];
};

const mirror = (points: { x: number; y: number }[]) => points.map((p) => ({ x: p.x, y: -p.y }));

/// Hero view: a translucent cloud of walks with the theoretical ±√n envelope and the
/// ±empirical sd measured from the cloud; the two merge as the path count grows.
export default function EnvelopeChart({ positions, pathCount, steps, std }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");

  const overlays = useMemo<PathOverlay[]>(() => {
    const truth = sqrtEnvelope(steps);
    const line = (key: string, points: PathOverlay["points"], color: string, dash?: string) => ({
      key, points, color, dash, strokeWidth: 2.5,
    });
    return [
      line("trueUpper", truth, SERIES_ROLE.reference),
      line("trueLower", mirror(truth), SERIES_ROLE.reference),
      line("stdUpper", std, SERIES_ROLE.estimate, "5 4"),
      line("stdLower", mirror(std), SERIES_ROLE.estimate, "5 4"),
    ];
  }, [steps, std]);

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochSqrtEnvelopeChart")}
      actions={<span className="stoch-chart-readout">{t("stochSqrtPathCount", { count: pathCount })}</span>}
    >
      <div className="stoch-path-chart">
        <PathCloudChart
          values={positions}
          pathCount={pathCount}
          stepCount={steps + 1}
          overlays={overlays}
          maxOpacity={0.35}
          isMobile={isMobile}
          ariaLabel={t("stochSqrtEnvelopeChart")}
        />
      </div>
      <ul className="stoch-path-legend stoch-envelope-legend" aria-hidden="true">
        <li><span style={{ backgroundColor: SERIES_ROLE.reference }} />{t("stochSqrtTrueEnvelope")}</li>
        <li><span style={{ backgroundColor: SERIES_ROLE.estimate }} />{t("stochSqrtEmpiricalEnvelope")}</li>
      </ul>
      <p className="stoch-chart-caption">{t("stochSqrtEnvelopeCaption")}</p>
    </ChartContainer>
  );
}
