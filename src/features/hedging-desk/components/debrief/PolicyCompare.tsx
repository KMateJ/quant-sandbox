import Panel from "../../../../components/layout/Panel";
import { useI18n, type TranslationKey } from "../../../../i18n";
import { money, signedMoney, toneClass } from "../../deskFormat";
import type { DebriefModel } from "../../useDebrief";
import type { HedgingDeskModel } from "../../useHedgingDesk";

type Row = { label: string; pnl: number; breaches: number; trades: number; costs: number; own?: boolean };

/// Auto-hedge policies replayed on the same path, with the user's run highlighted once settled.
export default function PolicyCompare({ desk, debrief }: { desk: HedgingDeskModel; debrief: DebriefModel }) {
  const { t } = useI18n();
  const rows: Row[] = debrief.policies.map((p) => ({ ...p, label: t(`hdDebriefPolicy${p.key}` as TranslationKey) }));
  if (desk.state.settled) {
    const { pnl, trades, state } = desk;
    rows.push({ label: t("hdDebriefYourRun"), pnl, breaches: state.breaches, trades, costs: state.costsPaid, own: true });
  }
  return (
    <Panel id="hd-debrief-policies" title={t("hdDebriefPoliciesTitle")} className="hdesk-panel" flush>
      <div className="hdesk-debrief-tablewrap">
        <table className="hdesk-debrief-table">
          <thead>
            <tr>
              <th scope="col">{t("hdDebriefPolicy")}</th>
              <th scope="col" className="hdesk-num">{t("hdDebriefPnl")}</th>
              <th scope="col" className="hdesk-num">{t("hdDebriefBreaches")}</th>
              <th scope="col" className="hdesk-num">{t("hdDebriefTrades")}</th>
              <th scope="col" className="hdesk-num">{t("hdDebriefCostsCol")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.own ? "is-own" : undefined}>
                <th scope="row">{r.label}</th>
                <td className={`hdesk-num ${toneClass(r.pnl)}`}>{signedMoney(r.pnl)}</td>
                <td className="hdesk-num">{r.breaches}</td>
                <td className="hdesk-num">{r.trades}</td>
                <td className="hdesk-num">{money(r.costs)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
