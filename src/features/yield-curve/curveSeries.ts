import type { ScatterAnnotation, ScatterSeries } from "../../components/charts";
import type { TermPoint } from "./yieldCurve.types";
import { YC_COLORS, type RepKey } from "./curveChartUtils";
import { effectDelta, formatDelta, strongestEffects, type EffectKey } from "./effects.math";

const COLORS = { par: YC_COLORS.par, zero: YC_COLORS.zero, fwd: YC_COLORS.forward, df: YC_COLORS.df };

/// All rates remain visible; only the market par nodes are draggable.
export function buildRateSeries(term: TermPoint[], labels: Record<RepKey, string>): ScatterSeries[] {
  return (["zero", "forward", "par"] as const).flatMap((rep) => {
    const key = rep === "forward" ? "fwd" : rep;
    const color = COLORS[key];
    return [
      { key, label: labels[rep], color, line: true, strokeWidth: rep === "par" ? 3 : 2,
        points: term.map((p, i) => ({ x: i, y: p[key] })),
        intuitionSectionId: rep === "forward" ? "forward-rate" : `${rep}-rate` },
      { key: `${key}-nodes`, label: labels[rep], color, radius: rep === "par" ? 7 : 3,
        draggable: rep === "par", legend: false,
        points: term.map((p, i) => ({ x: i, y: p[key], label: p.label })) },
    ];
  });
}

/// Discount factors share the same maturity positions as the rate curves.
export function buildDfSeries(term: TermPoint[], label: string): ScatterSeries[] {
  return [
    { key: "df", label, color: YC_COLORS.df, line: true, strokeWidth: 2.5,
      points: term.map((p, i) => ({ x: i, y: p.df })) },
    { key: "df-nodes", label, color: YC_COLORS.df, radius: 4, legend: false,
      points: term.map((p, i) => ({ x: i, y: p.df, label: p.label })) },
  ];
}

/// Ghost the pre-edit curves and thicken the most affected derived segments.
export function buildEffectOverlay(before: TermPoint[], after: TermPoint[], keys: EffectKey[]) {
  const series: ScatterSeries[] = [];
  const annotations: ScatterAnnotation[] = [];
  for (const key of keys) {
    const indices = strongestEffects(before, after, key, key === "fwd" ? 2 : 1);
    if (!indices.length) continue;
    series.push({
      key: `before-${key}`, label: "", color: COLORS[key], line: true,
      dash: "3 5", opacity: 0.3, strokeWidth: 1.5, legend: false,
      points: before.map((p, i) => ({ x: i, y: p[key] })),
    });
    indices.forEach((i, rank) => {
      series.push({
        key: `effect-${key}-${i}`, label: "", color: COLORS[key], line: true,
        strokeWidth: 5, legend: false,
        points: after.slice(Math.max(0, i - 1), i + 1).map((p, offset) => ({
          x: Math.max(0, i - 1) + offset, y: p[key],
        })),
      });
      annotations.push({
        x: i, y: after[i][key], text: formatDelta(effectDelta(before[i], after[i], key), key === "df"),
        color: COLORS[key], anchor: i >= after.length - 2 ? "end" : "start",
        dx: i >= after.length - 2 ? -10 : 10, dy: key === "zero" ? 22 : -14 - rank * 5,
        fontSize: 12, fontWeight: 700,
      });
    });
  }
  return { series, annotations };
}
