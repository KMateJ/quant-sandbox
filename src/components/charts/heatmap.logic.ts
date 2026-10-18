/// Index of the grid value closest to `v`.
export function nearestIndex(values: number[], v: number): number {
  let best = 0;
  for (let i = 1; i < values.length; i++) if (Math.abs(values[i] - v) < Math.abs(values[best] - v)) best = i;
  return best;
}

/// Fill and opacity of a heatmap cell. Diverging: sign picks --positive / --negative, |v − center| the strength;
/// sequential: --primary, strength from the position between the grid's min and max.
export function cellPaint(v: number, scale: "diverging" | "sequential", center: number, min: number, max: number) {
  if (scale === "diverging") {
    const reach = Math.max(Math.abs(max - center), Math.abs(min - center)) || 1;
    const r = Math.max(-1, Math.min(1, (v - center) / reach));
    return { fill: r >= 0 ? "var(--positive)" : "var(--negative)", opacity: 0.1 + 0.75 * Math.abs(r) };
  }
  const r = max > min ? (v - min) / (max - min) : 0;
  return { fill: "var(--primary)", opacity: 0.08 + 0.8 * r };
}

/// The cell reached from (xi, yi) by an arrow key, clamped to the grid; y grows upwards like the axis.
export function stepCell(key: string, xi: number, yi: number, nx: number, ny: number): [number, number] | null {
  const d: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] };
  const s = d[key];
  if (!s) return null;
  return [Math.min(nx - 1, Math.max(0, xi + s[0])), Math.min(ny - 1, Math.max(0, yi + s[1]))];
}
