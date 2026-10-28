import { fitInto, forceLayout, type Point } from "../../../lib/graph/forceLayout";
import type { NetEdge, NetNode } from "./network.types";

export type EdgeGeometry = { start: Point; end: Point; control: Point; d: string };

/// A slightly curved edge between two discs. The ends sit on the rims, so an arrowhead touches the disc, and the
/// bend is on the left of the direction of travel, so A→B and B→A are drawn on opposite sides and never overlap.
export function edgeGeometry(a: Point, b: Point, ra: number, rb: number, curve = 0.12): EdgeGeometry {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const start = { x: a.x + ux * ra, y: a.y + uy * ra };
  const end = { x: b.x - ux * rb, y: b.y - uy * rb };
  const control = { x: (a.x + b.x) / 2 + uy * len * curve, y: (a.y + b.y) / 2 - ux * len * curve };
  return { start, end, control, d: `M ${start.x} ${start.y} Q ${control.x} ${control.y} ${end.x} ${end.y}` };
}

/// SVG path of `edgeGeometry`.
export const edgePath = (a: Point, b: Point, ra: number, rb: number, curve = 0.12) => edgeGeometry(a, b, ra, rb, curve).d;

/// Seeded force layout of `nodes` and `edges`, fitted into `width × height`. Same input → same output.
export function layoutFor(nodes: readonly NetNode[], edges: readonly NetEdge[], width: number, height: number, seed = 3) {
  const laid = forceLayout(
    nodes.map((n) => ({ id: n.id, group: n.group, radius: n.radius })),
    edges.map((e) => ({ source: e.source, target: e.target, length: 90, strength: 0.04 })),
    { width, height, seed, padding: 36, groupPull: 0.02 }
  );
  return fitInto([...laid], width, height, 48, 2.2);
}

/// Id of the point nearest `p` within `max` user units, or null.
export function nearestNode(points: ReadonlyMap<string, Point>, p: Point, max: number): string | null {
  let best: string | null = null;
  let bestD = max;
  for (const [id, q] of points) {
    const d = Math.hypot(q.x - p.x, q.y - p.y);
    if (d <= bestD) { best = id; bestD = d; }
  }
  return best;
}

/// Key of the node set. The layout reruns when nodes change, not when edges are added or removed, so
/// drawing a link never rearranges the picture.
export const layoutKey = (nodes: readonly NetNode[]) => nodes.map((n) => `${n.id}:${n.group}:${n.radius}`).join("|");
