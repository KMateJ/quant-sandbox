import type { QuoteCell } from "../../components/game";
import { num, signed, signedMoney } from "../../components/game/gameFormat";
import type { MmDeskModel } from "./useMarketMakingDesk";

type Translate = (key: string, vars?: Record<string, unknown>) => string;

const tone = (x: number): QuoteCell["tone"] => (x > 0 ? "up" : x < 0 ? "down" : undefined);
const DASH = "—";

/// Quote strip: mid, spread, your bid/ask, inventory, P&L and its spread, adverse and fee parts.
export function quoteCells(desk: MmDeskModel, t: Translate): QuoteCell[] {
  const { parts, pnl, inventory, bid, ask } = desk;
  return [
    { label: t("mmdQMid"), value: num(desk.mid, 3) },
    { label: t("mmdQSpread"), value: desk.spread === null ? DASH : t("mmdTicksValue", { n: desk.spread }) },
    { label: t("mmdQBid"), value: bid ? num(bid.price, 2) : DASH },
    { label: t("mmdQAsk"), value: ask ? num(ask.price, 2) : DASH },
    { label: t("mmdQInventory"), value: signed(inventory, 0), tone: tone(inventory) },
    { label: t("mmdQPnl"), value: signedMoney(pnl), tone: tone(pnl) },
    { label: t("mmdQSpreadCap"), value: signedMoney(parts.spread), tone: tone(parts.spread) },
    { label: t("mmdQAdverse"), value: signedMoney(parts.adverse), tone: tone(parts.adverse) },
    { label: t("mmdQFees"), value: signedMoney(parts.fees), tone: tone(parts.fees) },
  ];
}
