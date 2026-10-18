import { ParentSize } from "@visx/responsive";
import HeatmapPickerInner, { type HeatmapPickerProps } from "./HeatmapPickerInner";

/// Responsive 2-D parameter map: each cell is value(x, y); click, drag or press Enter on a cell to set both inputs.
export default function HeatmapPicker({ height = 320, ...props }: HeatmapPickerProps & { height?: number }) {
  return (
    <div style={{ height }}>
      <ParentSize>
        {({ width, height: h }) => (width > 0 && h > 0 ? <HeatmapPickerInner {...props} width={width} height={h} /> : null)}
      </ParentSize>
    </div>
  );
}

export type { HeatmapPickerProps };
