import { useMemo, useState } from "react";
import { prefersReducedMotion, useTicker } from "../../components/playback";
import { advance, benchmarks, DEFAULT_CONFIG, drawShock, immunisedWeights, newGame, rebalance, setWeight, weightsOf } from "./immunization.math";

/// One game of the immunization lab for `seed`: the state, the editable target mix, and the moves.
/// A new seed starts a new game.
export function useImmunizationGame(seed: number) {
  const [game, setGame] = useState(() => newGame(seed));
  const [target, setTarget] = useState(() => weightsOf(game));
  const [playing, setPlaying] = useState(false);
  const [seedOf, setSeedOf] = useState(seed);
  const done = game.round >= DEFAULT_CONFIG.years;
  const bench = useMemo(() => benchmarks(seed), [seed]);

  const restart = () => {
    const fresh = newGame(seed);
    setGame(fresh);
    setTarget(weightsOf(fresh));
    setPlaying(false);
  };
  // Reset during render when the seed changes (React's "adjust state on prop change" pattern).
  if (seedOf !== seed) {
    setSeedOf(seed);
    restart();
  }

  const play = (rounds: number) => {
    let next = game;
    for (let i = 0; i < rounds && next.round < DEFAULT_CONFIG.years; i++) next = advance(next, drawShock(seed, next.round + 1));
    setGame(next);
    setTarget(weightsOf(next));
    return next.round < DEFAULT_CONFIG.years;
  };

  useTicker(playing, 1100, () => play(1), () => setPlaying(false));

  const traded = rebalance(game, target);
  return {
    game,
    target,
    done,
    playing,
    bench,
    tradeCost: traded.pendingCost - game.pendingCost,
    nextRound: () => play(1),
    playOn: () => (playing ? setPlaying(false) : prefersReducedMotion() ? play(DEFAULT_CONFIG.years) : setPlaying(true)),
    edit: (i: number, value: number) => setTarget((w) => setWeight(w, i, value)),
    match: () => setTarget(immunisedWeights(game, DEFAULT_CONFIG)),
    rebalance: () => {
      setGame(traded);
      setTarget(weightsOf(traded));
    },
    replay: restart,
  };
}

export type ImmunizationModel = ReturnType<typeof useImmunizationGame>;
