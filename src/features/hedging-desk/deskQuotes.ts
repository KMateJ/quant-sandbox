import type { QuoteCell } from "../../components/game/GameFrame";
import { num, pct, signed, signedMoney } from "../../components/game/gameFormat";
import type { Translate } from "./missionCopy";
import type { HedgingDeskModel } from "./useHedgingDesk";

const tone = (x: number): QuoteCell["tone"] => (x > 0 ? "up" : x < 0 ? "down" : undefined);

/// The eleven quote-strip cells under the command bar: price, session range, vols, rate, activity, P&L.
export function deskQuotes(t: Translate, desk: HedgingDeskModel): QuoteCell[] {
  const { market, day, S, iv, pnl, trades, lastRebalanceDay, realizedVol } = desk;
  const seen = market.spot.slice(0, day + 1);
  const prev = market.spot[Math.max(day - 1, 0)];
  const change = S - prev;
  const changeText = day > 0 ? `${signed(change, 2)} (${signed((change / prev) * 100, 2)}%)` : signed(0, 2);
  return [
    { label: t("hdQuoteLast"), value: num(S, 2) },
    { label: t("hdQuoteChange"), value: changeText, tone: tone(change) },
    { label: t("hdQuoteOpen"), value: num(seen[0], 2) },
    { label: t("hdQuoteHigh"), value: num(Math.max(...seen), 2) },
    { label: t("hdQuoteLow"), value: num(Math.min(...seen), 2) },
    { label: t("hdQuoteIv"), value: pct(iv) },
    { label: t("hdQuoteRv"), value: realizedVol === null ? "—" : pct(realizedVol) },
    { label: t("hdQuoteRate"), value: pct(market.rate, 2) },
    { label: t("hdQuoteTrades"), value: String(trades) },
    { label: t("hdQuoteLastRebalance"), value: lastRebalanceDay === null ? "—" : t("hdDayShort", { day: lastRebalanceDay }) },
    { label: t("hdQuotePnl"), value: signedMoney(pnl), tone: tone(pnl) },
  ];
}
