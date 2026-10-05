import { ParentSize } from "@visx/responsive";
import LineChartInner from "./LineChartInner";
import ChartLegend from "./ChartLegend";
import type { LineChartProps } from "./chart.types";

/// Responsive line chart built on visx. Fills its (sized) parent container.
export default function LineChart(props: LineChartProps) {
  const showLegend = props.legend !== false;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <LineChartInner {...props} width={width} height={height} />
          ) : null
        }
      </ParentSize>
      {showLegend && <ChartLegend series={props.series} />}
    </div>
  );
}
