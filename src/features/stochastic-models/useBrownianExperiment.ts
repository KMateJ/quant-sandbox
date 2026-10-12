import { useMemo, useState } from "react";
import { simulateBrownian, valuesAt } from "./brownianFundamentals.math";
import { BM_GRID_STEPS, BM_MIN_GAP } from "./brownianFundamentals.types";

/// Shared state for the Chapter 2 lessons: a seeded Brownian cloud and an ordered
/// window s < t, with the cross-sections W(s) and W(t) taken from it.
export function useBrownianExperiment(initialPaths: number) {
  const [paths, setPaths] = useState(initialPaths);
  const [seed, setSeed] = useState(7);
  const [[s, t], setWindow] = useState<[number, number]>([0.3, 0.7]);

  const cloud = useMemo(() => simulateBrownian(seed, paths, BM_GRID_STEPS), [seed, paths]);
  const ws = useMemo(() => valuesAt(cloud, s), [cloud, s]);
  const wt = useMemo(() => valuesAt(cloud, t), [cloud, t]);

  return {
    paths,
    setPaths,
    seed,
    setSeed,
    s,
    t,
    setS: (value: number) => setWindow(([, end]) => [Math.min(value, end - BM_MIN_GAP), end]),
    setT: (value: number) => setWindow(([start]) => [start, Math.max(value, start + BM_MIN_GAP)]),
    setWindow: (start: number, end: number) => setWindow([start, end]),
    onResample: () => setSeed((value) => (value >= 9999 ? 1 : value + 1)),
    cloud,
    ws,
    wt,
  };
}

export type BrownianExperiment = ReturnType<typeof useBrownianExperiment>;
