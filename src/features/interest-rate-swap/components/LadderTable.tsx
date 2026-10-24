import { useI18n } from "../../../i18n";
import type { LadderRow } from "../swap.math";
import { money, rate, years } from "../swapFormat";

type Props = { rows: LadderRow[]; selected: number | null; onSelect: (i: number | null) => void };

/// Every payment (or year) with forward, discount factor and both legs' present values; a row and its ladder
/// column highlight each other.
export default function LadderTable({ rows, selected, onSelect }: Props) {
  const { t } = useI18n();
  return (
    <div className="irs-table-wrap">
      <table className="irs-table">
        <thead>
          <tr>
            <th scope="col">{t("irsColDate")}</th>
            <th scope="col">{t("irsColForward")}</th>
            <th scope="col">{t("irsColDf")}</th>
            <th scope="col">{t("irsColPvFloating")}</th>
            <th scope="col">{t("irsColPvFixed")}</th>
            <th scope="col">{t("irsColNet")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.t} className={selected === i ? "is-selected" : undefined} tabIndex={0}
              onMouseEnter={() => onSelect(i)} onFocus={() => onSelect(i)} onMouseLeave={() => onSelect(null)} onBlur={() => onSelect(null)}>
              <th scope="row">{years(r.t)}</th>
              <td>{rate(r.forward, 2)}</td>
              <td>{r.df.toFixed(4)}</td>
              <td>{money(r.pvFloating)}</td>
              <td>{money(r.pvFixed)}</td>
              <td>{money(r.net)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
