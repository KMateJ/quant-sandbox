import type { ReactNode } from "react";
import { LineChart } from "../../components/charts";
import type { ChartDatum, ChartReferenceLine, ChartSeries } from "../../components/charts";
import { ChartContainer } from "../../components/layout";
import { useMediaQuery } from "../../components/useMediaQuery";

type Props = {
  data: ChartDatum[];
  series: ChartSeries[];
  title: string;
  /// Variable name shown in the tooltip, e.g. "a" or "t".
  xLabel: string;
  caption?: string;
  actions?: ReactNode;
  xDomain?: [number, number];
  yDomain?: [number, number];
  referenceLines?: ChartReferenceLine[];
};

/// Secondary Chapter 3 chart: empirical curves against their theoretical counterparts.
export default function GeometryCurveChart({ data, series, title, xLabel, caption, actions, xDomain, yDomain, referenceLines }: Props) {
  const isMobile = useMediaQuery("(max-width: 640px)");
  return (
    <ChartContainer className="stoch-distribution-frame" title={title} actions={actions}>
      <div className="stoch-density-chart">
        <LineChart
          data={data}
          xKey="x"
          series={series}
          xDomain={xDomain}
          yDomain={yDomain}
          referenceLines={referenceLines}
          isMobile={isMobile}
          tooltipLabel={(x) => `${xLabel} = ${x.toFixed(2)}`}
          valueFormat={(value) => value.toFixed(3)}
        />
      </div>
      {caption && <p className="stoch-chart-caption">{caption}</p>}
    </ChartContainer>
  );
}
