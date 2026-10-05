import { ParentSize } from "@visx/responsive";
import ScatterChartInner from "./ScatterChartInner";
import ChartLegend from "./ChartLegend";
import type { ScatterChartProps } from "./chart.types";

/// Responsive scatter chart (points + optional line overlays) built on visx.
export default function ScatterChart(props: ScatterChartProps) {
  const showLegend = props.legend !== false;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <ScatterChartInner {...props} width={width} height={height} />
          ) : null
        }
      </ParentSize>
      {showLegend && <ChartLegend series={props.series} />}
    </div>
  );
}
