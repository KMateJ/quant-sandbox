export type ChartDatum = Record<string, number | string | undefined>;

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
  strokeWidth?: number;
  dash?: string;
  /// Fill the region between this series and y=0 with a vertical gradient.
  area?: boolean;
  areaColor?: string;
  /// Show in the legend row (defaults to true).
  legend?: boolean;
};

export type ChartReferenceLine = {
  axis: "x" | "y";
  value: number;
  color?: string;
  dash?: string;
  width?: number;
};

export type LineChartProps = {
  data: ChartDatum[];
  xKey: string;
  series: ChartSeries[];
  /// Omit to auto-fit the x extent of the data.
  xDomain?: [number, number];
  /// Omit to auto-fit the y extent across all series.
  yDomain?: [number, number];
  referenceLines?: ChartReferenceLine[];
  isMobile?: boolean;
  legend?: boolean;
  tooltipLabel?: (x: number) => string;
  valueFormat?: (value: number) => string;
};

export type ScatterPoint = {
  x: number;
  y: number;
  /// Optional label shown in the tooltip (e.g. an asset or portfolio name).
  label?: string;
  /// Optional per-point fill colour, overriding the series colour.
  color?: string;
  /// Optional extra rows (e.g. portfolio composition) rendered in the tooltip.
  tooltipRows?: { label: string; value: string; color?: string }[];
};

export type ScatterSeries = {
  key: string;
  label: string;
  color: string;
  points: ScatterPoint[];
  /// Connect the points with a path instead of drawing markers.
  line?: boolean;
  dash?: string;
  strokeWidth?: number;
  /// Marker radius in pixels (ignored for line series).
  radius?: number;
  legend?: boolean;
};

export type ScatterChartProps = {
  series: ScatterSeries[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  referenceLines?: ChartReferenceLine[];
  isMobile?: boolean;
  legend?: boolean;
  xFormat?: (value: number) => string;
  yFormat?: (value: number) => string;
  xLabel?: string;
  yLabel?: string;
};
