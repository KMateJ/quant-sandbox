import { useMemo } from "react";
import { useUrlState } from "../../../components/useUrlState";
import type { UrlSchema } from "../../../lib/urlState";
import { simulateBrownian } from "./brownianFundamentals.math";
import { PG_GRID_STEPS } from "../../../lib/stochastic/pathGeometry.types";
import type { GeometryCloud } from "../../../lib/stochastic/pathGeometry.types";

type GeometryUrl = { paths: number; seed: number };

/// Shared state for the Chapter 3 lessons: a seeded Brownian cloud on [0, 1]. Paths, seed and the lesson's own
/// fields live in the URL (`schema`); per-path seed streams keep existing paths fixed when paths are added.
export function usePathGeometry<S extends GeometryUrl>(schema: UrlSchema<S>, steps: number = PG_GRID_STEPS) {
  const [url, setUrl] = useUrlState(schema);
  const { paths, seed } = url;
  const cloud: GeometryCloud = useMemo(() => simulateBrownian(seed, paths, steps), [seed, paths, steps]);
  return {
    url,
    setUrl,
    paths,
    setPaths: (value: number) => setUrl({ paths: value } as Partial<S>),
    seed,
    setSeed: (value: number) => setUrl({ seed: value } as Partial<S>),
    cloud,
  };
}

export type PathGeometrySim = Pick<ReturnType<typeof usePathGeometry<GeometryUrl>>, "paths" | "setPaths" | "seed" | "setSeed" | "cloud">;
