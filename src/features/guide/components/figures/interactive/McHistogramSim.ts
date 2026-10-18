import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { makeRng } from "../../../../../lib/math/random";
import { MC_SETUP, addDraws, drawsPerFrame, emptyMcState } from "../../../guide.interactive.mcHistogram.math";

/// Playing stops on its own here, so the page never keeps simulating unattended.
const MAX_DRAWS = 50_000;
/// Under reduced motion, Play adds draws in plain jumps instead of an animation.
const JUMP_DRAWS = 1000;
const JUMP_MS = 700;

/// Live simulation state for the mc-histogram figure: manual draws, play/pause and reset.
export function useMcHistogramSim() {
  const seed = useRef(1);
  const rng = useRef(makeRng(seed.current));
  const stateRef = useRef(emptyMcState());
  const [state, setState] = useState(stateRef.current);
  const [playing, setPlaying] = useState(false);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const add = useCallback((count: number) => {
    stateRef.current = addDraws(stateRef.current, count, MC_SETUP, rng.current);
    setState(stateRef.current);
    if (stateRef.current.n >= MAX_DRAWS) setPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setPlaying(false);
    seed.current += 1;
    rng.current = makeRng(seed.current);
    stateRef.current = emptyMcState();
    setState(stateRef.current);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const stop = () => document.hidden && setPlaying(false);
    document.addEventListener("visibilitychange", stop);
    let frame = 0;
    let raf = 0;
    let timer = 0;
    if (reducedMotion) {
      add(JUMP_DRAWS);
      timer = window.setInterval(() => add(JUMP_DRAWS), JUMP_MS);
    } else {
      const tick = () => {
        add(drawsPerFrame(frame++));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [playing, reducedMotion, add]);

  return { state, playing, setPlaying, add, reset };
}
