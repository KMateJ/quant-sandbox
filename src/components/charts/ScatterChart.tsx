import { ParentSize } from "@visx/responsive";
import ScatterChartInner from "./ScatterChartInner";
import ChartLegend from "./ChartLegend";
import type { ScatterChartProps } from "./chart.types";
import { LEGEND_HEIGHT } from "./chart.theme";
import { useMeasuredHeight } from "./useMeasuredHeight";

/// Responsive scatter chart (points + optional line overlays) built on visx.
export default function ScatterChart(props: ScatterChartProps) {
  const showLegend = props.legend !== false;
  const [legendRef, legendHeight] = useMeasuredHeight<HTMLDivElement>(LEGEND_HEIGHT);
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? (
            <ScatterChartInner {...props} width={width} height={height} legendHeight={legendHeight} />
          ) : null
        }
      </ParentSize>
      {showLegend && <ChartLegend ref={legendRef} series={props.series} />}
    </div>
  );
}
