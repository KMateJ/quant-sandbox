/// Gap kept between neighbouring tick labels, in px.
const TICK_GAP = 12;

/// Number of axis ticks that fit `length` px with labels of ~`labelPx` px plus spacing, between `min` and `max`.
export function tickCount(length: number, labelPx = 44, min = 2, max = 10): number {
  if (!Number.isFinite(length) || length <= 0) return min;
  return Math.max(min, Math.min(max, Math.floor(length / (labelPx + TICK_GAP))));
}

/// Picks `textAnchor` per tick so the first and last labels stay inside [0, length].
export function edgeAnchor(pos: number, length: number, halfLabelPx = 18): "start" | "middle" | "end" {
  if (pos < halfLabelPx) return "start";
  if (pos > length - halfLabelPx) return "end";
  return "middle";
}

/// Indices of the ticks whose labels fit side by side: `positions` ascend (px, label centres) and `widths`
/// are the label widths. Always keeps the last tick, dropping earlier ones that would touch it.
export function thinTicks(positions: number[], widths: number[], gap = 8): number[] {
  const left = (i: number) => positions[i] - widths[i] / 2;
  const right = (i: number) => positions[i] + widths[i] / 2;
  const kept: number[] = [];
  for (let i = 0; i < positions.length; i++) {
    const prev = kept[kept.length - 1];
    if (prev === undefined || left(i) - right(prev) >= gap) kept.push(i);
  }
  const last = positions.length - 1;
  if (last >= 0 && kept[kept.length - 1] !== last) {
    while (kept.length && left(last) - right(kept[kept.length - 1]) < gap) kept.pop();
    kept.push(last);
  }
  return kept;
}
