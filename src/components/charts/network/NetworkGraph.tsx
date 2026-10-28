import { ParentSize } from "@visx/responsive";
import NetworkGraphInner from "./NetworkGraphInner";
import type { NetworkGraphProps } from "./network.types";

/// Generic interactive network (nodes and edges by props, no finance): seeded force layout, pan/zoom/drag,
/// selection, draw-an-edge mode, status glyphs that are not colour-only and a keyboard path.
export default function NetworkGraph(props: NetworkGraphProps) {
  return (
    <div className="net-frame" style={{ height: props.height }}>
      <ParentSize>
        {({ width }) => (width > 0 ? <NetworkGraphInner {...props} width={width} /> : null)}
      </ParentSize>
    </div>
  );
}
