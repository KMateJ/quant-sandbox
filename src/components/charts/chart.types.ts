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
  intuitionSectionId?: string;
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

/// A light vector curve drawn over a path cloud (envelopes, means, bounds).
export type PathOverlay = {
  key: string;
  color: string;
  points: { x: number; y: number }[];
  strokeWidth?: number;
  dash?: string;
};

export type PathCloudProps = {
  /// Step-major samples: `values[step * pathCount + path]`.
  values: ArrayLike<number>;
  pathCount: number;
  /// Points per path (steps + 1 for a walk that starts at 0).
  stepCount: number;
  /// x spacing between consecutive points (defaults to 1, i.e. x = step).
  dx?: number;
  xDomain?: [number, number];
  /// Omit to fit every value (not just the visible prefix), so axes stay put while animating.
  yDomain?: [number, number];
  /// Draw only the first `visibleSteps` points of each path (animation).
  visibleSteps?: number;
  /// Single cloud colour; opacity is scaled down as the path count grows.
  color?: string;
  /// Distinct opaque colour per path instead of a cloud (for a handful of paths).
  palette?: string[];
  overlays?: PathOverlay[];
  isMobile?: boolean;
  ariaLabel?: string;
};

export type ScatterPoint = {
  x: number;
  y: number;
  /// Optional label shown in the tooltip (e.g. an asset or portfolio name).
  label?: string;
  /// Optional per-point fill colour, overriding the series colour.
  color?: string;
  /// Optional per-point fill opacity, overriding the series opacity.
  opacity?: number;
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
  /// Marker opacity (used to de-emphasise context series such as the cloud).
  opacity?: number;
  /// Markers can be grabbed and dragged; drag deltas are reported via onDrag.
  draggable?: boolean;
  intuitionSectionId?: string;
  /// Draw markers as a hollow ring (transparent fill) so overlapping points stay distinct.
  hollow?: boolean;
};

/// Shaded vertical region between two x-values (e.g. lending vs borrowing).
export type ScatterBand = {
  from: number;
  to: number;
  color?: string;
  label?: string;
  labelColor?: string;
  /// Fill opacity for the tint (defaults to 0.12).
  opacity?: number;
};

/// Text label placed directly at a data coordinate on the plot.
export type ScatterAnnotation = {
  x: number;
  y: number;
  text: string;
  /// Rotate the label (degrees) around its anchor, e.g. to sit along a sloped line.
  rotate?: number;
  fontSize?: number;
  fontWeight?: number;
  color?: string;
  anchor?: "start" | "middle" | "end";
  dx?: number;
  dy?: number;
};

export type ScatterChartProps = {
  series: ScatterSeries[];
  xDomain?: [number, number];
  yDomain?: [number, number];
  referenceLines?: ChartReferenceLine[];
  bands?: ScatterBand[];
  annotations?: ScatterAnnotation[];
  isMobile?: boolean;
  legend?: boolean;
  xFormat?: (value: number) => string;
  yFormat?: (value: number) => string;
  xLabel?: string;
  yLabel?: string;
  xTickValues?: number[];
  yNumTicks?: number;
  onSelectPoint?: (index: number) => void;
  onDragStart?: (index: number) => void;
  onDragEnd?: () => void;
  /// Fires with data coordinates while a draggable marker is being dragged.
  /// `index` is the position of the grabbed point within its series.
  onDrag?: (x: number, y: number, index: number) => void;
};
