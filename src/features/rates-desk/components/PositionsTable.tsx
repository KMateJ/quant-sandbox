import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { money, num, signed, signedMoney } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { KEY_RATES } from "../../../lib/finance/curveRisk";
import { positionRows } from "../deskView.math";
import type { RatesDeskModel } from "../useRatesDesk";

/// Bonds and futures held: size, price, value, DV01 and key-rate DV01s, with a NET row.
export default function PositionsTable({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const { state, mission, zeros, risk } = desk;
  const rows = useMemo(() => positionRows(state, mission, zeros), [state, mission, zeros]);
  return (
    <Panel id="ratd-positions" title={t("ratdPosTitle")} className="gdesk-panel">
      <div className="gdesk-scroll">
        <table className="gdesk-matrix">
          <thead>
            <tr>
              <th scope="col">{t("ratdColInstr")}</th>
              <th scope="col">{t("ratdColSize")}</th>
              <th scope="col">{t("ratdColPrice")}</th>
              <th scope="col">{t("ratdColValue")}</th>
              <th scope="col">{t("ratdColDv01")}</th>
              {KEY_RATES.map((k) => <th key={k} scope="col">{t("ratdChartMat", { t: k })}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.kind}-${r.id}`}>
                <th scope="row">{t(r.kind === "bond" ? "ratdBondLabel" : "ratdFutLabel", { id: r.id })}</th>
                <td>{r.kind === "bond" ? money(r.size) : signed(r.size)}</td>
                <td>{num(r.price, 3)}</td>
                <td>{r.kind === "bond" ? money(r.value) : "—"}</td>
                <td>{signedMoney(r.dv01)}</td>
                {r.krd.map((v, k) => <td key={k}>{signedMoney(v)}</td>)}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">{t("ratdNet")}</th>
              <td />
              <td />
              <td>{money(risk.bookValue)}</td>
              <td>{signedMoney(risk.net)}</td>
              {risk.kNet.map((v, k) => <td key={k}>{signedMoney(v)}</td>)}
            </tr>
          </tfoot>
        </table>
      </div>
    </Panel>
  );
}
