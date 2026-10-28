import type { CSSProperties, KeyboardEvent, PointerEvent } from "react";
import type { Point } from "../../../lib/graph/forceLayout";
import type { NetLabels, NetNode } from "./network.types";

type Props = {
  nodes: NetNode[];
  at: (id: string) => Point;
  selectedId?: string | null;
  armedId?: string | null;
  dimmed?: ReadonlySet<string>;
  statusWords: NetLabels["status"];
  onPress: (event: PointerEvent<Element>, node: NetNode, at: Point) => void;
  onActivate: (id: string) => void;
};

const cross = (r: number) => `M${-r} ${-r}L${r} ${r}M${r} ${-r}L${-r} ${r}`;

/// Focusable discs. Status shows by shape as well as colour: dashed ring, thick ring, or hollow with a cross.
export default function NetworkNodes({ nodes, at, selectedId, armedId, dimmed, statusWords, onPress, onActivate }: Props) {
  const keyDown = (event: KeyboardEvent, id: string) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    onActivate(id);
  };
  return (
    <g className="net-nodes">
      {nodes.map((n) => {
        const p = at(n.id);
        const status = n.status ?? "ok";
        const marked = selectedId === n.id || armedId === n.id;
        const cls = `net-node is-${status}${marked ? " is-selected" : ""}${dimmed?.has(n.id) ? " is-dim" : ""}`;
        return (
          <g
            key={n.id}
            className={cls}
            style={{ "--net-fill": n.fill } as CSSProperties}
            transform={`translate(${p.x} ${p.y})`}
            tabIndex={0}
            role="button"
            aria-pressed={selectedId === n.id}
            aria-label={`${n.label}, ${statusWords[status]}${n.badge ? `, ${n.badge}` : ""}`}
            onPointerDown={(event) => onPress(event, n, p)}
            onKeyDown={(event) => keyDown(event, n.id)}
          >
            {marked && <circle className="net-select" r={n.radius + 8} />}
            {(status === "stressed" || status === "critical") && <circle className="net-ring" r={n.radius + 4} />}
            <circle className="net-disc" r={n.radius} />
            {status === "failed" && <path className="net-cross" d={cross(n.radius * 0.5)} />}
            <text className="net-label" y={n.radius + 13} textAnchor="middle">{n.label}</text>
            {n.badge && <text className="net-badge" x={n.radius + 3} y={-n.radius + 2}>{n.badge}</text>}
          </g>
        );
      })}
    </g>
  );
}
