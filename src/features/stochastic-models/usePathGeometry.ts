import { useMemo, useState } from "react";
import { simulateBrownian } from "./brownianFundamentals.math";
import { PG_GRID_STEPS } from "./pathGeometry.types";
import type { GeometryCloud } from "./pathGeometry.types";

/// Shared state for the Chapter 3 lessons: a seeded Brownian cloud on [0, 1].
/// Per-path seed streams keep existing paths fixed when paths are added.
export function usePathGeometry(initialPaths: number, steps: number = PG_GRID_STEPS) {
  const [paths, setPaths] = useState(initialPaths);
  const [seed, setSeed] = useState(7);
  const cloud: GeometryCloud = useMemo(() => simulateBrownian(seed, paths, steps), [seed, paths, steps]);
  return {
    paths,
    setPaths,
    seed,
    setSeed,
    cloud,
  };
}

export type PathGeometrySim = ReturnType<typeof usePathGeometry>;
