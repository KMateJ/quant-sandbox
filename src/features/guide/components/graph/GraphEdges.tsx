import { edgeKey, type GraphEdge } from "../../guide.graph";
import type { Point } from "../../guide.graph.layout";

type Props = {
  edges: GraphEdge[];
  at: (id: string) => Point;
  /// Radius of a node, so arrows stop at its rim.
  radiusOf: (id: string) => number;
  isLit: (e: GraphEdge) => boolean;
  focusing: boolean;
  onPath: boolean;
};

// Citations bend slightly so edges between the same clusters fan out instead of stacking.
const BEND: Record<GraphEdge["kind"], number> = { citation: 0.14, sequence: 0, practice: 0.08 };

/// Quadratic path from `a` to `b`, shortened so it ends `gap` units before `b`.
function curve(a: Point, b: Point, bend: number, gap: number): string {
  const c = { x: (a.x + b.x) / 2 - (b.y - a.y) * bend, y: (a.y + b.y) / 2 + (b.x - a.x) * bend };
  const dx = b.x - c.x;
  const dy = b.y - c.y;
  const len = Math.hypot(dx, dy) || 1;
  return `M${a.x} ${a.y}Q${c.x} ${c.y} ${b.x - (dx * gap) / len} ${b.y - (dy * gap) / len}`;
}

/// Graph edges: curved citations with arrowheads, straight dashed reading order, faint lab links.
export default function GraphEdges({ edges, at, radiusOf, isLit, focusing, onPath }: Props) {
  return (
    <>
      <defs>
        <marker id="gg-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1L9 5L0 9z" className="gg-arrowhead" />
        </marker>
        <marker id="gg-arrow-lit" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 1L9 5L0 9z" className="gg-arrowhead is-lit" />
        </marker>
      </defs>
      {edges.map((e) => {
        const on = isLit(e);
        const cls = `gg-edge gg-edge--${e.kind}${on ? " is-lit" : ""}${focusing && !on ? " is-dim" : ""}${on && onPath ? " is-path" : ""}`;
        return (
          <path
            key={`${e.kind}:${edgeKey(e)}`}
            className={cls}
            d={curve(at(e.source), at(e.target), BEND[e.kind], radiusOf(e.target) + 3)}
            markerEnd={e.kind === "citation" ? `url(#${on ? "gg-arrow-lit" : "gg-arrow"})` : undefined}
          />
        );
      })}
    </>
  );
}
