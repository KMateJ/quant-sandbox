import type { EventRow } from "../../components/game/GamePanels";
import { num, signed, signedMoney } from "../../components/game/gameFormat";
import { clockParts } from "./deskModel.math";
import type { MmEvent } from "./engine/mm.types";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// One event-log row per engine event (newest-first ordering is the caller's job).
export function eventText(e: MmEvent, t: Translate): EventRow {
  const { mm, ss } = clockParts(e.t, Infinity);
  const row = (tone: EventRow["tone"], text: string): EventRow => ({ t: t("mmdTimeShort", { mm, ss }), kind: t(`mmdEvKind_${e.kind}`), tone, text });
  switch (e.kind) {
    case "start":
      return row("muted", t("mmdEvStart"));
    case "fill":
      return row(e.side === "buy" ? "up" : "down", t(e.side === "buy" ? "mmdEvBought" : "mmdEvSold", { size: num(e.size, 0), price: num(e.price, 2) }));
    case "hedge":
      return row("accent", t("mmdEvHedge", { side: t(e.side === "buy" ? "mmdTapeBuy" : "mmdTapeSell"), size: num(e.size, 0), avg: num(e.avg, 2) }));
    case "limitBreach":
      return row("down", t("mmdEvBreach", { inv: signed(e.inventory, 0) }));
    case "news":
      return row("accent", t("mmdEvNews", { jump: signed(e.jump, 1) }));
    case "requote":
      return row("muted", t("mmdEvRequote"));
    case "pulled":
      return row("muted", t("mmdEvPulled"));
    case "end":
      return row(e.pnl >= 0 ? "up" : "down", t("mmdEvEnd", { pnl: signedMoney(e.pnl) }));
    default: {
      const never: never = e;
      return never;
    }
  }
}
