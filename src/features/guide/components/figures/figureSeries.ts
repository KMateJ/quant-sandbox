import { SERIES_PALETTE, SERIES_ROLE, type ChartReferenceLine, type ChartSeries, type ScatterSeries } from "../../../../components/charts";
import type { TranslationKey } from "../../../../i18n";

/// Thin dashed guide line (bands, envelopes); unlabelled twins stay out of legend and tooltip.
export const bandSeries = (key: string, label: string, dash: string): ChartSeries => ({
  key,
  label,
  color: SERIES_PALETTE[1],
  strokeWidth: 1.25,
  dash,
  legend: Boolean(label),
});

/// `count` unlabelled sample paths keyed `p0`, `p1`, …
export const pathSeries = (count: number): ChartSeries[] =>
  Array.from({ length: count }, (_, p) => ({ key: `p${p}`, label: "", color: SERIES_ROLE.cloud, strokeWidth: 1.1, legend: false }));

/// A σ–μ curve drawn as a line in a scatter chart.
export const curveSeries = (key: string, label: string, points: { sigma: number; mu: number }[], color: string, dash?: string): ScatterSeries => ({
  key,
  label,
  color,
  line: true,
  dash,
  strokeWidth: dash ? 1.5 : 2.5,
  points: points.map((p) => ({ x: p.sigma, y: p.mu })),
});

type Translate = (key: TranslationKey) => string;

/// Markers for the two assets A and B, labelled for the tooltip.
export const assetMarkers = (t: Translate, [a, b]: { sigma: number; mu: number }[]): ScatterSeries => ({
  key: "assets",
  label: t("gfAssets"),
  color: "var(--text)",
  radius: 5,
  points: [
    { x: a.sigma, y: a.mu, label: "A" },
    { x: b.sigma, y: b.mu, label: "B" },
  ],
});

/// Solid text-coloured line marking the value currently chosen on a slider (distinct from the dashed grid).
export const markerLine = (value: number): ChartReferenceLine => ({ axis: "x", value, color: "var(--text)", dash: "none", width: 1.25 });
