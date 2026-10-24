import { useI18n } from "../../../../i18n";
import { signed, signedMoney, toneClass } from "../../../../components/game/gameFormat";
import type { WhatIfResult } from "../../help/whatIf.types";

/// One-day P&L at -2..+2 daily sigmas, plus the instant vol-jump line.
export default function WhatIfShocks({ result }: { result: WhatIfResult }) {
  const { t } = useI18n();
  return (
    <section className="gdesk-help-section">
      <h4 className="gdesk-help-h">{t("hdWiShocks")}</h4>
      <table className="gdesk-wi-table">
        <tbody>
          {result.shocks.map((row) => (
            <tr key={row.sigmas}>
              <th scope="row">{t("hdWiSigma", { n: signed(row.sigmas), move: signed(row.move, 2) })}</th>
              <td className={toneClass(row.pnl)}>{signedMoney(row.pnl)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="gdesk-help-kv">
        <dt>{t("hdWiVolUp")}</dt>
        <dd className={toneClass(result.volUp)}>{signedMoney(result.volUp)}</dd>
      </dl>
    </section>
  );
}
