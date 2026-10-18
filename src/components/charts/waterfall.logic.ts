/// One step of a waterfall: a "total" bar stands on zero and resets the running total (start, subtotal, end);
/// a "delta" bar floats from the running total by `value`.
export type WaterfallStep = { key: string; label: string; value: number; kind?: "total" | "delta" };

export type WaterfallBar = {
  key: string;
  label: string;
  value: number;
  kind: "total" | "delta";
  /// Bar extent in value units (start → end); `end` is the running total after the step.
  start: number;
  end: number;
};

export type WaterfallProps = {
  steps: WaterfallStep[];
  ariaLabel: string;
  height?: number;
  valueFormat?: (value: number) => string;
  /// Key of the highlighted bar.
  selected?: string | null;
  onSelect?: (key: string) => void;
};

/// Running totals for a waterfall; the first step is treated as a total when no kind is given.
export function waterfallBars(steps: WaterfallStep[]): WaterfallBar[] {
  let running = 0;
  return steps.map((s, i) => {
    const kind = s.kind ?? (i === 0 ? "total" : "delta");
    const start = kind === "total" ? 0 : running;
    const end = kind === "total" ? s.value : running + s.value;
    running = end;
    return { key: s.key, label: s.label, value: s.value, kind, start, end };
  });
}

/// Value range covering every bar and zero, padded for the labels.
export function waterfallDomain(bars: WaterfallBar[]): [number, number] {
  const values = [0, ...bars.flatMap((b) => [b.start, b.end])];
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const pad = (hi - lo || 1) * 0.12;
  return [lo < 0 ? lo - pad : 0, hi > 0 ? hi + pad : 0];
}
