import { useMemo } from "react";
import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { money, num, signed, toneClass } from "../deskFormat";
import { isStock } from "../engine/instruments.math";
import type { HedgingDeskModel } from "../useHedgingDesk";

type Row = { id: string; qty: number; mid: number; value: number; delta: number; gamma: number; vega: number; theta: number };

const COLS = ["hdChartColInstrument", "hdChartColPosition", "hdChartColMid", "hdChartColValue", "hdChartColDelta", "hdChartColGamma", "hdChartColVega", "hdChartColTheta"] as const;

/// Open positions with mid, market value and Greeks in book units, plus a BOOK total row.
export default function PositionsTable({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { state, quote, greeks } = desk;
  const rows = useMemo(
    () =>
      Object.entries(state.positions)
        .filter(([, qty]) => qty !== 0)
        .map(([id, qty]): Row => {
          const q = quote(id);
          const k = qty * q.mult;
          return { id, qty, mid: q.mid, value: k * q.mid, delta: k * q.delta, gamma: k * q.gamma, vega: k * q.vega, theta: k * q.theta };
        }),
    [state.positions, quote],
  );
  const total = rows.reduce((s, r) => s + r.value, 0);

  return (
    <Panel id="hd-positions" title={t("hdPositionsTitle")} className="hdesk-panel">
      <div className="hdesk-scroll">
        <table className="hdesk-positions">
          <thead>
            <tr>{COLS.map((c) => <th key={c} scope="col">{t(c)}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <th scope="row">{isStock(r.id) ? t("hdChartStock") : r.id}</th>
                <td className={toneClass(r.qty)}>{signed(r.qty, 0)}</td>
                <td>{num(r.mid, 2)}</td>
                <td>{money(r.value)}</td>
                <td>{signed(r.delta, 0)}</td>
                <td>{num(r.gamma, 2)}</td>
                <td>{num(r.vega, 0)}</td>
                <td>{num(r.theta, 0)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="hdesk-positions__total">
              <th scope="row">{t("hdChartBook")}</th>
              <td />
              <td />
              <td>{money(total)}</td>
              <td>{signed(greeks.delta, 0)}</td>
              <td>{num(greeks.gamma, 2)}</td>
              <td>{num(greeks.vega, 0)}</td>
              <td>{num(greeks.theta, 0)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </Panel>
  );
}
