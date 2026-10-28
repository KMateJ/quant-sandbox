import Panel from "../../../components/layout/Panel";
import { num } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import type { Side } from "../../../lib/market/market.types";
import type { MmDeskModel } from "../useMarketMakingDesk";

const SIDES: { side: Side; key: "mmdSideBid" | "mmdSideAsk" }[] = [
  { side: "buy", key: "mmdSideBid" },
  { side: "sell", key: "mmdSideAsk" },
];

/// Bid/ask offsets in ticks, size, auto re-quote, where the quotes would sit and how much is queued ahead.
export default function QuoteTicket({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const { draft, target, live } = desk;

  const preview = (side: Side, label: string) => {
    const resting = side === "buy" ? desk.bid : desk.ask;
    if (resting) return t("mmdPreviewLine", { side: label, price: num(resting.price, 2), ahead: num(resting.ahead, 0) });
    return t("mmdPreviewTarget", { side: label, price: num(side === "buy" ? target.bid : target.ask, 2) });
  };

  return (
    <Panel id="mmd-ticket" title={t("mmdTicketTitle")} className="gdesk-panel">
      <div className="mmd-offsets">
        {SIDES.map(({ side, key }) => {
          const label = t(key);
          const value = side === "buy" ? draft.bidOffset : draft.askOffset;
          return (
            <div key={side} className="mmd-offset">
              <span className="gdesk-label">{label} · {t("mmdOffset")}</span>
              <span className="mmd-stepper">
                <button type="button" className="gdesk-btn" disabled={!live} aria-label={t("mmdOffsetDownAria", { side: label })}
                  onClick={() => desk.nudgeDraft(side, -1)}>−</button>
                <span className="gdesk-num">{num(value, 1)}</span>
                <button type="button" className="gdesk-btn" disabled={!live} aria-label={t("mmdOffsetUpAria", { side: label })}
                  onClick={() => desk.nudgeDraft(side, 1)}>+</button>
              </span>
              <span className={`mmd-preview gdesk-num ${side === "buy" ? "gdesk-up" : "gdesk-down"}`}>{preview(side, label)}</span>
            </div>
          );
        })}
      </div>
      <label className="mmd-field">
        <span className="gdesk-label">{t("mmdSize")}</span>
        <input type="number" min={10} step={10} value={draft.size} disabled={!live}
          onChange={(e) => desk.setDraftSize(Number(e.target.value) || 10)} />
      </label>
      <label className="mmd-check">
        <input type="checkbox" checked={draft.auto} disabled={!live} onChange={desk.toggleDraftAuto} />
        <span>{t("mmdAuto")}</span>
      </label>
      <div className="mmd-ticket-actions">
        <button id="mmd-place" type="button" className="mmd-submit" disabled={!live} onClick={desk.place}>{t("mmdPlace")}</button>
        <button id="mmd-pull" type="button" className="gdesk-btn" disabled={!live || !desk.state.quote.live} onClick={desk.pull}>{t("mmdPull")}</button>
      </div>
    </Panel>
  );
}
