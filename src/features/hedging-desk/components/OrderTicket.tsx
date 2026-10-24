import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { STOCK_ID } from "../engine/desk.config";
import { isStock } from "../engine/instruments.math";
import { instrumentLabel, parseQty } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";
import QtyPresets from "./QtyPresets";
import TicketPreview from "./TicketPreview";

/// Instrument, side and quantity entry with a live preview and the submit / expiry action.
export default function OrderTicket({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { ticket, mission, state } = desk;
  const stock = isStock(ticket.id);
  const qty = parseQty(ticket.qty);
  const sideKey = ticket.side === "buy" ? "hdSideBuyCaps" : "hdSideSellCaps";
  return (
    <Panel id="hd-ticket" title={t("hdOrderTicketTitle")} className="gdesk-panel">
      <div className="hdesk-ticket-inst">
        <strong>{instrumentLabel(ticket.id)}</strong>
        <button type="button" className="gdesk-btn" disabled={stock} onClick={() => desk.setTicketId(STOCK_ID)}>
          {t("hdSideUnderlying")}
        </button>
      </div>
      <p className="gdesk-label">{t(mission.instruments === "stock" ? "hdSideStockOnly" : "hdSidePickHint")}</p>
      <div className="hdesk-sides" role="group" aria-label={t("hdSideSideAria")}>
        {(["buy", "sell"] as const).map((side) => (
          <button
            key={side}
            type="button"
            className={`hdesk-side hdesk-side--${side}`}
            aria-pressed={ticket.side === side}
            onClick={() => desk.setSide(side)}
          >
            {t(side === "buy" ? "hdSideBuy" : "hdSideSell")}
          </button>
        ))}
      </div>
      <label className="hdesk-qty">
        <span className="gdesk-label">
          {t("hdSideQty")} ({t(stock ? "hdSideQtyShares" : "hdSideQtyContracts")})
        </span>
        <input
          type="number"
          min={1}
          step={1}
          inputMode="numeric"
          value={ticket.qty}
          onChange={(e) => desk.setQty(e.target.value)}
        />
      </label>
      <QtyPresets stock={stock} qty={ticket.qty} onPick={desk.setQty} />
      <TicketPreview desk={desk} qty={qty} />
      {mission.maxTrades !== undefined && (
        <p className="gdesk-label">{t("hdSideTradesLeft", { n: Math.max(0, mission.maxTrades - desk.trades) })}</p>
      )}
      {state.settled ? (
        <div className="hdesk-expired">
          <p>{t("hdSideExpired")}</p>
          <button type="button" className="gdesk-btn" onClick={() => desk.setScreen("debrief")}>
            {t("hdSideToDebrief")}
          </button>
        </div>
      ) : (
        <button
          id="hd-submit"
          type="button"
          className={`hdesk-submit hdesk-submit--${ticket.side}`}
          disabled={qty === 0}
          onClick={desk.submit}
        >
          {t("hdSideSubmit", { side: t(sideKey), qty: ticket.qty, inst: instrumentLabel(ticket.id) })}
        </button>
      )}
    </Panel>
  );
}
