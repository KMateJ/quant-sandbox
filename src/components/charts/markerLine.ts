import type { ChartReferenceLine } from "./chart.types";

/// Solid text-coloured vertical line marking the value chosen on a slider or the playback cursor
/// (distinct from the dashed grid and from muted fixed references).
export const markerLine = (value: number): ChartReferenceLine => ({ axis: "x", value, color: "var(--text)", dash: "none", width: 1.25 });
