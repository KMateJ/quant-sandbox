import type { Attribution } from "../../immunization/immunization.types";
import type { AlmMission, AlmPolicy, AlmState } from "./alm.types";
import { replayAlm } from "./policy.math";

/// Surplus at the start (zero: the book opens fully funded) and after each year played.
export const surplusSeries = (state: AlmState): number[] => [0, ...state.game.history.map((h) => h.surplus)];

/// Surplus paths of the reference policies on the same seed, up to year `upTo`.
export function benchmarkSeries(mission: AlmMission, seed: number, upTo: number): Record<"matchYearly" | "none", number[]> {
  const path = (p: AlmPolicy) => replayAlm(mission, seed, p).surplus.slice(0, upTo + 1);
  return { matchYearly: path("matchYearly"), none: path("none") };
}

/// Surplus attribution summed over the years played.
export function attributionTotals(state: AlmState): Attribution {
  const sum: Attribution = { carry: 0, rate: 0, convexity: 0, cost: 0 };
  for (const { attribution: a } of state.game.history) {
    sum.carry += a.carry;
    sum.rate += a.rate;
    sum.convexity += a.convexity;
    sum.cost += a.cost;
  }
  return sum;
}
