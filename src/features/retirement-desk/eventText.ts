import type { EventRow } from "../../components/game/GamePanels";
import { pct } from "../../components/game/gameFormat";
import type { RetirementEvent } from "./engine/retirement.types";
import { amount, spct } from "./retirementFormat";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

/// One event-log row per engine event (newest-first ordering is the caller's job).
export function eventText(e: RetirementEvent, t: Translate): EventRow {
  const row = (tone: EventRow["tone"], text: string): EventRow => ({ t: t("retrYearShort", { y: e.t }), kind: t(`retrEvKind_${e.kind}`), tone, text });
  switch (e.kind) {
    case "start":
      return row("muted", t("retrEvStart"));
    case "take":
      return row(e.tag === "auto" ? "accent" : "", t(e.tag === "auto" ? "retrEvTakeAuto" : "retrEvTake", { amount: amount(e.amount), equity: pct(e.equity, 0) }));
    case "cut":
      return row("down", t("retrEvCut", { amount: amount(e.amount), pct: spct(e.pct, 0) }));
    case "bigYear":
      return row(e.r > 0 ? "up" : "down", t("retrEvBigYear", { r: spct(e.r) }));
    case "broke":
      return row("down", t("retrEvBroke", { y: e.t }));
    case "end":
      return row("accent", t("retrEvEnd", { wealth: amount(e.wealth) }));
    default: {
      const never: never = e;
      return never;
    }
  }
}
