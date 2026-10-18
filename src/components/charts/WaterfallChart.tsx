import { ParentSize } from "@visx/responsive";
import WaterfallChartInner from "./WaterfallChartInner";
import type { WaterfallProps } from "./waterfall.logic";

/// Responsive waterfall ("why did it move?"): totals stand on zero, deltas float from the running total.
export default function WaterfallChart({ height = 240, ...props }: WaterfallProps) {
  return (
    <div style={{ height }}>
      <ParentSize>
        {({ width, height: h }) => (width > 0 && h > 0 ? <WaterfallChartInner {...props} width={width} height={h} /> : null)}
      </ParentSize>
    </div>
  );
}
