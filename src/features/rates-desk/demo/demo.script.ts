import type { DemoStepBase } from "../../../lib/game/game.types";
import { reduceRates, startRates } from "../engine/book.math";
import { factorPath } from "../engine/curve.math";
import { tenYearContract } from "../engine/policy.math";
import type { RatesAction, RatesMission } from "../engine/rates.types";

export type RatesDemoStep = DemoStepBase<"desk" | "missions" | "debrief", RatesAction>;

/// Mission and seed of the playthrough; daily DV01 hedging in the 10Y passes R1 on this path.
export const RATES_DEMO_MISSION = "R1";
export const RATES_DEMO_SEED = 21;
const HOLD_MS = 6000;
const HOLD_LONG_MS = 9000;

/// Six-step playthrough: hedge DV01 with the 10Y, five days of daily re-hedging, a look at key-rate risk,
/// the rest of the run on the same rule, then hand over.
export function buildRatesDemo(mission: RatesMission, seed: number): RatesDemoStep[] {
  const path = factorPath(mission, seed);
  const ten = Math.max(0, tenYearContract(mission, 0));
  const hedge: RatesAction = { type: "dv01Hedge", future: ten };
  const day: RatesAction[] = [{ type: "step", days: 1 }, hedge];
  const step = (id: string, screen: RatesDemoStep["screen"], anchor: string, actions: RatesAction[] = [], holdMs = HOLD_MS): RatesDemoStep =>
    ({ id, screen, anchor, actions, holdMs });

  const head = [hedge, ...Array.from({ length: 5 }, () => day).flat()];
  let s = head.reduce((st, a) => reduceRates(st, a, mission, path), startRates(mission, seed, path));
  const rest: RatesAction[] = [];
  while (!s.settled) {
    rest.push(...day);
    s = day.reduce((st, a) => reduceRates(st, a, mission, path), s);
  }

  return [
    step("welcome", "desk", "quotes"),
    step("dv01Hedge", "desk", "ticket", [hedge]),
    step("fiveDays", "desk", "pnl", head.slice(1), HOLD_LONG_MS),
    step("keyRate", "desk", "risk"),
    step("toEnd", "debrief", "debrief-banner", rest, HOLD_LONG_MS),
    step("yourTurn", "desk", "tabs"),
  ];
}
