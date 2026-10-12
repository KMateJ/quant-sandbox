import type { PathOverlay } from "../../components/charts";
import type { CurvePoint } from "./pathGeometry.types";

/// Solid or dashed curve overlay.
export const curve = (key: string, points: CurvePoint[], color: string, strokeWidth = 2, dash?: string): PathOverlay => ({
  key,
  points,
  color,
  strokeWidth,
  dash,
});

/// Horizontal level y = a across [0, 1] (barriers, reflection levels).
export const level = (key: string, a: number, color: string): PathOverlay =>
  curve(key, [{ x: 0, y: a }, { x: 1, y: a }], color, 1.5, "6 4");

/// Vertical marker at time x spanning [lo, hi].
export const marker = (key: string, x: number, lo: number, hi: number, color: string): PathOverlay =>
  curve(key, [{ x, y: lo }, { x, y: hi }], color, 1.5, "3 4");

/// Symmetric y-extent of a set of curves (at least ±1), so markers can span the plot.
export function curvesExtent(...curves: CurvePoint[][]): [number, number] {
  let max = 1;
  for (const points of curves) for (const p of points) max = Math.max(max, Math.abs(p.y));
  return [-max, max];
}
