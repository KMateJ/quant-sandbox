import { useEffect, useRef, useState } from "react";
import { BM_TIME_STEP, BM_WINDOW_BOUNDS } from "./brownianFundamentals.types";

const SPEED = 0.18; // time units per second

/// Slides a fixed-width window [s, t] back and forth across the allowed range — the animation that
/// shows the increment's law depends only on the window length.
export function useWindowSweep(s: number, t: number, setWindow: (s: number, t: number) => void) {
  const [playing, setPlaying] = useState(false);
  const state = useRef({ s, width: t - s, direction: 1 });

  useEffect(() => {
    if (!playing) return;
    state.current = { s, width: t - s, direction: state.current.direction };
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const st = state.current;
      const [min, end] = BM_WINDOW_BOUNDS;
      const max = end - st.width;
      let next = st.s + st.direction * SPEED * ((now - last) / 1000);
      last = now;
      if (next >= max || next <= min) {
        st.direction *= -1;
        next = Math.min(max, Math.max(min, next));
      }
      st.s = next;
      const snapped = Math.round(next / BM_TIME_STEP) * BM_TIME_STEP;
      setWindow(Number(snapped.toFixed(6)), Number((snapped + st.width).toFixed(6)));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
    // The window is read once when playback starts; afterwards the sweep owns it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  return { playing, toggle: () => setPlaying((value) => !value), stop: () => setPlaying(false) };
}
