import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { num, signed } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { ctdSwitchBp } from "../engine/risk.math";
import { basketRows } from "../deskView.math";
import type { RatesDeskModel } from "../useRatesDesk";

/// The selected contract's deliverable basket: price, conversion factor, P/CF and basis; the CTD row is marked.
export default function CtdMonitor({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { mission, ticket, quotes, zeros } = desk;
  const spec = mission.futures[ticket.future];
  const q = quotes[ticket.future];
  const sw = useMemo(() => ctdSwitchBp(spec, zeros), [spec, zeros]);
  return (
    <Panel id="ratd-ctd" title={t("ratdCtdTitle", { id: spec.id })} className="gdesk-panel">
      <div className="gdesk-scroll">
        <table className="gdesk-matrix">
          <thead>
            <tr>
              <th scope="col">{t("ratdCtdBond")}</th>
              <th scope="col">{t("ratdColPrice")}</th>
              <th scope="col">{t("ratdCtdCf")}</th>
              <th scope="col">{t("ratdCtdRatio")}</th>
              <th scope="col">{t("ratdCtdBasis")}</th>
            </tr>
          </thead>
          <tbody>
            {basketRows(spec, q).map((r, i) => (
              <tr key={i} className={r.ctd ? "ratd-ctd-row" : undefined}>
                <th scope="row">
                  {t("ratdCtdBondLabel", { c: num(r.coupon * 100, 2), m: num(r.maturity, 1) })}
                  {r.ctd && <span className="ratd-ctd-tag"> {t("ratdCtdTag")}</span>}
                </th>
                <td>{num(r.price, 3)}</td>
                <td>{num(r.cf, 4)}</td>
                <td>{num(r.ratio, 3)}</td>
                <td>{num(r.basis, 3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="gdesk-matrix__note">{sw === null ? t("ratdCtdNoSwitch") : t("ratdCtdSwitch", { bp: signed(sw) })}</p>
    </Panel>
  );
}
