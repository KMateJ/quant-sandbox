import { makeRng } from "../../lib/math/random";

export type LayoutNode = { id: string; group: string; radius: number };
export type LayoutEdge = { source: string; target: string; length: number; strength: number };
export type Point = { x: number; y: number };

export type LayoutOptions = {
  width: number;
  height: number;
  iterations?: number;
  seed?: number;
  /// Pull of each node toward its group's anchor (keeps tracks together).
  groupPull?: number;
  padding?: number;
};

/// Deterministic force-directed layout: seeded start around per-group anchors, then repulsion,
/// edge springs, group pull, centring and collision with a cooling step size. Same input → same output,
/// so a pre-rendered page and the browser agree. Returns positions fitted into `width × height`.
export function forceLayout(nodes: LayoutNode[], edges: LayoutEdge[], options: LayoutOptions): Map<string, Point> {
  const { width, height, iterations = 320, seed = 7, groupPull = 0.04, padding = 40 } = options;
  const rng = makeRng(seed);
  const groups = [...new Set(nodes.map((n) => n.group))];
  // Group anchors on an ellipse shaped like the canvas, so clusters use the full width.
  const aspect = width / height;
  const anchor = new Map(groups.map((g, i) => {
    const angle = (2 * Math.PI * i) / Math.max(groups.length, 1) - Math.PI / 2;
    const r = groups.length > 1 ? 300 : 0;
    return [g, { x: r * aspect * Math.cos(angle), y: r * Math.sin(angle) }];
  }));

  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const x = nodes.map((n) => anchor.get(n.group)!.x + (rng() - 0.5) * 120);
  const y = nodes.map((n) => anchor.get(n.group)!.y + (rng() - 0.5) * 120);
  const vx = new Array<number>(nodes.length).fill(0);
  const vy = new Array<number>(nodes.length).fill(0);
  const links = edges
    .map((e) => ({ a: index.get(e.source), b: index.get(e.target), e }))
    .filter((l): l is { a: number; b: number; e: LayoutEdge } => l.a !== undefined && l.b !== undefined);

  for (let it = 0; it < iterations; it += 1) {
    const alpha = 1 - it / iterations;
    const fx = new Array<number>(nodes.length).fill(0);
    const fy = new Array<number>(nodes.length).fill(0);

    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = x[j] - x[i] || 0.01;
        const dy = y[j] - y[i] || 0.01;
        const d2 = Math.max(dx * dx + dy * dy, 25);
        const f = 4200 / d2;
        const d = Math.sqrt(d2);
        fx[i] -= (f * dx) / d; fy[i] -= (f * dy) / d;
        fx[j] += (f * dx) / d; fy[j] += (f * dy) / d;
      }
    }
    for (const { a, b, e } of links) {
      const dx = x[b] - x[a];
      const dy = y[b] - y[a];
      const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
      const f = (d - e.length) * e.strength;
      fx[a] += (f * dx) / d; fy[a] += (f * dy) / d;
      fx[b] -= (f * dx) / d; fy[b] -= (f * dy) / d;
    }
    nodes.forEach((n, i) => {
      const p = anchor.get(n.group)!;
      fx[i] += (p.x - x[i]) * groupPull - x[i] * 0.004;
      fy[i] += (p.y - y[i]) * groupPull - y[i] * 0.004;
      vx[i] = (vx[i] + fx[i] * alpha) * 0.55;
      vy[i] = (vy[i] + fy[i] * alpha) * 0.55;
      x[i] += vx[i];
      y[i] += vy[i];
    });
    // Collision: push overlapping discs apart so labels have room.
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const dx = x[j] - x[i] || 0.01;
        const dy = y[j] - y[i] || 0.01;
        const d = Math.sqrt(dx * dx + dy * dy);
        // Room for a label under each node, not just the discs.
        const min = nodes[i].radius + nodes[j].radius + 26;
        if (d < min) {
          const push = (min - d) / 2;
          x[i] -= (push * dx) / d; y[i] -= (push * dy) / d;
          x[j] += (push * dx) / d; y[j] += (push * dy) / d;
        }
      }
    }
  }
  return fitInto(nodes.map((n, i) => [n.id, { x: x[i], y: y[i] }] as const), width, height, padding);
}

/// Scales and centres points to fill `width × height` minus `padding`, keeping the aspect ratio.
export function fitInto(points: readonly (readonly [string, Point])[], width: number, height: number, padding: number) {
  const xs = points.map(([, p]) => p.x);
  const ys = points.map(([, p]) => p.y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const scale = Math.min((width - 2 * padding) / Math.max(maxX - minX, 1), (height - 2 * padding) / Math.max(maxY - minY, 1), 1.6);
  const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
  const round = (v: number) => Math.round(v * 10) / 10;
  return new Map(points.map(([id, p]) => [id, { x: round(width / 2 + (p.x - cx) * scale), y: round(height / 2 + (p.y - cy) * scale) }]));
}

export type LabelCandidate = { id: string; x: number; y: number; text: string; priority: number };
export type PlacedLabel = { x: number; y: number; anchor: "start" | "middle" | "end"; text: string };

/// Greedy label placement: highest priority first, skipping any label whose box would overlap one already
/// placed; labels near the left/right edge are anchored inward so they are never cut off.
export function placeLabels(candidates: LabelCandidate[], width: number, charWidth = 5.6, lineHeight = 13): Map<string, PlacedLabel> {
  const placed: { x0: number; x1: number; y0: number; y1: number }[] = [];
  const out = new Map<string, PlacedLabel>();
  const maxChars = Math.max(8, Math.floor((width - 8) / charWidth));
  for (const c of [...candidates].sort((a, b) => b.priority - a.priority)) {
    // Titles wider than the canvas are shortened rather than cut off at its edge.
    const text = c.text.length > maxChars ? `${c.text.slice(0, maxChars - 1).trimEnd()}…` : c.text;
    const w = text.length * charWidth;
    const anchor: PlacedLabel["anchor"] = c.x - w / 2 < 4 ? "start" : c.x + w / 2 > width - 4 ? "end" : "middle";
    const x0 = anchor === "start" ? Math.max(c.x - 8, 2) : anchor === "end" ? Math.min(c.x + 8, width - 2) - w : c.x - w / 2;
    const box = { x0, x1: x0 + w, y0: c.y - lineHeight + 3, y1: c.y + 3 };
    if (placed.some((b) => box.x0 < b.x1 && box.x1 > b.x0 && box.y0 < b.y1 && box.y1 > b.y0)) continue;
    placed.push(box);
    out.set(c.id, { x: anchor === "start" ? x0 : anchor === "end" ? x0 + w : c.x, y: c.y, anchor, text });
  }
  return out;
}
