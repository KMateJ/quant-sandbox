import type { EventRow } from "../../components/game/GamePanels";
import { money, num, signed } from "../../components/game/gameFormat";
import type { TranslationKey } from "../../i18n";
import type { AlmEvent } from "./engine/alm.types";

type Translate = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const bp = (x: number) => `${signed(x)} bp`;

/// Event-log row for one ALM event (kind tag, tone and text).
export function eventText(e: AlmEvent, t: Translate): EventRow {
  const row = (kind: TranslationKey, tone: EventRow["tone"], text: TranslationKey, vars?: Record<string, unknown>): EventRow => ({
    t: t("almdRoundShort", { n: e.t }),
    kind: t(kind),
    tone,
    text: t(text, vars),
  });
  switch (e.kind) {
    case "start":
      return row("almdEvStart", "muted", "almdEvStartText");
    case "shock":
      return row("almdEvShock", "", "almdEvShockText", { p: bp(e.parallelBp), tw: bp(e.twistBp) });
    case "rebalance":
      return row(e.tag === "auto" ? "almdEvAuto" : "almdEvTrade", "accent", "almdEvTradeText", { dur: num(e.duration, 2), cost: money(e.cost) });
    case "matured":
      return row("almdEvMatured", "muted", "almdEvMaturedText", { tenor: e.tenor, amount: money(e.amount) });
    case "gapMiss":
      return row("almdEvGapMiss", "down", "almdEvGapMissText", { gap: signed(e.gap, 2) });
    case "convMiss":
      return row("almdEvConvMiss", "down", "almdEvConvMissText", { gap: signed(e.gap, 1) });
    case "liabilityAdded":
      return row("almdEvAdded", "accent", "almdEvAddedText", { amount: money(e.amount), year: e.year, contribution: money(e.contribution) });
    case "liabilityPaid":
      return row("almdEvPaid", "muted", "almdEvPaidText", { amount: money(e.amount) });
    case "rejected":
      return row("almdEvRejected", "down", "almdEvRejectedText");
    case "end":
      return row("almdEvEnd", e.surplus >= 0 ? "up" : "down", "almdEvEndText", { surplus: money(e.surplus) });
    default: {
      const never: never = e;
      return never;
    }
  }
}
