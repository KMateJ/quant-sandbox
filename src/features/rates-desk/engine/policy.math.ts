import { factorPath } from "./curve.math";
import { hedgedPnl, reduceRates, startRates } from "./book.math";
import { isExpired } from "./risk.math";
import type { RatesMission, RatesPolicy, RatesState } from "./rates.types";

/// Index of the live 10-year contract on `day` (front until it expires, then the back), or −1.
export function tenYearContract(mission: RatesMission, day: number): number {
  return mission.futures.findIndex((f) => f.id.startsWith("10Y") && !isExpired(f, day));
}

/// Plays the mission with a simple rule on the same path: hedge DV01 in the 10Y daily or weekly, key-rate hedge daily, or nothing.
export function replayRates(mission: RatesMission, seed: number, policy: RatesPolicy) {
  const path = factorPath(mission, seed);
  let s: RatesState = startRates(mission, seed, path);
  while (!s.settled) {
    const j = tenYearContract(mission, s.day);
    if (policy === "krdDaily") s = reduceRates(s, { type: "krdHedge" }, mission, path);
    else if (j >= 0 && (policy === "dv01Daily10Y" || (policy === "dv01Weekly10Y" && s.day % 5 === 0))) {
      s = reduceRates(s, { type: "dv01Hedge", future: j }, mission, path);
    }
    s = reduceRates(s, { type: "step", days: 1 }, mission, path);
  }
  return { state: s, pnl: hedgedPnl(s), misses: s.misses, krdMisses: s.krdMisses, traded: s.traded, costs: s.costs, series: s.hist };
}
