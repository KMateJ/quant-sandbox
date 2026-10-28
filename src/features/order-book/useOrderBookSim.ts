import { useMemo, useReducer, useState } from "react";
import { fairPath, flowSchedule, seedBook } from "../../lib/market/flow";
import type { Side } from "../../lib/market/market.types";
import { useTicker } from "../../components/playback/useTicker";
import { presetSpec, SIM_SECONDS } from "./orderBook.math";
import type { Liquidity } from "./orderBook.types";
import { initialSim, simReducer, type World } from "./simReducer";

/// Real milliseconds per simulated second at 1× (slow enough to follow each event).
const TICK_MS = 1500;

/// Live order book: pre-drawn crowd flow per (seed, liquidity), play / pause / step, and your orders.
export function useOrderBookSim(seed: number, liquidity: Liquidity, frozen: boolean) {
  const world = useMemo<World>(() => {
    const spec = presetSpec(liquidity);
    const fair = fairPath(spec, SIM_SECONDS, seed);
    return { spec, fair, draws: flowSchedule(spec, SIM_SECONDS, seed), book0: seedBook(spec, fair[0], seed) };
  }, [seed, liquidity]);
  const [state, dispatch] = useReducer(simReducer, world, initialSim);
  const [worldSeen, setWorldSeen] = useState(world);
  if (worldSeen !== world) {
    setWorldSeen(world);
    dispatch({ type: "reset", world });
  }
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<1 | 4>(1);
  const step = () => dispatch({ type: "tick", world });
  const stopped = frozen || Boolean(state.challenge?.done);
  useTicker(running && !stopped, TICK_MS / speed, () => {
    step();
    return state.t + 1 < SIM_SECONDS;
  }, () => setRunning(false));

  return {
    ...state,
    spec: world.spec,
    running: running && !stopped,
    toggle: () => setRunning((r) => !r),
    step,
    speed,
    setSpeed,
    send: (side: Side, size: number) => dispatch({ type: "send", side, size }),
    placeLimit: (side: Side, price: number, size: number) => dispatch({ type: "placeLimit", side, price, size }),
    cancelMine: (id: number) => dispatch({ type: "cancelMine", id }),
    cancelAllMine: () => dispatch({ type: "cancelAllMine" }),
    reset: () => dispatch({ type: "reset", world }),
    startChallenge: () => {
      dispatch({ type: "startChallenge", world });
      setRunning(true);
    },
  };
}

export type OrderBookSim = ReturnType<typeof useOrderBookSim>;
