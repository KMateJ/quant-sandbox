import { ParentSize } from "@visx/responsive";
import DraggableBarsInner, { type DraggableBarsProps } from "./DraggableBarsInner";

/// Responsive bar chart whose bars are the input: drag a bar (or focus it and use the arrow keys) to set its value.
/// Without `height` it fills its parent's height.
export default function DraggableBars({ height, ...props }: DraggableBarsProps & { height?: number }) {
  return (
    <div style={{ height: height ?? "100%", width: "100%" }}>
      <ParentSize>
        {({ width, height: h }) => (width > 0 && h > 0 ? <DraggableBarsInner {...props} width={width} height={h} /> : null)}
      </ParentSize>
    </div>
  );
}

export type { DraggableBarsProps };
