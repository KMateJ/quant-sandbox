export type ChartMargin = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

/// Palette matching the previous Recharts look (dark workspace theme).
export const CHART_COLORS = {
  grid: "#475569",
  axis: "#94a3b8",
  tooltipBg: "#1e293b",
  tooltipBorder: "#475569",
  tooltipText: "#e2e8f0",
} as const;

/// Categorical series palette, themed via `--chart-1…8` in tokens.scss.
export const SERIES_PALETTE = Array.from({ length: 8 }, (_, i) => `var(--chart-${i + 1})`);

/// Semantic series colours shared by experiment charts.
export const SERIES_ROLE = {
  empirical: "var(--chart-empirical)",
  reference: "var(--chart-reference)",
  candidate: "var(--chart-candidate)",
  cloud: "var(--chart-cloud)",
  estimate: "var(--chart-estimate)",
} as const;

export const LEGEND_HEIGHT = 28;

/// Axis gutters sized to fit tick labels (visx needs explicit room).
export function chartMargin(isMobile: boolean): ChartMargin {
  return isMobile
    ? { top: 8, right: 10, bottom: 24, left: 40 }
    : { top: 10, right: 20, bottom: 28, left: 52 };
}
