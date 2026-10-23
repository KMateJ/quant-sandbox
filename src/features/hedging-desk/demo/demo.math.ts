import { startBook } from "../engine/book.math";
import type { BookState, Market, MissionDef } from "../engine/desk.types";
import { buildMarket } from "../engine/market.math";
import { DEMO_SEED } from "./demo.config";
import { applyActions, buildDemoScript } from "./demo.script";
import type { DemoRun, DemoStep } from "./demo.types";

/// Book state after each step: `states[k]` folds the actions of `steps[0..k]` from `start`.
export function demoStates(steps: DemoStep[], start: BookState, market: Market, mission: MissionDef): BookState[] {
  const states: BookState[] = [];
  let state = start;
  for (const s of steps) {
    state = applyActions(state, s.actions, market, mission);
    states.push(state);
  }
  return states;
}

/// The demo's market: the mission's spec on `seed` (`DEMO_SEED` by default).
export function demoMarket(mission: MissionDef, seed = DEMO_SEED): Market {
  return buildMarket(mission.market, seed);
}

/// The full scripted playthrough: steps plus the book state after each one.
export function runDemo(mission: MissionDef, market: Market, seed = DEMO_SEED): DemoRun {
  const steps = buildDemoScript(mission, market, seed);
  return { steps, states: demoStates(steps, startBook(mission, seed, market), market, mission) };
}

/// Index of the step with `id`, or −1.
export function stepIndexById(steps: DemoStep[], id: string): number {
  return steps.findIndex((s) => s.id === id);
}
