import { useState } from "react";
import { usePredictReveal } from "../../components/ui";
import { subSeed } from "../../lib/game/seed";
import { asReservation } from "../../lib/market/quotes";
import { makeRng } from "../../lib/math/random";
import type { AsParams } from "./avellanedaStoikov.types";

const TIMES = [0.25, 0.5, 0.75];

/// A predict question: inventory q ≠ 0 in −8…8 and a clock time, both drawn from the seed and round.
export function predictCase(seed: number, round: number) {
  const rng = makeRng(subSeed(seed, 500 + round));
  const mag = 1 + Math.floor(rng() * 8);
  const q = rng() < 0.5 ? -mag : mag;
  return { q, t: TIMES[Math.floor(rng() * TIMES.length)] };
}

/// Predict round: where is the reservation price for this inventory and time? Guess placed on the price column.
export function useAvsPredict(params: AsParams, seed: number) {
  const [round, setRound] = useState(0);
  const c = predictCase(seed, round);
  const truth = asReservation(params.s0, c.q, params.gamma, params.sigma, params.T - c.t);
  const state = usePredictReveal({ truth, tolerance: 0.15, resetKey: `${seed}|${round}`, challengeId: "avs-reservation" });
  return { ...c, state, next: () => setRound((r) => r + 1) };
}

export type AvsPredict = ReturnType<typeof useAvsPredict>;
