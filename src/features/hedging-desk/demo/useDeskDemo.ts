import { useMemo } from "react";
import { useDemoPlayer } from "../../../components/game/useDemoPlayer";
import { STOCK_ID } from "../engine/desk.config";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { runDemo } from "./demo.math";

/// Scripted playthrough of the desk on the kit's player: entering step `i` restores its book, screen
/// and ticket (the book first, so the debrief mounts on a settled demo book). Null outside demo mode.
export function useDeskDemo(desk: HedgingDeskModel) {
  const { demo, mission, market, seed, dispatch, setScreen, setTicketId, setSide, setQty, takeOver, exitDemo } = desk;
  const run = useMemo(() => runDemo(mission, market, seed), [mission, market, seed]);
  const player = useDemoPlayer({
    deskId: "hedging",
    active: demo,
    total: run.steps.length,
    holdMs: (i) => run.steps[i].holdMs,
    // Only once the step's screen shows, so the element exists when the kit looks it up.
    focusId: (i) => (desk.url.screen === run.steps[i].screen ? `hd-${run.steps[i].anchor}` : null),
    onTakeOver: takeOver,
    onExit: exitDemo,
    onEnter: (i) => {
      const step = run.steps[i];
      dispatch({ type: "restore", state: run.states[i] });
      if (desk.url.screen !== step.screen) setScreen(step.screen);
      if (step.ticket) {
        setTicketId(step.ticket.id);
        setSide(step.ticket.side);
        setQty(String(step.ticket.qty));
      } else setTicketId(STOCK_ID);
    },
  });
  return { player, step: player ? run.steps[player.index] : null };
}
