import { foldStates } from "../../../lib/game/demo";
import type { DemoStepBase } from "../../../lib/game/game.types";
import type { AlmScreen } from "../almDesk.url";
import { reduceAlm, startAlm } from "../engine/book.math";
import type { AlmAction, AlmMission, AlmState } from "../engine/alm.types";

export type AlmDemoStep = DemoStepBase<AlmScreen, AlmAction>;

/// Mission and path the playthrough runs on (A1 passes on this seed when matched every year).
export const ALM_DEMO_MISSION = "A1";
export const ALM_DEMO_SEED = 1;
const HOLD = 7000;
const HOLD_FIRST = 10000;

const step = (id: string, anchor: string, actions: AlmAction[], holdMs = HOLD): AlmDemoStep => ({ id, screen: "desk", anchor, actions, holdMs });

/// The seven-step playthrough of A1: match, live a year, re-match, another year, re-match, hand over.
export function buildAlmDemo(mission: AlmMission, seed: number): AlmDemoStep[] {
  void mission;
  void seed;
  return [
    step("welcome", "quotes", [], HOLD_FIRST),
    step("match", "ticket", [{ type: "match" }]),
    step("firstYear", "curve", [{ type: "step" }]),
    step("rematch", "risk", [{ type: "match" }]),
    step("secondYear", "attr", [{ type: "step" }]),
    step("matured", "holdings", [{ type: "match" }]),
    step("yourTurn", "keys", []),
  ];
}

/// Book after each demo step.
export const demoStates = (mission: AlmMission, seed: number, steps: AlmDemoStep[]): AlmState[] =>
  foldStates(startAlm(mission, seed), steps, (s, a) => reduceAlm(s, a, mission));
