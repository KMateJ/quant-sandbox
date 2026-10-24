import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { money, num, pct } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { holdingRows, type HoldingRow } from "../deskView.math";
import type { AlmDeskModel } from "../useAlmDesk";

const COLS: TranslationKey[] = ["almdHoldLeft", "almdHoldCoupon", "almdHoldFace", "almdHoldPrice", "almdHoldValue", "almdHoldWeight", "almdHoldDv01"];

/// Bonds held, cash and the liability with value, weight and DV01.
export default function HoldingsTable({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const rows = useMemo(() => holdingRows(desk.state, desk.mission), [desk.state, desk.mission]);
  const name = (r: HoldingRow) => (r.kind === "bond" ? t("almdHoldBond", { tenor: r.tenor }) : t(r.kind === "cash" ? "almdHoldCash" : "almdHoldLiability"));
  const dash = "—";
  return (
    <Panel id="almd-holdings" title={t("almdHoldingsTitle")} className="gdesk-panel" flush>
      <div className="gdesk-scroll">
        <table className="almd-table">
          <thead>
            <tr>
              <th scope="col">{t("almdHoldSlot")}</th>
              {COLS.map((k) => <th key={k} scope="col">{t(k)}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className={r.kind === "liability" ? "almd-table__liability" : undefined}>
                <th scope="row">{name(r)}</th>
                <td>{r.kind === "cash" ? dash : num(r.left, 0)}</td>
                <td>{r.kind === "liability" ? dash : pct(r.coupon, 2)}</td>
                <td>{money(r.face)}</td>
                <td>{num(r.price, 2)}</td>
                <td>{money(r.value)}</td>
                <td>{pct(r.weight, 1)}</td>
                <td>{money(r.dv01)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
