import type { ReactNode } from "react";
import { useI18n } from "../../../i18n";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { num, pct, signed, signedMoney, toneClass } from "../deskFormat";

/// Fictional ticker and function code shown on the command bar (not user copy).
const TICKER = "QSBX US Equity";
const FUNCTION_CODE = "HDGS <GO>";

type QuoteCell = { label: string; value: string; className?: string };

/// Amber command bar (ticker, function code, page name, simulation clock, `actions`) and the quote strip.
export default function DeskHeader({ desk, actions }: { desk: HedgingDeskModel; actions?: ReactNode }) {
  const { t } = useI18n();
  const { market, day, S, iv, pnl, trades, lastRebalanceDay } = desk;
  const seen = market.spot.slice(0, day + 1);
  const prev = market.spot[Math.max(day - 1, 0)];
  const change = S - prev;
  const changeText = day > 0 ? `${signed(change, 2)} (${signed((change / prev) * 100, 2)}%)` : signed(0, 2);

  const cells: QuoteCell[] = [
    { label: t("hdQuoteLast"), value: num(S, 2) },
    { label: t("hdQuoteChange"), value: changeText, className: toneClass(change) },
    { label: t("hdQuoteOpen"), value: num(seen[0], 2) },
    { label: t("hdQuoteHigh"), value: num(Math.max(...seen), 2) },
    { label: t("hdQuoteLow"), value: num(Math.min(...seen), 2) },
    { label: t("hdQuoteIv"), value: pct(iv) },
    { label: t("hdQuoteRv"), value: desk.realizedVol === null ? "—" : pct(desk.realizedVol) },
    { label: t("hdQuoteRate"), value: pct(market.rate, 2) },
    { label: t("hdQuoteTrades"), value: String(trades) },
    { label: t("hdQuoteLastRebalance"), value: lastRebalanceDay === null ? "—" : t("hdDayShort", { day: lastRebalanceDay }) },
    { label: t("hdQuotePnl"), value: signedMoney(pnl), className: `hdesk-quote--pnl ${toneClass(pnl)}` },
  ];

  return (
    <header className="hdesk-header">
      <div className="hdesk-cmd">
        <span className="hdesk-cmd-ticker">{TICKER}</span>
        <span className="hdesk-cmd-code">{FUNCTION_CODE}</span>
        <h1 className="hdesk-cmd-title">{t("hdTitle")}</h1>
        <span className="hdesk-cmd-clock">
          {t("hdSimClock", { day, days: market.days, left: market.days - day })}
        </span>
        {desk.demo && <span className="hdesk-cmd-badge">{t("hdDemoBadge")}</span>}
        {actions}
      </div>
      <dl className="hdesk-quotes" id="hd-quotes">
        {cells.map((cell) => (
          <div key={cell.label} className={["hdesk-quote", cell.className].filter(Boolean).join(" ")}>
            <dt className="hdesk-label">{cell.label}</dt>
            <dd className="hdesk-num">{cell.value}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}
