/// A draggable marker on a chart: a vertical line (`axis: "x"`), a horizontal line (`"y"`) or a free point (`"xy"`).
export type DragHandle = {
  id: string;
  axis: "x" | "y" | "xy";
  /// Data coordinates: `x` for "x" / "xy" handles, `y` for "y" / "xy" handles.
  x?: number;
  y?: number;
  /// Drawn by the knob and used as the accessible name.
  label?: string;
  /// Defaults to `var(--primary)`.
  color?: string;
  /// Clamp along the handle's own axis ("x" or "y" handles).
  min?: number;
  max?: number;
  /// Clamp for free points.
  bounds?: { x?: [number, number]; y?: [number, number] };
  /// Snap size and keyboard step (Shift multiplies it by 10).
  step?: number;
  /// Value text for screen readers and the drag readout.
  format?: (value: number) => string;
};

export type HandleValue = { x?: number; y?: number };

const clamp = (v: number, range?: [number, number]) =>
  range ? Math.min(Math.max(v, Math.min(...range)), Math.max(...range)) : v;

const snap = (v: number, step?: number) => (step ? Math.round(v / step) * step : v);

/// Range a handle may move in along one axis.
export function axisRange(h: DragHandle, axis: "x" | "y"): [number, number] | undefined {
  if (h.axis !== "xy" && h.min !== undefined && h.max !== undefined) return [h.min, h.max];
  return h.bounds?.[axis];
}

/// Clamps and snaps a proposed position; only the axes the handle moves along are returned.
export function constrain(h: DragHandle, proposed: HandleValue): HandleValue {
  const out: HandleValue = {};
  if (h.axis !== "y" && proposed.x !== undefined) out.x = clamp(snap(proposed.x, h.step), axisRange(h, "x"));
  if (h.axis !== "x" && proposed.y !== undefined) out.y = clamp(snap(proposed.y, h.step), axisRange(h, "y"));
  return out;
}

/// Keyboard movement for a focused handle (slider semantics); `null` if the key does nothing.
export function keyMove(h: DragHandle, key: string, shift: boolean, span: { x: number; y: number }): HandleValue | null {
  const stepX = (h.step ?? span.x / 100) * (shift ? 10 : 1);
  const stepY = (h.step ?? span.y / 100) * (shift ? 10 : 1);
  const x = h.x ?? 0;
  const y = h.y ?? 0;
  const moves: Record<string, HandleValue> = {
    ArrowRight: h.axis === "y" ? { y: y + stepY } : { x: x + stepX },
    ArrowLeft: h.axis === "y" ? { y: y - stepY } : { x: x - stepX },
    ArrowUp: h.axis === "x" ? { x: x + stepX } : { y: y + stepY },
    ArrowDown: h.axis === "x" ? { x: x - stepX } : { y: y - stepY },
    PageUp: h.axis === "x" ? { x: x + stepX * 10 } : { y: y + stepY * 10 },
    PageDown: h.axis === "x" ? { x: x - stepX * 10 } : { y: y - stepY * 10 },
  };
  const range = axisRange(h, h.axis === "y" ? "y" : "x");
  if (key === "Home" && range) return h.axis === "y" ? { y: Math.min(...range) } : { x: Math.min(...range) };
  if (key === "End" && range) return h.axis === "y" ? { y: Math.max(...range) } : { x: Math.max(...range) };
  const move = moves[key];
  return move ? constrain(h, { x: h.x, y: h.y, ...move }) : null;
}
