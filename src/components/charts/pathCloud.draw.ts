/// Canvas renderer for dense sample-path clouds (hundreds of paths × hundreds of
/// steps), where one SVG <path> per trajectory would stall the main thread.

export type PathCloudFrame = {
  values: ArrayLike<number>;
  pathCount: number;
  stepCount: number;
  visibleSteps: number;
  /// Pixel x of point i, already offset into the plot area.
  xPx: (i: number) => number;
  /// Pixel y of a value.
  yPx: (v: number) => number;
  colors: string[];
  alpha: number;
  lineWidth: number;
};

/// Cloud opacity falling with path count so the density stays readable: few paths
/// are near-opaque, a thousand overlap into a smooth spread.
export function cloudOpacity(pathCount: number): number {
  return Math.min(0.85, Math.max(0.05, 2.6 / Math.sqrt(Math.max(1, pathCount))));
}

/// Line width matching `cloudOpacity`: thinner strokes as the cloud gets denser.
export function cloudLineWidth(pathCount: number): number {
  return pathCount > 200 ? 0.7 : pathCount > 20 ? 1 : 1.6;
}

/// [min, max] over every sample (padded when flat), so axes don't jump during playback.
export function valueExtent(values: ArrayLike<number>, extra: number[] = []): [number, number] {
  let lo = Infinity;
  let hi = -Infinity;
  for (let i = 0; i < values.length; i++) {
    const v = values[i];
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  for (const v of extra) {
    if (v < lo) lo = v;
    if (v > hi) hi = v;
  }
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0, 1];
  return lo === hi ? [lo - 1, hi + 1] : [lo, hi];
}

/// Resolve `var(--token)` against `el` — canvas styles cannot read CSS variables.
export function resolveCssColor(value: string, el: Element): string {
  const match = /^var\((--[\w-]+)\)$/.exec(value.trim());
  if (!match) return value;
  return getComputedStyle(el).getPropertyValue(match[1]).trim() || "#888";
}

/// Stroke each path separately so overlapping translucent paths accumulate into a
/// density; the palette (if several colours) cycles per path.
export function drawPathCloud(ctx: CanvasRenderingContext2D, frame: PathCloudFrame): void {
  const { values, pathCount, visibleSteps, xPx, yPx, colors, alpha, lineWidth } = frame;
  const steps = Math.min(visibleSteps, frame.stepCount);
  if (steps < 1 || pathCount < 1) return;

  const xs = new Float32Array(steps);
  for (let i = 0; i < steps; i++) xs[i] = xPx(i);

  ctx.lineWidth = lineWidth;
  ctx.lineJoin = "round";
  ctx.globalAlpha = alpha;
  for (let path = 0; path < pathCount; path++) {
    ctx.strokeStyle = colors[path % colors.length];
    ctx.beginPath();
    ctx.moveTo(xs[0], yPx(values[path]));
    for (let i = 1; i < steps; i++) ctx.lineTo(xs[i], yPx(values[i * pathCount + path]));
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}
