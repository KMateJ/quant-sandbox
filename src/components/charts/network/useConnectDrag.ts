import { useState, type PointerEvent, type RefObject } from "react";
import type { Point } from "../../../lib/graph/forceLayout";
import { nearestNode } from "./network.logic";

export type ConnectDrag = { from: string; to: Point; start: Point };

/// Rubber-band "draw an edge from this node to that one". `toGraph` converts a pointer event to graph units.
/// A press that barely moves counts as a tap and calls `onTap`; a release near another node calls `onConnect`.
export function useConnectDrag(
  svgRef: RefObject<SVGSVGElement | null>,
  toGraph: (event: { clientX: number; clientY: number }, svg: SVGSVGElement) => Point,
  positions: ReadonlyMap<string, Point>,
  reach: number,
  onConnect?: (from: string, to: string) => void,
  onTap?: (id: string) => void
) {
  const [drag, setDrag] = useState<ConnectDrag | null>(null);

  const begin = (event: PointerEvent<Element>, id: string) => {
    const svg = svgRef.current;
    if (event.button !== 0 || !svg) return;
    event.stopPropagation();
    svg.setPointerCapture(event.pointerId);
    const p = toGraph(event, svg);
    setDrag({ from: id, to: p, start: p });
  };

  const move = (event: PointerEvent<SVGSVGElement>) => {
    if (drag) setDrag({ ...drag, to: toGraph(event, event.currentTarget) });
  };

  const end = (event: PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = toGraph(event, event.currentTarget);
    setDrag(null);
    if (Math.hypot(p.x - drag.start.x, p.y - drag.start.y) < 4) return onTap?.(drag.from);
    const target = nearestNode(positions, p, reach);
    if (target && target !== drag.from) onConnect?.(drag.from, target);
  };

  return { drag, begin, move, end, cancel: () => setDrag(null) };
}
