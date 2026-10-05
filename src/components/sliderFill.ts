import type { CSSProperties } from "react";

/// Inline style exposing the 0–100% track fill ratio for a styled range input.
export function sliderFill(value: number, min: number, max: number): CSSProperties {
  const ratio = max > min ? ((value - min) / (max - min)) * 100 : 0;
  const pct = Math.max(0, Math.min(100, ratio));
  return { "--fill": `${pct}%` } as CSSProperties;
}
