import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "../../../../../components/playback/useTicker";

/// Eases a number towards `target` over `ms` milliseconds; returns `target` at once under reduced motion.
export function useTweened(target: number, ms = 700): number {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const reduced = prefersReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const start = performance.now();
    const origin = from.current;
    let frame = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / ms);
      from.current = origin + (target - origin) * (1 - (1 - k) ** 2);
      setValue(from.current);
      if (k < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, ms, reduced]);
  return reduced ? target : value;
}
