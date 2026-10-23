import { useState } from "react";
import { useI18n } from "../../../../i18n";
import { money, num, pct, signed } from "../../deskFormat";
import type { DeskHelp } from "../../help/useDeskHelp";
import { verdictTone, whatIfBlockKey, whatIfTitleKey, whatIfVerdictKey } from "../../help/whatIfCopy";
import type { WhatIfResult } from "../../help/whatIf.types";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import WhatIfDetail from "./WhatIfDetail";

/// One scenario: headline numbers, verdict lines, expandable detail and the "Put in ticket" action.
export default function WhatIfCard({ result: r, desk, help }: { result: WhatIfResult; desk: HedgingDeskModel; help: DeskHelp }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const first = r.orders[0];
  const loadable = !r.block && r.id !== "ticket" && first !== undefined;
  const load = () => {
    desk.setTicketId(first.id);
    desk.setSide(first.side);
    desk.setQty(String(first.qty));
    help.point("ticket");
  };
  return (
    <section className="hdesk-wi-card">
      <h3 className="hdesk-wi-title">{t(whatIfTitleKey(r.id))}</h3>
      {r.block ? (
        <p className="hdesk-help-p hdesk-wi-block">{t(whatIfBlockKey(r.block))}</p>
      ) : (
        <>
          <dl className="hdesk-help-kv">
            <dt>{t("hdWiCost")}</dt><dd>{money(r.cost)}</dd>
            <dt>{t("hdWiDeltaAfter")}</dt><dd>{signed(r.after.delta)}</dd>
            <dt>{t("hdWiGammaAfter")}</dt><dd>{num(r.after.gamma, 1)}</dd>
            <dt>{t("hdWiBreach")}</dt><dd>{pct(r.breachChance, 0)}</dd>
          </dl>
          <ul className="hdesk-wi-verdicts">
            {r.verdicts.map((v) => (
              <li key={v} className={`hdesk-help-tone--${verdictTone(v)}`}>{t(whatIfVerdictKey(v))}</li>
            ))}
          </ul>
          <div className="hdesk-help-actions">
            <button type="button" className="hdesk-btn" aria-expanded={open} onClick={() => setOpen(!open)}>
              {t("hdWiDetails")}
            </button>
            {loadable && <button type="button" className="hdesk-btn" onClick={load}>{t("hdHelpUseTicket")}</button>}
          </div>
          {loadable && r.orders.length > 1 && (
            <p className="hdesk-help-p">{t("hdWiStep", { n: 1, total: r.orders.length })} · {t("hdWiMultiLeg")}</p>
          )}
          {open && <WhatIfDetail result={r} desk={desk} />}
        </>
      )}
    </section>
  );
}
