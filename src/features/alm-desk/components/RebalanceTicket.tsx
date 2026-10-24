import Panel from "../../../components/layout/Panel";
import { money, num, pct, signed } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { TENORS } from "../../immunization/immunization.math";
import type { AlmDeskModel } from "../useAlmDesk";

/// Target weights per bond (cash takes the rest), a duration-match fill, the trade preview and submit.
export default function RebalanceTicket({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { targets, parsed, preview, tradesLeft, state } = desk;
  if (state.settled) {
    return (
      <Panel id="almd-ticket" title={t("almdTicketTitle")} className="gdesk-panel">
        <p className="almd-ticket-note">{t("almdTicketSettled")}</p>
      </Panel>
    );
  }
  const cash = parsed.weights ? pct(parsed.weights[TENORS.length], 1) : "—";
  const rows: [string, string][] = preview
    ? [
        [t("almdTicketDurAfter"), num(preview.durAfter, 2)],
        [t("almdTicketGapAfter"), signed(preview.gapAfter, 2)],
        [t("almdTicketConvAfter"), signed(preview.convAfter, 1)],
        [t("almdTicketTraded"), money(preview.traded)],
        [t("almdTicketCost"), money(preview.cost)],
      ]
    : [];
  if (tradesLeft !== null) rows.push([t("almdRiskTradesLeft"), String(tradesLeft)]);

  return (
    <Panel id="almd-ticket" title={t("almdTicketTitle")} className="gdesk-panel">
      <div className="almd-ticket">
        {TENORS.map((tenor, i) => {
          const label = t("almdTicketTarget", { line: t("almdHoldBond", { tenor }) });
          return (
            <label key={tenor} className="almd-ticket-field">
              <span className="gdesk-label">{label}</span>
              <input type="number" inputMode="decimal" min={0} max={100} step={0.1} value={targets[i]} onChange={(e) => desk.setTarget(i, e.target.value)} />
            </label>
          );
        })}
        <div className="almd-ticket-field">
          <span className="gdesk-label">{t("almdTicketCashRest")}</span>
          <span className="gdesk-num almd-ticket-cash">{cash}</span>
        </div>
        <button type="button" className="gdesk-btn" onClick={desk.fillMatch}>{t("almdTicketFill")}</button>
        {tradesLeft === 0 && <p className="almd-ticket-note gdesk-down">{t("almdTicketNoTrades")}</p>}
        {parsed.over && <p className="almd-ticket-note gdesk-down" role="alert">{t("almdTicketOver")}</p>}
        <dl className="gdesk-kv">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd className="gdesk-num">{v}</dd>
            </div>
          ))}
        </dl>
        <button id="almd-submit" type="button" className="almd-submit" disabled={!parsed.weights} onClick={desk.submit}>
          {t("almdTicketSubmit")}
        </button>
      </div>
    </Panel>
  );
}
