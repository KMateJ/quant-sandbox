import { useI18n } from "../../../../i18n";
import { num, signed, signedMoney } from "../../../../components/game/gameFormat";
import { whatIfBodyKey, whatIfVars } from "../../help/whatIfCopy";
import type { WhatIfResult } from "../../help/whatIf.types";
import { STATUS_KEY } from "../../../../components/game/gameCopy";
import { objectiveText } from "../../missionCopy";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import WhatIfShocks from "./WhatIfShocks";

/// Expanded scenario: explanation, Greeks now and after, shock table and objectives after the trade.
export default function WhatIfDetail({ result: r, desk }: { result: WhatIfResult; desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { before: b, after: a } = r;
  const rows: [string, string, string][] = [
    [t("hdWiDeltaAfter"), signed(b.delta), signed(a.delta)],
    [t("hdWiGammaAfter"), num(b.gamma, 1), num(a.gamma, 1)],
    [t("hdWiVegaAfter"), signedMoney(b.vega), signedMoney(a.vega)],
    [t("hdWiThetaAfter"), signedMoney(b.theta), signedMoney(a.theta)],
  ];
  return (
    <>
      <p className="gdesk-help-p">{t(whatIfBodyKey(r.id), whatIfVars(r))}</p>
      <table className="gdesk-wi-table">
        <thead>
          <tr><th /><td>{t("hdWiNow")}</td><td>→</td></tr>
        </thead>
        <tbody>
          {rows.map(([label, now, after]) => (
            <tr key={label}><th scope="row">{label}</th><td>{now}</td><td>{after}</td></tr>
          ))}
        </tbody>
      </table>
      {r.premium !== 0 && (
        <dl className="gdesk-help-kv"><dt>{t("hdWiPremium")}</dt><dd>{signedMoney(r.premium)}</dd></dl>
      )}
      <WhatIfShocks result={r} />
      <section className="gdesk-help-section">
        <h4 className="gdesk-help-h">{t("hdWiObjectives")}</h4>
        <ul className="gdesk-wi-objectives">
          {r.objectives.map((o) => (
            <li key={o.def.kind}>{objectiveText(t, o.def, desk.mission.band)}: {t(STATUS_KEY[o.status])}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
