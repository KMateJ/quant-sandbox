import { useEffect, useRef, useState } from "react";

const SWEEP_MS = 4000;

/// A grid-step cursor on 0…steps that can be scrubbed or played forward over
/// ~4 s, restarting from 0 when played at the end.
export function useTimeCursor(steps: number, initial = steps) {
  const [step, setStep] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    if (!playing) return;
    const from = stepRef.current >= steps ? 0 : stepRef.current;
    const start = performance.now() - (from / steps) * SWEEP_MS;
    let frame = requestAnimationFrame(function tick(now) {
      const next = Math.min(steps, Math.round(((now - start) / SWEEP_MS) * steps));
      setStep(next);
      if (next >= steps) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, steps]);

  return {
    step: Math.min(step, steps),
    time: Math.min(step, steps) / steps,
    setStep: (value: number) => {
      setPlaying(false);
      setStep(value);
    },
    playing,
    toggle: () => setPlaying((value) => !value),
  };
}

export type TimeCursor = ReturnType<typeof useTimeCursor>;
