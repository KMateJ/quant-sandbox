import type { MmParams } from "./marketMaking.types";

export const RAIL_W = 640;
export const RAIL_H = 280;
/// Right gutter where the drag handles and quote labels sit.
export const RAIL_GUTTER = 56;
/// Seconds of history visible on the rail.
export const RAIL_WINDOW = 20;

export type RailFrame = { now: number; centre: number; range: number; x: (t: number) => number; y: (c: number) => number; cents: (py: number) => number };

/// Maps time (s) and price (¢) to rail pixels: the last 20 s left of the gutter, ±range ¢ around the current fair.
export function railFrame(now: number, centre: number, p: MmParams): RailFrame {
  const range = 3 / p.k + 2 * p.sigma;
  const plotW = RAIL_W - RAIL_GUTTER;
  const t0 = Math.max(now, RAIL_WINDOW) - RAIL_WINDOW;
  return {
    now,
    centre,
    range,
    x: (t) => ((t - t0) / RAIL_WINDOW) * plotW,
    y: (c) => RAIL_H / 2 - ((c - centre) / range) * (RAIL_H / 2 - 8),
    cents: (py) => centre + ((RAIL_H / 2 - py) / (RAIL_H / 2 - 8)) * range,
  };
}

/// SVG path through (x, y) points, skipping gaps marked by null.
export function railPath(points: ({ x: number; y: number } | null)[]): string {
  let d = "";
  let pen = false;
  for (const pt of points) {
    if (!pt) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    pen = true;
  }
  return d;
}
