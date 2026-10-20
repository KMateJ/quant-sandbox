import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "./useTicker";

type Options = {
  /// Last step; the cursor runs over 0…steps.
  steps: number;
  /// Starting step (defaults to the end, so a static page shows the full picture).
  initial?: number;
  /// Time for a full sweep from 0 to `steps` at speed 1.
  durationMs?: number;
  /// Restart from 0 instead of stopping at the end.
  loop?: boolean;
};

/// A step cursor over 0…steps that can be scrubbed, stepped, or played forward at a chosen speed.
/// Playing from the end restarts at 0; under prefers-reduced-motion, play jumps straight to the end.
export function usePlayback({ steps, initial = steps, durationMs = 4000, loop = false }: Options) {
  const [step, setStepState] = useState(initial);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  useEffect(() => {
    if (!playing) return;
    const sweep = durationMs / speed;
    const from = stepRef.current >= steps ? 0 : stepRef.current;
    const start = performance.now() - (from / steps) * sweep;
    let frame = requestAnimationFrame(function tick(now) {
      // The first frame's timestamp can precede `performance.now()` above, so clamp at 0.
      const raw = Math.max(0, Math.round(((now - start) / sweep) * steps));
      const next = loop ? raw % (steps + 1) : Math.min(steps, raw);
      setStepState(next);
      if (!loop && next >= steps) setPlaying(false);
      else frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing, steps, durationMs, speed, loop]);

  const clamp = (value: number) => Math.max(0, Math.min(steps, Math.round(value)));
  const setStep = (value: number) => {
    setPlaying(false);
    setStepState(clamp(value));
  };
  const play = () => {
    if (prefersReducedMotion()) return setStep(steps);
    setPlaying(true);
  };

  const current = Math.min(step, steps);
  return {
    step: current,
    time: steps > 0 ? current / steps : 1,
    playing,
    speed,
    setSpeed,
    setStep,
    play,
    pause: () => setPlaying(false),
    toggle: () => (playing ? setPlaying(false) : play()),
    stepBy: (delta: number) => setStep(current + delta),
    reset: () => setStep(0),
  };
}

export type Playback = ReturnType<typeof usePlayback>;
