import { ParentSize } from "@visx/responsive";
import LineChartInner from "./LineChartInner";
import ChartLegend from "./ChartLegend";
import type { LineChartProps } from "./chart.types";
import { LEGEND_HEIGHT } from "./chart.theme";
import { useMeasuredHeight } from "./useMeasuredHeight";

/// Responsive line chart built on visx. Fills its (sized) parent container.
export default function LineChart(props: LineChartProps) {
  const showLegend = props.legend !== false;
  const [legendRef, legendHeight] = useMeasuredHeight<HTMLDivElement>(LEGEND_HEIGHT);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <LineChartInner {...props} width={width} height={height} legendHeight={legendHeight} />
          ) : null
        }
      </ParentSize>
      {showLegend && <ChartLegend ref={legendRef} series={props.series} />}
    </div>
  );
}
