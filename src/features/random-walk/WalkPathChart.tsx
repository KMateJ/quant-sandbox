import { PathCloudChart, SERIES_PALETTE } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";

type Props = { positions: Int16Array; pathCount: number; steps: number; activeStep: number };

/// Every simulated walk; a handful get distinct colours, more become a density cloud.
export default function WalkPathChart({ positions, pathCount, steps, activeStep }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const many = pathCount > SERIES_PALETTE.length;

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochWalkPathsChart")}
      actions={<span className="stoch-chart-readout">{t("stochStepReadout", { current: activeStep, total: steps })}</span>}
    >
      <div className="stoch-path-chart">
        <PathCloudChart
          values={positions}
          pathCount={pathCount}
          stepCount={steps + 1}
          visibleSteps={activeStep + 1}
          palette={many ? undefined : SERIES_PALETTE}
          isMobile={isMobile}
          ariaLabel={t("stochWalkPathsChart")}
        />
      </div>
      {many ? (
        <p className="stoch-chart-caption">{t("stochWalkCloudNote", { paths: pathCount })}</p>
      ) : (
        <ul className="stoch-path-legend" aria-label={t("stochPathLegend")}>
          {Array.from({ length: pathCount }, (_, index) => (
            <li key={index}>
              <span aria-hidden="true" style={{ backgroundColor: SERIES_PALETTE[index] }} />
              {`${t("stochPathLabel")} ${index + 1}`}
            </li>
          ))}
        </ul>
      )}
    </ChartContainer>
  );
}
