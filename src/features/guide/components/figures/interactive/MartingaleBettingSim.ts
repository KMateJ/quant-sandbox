import { useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "../../../../../components/useMediaQuery";
import { makeRng } from "../../../../../lib/math/random";
import {
  BETTING_SETUP,
  newPlayer,
  playRound,
  simulateCrowd,
  type BettingStrategy,
  type CrowdResult,
  type Player,
} from "../../../guide.interactive.martingaleBetting.math";

/// Rounds added per animation frame while "Play 100 rounds" runs (≈ 1.5 s for the batch).
const ROUNDS_PER_FRAME = 1;

/// Game state for the martingale-betting figure: one player played round by round, plus a simulated crowd.
export function useMartingaleBetting() {
  const seed = useRef(1);
  const rng = useRef(makeRng(1));
  const [strategy, setStrategyState] = useState<BettingStrategy>("constant");
  // The RNG is advanced outside state updaters, so StrictMode's double calls don't consume extra draws.
  const [player, setPlayer] = useState<Player>(newPlayer);
  const playerRef = useRef<Player>(player);
  const [crowd, setCrowd] = useState<CrowdResult | null>(null);
  const [pending, setPending] = useState(0);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");

  const advance = useCallback((rounds: number, s: BettingStrategy) => {
    let q = playerRef.current;
    for (let i = 0; i < rounds; i++) q = playRound(q, s, rng.current);
    playerRef.current = q;
    setPlayer(q);
  }, []);

  const reset = useCallback(() => {
    seed.current += 1;
    rng.current = makeRng(seed.current);
    setPending(0);
    playerRef.current = newPlayer();
    setPlayer(playerRef.current);
    setCrowd(null);
  }, []);

  const setStrategy = (s: BettingStrategy) => {
    setStrategyState(s);
    reset();
  };

  const flip = () => advance(1, strategy);
  const play = () => (reducedMotion ? advance(BETTING_SETUP.rounds, strategy) : setPending(BETTING_SETUP.rounds));
  const simulate = () => setCrowd(simulateCrowd(strategy, 1000 + seed.current));

  useEffect(() => {
    if (pending <= 0) return;
    const stop = () => document.hidden && setPending(0);
    document.addEventListener("visibilitychange", stop);
    const raf = requestAnimationFrame(() => {
      const n = Math.min(ROUNDS_PER_FRAME, pending);
      advance(n, strategy);
      setPending((k) => k - n);
    });
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", stop);
    };
  }, [pending, strategy, advance]);

  return { strategy, setStrategy, player, crowd, playing: pending > 0, flip, play, simulate, reset };
}
