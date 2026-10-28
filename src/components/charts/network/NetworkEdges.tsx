import { useMemo } from "react";
import type { Point } from "../../../lib/graph/forceLayout";
import { edgeGeometry } from "./network.logic";
import type { NetEdge } from "./network.types";

type Props = {
  edges: NetEdge[];
  at: (id: string) => Point | undefined;
  radiusOf: (id: string) => number;
  /// Scopes marker ids, so two graphs on one page don't share arrowheads.
  uid: string;
  dimmed?: ReadonlySet<string>;
  onSelect?: (id: string) => void;
};

/// Edges with arrowheads that touch the rim; one marker per colour, since markers don't inherit stroke colour.
export default function NetworkEdges({ edges, at, radiusOf, uid, dimmed, onSelect }: Props) {
  const colors = useMemo(() => [...new Set(edges.filter((e) => e.directed).map((e) => e.color))], [edges]);
  return (
    <g className="net-edges">
      <defs>
        {colors.map((c, i) => (
          <marker key={c} id={`${uid}-m${i}`} viewBox="0 0 8 8" refX="7" refY="4" markerWidth="8" markerHeight="8" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M0 0L8 4L0 8z" style={{ fill: c }} />
          </marker>
        ))}
      </defs>
      {edges.map((e) => {
        const a = at(e.source);
        const b = at(e.target);
        if (!a || !b) return null;
        const d = edgeGeometry(a, b, radiusOf(e.source), radiusOf(e.target), e.directed ? 0.14 : 0).d;
        const dim = dimmed?.has(e.source) || dimmed?.has(e.target);
        return (
          <g key={e.id} className={`net-edge${e.active ? " is-active" : ""}${dim ? " is-dim" : ""}`}>
            <path
              d={d}
              fill="none"
              style={{ stroke: e.color }}
              strokeWidth={e.active ? e.width * 1.8 : e.width}
              strokeDasharray={e.dashed ? "5 4" : undefined}
              markerEnd={e.directed ? `url(#${uid}-m${colors.indexOf(e.color)})` : undefined}
            />
            {onSelect && <path className="net-edge-hit" d={d} fill="none" strokeWidth={Math.max(e.width, 12)} onClick={() => onSelect(e.id)} />}
          </g>
        );
      })}
    </g>
  );
}
