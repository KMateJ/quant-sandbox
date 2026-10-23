import { reduceDesk, startBook } from "../engine/book.math";
import { STOCK_ID } from "../engine/desk.config";
import type { BookState, DeskAction, Market, MissionDef } from "../engine/desk.types";
import { optionId } from "../engine/instruments.math";
import { DEMO_HOLD_LONG_MS, DEMO_HOLD_MS, DEMO_SEED } from "./demo.config";
import type { DemoStep } from "./demo.types";

/// Folds `actions` through the desk reducer, starting from `state`.
export function applyActions(state: BookState, actions: DeskAction[], market: Market, mission: MissionDef): BookState {
  return actions.reduce((s, a) => reduceDesk(s, a, market, mission), state);
}

/// The playthrough's sixteen steps for `mission` on `market` (built from `seed`, `DEMO_SEED` by default).
export function buildDemoScript(mission: MissionDef, market: Market, seed = DEMO_SEED): DemoStep[] {
  const start = startBook(mission, seed, market);
  const q = Math.round(-start.openDelta);
  const stockTicket = { id: STOCK_ID, side: "buy" as const, qty: q };
  const step = (
    id: string,
    screen: DemoStep["screen"],
    anchor: DemoStep["anchor"],
    extra: Partial<Pick<DemoStep, "actions" | "ticket" | "holdMs">> = {},
  ): DemoStep => ({ id, screen, anchor, actions: [], holdMs: DEMO_HOLD_MS, ...extra });

  const head: DemoStep[] = [
    step("welcome", "desk", "quotes"),
    step("clientFill", "desk", "blotter"),
    step("positions", "desk", "positions"),
    step("riskBand", "desk", "risk"),
    step("objectives", "desk", "mission"),
    step("ticket", "desk", "ticket", { ticket: stockTicket }),
    step("firstFill", "desk", "price", {
      actions: [{ type: "order", order: { id: STOCK_ID, side: "buy", qty: q, tag: "manual" } }],
      ticket: stockTicket,
    }),
    step("dayStep", "desk", "delta", { actions: [{ type: "step", days: 1 }] }),
    step("drift", "desk", "risk", { actions: [{ type: "step", days: 5 }], holdMs: DEMO_HOLD_LONG_MS }),
    step("autoHedge", "desk", "keys", { actions: [{ type: "autoHedge" }] }),
    step("scenarios", "desk", "matrix"),
    step("chain", "desk", "chain", { ticket: { id: optionId("C", 105), side: "buy", qty: 5 } }),
  ];

  let state = applyActions(start, head.flatMap((s) => s.actions), market, mission);
  const toExpiry: DeskAction[] = [];
  while (!state.settled) {
    const pair: DeskAction[] = [{ type: "autoHedge" }, { type: "step", days: 1 }];
    toExpiry.push(...pair);
    state = applyActions(state, pair, market, mission);
  }

  return [
    ...head,
    step("toExpiry", "desk", "pnl", { actions: toExpiry, ticket: stockTicket, holdMs: DEMO_HOLD_LONG_MS }),
    step("attribution", "debrief", "debrief-attribution", { holdMs: DEMO_HOLD_LONG_MS }),
    step("policies", "debrief", "debrief-policies", { holdMs: DEMO_HOLD_LONG_MS }),
    step("yourTurn", "desk", "tabs"),
  ];
}
