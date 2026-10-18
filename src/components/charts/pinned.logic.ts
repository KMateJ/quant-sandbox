import type { ChartDatum, ChartSeries, ScatterSeries } from "./chart.types";

/// A frozen copy of some chart series, drawn later as a faded dashed ghost.
export type PinnedSnapshot = {
  xKey: string;
  /// x and the pinned series' values, sorted by x.
  points: { x: number; values: Record<string, number> }[];
  series: ChartSeries[];
};

export const pinnedKey = (key: string) => `pinned:${key}`;

/// Freezes the given series of the current chart data.
export function takeSnapshot(data: ChartDatum[], xKey: string, series: ChartSeries[]): PinnedSnapshot {
  const points = data
    .map((row) => {
      const values: Record<string, number> = {};
      for (const s of series) {
        const v = row[s.key];
        if (typeof v === "number" && Number.isFinite(v)) values[s.key] = v;
      }
      return { x: Number(row[xKey]), values };
    })
    .filter((p) => Number.isFinite(p.x))
    .sort((a, b) => a.x - b.x);
  return { xKey, points, series };
}

/// Value of a pinned series at `x` by linear interpolation; undefined outside the pinned range or across a gap.
export function pinnedValueAt(snapshot: PinnedSnapshot, key: string, x: number): number | undefined {
  const pts = snapshot.points;
  if (!pts.length || x < pts[0].x || x > pts[pts.length - 1].x) return undefined;
  let i = 1;
  while (i < pts.length && pts[i].x < x) i += 1;
  if (i >= pts.length) return pts[pts.length - 1].values[key];
  const a = pts[i - 1];
  const b = pts[i];
  const va = a.values[key];
  const vb = b.values[key];
  if (va === undefined || vb === undefined) return undefined;
  if (b.x === a.x) return vb;
  return va + ((vb - va) * (x - a.x)) / (b.x - a.x);
}

/// Current data with the pinned series added as extra columns on the current x grid, so one LineChart can draw both.
export function mergePinned(data: ChartDatum[], snapshot: PinnedSnapshot | null): ChartDatum[] {
  if (!snapshot) return data;
  return data.map((row) => {
    const x = Number(row[snapshot.xKey]);
    const extra: ChartDatum = {};
    for (const s of snapshot.series) extra[pinnedKey(s.key)] = pinnedValueAt(snapshot, s.key, x);
    return { ...row, ...extra };
  });
}

/// Ghost series for a snapshot: same colour, dashed, thinner, out of the tooltip's way via a "(pinned)" label.
export function ghostSeries(snapshot: PinnedSnapshot | null, label: (original: string) => string): ChartSeries[] {
  if (!snapshot) return [];
  return snapshot.series.map((s) => ({
    key: pinnedKey(s.key),
    label: label(s.label),
    color: s.color,
    strokeWidth: Math.max(1.25, (s.strokeWidth ?? 2) * 0.6),
    dash: "5 4",
    legend: s.legend,
  }));
}

/// Ghosts for a ScatterChart snapshot: line series become faded dashed copies; marker series are kept only when
/// `markers` is set, drawn hollow and faded. Ghosts are never draggable.
export function ghostScatter(pinned: ScatterSeries[] | null, label: (original: string) => string, markers = false): ScatterSeries[] {
  if (!pinned) return [];
  return pinned
    .filter((s) => s.line || markers)
    .map((s) => ({
      ...s,
      key: pinnedKey(s.key),
      label: label(s.label),
      points: s.points.map((p) => ({ ...p, color: undefined, tooltipRows: undefined })),
      draggable: false,
      opacity: 0.5,
      ...(s.line ? { dash: "5 4", strokeWidth: Math.max(1.25, (s.strokeWidth ?? 2) * 0.6) } : { hollow: true }),
    }));
}
