import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { money, num, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { ticketPreview } from "../deskView.math";
import type { RatesDeskModel, Side } from "../useRatesDesk";

const SIDES: { id: Side; key: "ratdBuy" | "ratdSell" }[] = [{ id: "buy", key: "ratdBuy" }, { id: "sell", key: "ratdSell" }];

/// Futures order ticket: contract, side and size, a DV01 preview, submit and the two quick hedges.
export default function FuturesTicket({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { mission, ticket, expired, state, zeros, risk } = desk;
  const live = !state.settled;
  const blocked = expired[ticket.future];
  const p = useMemo(
    () => ticketPreview(mission, zeros, ticket.future, desk.signedQty, risk.net),
    [mission, zeros, ticket.future, desk.signedQty, risk.net],
  );
  return (
    <Panel id="ratd-ticket" title={t("ratdTicketTitle")} className="gdesk-panel">
      <div className="ratd-seg" role="group" aria-label={t("ratdContract")}>
        {mission.futures.map((f, j) => (
          <button key={f.id} type="button" className="gdesk-btn" aria-pressed={ticket.future === j} disabled={expired[j]} onClick={() => desk.setFuture(j)}>
            {f.id}{expired[j] ? ` · ${t("ratdExpiredTag")}` : ""}
          </button>
        ))}
      </div>
      <div className="ratd-seg" role="group" aria-label={t("ratdSideAria")}>
        {SIDES.map((s) => (
          <button key={s.id} type="button" className="gdesk-btn" aria-pressed={ticket.side === s.id} onClick={() => desk.setSide(s.id)}>
            {t(s.key)}
          </button>
        ))}
      </div>
      <label className="ratd-qty">
        <span className="gdesk-label">{t("ratdQty")}</span>
        <input type="number" inputMode="numeric" min={1} step={1} value={ticket.qty} onChange={(e) => desk.setQty(e.target.value)} aria-invalid={!desk.qtyValid} />
      </label>
      {!desk.qtyValid && <p className="ratd-warn" role="alert">{t("ratdQtyInvalid")}</p>}
      <dl className="gdesk-kv">
        <div><dt>{t("ratdPrevPrice")}</dt><dd className="gdesk-num">{num(p.price, 3)}</dd></div>
        <div><dt>{t("ratdPrevDv01")}</dt><dd className="gdesk-num">{money(p.perContract)}</dd></div>
        <div><dt>{t("ratdPrevImpact")}</dt><dd className="gdesk-num">{signedMoney(p.impact)}</dd></div>
        <div><dt>{t("ratdPrevAfter")}</dt><dd className="gdesk-num">{signedMoney(p.netAfter)}</dd></div>
        <div><dt>{t("ratdPrevCost")}</dt><dd className="gdesk-num">{money(p.cost)}</dd></div>
      </dl>
      <button id="ratd-submit" type="button" className="gdesk-btn ratd-submit" disabled={!live || blocked || !desk.qtyValid} onClick={desk.submit}>
        {t("ratdSubmit")}
      </button>
      <div className="ratd-seg">
        <button type="button" className="gdesk-btn" disabled={!live || blocked} onClick={desk.hedgeDv01}>{t("ratdQuickDv01")}</button>
        <button type="button" className="gdesk-btn" disabled={!live} onClick={desk.hedgeKrd}>{t("ratdQuickKrd")}</button>
      </div>
    </Panel>
  );
}
