/// Clamps `value` to [min, max] and snaps it to a multiple of `step`.
export function snapToStep(value: number, min: number, max: number, step: number): number {
  const snapped = Math.round(value / step) * step;
  // Rounding away float noise keeps typed-in and dragged values identical (e.g. 0.1 steps).
  const clean = Number(snapped.toFixed(10));
  return Math.min(max, Math.max(min, clean));
}

/// The value a key press moves a bar to, or null for keys the bar doesn't handle.
/// Arrows move one step (Shift: ten), PageUp/PageDown ten steps, Home/End jump to the limits.
export function keyTarget(key: string, shift: boolean, value: number, min: number, max: number, step: number): number | null {
  if (key === "Home") return min;
  if (key === "End") return max;
  const unit: Record<string, number> = { ArrowUp: 1, ArrowRight: 1, ArrowDown: -1, ArrowLeft: -1, PageUp: 10, PageDown: -10 };
  const dir = unit[key];
  if (!dir) return null;
  return snapToStep(value + dir * step * (shift ? 10 : 1), min, max, step);
}

/// Default axis domain: the drag range with a little headroom so value labels of extreme bars stay inside.
export function paddedDomain(min: number, max: number): [number, number] {
  const pad = (max - min) * 0.08;
  return [min - pad, max + pad];
}
