import { ParentSize } from "@visx/responsive";
import HistogramInner from "./HistogramInner";
import type { HistogramProps } from "./histogram.types";

/// Responsive histogram of pre-binned counts (see `binValues` / `addToBins` in lib/stats), with optional
/// density overlay, tinted bins, vertical markers and a brushable bin selection.
export default function Histogram({ height = 220, ...props }: HistogramProps) {
  return (
    <div style={{ height }}>
      <ParentSize>
        {({ width, height: h }) => (width > 0 && h > 0 ? <HistogramInner {...props} width={width} height={h} /> : null)}
      </ParentSize>
    </div>
  );
}
