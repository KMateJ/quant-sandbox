import { useMemo, useState } from "react";
import type { ChartDatum, ChartSeries, ScatterSeries } from "./chart.types";
import { ghostScatter, ghostSeries, mergePinned, pinnedValueAt, takeSnapshot, type PinnedSnapshot } from "./pinned.logic";

/// Pin & compare for a LineChart: `pin()` freezes the current series; afterwards `data` / `series` carry the pinned copy
/// as faded dashed ghosts (interpolated onto the current x grid), so later changes are seen against it.
/// `delta(key, x)` gives current minus pinned at `x` for a readout.
export function usePinnedSeries(data: ChartDatum[], xKey: string, series: ChartSeries[], ghostLabel: (label: string) => string) {
  const [snapshot, setSnapshot] = useState<PinnedSnapshot | null>(null);

  const merged = useMemo(() => mergePinned(data, snapshot), [data, snapshot]);
  const ghosts = useMemo(() => ghostSeries(snapshot, ghostLabel), [snapshot, ghostLabel]);

  return {
    pinned: snapshot !== null,
    pin: () => setSnapshot(takeSnapshot(data, xKey, series)),
    clear: () => setSnapshot(null),
    data: merged,
    // Ghosts go first so the live curves are drawn on top of them.
    series: [...ghosts, ...series],
    delta: (key: string, x: number) => {
      if (!snapshot) return undefined;
      const row = data.find((r) => Number(r[xKey]) === x);
      const now = row?.[key];
      const then = pinnedValueAt(snapshot, key, x);
      return typeof now === "number" && then !== undefined ? now - then : undefined;
    },
  };
}

/// Pin & compare for a ScatterChart: `pin()` freezes the current series; ghosts (faded, dashed lines; hollow markers
/// when `markers` is true) are drawn under the live series.
export function usePinnedScatter(series: ScatterSeries[], ghostLabel: (label: string) => string, markers = false) {
  const [pinned, setPinned] = useState<ScatterSeries[] | null>(null);
  const ghosts = useMemo(() => ghostScatter(pinned, ghostLabel, markers), [pinned, ghostLabel, markers]);
  return {
    pinned: pinned !== null,
    pin: () => setPinned(series.map((s) => ({ ...s, points: s.points.map((p) => ({ ...p })) }))),
    clear: () => setPinned(null),
    series: [...ghosts, ...series],
  };
}
