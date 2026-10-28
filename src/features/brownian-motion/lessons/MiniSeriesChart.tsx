import { LineChart, type ChartDatum, type ChartSeries } from "../../../components/charts";
import { useMediaQuery } from "../../../components/useMediaQuery";

type Props = { title: string; data: ChartDatum[]; series: ChartSeries[]; ariaLabel: string };

/// A small titled line chart for grids of side-by-side comparisons.
export default function MiniSeriesChart({ title, data, series, ariaLabel }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <figure className="bl-mini">
      <figcaption>{title}</figcaption>
      <div className="bl-mini-chart" role="img" aria-label={ariaLabel}>
        <LineChart data={data} xKey="x" series={series} curve="linear" legend={false} isMobile={isMobile} valueFormat={(v) => v.toFixed(2)} />
      </div>
    </figure>
  );
}
