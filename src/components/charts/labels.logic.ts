/// A label's box (top-left origin) in plot coordinates; higher `priority` wins a collision.
export type LabelBox = { id: string; x: number; y: number; w: number; h: number; priority: number };

export type LabelPlacement = {
  /// Final top-left position of every label that was kept.
  placed: Record<string, { x: number; y: number }>;
  /// Labels that could not be placed without a collision.
  hidden: Set<string>;
};

/// Rough text width: `chars × fontSize × 0.6`.
export const estimateTextWidth = (text: string, fontSize: number) => text.length * fontSize * 0.6;

/// Offsets tried for a colliding label, closest first: vertical nudges (in label heights, up to 3) and
/// sideways shifts (in label widths), vertical ones preferred.
const OFFSETS = [0, 1, -1, 2, -2, 3, -3]
  .flatMap((dy) => [0, 0.75, -0.75].map((dx) => ({ dx, dy })))
  .sort((a, b) => Math.abs(a.dy) + Math.abs(a.dx) * 1.5 - (Math.abs(b.dy) + Math.abs(b.dx) * 1.5));

const overlaps = (a: LabelBox, b: LabelBox) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

/// Greedy placement: keeps higher-priority labels, nudges others vertically (±h steps, max 3) or sideways
/// inside [0,W]×[0,H], hides a label that still collides with a kept label or an obstacle.
export function placeLabels(boxes: LabelBox[], W: number, H: number, obstacles: LabelBox[] = []): LabelPlacement {
  const placed: LabelPlacement["placed"] = {};
  const hidden = new Set<string>();
  const taken: LabelBox[] = [...obstacles];
  for (const box of [...boxes].sort((a, b) => b.priority - a.priority)) {
    if (box.w > W || box.h > H) {
      hidden.add(box.id);
      continue;
    }
    const x = Math.min(Math.max(box.x, 0), W - box.w);
    const fit = OFFSETS.map(({ dx, dy }) => ({ ...box, x: x + dx * box.w, y: box.y + dy * box.h })).find(
      (c) => c.x >= 0 && c.x + c.w <= W && c.y >= 0 && c.y + c.h <= H && !taken.some((t) => overlaps(c, t))
    );
    if (!fit) {
      hidden.add(box.id);
      continue;
    }
    taken.push(fit);
    placed[box.id] = { x: fit.x, y: fit.y };
  }
  return { placed, hidden };
}
