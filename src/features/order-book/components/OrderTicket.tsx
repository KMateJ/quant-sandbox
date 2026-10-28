import NumberStepper from "../../../components/NumberStepper";
import { SegmentedControl } from "../../../components/ui";
import { useI18n } from "../../../i18n";
import type { Side } from "../../../lib/market/market.types";
import { bestAsk, bestBid } from "../../../lib/market/book";
import type { TicketKind } from "../orderBook.types";
import type { OrderBookLab } from "../useOrderBookLab";
import SimControls from "./SimControls";

/// Market order ticket (side, size, send) plus the crowd's playback controls.
export default function OrderTicket({ lab }: { lab: OrderBookLab }) {
  const { t } = useI18n();
  const { url, setUrl, preview } = lab;
  const frozen = url.mode === "predict" || Boolean(lab.sim.challenge?.done);
  const touch = url.side === "buy" ? bestBid(lab.sim.book) : bestAsk(lab.sim.book);
  const submit = () => (lab.limitMode ? touch !== null && lab.placeAt(touch) : lab.send(url.side, url.size));
  return (
    <div className="obk-ticket">
      <SegmentedControl<TicketKind>
        ariaLabel={t("obkTicketAria")}
        value={url.ticket}
        onChange={(ticket) => setUrl({ ticket })}
        options={[{ value: "market", label: t("obkKindMarket") }, { value: "limit", label: t("obkKindLimit") }]}
      />
      <SegmentedControl<Side>
        ariaLabel={t("obkSideAria")}
        value={url.side}
        onChange={(side) => setUrl({ side })}
        options={[{ value: "buy", label: t("obkBuy") }, { value: "sell", label: t("obkSell") }]}
      />
      <NumberStepper label={t("obkSize")} min={100} max={20000} step={100} value={url.size} onChange={(size) => setUrl({ size })} formatValue={(v) => v.toLocaleString("en-US")} />
      <button type="button" className="lp-btn lp-btn--primary" disabled={frozen} onClick={submit}>
        {lab.limitMode
          ? t(url.side === "buy" ? "obkJoinBid" : "obkJoinAsk", { n: url.size.toLocaleString("en-US") })
          : t(url.side === "buy" ? "obkSendBuy" : "obkSendSell", { n: url.size.toLocaleString("en-US") })}
      </button>
      {!lab.limitMode && preview.toPrice !== null && <p className="obk-hint">{t("obkPreviewRow", { n: preview.size.toLocaleString("en-US") })}</p>}
      <SimControls sim={lab.sim} frozen={frozen} />
    </div>
  );
}
