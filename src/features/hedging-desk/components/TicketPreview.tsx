import { useI18n } from "../../../i18n";
import { money, num, signed } from "../../../components/game/gameFormat";
import { ticketPreview } from "../sidePanels.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

/// Key–value preview of what the ticket would do if sent now.
export default function TicketPreview({ desk, qty }: { desk: HedgingDeskModel; qty: number }) {
  const { t } = useI18n();
  const { ticket, mission, greeks } = desk;
  const p = ticketPreview(desk.quote(ticket.id), ticket.side, qty, greeks.delta, mission.band, mission.costs.ticketFee);
  const rows = [
    { key: "hdSideMid", value: num(p.mid, 2) },
    { key: "hdSideEstFill", value: num(p.fill, 2) },
    { key: "hdSideNotional", value: money(p.notional) },
    { key: "hdSideSpreadCost", value: money(p.cost) },
    { key: "hdSideDeltaImpact", value: `${signed(p.deltaImpact)} ${t("hdSideShares")}` },
    { key: "hdSideGammaImpact", value: signed(p.gammaImpact, 1) },
  ] as const;
  return (
    <dl className="gdesk-kv">
      {rows.map((r) => (
        <div key={r.key}>
          <dt>{t(r.key)}</dt>
          <dd className="gdesk-num">{r.value}</dd>
        </div>
      ))}
      <div>
        <dt>{t("hdSideNetAfter")}</dt>
        <dd className={`gdesk-num ${p.inBand ? "gdesk-up" : "gdesk-down"}`}>
          {signed(p.netAfter)} {t("hdSideShares")} · {t(p.inBand ? "hdSideInBand" : "hdSideOutOfBand")}
        </dd>
      </div>
    </dl>
  );
}
