import type { Bin } from "../../lib/stats";

export type HistogramTint = "accent" | "muted" | undefined;

export type HistogramMarker = { value: number; label?: string; color?: string; dash?: string };

/// Inclusive range of bin indices.
export type BinRange = [number, number];

export type HistogramProps = {
  bins: Bin[];
  /// "density" scales bars to count / (total · width) so a density curve can be overlaid.
  normalize?: "count" | "density";
  /// Overlay curve in density units (implies normalize = "density").
  density?: { x: number; y: number }[];
  tint?: (bin: Bin, index: number) => HistogramTint;
  markers?: HistogramMarker[];
  /// Brushed bins; click a bin or drag across bins to set; Esc, or clicking a lone selected bin again, clears.
  selection?: BinRange | null;
  onSelectionChange?: (range: BinRange | null) => void;
  /// Bin to flash briefly (e.g. where the latest draw landed); a new `key` restarts the flash.
  flash?: { index: number; key: number } | null;
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  height?: number;
  ariaLabel: string;
  color?: string;
};
