import { foldStates } from "../../../lib/game/demo";
import type { DemoStepBase } from "../../../lib/game/game.types";
import { reduceMm, startMm } from "../engine/book.math";
import type { MmAction, MmMarket, MmMission, MmState } from "../engine/mm.types";
import type { MmScreen } from "../marketMakingDesk.url";

export type MmDemoStep = DemoStepBase<MmScreen, MmAction>;

/// Mission and seed the playthrough runs on.
export const MM_DEMO_MISSION = "MM1";
export const MM_DEMO_SEED = 7;
const HOLD = 6500;

const quote = (bidOffset: number, askOffset: number): MmAction => ({ type: "setQuote", quote: { bidOffset, askOffset, live: true } });

/// The six narrated steps of the MM1 playthrough: welcome, join, inventory skew, toxic tape, widen, your turn.
export function buildMmDemo(): MmDemoStep[] {
  const step = (id: string, anchor: string, actions: MmAction[]): MmDemoStep => ({ id, screen: "desk", anchor, actions, holdMs: HOLD });
  return [
    step("welcome", "book", []),
    step("join", "ticket", [quote(0.5, 0.5), { type: "step", ticks: 30 }]),
    step("inventory", "risk", [quote(1.5, 0.5)]),
    step("toxic", "tape", []),
    step("widen", "pnl", [quote(2.5, 1.5), { type: "step", ticks: 60 }]),
    step("yourTurn", "mission", []),
  ];
}

/// Desk state after each demo step, folded through the reducer from a fresh start (deterministic per mission + seed).
export function demoStates(mission: MmMission, market: MmMarket, seed: number): MmState[] {
  return foldStates(startMm(mission, seed, market), buildMmDemo(), (s, a) => reduceMm(s, a, mission, market));
}
