import type { ScatterAnnotation } from "./chart.types";
import { estimateTextWidth, placeLabels, type LabelBox } from "./labels.logic";

/// A scatter annotation with its final pixel position, or `hidden` when no collision-free spot exists.
export type LaidOutAnnotation = { annotation: ScatterAnnotation; x: number; y: number; fontSize: number; hidden: boolean };

type Pixel = { x: number; y: number };

/// Spacing of obstacle samples along a curve, in px.
const SAMPLE_PX = 3;

/// Obstacle boxes along a polyline of pixel points, limited to where it crosses [x0, x1].
function curveObstacles(points: Pixel[], x0: number, x1: number): LabelBox[] {
  const boxes: LabelBox[] = [];
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    if (Math.max(a.x, b.x) < x0 || Math.min(a.x, b.x) > x1) continue;
    const steps = Math.max(1, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / SAMPLE_PX));
    for (let s = 0; s <= steps; s++) {
      const x = a.x + ((b.x - a.x) * s) / steps;
      const y = a.y + ((b.y - a.y) * s) / steps;
      boxes.push({ id: "curve", x: x - 2, y: y - 2, w: 4, h: 4, priority: 0 });
    }
  }
  return boxes;
}

/// Pixel positions for `annotations` so that none sits on a curve or another label: earlier labels win,
/// the rest are nudged vertically or hidden. Rotated labels follow a line on purpose and are left alone.
export function layoutAnnotations(
  annotations: ScatterAnnotation[],
  curves: Pixel[][],
  px: { x: (v: number) => number; y: (v: number) => number },
  size: { width: number; height: number },
  defaultFont: number
): LaidOutAnnotation[] {
  const boxes = annotations.map((a, i): LabelBox & { fontSize: number } => {
    const fontSize = a.fontSize ?? defaultFont;
    const w = estimateTextWidth(a.text, fontSize);
    const h = fontSize * 1.2;
    const ax = px.x(a.x) + (a.dx ?? 0);
    const baseline = px.y(a.y) + (a.dy ?? 0);
    const left = a.anchor === "middle" ? ax - w / 2 : a.anchor === "end" ? ax - w : ax;
    return { id: String(i), x: left, y: baseline - fontSize, w, h, priority: annotations.length - i, fontSize };
  });
  const movable = boxes.filter((_, i) => !annotations[i].rotate);
  const x0 = Math.min(...movable.map((b) => b.x));
  const x1 = Math.max(...movable.map((b) => b.x + b.w));
  const obstacles = movable.length ? curves.flatMap((c) => curveObstacles(c, x0, x1)) : [];
  const { placed, hidden } = placeLabels(movable, size.width, size.height, obstacles);
  return annotations.map((annotation, i) => {
    const box = boxes[i];
    const spot = placed[box.id];
    if (annotation.rotate || !spot) {
      const hide = !annotation.rotate && hidden.has(box.id);
      return { annotation, x: px.x(annotation.x) + (annotation.dx ?? 0), y: px.y(annotation.y) + (annotation.dy ?? 0), fontSize: box.fontSize, hidden: hide };
    }
    const anchorX = annotation.anchor === "middle" ? spot.x + box.w / 2 : annotation.anchor === "end" ? spot.x + box.w : spot.x;
    return { annotation, x: anchorX, y: spot.y + box.fontSize, fontSize: box.fontSize, hidden: false };
  });
}
