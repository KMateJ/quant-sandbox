import { reduceDesk, startBook, tradeCount } from "./book.math";
import type { Market, MissionDef, PolicyResult } from "./desk.types";
import { markToMarket } from "./risk.math";

/// Replays an auto-hedge-every-`every`-days policy (0 = never hedge) on `market` through `reduceDesk`.
export function replayPolicy(mission: MissionDef, market: Market, seed: number, every: number): PolicyResult {
  let state = startBook(mission, seed, market);
  while (!state.settled) {
    if (every > 0 && state.day % every === 0) state = reduceDesk(state, { type: "autoHedge" }, market, mission);
    state = reduceDesk(state, { type: "step", days: 1 }, market, mission);
  }
  return {
    pnl: markToMarket(state, market),
    breaches: state.breaches,
    trades: tradeCount(state),
    costs: state.costsPaid,
    series: state.history.map((r) => r.pnl),
  };
}
