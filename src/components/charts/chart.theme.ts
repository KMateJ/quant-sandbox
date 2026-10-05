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

export const LEGEND_HEIGHT = 28;

/// Axis gutters sized to fit tick labels (visx needs explicit room).
export function chartMargin(isMobile: boolean): ChartMargin {
  return isMobile
    ? { top: 8, right: 10, bottom: 24, left: 40 }
    : { top: 10, right: 20, bottom: 28, left: 52 };
}
