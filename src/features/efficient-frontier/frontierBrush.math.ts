/// Index of the point whose return is closest to `ret` (0 for an empty list).
export function nearestReturnIndex(points: { ret: number }[], ret: number): number {
  let best = 0;
  for (let i = 1; i < points.length; i++)
    if (Math.abs(points[i].ret - ret) < Math.abs(points[best].ret - ret)) best = i;
  return best;
}

/// Frontier index under a pointer on a linear return axis spanning the branch (first → last return).
/// `fraction` is the pointer's position across the plot width, 0 = left edge, 1 = right edge.
export function indexAtFraction(points: { ret: number }[], fraction: number): number {
  if (points.length < 2) return 0;
  const lo = points[0].ret;
  const hi = points[points.length - 1].ret;
  const f = Math.min(1, Math.max(0, fraction));
  return nearestReturnIndex(points, lo + f * (hi - lo));
}

/// Index of the point nearest to (px, py) in screen space (pixel coordinates).
export function nearestIndex2D(points: { x: number; y: number }[], px: number, py: number): number {
  let best = 0;
  let bestD = Infinity;
  for (let i = 0; i < points.length; i++) {
    const d = (points[i].x - px) ** 2 + (points[i].y - py) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/// Keyboard movement along the frontier (slider semantics); `null` when the key does nothing.
/// Arrows step one point (Shift: five), PageUp/PageDown ten, Home/End jump to the ends.
export function brushKeyStep(index: number, count: number, key: string, shift = false): number | null {
  if (count < 1) return null;
  const step = shift ? 5 : 1;
  const moves: Record<string, number> = {
    ArrowRight: index + step,
    ArrowUp: index + step,
    ArrowLeft: index - step,
    ArrowDown: index - step,
    PageUp: index + 10,
    PageDown: index - 10,
    Home: 0,
    End: count - 1,
  };
  const next = moves[key];
  return next === undefined ? null : Math.min(count - 1, Math.max(0, next));
}
