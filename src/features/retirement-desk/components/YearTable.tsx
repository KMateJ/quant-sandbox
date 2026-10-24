import Panel from "../../../components/layout/Panel";
import { pct, toneClass } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { CUT_RATIO } from "../engine/book.math";
import { amount, spct } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";

const ROWS = 10;

/// The last ten years, newest first: start wealth, withdrawal (marked when it was a cut), equity, return, end wealth, odds.
export default function YearTable({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { rows } = desk.state;
  const recent = rows.slice(-ROWS).reverse();
  return (
    <Panel id="retr-years" title={t("retrYearsTitle")} className="gdesk-panel" flush>
      {recent.length === 0 ? (
        <p className="gdesk-label retr-empty">{t("retrReturnsEmpty")}</p>
      ) : (
        <div className="gdesk-scroll">
          <table className="gdesk-matrix">
            <thead>
              <tr>
                <th scope="col">{t("retrColYear")}</th>
                <th scope="col">{t("retrColStart")}</th>
                <th scope="col">{t("retrColTake")}</th>
                <th scope="col">{t("retrEquity")}</th>
                <th scope="col">{t("retrColReturn")}</th>
                <th scope="col">{t("retrColEnd")}</th>
                <th scope="col">{t("retrOddsLabel")}</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => {
                const prev = rows[r.y - 2];
                const cut = prev !== undefined && r.take < CUT_RATIO * prev.take;
                return (
                  <tr key={r.y}>
                    <th scope="row">{t("retrYearShort", { y: r.y })}</th>
                    <td>{amount(r.start)}</td>
                    <td>{amount(r.take)}{cut && <span className="gdesk-down"> {t("retrCutTag")}</span>}</td>
                    <td>{pct(r.equity, 0)}</td>
                    <td className={toneClass(r.r)}>{spct(r.r)}</td>
                    <td>{amount(r.end)}</td>
                    <td>{pct(r.odds, 0)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}
