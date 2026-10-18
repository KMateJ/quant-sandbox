import { useMemo } from "react";
import type { PathOverlay } from "../charts";
import { binValues, densityCurve, pathPoints, pathQuantiles, pathsEndingIn, shareBelow, valuesAtStep } from "../../lib/stats";
import type { BinRange } from "../charts";

export type TerminalLaw = { pdf: (x: number) => number; cdf: (x: number) => number };

const FAN = [0.05, 0.25, 0.5, 0.75, 0.95];
const BINS = 40;
const MAX_BRUSHED = 40;

type Input = {
  values: Float64Array;
  pathCount: number;
  stepCount: number;
  horizon: number;
  /// Exact law of the values at time index `step`.
  law: TerminalLaw;
  domain: [number, number];
  level: number;
  selection: BinRange | null;
  /// Time index the panel shows; defaults to the last step (the terminal view).
  step?: number;
};

/// Everything the ensemble panel draws at time index `step`: the histogram and density of the values at that time,
/// the quantile fan up to it, the paths behind a brushed histogram range, and the share of paths below the level.
export function usePathEnsemble({ values, pathCount, stepCount, horizon, law, domain, level, selection, step = stepCount - 1 }: Input) {
  const dx = horizon / (stepCount - 1);
  const atStep = useMemo(() => valuesAtStep(values, pathCount, stepCount, step), [values, pathCount, stepCount, step]);
  const bins = useMemo(() => binValues(atStep, domain, BINS).bins, [atStep, domain]);
  const density = useMemo(() => densityCurve(law, domain), [law, domain]);
  const curves = useMemo(() => pathQuantiles(values, pathCount, stepCount, FAN, 4), [values, pathCount, stepCount]);
  const fan = useMemo(
    () =>
      curves.map((points, i): PathOverlay => ({
        key: `q${FAN[i]}`,
        color: "var(--text)",
        strokeWidth: FAN[i] === 0.5 ? 2 : 1.25,
        dash: FAN[i] === 0.05 || FAN[i] === 0.95 ? "4 4" : undefined,
        points: points.filter((p) => p.step <= step).map((p) => ({ x: p.step * dx, y: p.value })),
      })),
    [curves, step, dx]
  );
  const brushed = useMemo(() => {
    if (!selection) return { count: 0, overlays: [] as PathOverlay[] };
    const lo = bins[selection[0]].x0;
    const hi = bins[selection[1]].x1;
    const all = pathsEndingIn(atStep, lo, hi);
    const overlays = all.slice(0, MAX_BRUSHED).map((p): PathOverlay => ({
      key: `b${p}`,
      color: "var(--primary)",
      strokeWidth: 1.1,
      points: pathPoints(values, pathCount, stepCount, p, dx, step),
    }));
    return { count: all.length, overlays };
  }, [selection, bins, atStep, values, pathCount, stepCount, dx, step]);

  return {
    bins,
    density,
    fan,
    brushed,
    maxBrushed: MAX_BRUSHED,
    below: shareBelow(atStep, level),
    belowTheory: law.cdf(level),
  };
}
