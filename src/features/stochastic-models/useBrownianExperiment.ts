import { useEffect, useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import type { UrlSchema } from "../../lib/urlState";
import { simulateBrownian, valuesAt } from "./brownianFundamentals.math";
import { BM_GRID_STEPS, BM_MIN_GAP } from "./brownianFundamentals.types";

type BrownianUrl = { paths: number; seed: number; s: number; t: number };

/// Delay before a moved window is written to the URL, so drags and the sweep animation don't flood the history API.
const URL_SETTLE_MS = 250;
const tidy = (v: number) => Number(v.toFixed(2));

/// Shared state for the Chapter 2 lessons: a seeded Brownian cloud and an ordered window s < t, with the
/// cross-sections W(s) and W(t) taken from it. Paths, seed and window live in the URL (`schema`); the window
/// renders from local state at once and reaches the URL once it settles.
export function useBrownianExperiment<S extends BrownianUrl>(schema: UrlSchema<S>) {
  const [url, setUrl] = useUrlState(schema);
  const linked: [number, number] = url.t - url.s >= BM_MIN_GAP ? [url.s, url.t] : [Math.max(0.05, url.t - BM_MIN_GAP), url.t];
  const [[s, t], setWindow] = useState<[number, number]>(linked);
  const [seen, setSeen] = useState(linked);

  // Adjust state on prop change: a URL that moves on its own (hydration, back/forward) wins over the local window.
  if (seen[0] !== linked[0] || seen[1] !== linked[1]) {
    setSeen(linked);
    setWindow(linked);
  }

  useEffect(() => {
    if (tidy(s) === url.s && tidy(t) === url.t) return;
    const id = setTimeout(() => setUrl({ s: tidy(s), t: tidy(t) } as Partial<S>), URL_SETTLE_MS);
    return () => clearTimeout(id);
  }, [s, t, url.s, url.t, setUrl]);

  const { paths, seed } = url;
  const cloud = useMemo(() => simulateBrownian(seed, paths, BM_GRID_STEPS), [seed, paths]);
  const ws = useMemo(() => valuesAt(cloud, s), [cloud, s]);
  const wt = useMemo(() => valuesAt(cloud, t), [cloud, t]);

  return {
    url,
    setUrl,
    paths,
    setPaths: (value: number) => setUrl({ paths: value } as Partial<S>),
    seed,
    setSeed: (value: number) => setUrl({ seed: value } as Partial<S>),
    s,
    t,
    setS: (value: number) => setWindow(([, end]) => [Math.min(value, end - BM_MIN_GAP), end]),
    setT: (value: number) => setWindow(([start]) => [start, Math.max(value, start + BM_MIN_GAP)]),
    setWindow: (start: number, end: number) => setWindow([start, end]),
    onResample: () => setUrl({ seed: seed >= 9999 ? 1 : seed + 1 } as Partial<S>),
    cloud,
    ws,
    wt,
  };
}

export type BrownianExperiment = ReturnType<typeof useBrownianExperiment<BrownianUrl>>;
