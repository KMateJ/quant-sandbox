import { useI18n } from "../../../i18n";
import { fmtTicks } from "../orderBook.math";
import type { FlowEvent } from "../../../lib/market/market.types";

/// The last few crowd and market events, newest first.
export default function BookEventLog({ events }: { events: FlowEvent[] }) {
  const { t } = useI18n();
  const line = (e: FlowEvent) => {
    const n = (e.size ?? 0).toLocaleString("en-US");
    if (e.kind === "limit") return t(e.side === "buy" ? "obkEvBid" : "obkEvAsk", { p: fmtTicks(e.price ?? 0), n });
    if (e.kind === "cancel") return t("obkEvCancel");
    if (e.kind === "skip") return t("obkEvSkip");
    return t(e.side === "buy" ? "obkEvMktBuy" : "obkEvMktSell", { n, who: t(e.taker === "you" ? "obkWhoYou" : "obkWhoCrowd") });
  };
  return (
    <ol className="obk-log" aria-label={t("obkLogAria")}>
      {events.map((e, i) => <li key={`${e.t}-${i}`} className={`obk-log-${e.kind}`}>{t("obkLogT", { t: e.t })} {line(e)}</li>)}
    </ol>
  );
}
