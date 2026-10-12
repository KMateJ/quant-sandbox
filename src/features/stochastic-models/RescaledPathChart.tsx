import { LineChart, SERIES_PALETTE } from "../../components/charts";
import type { ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";
import { useI18n } from "../../i18n";
import type { RescaledPathData } from "./rescaledWalk.types";

type Props = { paths: RescaledPathData; level: number; yDomain: [number, number] };

export default function RescaledPathChart({ paths, level, yDomain }: Props) {
  const { t } = useI18n();
  const isMobile = useMediaQuery("(max-width: 640px)");
  const series: ChartSeries[] = paths.pathKeys.map((key, index) => ({
    key,
    label: `${t("stochPathLabel")} ${index + 1}`,
    color: SERIES_PALETTE[index % SERIES_PALETTE.length],
    strokeWidth: 1.3,
  }));
  const jump = 1 / Math.sqrt(level);

  return (
    <ChartContainer
      className="stoch-path-frame"
      title={t("stochRescaledPathsChart")}
      actions={<span className="stoch-chart-readout">{t("stochRescaledLevelReadout", { n: level })}</span>}
    >
      <div className="stoch-path-chart">
        <LineChart
          data={paths.rows}
          xKey="t"
          series={series}
          xDomain={[0, 1]}
          yDomain={yDomain}
          curve="linear"
          isMobile={isMobile}
          legend={false}
          tooltipLabel={(x) => `t = ${x.toFixed(3)}`}
          valueFormat={(value) => value.toFixed(3)}
        />
      </div>
      <p className="stoch-chart-caption">{t("stochRescaledJumpNote", { jump: jump.toFixed(3) })}</p>
    </ChartContainer>
  );
}
