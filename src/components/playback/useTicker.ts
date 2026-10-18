import { useEffect, useRef } from "react";

/// Calls `tick` every `ms` while `running`; stops when `tick` returns false.
/// Under prefers-reduced-motion the caller should step manually instead of playing.
export function useTicker(running: boolean, ms: number, tick: () => boolean | void, onStop: () => void) {
  const tickRef = useRef(tick);
  const stopRef = useRef(onStop);
  useEffect(() => {
    tickRef.current = tick;
    stopRef.current = onStop;
  });
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      if (tickRef.current() === false) stopRef.current();
    }, ms);
    return () => window.clearInterval(id);
  }, [running, ms]);
}

/// Whether the reader asked for reduced motion.
export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
