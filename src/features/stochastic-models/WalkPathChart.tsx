import { LineChart } from "../../components/charts";
import type { ChartDatum, ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";

const COLORS = ["#60a5fa", "#34d399", "#fbbf24", "#f87171", "#c084fc", "#22d3ee", "#fb7185", "#a3e635"];

type Props = { data: ChartDatum[]; steps: number; activeStep: number };

export default function WalkPathChart({ data, steps, activeStep }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = COLORS.map((color, index) => ({
    key: `p${index}`,
    label: `${t("stochPathLabel")} ${index + 1}`,
    color,
    strokeWidth: 1.6,
  }));
  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochWalkPathsChart")}
      actions={<span className="stoch-chart-readout">{t("stochStepReadout", { current: activeStep, total: steps })}</span>}
    >
      <div className="stoch-path-chart">
        <LineChart
          data={data.slice(0, activeStep + 1)}
          xKey="step"
          series={series}
          xDomain={[0, steps]}
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(step) => `${t("stochStepLabel")} ${step.toFixed(0)}`}
          valueFormat={(value) => value.toFixed(0)}
        />
      </div>
      <ul className="stoch-path-legend" aria-label={t("stochPathLegend")}>
        {series.map((path) => (
          <li key={path.key}>
            <span aria-hidden="true" style={{ backgroundColor: path.color }} />
            {path.label}
          </li>
        ))}
      </ul>
    </ChartContainer>
  );
}
