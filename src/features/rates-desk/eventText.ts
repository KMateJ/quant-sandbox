import { money, num, signed, signedMoney } from "../../components/game/gameFormat";
import type { EventRow } from "../../components/game/GamePanels";
import type { TranslationKey } from "../../i18n";
import type { RatesEvent, RatesMission } from "./engine/rates.types";

type T = (key: TranslationKey, vars?: Record<string, unknown>) => string;

const BUCKET_KEYS: TranslationKey[] = ["ratdBucket0", "ratdBucket1", "ratdBucket2"];

/// Kind tag, tone and sentence of one desk event; exhaustive over `RatesEvent`.
export function eventRow(e: RatesEvent, mission: RatesMission, t: T): EventRow {
  const row = (kind: TranslationKey, tone: EventRow["tone"], text: string): EventRow => ({ t: t("ratdChartDay", { day: e.t }), kind: t(kind), tone, text });
  switch (e.kind) {
    case "start":
      return row("ratdEvStart", "accent", t("ratdEvStartText", { bonds: mission.book.length, contracts: mission.opening.reduce((s, q) => s + Math.abs(q), 0) }));
    case "move":
      return row("ratdEvMove", e.d10 > 0 ? "down" : e.d10 < 0 ? "up" : "", t("ratdEvMoveText", { d2: signed(e.d2, 1), d10: signed(e.d10, 1) }));
    case "fill":
      return row("ratdEvFill", "accent", t(e.tag === "auto" ? "ratdEvFillAutoText" : "ratdEvFillText", {
        side: t(e.qty > 0 ? "ratdBuy" : "ratdSell"), qty: Math.abs(e.qty), id: e.future, price: num(e.price, 3),
      }));
    case "dv01Miss":
      return row("ratdEvDv01Miss", "down", t("ratdEvDv01MissText", { net: signedMoney(e.net) }));
    case "krdMiss":
      return row("ratdEvKrdMiss", "down", t("ratdEvKrdMissText", { bucket: t(BUCKET_KEYS[e.node]), value: signedMoney(e.value) }));
    case "ctdSwitch":
      return row("ratdEvCtd", "accent", t("ratdEvCtdText", { id: e.future, n: e.to + 1 }));
    case "expired":
      return row("ratdEvExpired", "accent", t("ratdEvExpiredText", { id: e.future, qty: signed(e.qty), price: num(e.price, 3) }));
    case "end":
      return row("ratdEvEnd", e.pnl >= 0 ? "up" : "down", t("ratdEvEndText", { pnl: e.pnl >= 0 ? money(e.pnl) : signedMoney(e.pnl) }));
    default: {
      const never: never = e;
      return never;
    }
  }
}

/// Newest-first event rows for the log.
export const eventRows = (events: RatesEvent[], mission: RatesMission, t: T) => events.map((e) => eventRow(e, mission, t)).reverse();
