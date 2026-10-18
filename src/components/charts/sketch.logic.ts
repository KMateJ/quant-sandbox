export type SketchPoint = { x: number; y: number };

const clampTo = (v: number, range?: [number, number]) =>
  range ? Math.min(Math.max(v, Math.min(...range)), Math.max(...range)) : v;

/// Writes a freehand stroke onto a fixed x grid: every grid x inside the stroke's x span takes the stroke's value
/// there (linear between stroke samples); grid points outside the span keep their previous value.
/// `previous` may be empty or sparse; the result has one point per grid x where a value is known.
export function applyStroke(xGrid: number[], previous: SketchPoint[], stroke: SketchPoint[], yRange?: [number, number]): SketchPoint[] {
  const pts = [...stroke].sort((a, b) => a.x - b.x);
  const before = new Map(previous.map((p) => [p.x, p.y]));
  if (pts.length === 0) return previous;
  const lo = pts[0].x;
  const hi = pts[pts.length - 1].x;
  const strokeAt = (x: number) => {
    let i = 1;
    while (i < pts.length && pts[i].x < x) i += 1;
    if (i >= pts.length) return pts[pts.length - 1].y;
    const a = pts[i - 1];
    const b = pts[i];
    return b.x === a.x ? b.y : a.y + ((b.y - a.y) * (x - a.x)) / (b.x - a.x);
  };
  const out: SketchPoint[] = [];
  for (const x of xGrid) {
    if (x >= lo && x <= hi) out.push({ x, y: clampTo(strokeAt(x), yRange) });
    else if (before.has(x)) out.push({ x, y: before.get(x)! });
  }
  return out;
}

/// Light smoothing: each value moves toward the average of its neighbours by `amount` (0 = off, 1 = full average).
export function smoothSamples(points: SketchPoint[], amount: number): SketchPoint[] {
  if (amount <= 0 || points.length < 3) return points;
  return points.map((p, i) => {
    if (i === 0 || i === points.length - 1) return p;
    const avg = (points[i - 1].y + p.y + points[i + 1].y) / 3;
    return { x: p.x, y: p.y + (avg - p.y) * Math.min(1, amount) };
  });
}

/// A straight line from a press point to a release point, ordered by x (for "draw the line by eye").
export function lineThrough(a: SketchPoint, b: SketchPoint): SketchPoint[] {
  return a.x <= b.x ? [a, b] : [b, a];
}

/// Slope and intercept of a two-point line (null if vertical).
export function lineCoefficients(line: SketchPoint[]): { slope: number; intercept: number } | null {
  if (line.length < 2 || line[1].x === line[0].x) return null;
  const slope = (line[1].y - line[0].y) / (line[1].x - line[0].x);
  return { slope, intercept: line[0].y - slope * line[0].x };
}
