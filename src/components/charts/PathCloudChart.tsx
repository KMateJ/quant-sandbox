import { ParentSize } from "@visx/responsive";
import PathCloudChartInner from "./PathCloudChartInner";
import type { PathCloudProps } from "./chart.types";

/// Responsive canvas chart for dense sample-path clouds with SVG axes and overlays.
export default function PathCloudChart(props: PathCloudProps) {
  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? <PathCloudChartInner {...props} width={width} height={height} /> : null
        }
      </ParentSize>
    </div>
  );
}
