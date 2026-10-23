import { useEffect, useState } from "react";

/// Cycles an index through `count` items every `ms`, unless paused or reduced motion is requested.
export function useRotation(count: number, ms: number, paused: boolean) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), ms);
    return () => window.clearTimeout(id);
  }, [index, count, ms, paused]);

  return [index, setIndex] as const;
}
