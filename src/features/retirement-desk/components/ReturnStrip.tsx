import type { CSSProperties } from "react";
import Panel from "../../../components/layout/Panel";
import { heatCell } from "../../../components/game/gameFormat";
import { useI18n } from "../../../i18n";
import { spct } from "../retirementFormat";
import type { RetirementDeskModel } from "../useRetirementDesk";

const HEAT_MAX = 0.25;

/// Portfolio return of every year played, one tinted cell per year (±25% = full tint), with the signed value written in.
export default function ReturnStrip({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const { rows } = desk.state;
  return (
    <Panel id="retr-returns" title={t("retrReturnsTitle")} className="gdesk-panel">
      {rows.length === 0 ? (
        <p className="gdesk-label">{t("retrReturnsEmpty")}</p>
      ) : (
        <ol className="retr-strip" aria-label={t("retrReturnsTitle")}>
          {rows.map((r) => {
            const h = heatCell(r.r, HEAT_MAX);
            return (
              <li key={r.y} title={t("retrReturnCell", { y: r.y, r: spct(r.r) })}
                className={`retr-strip-cell gdesk-matrix__cell gdesk-matrix__cell--${h.tone}`} style={{ "--gdesk-tint": h.alpha } as CSSProperties}>
                <span className="gdesk-label">{r.y}</span>
                <span className="gdesk-num">{spct(r.r, 0)}</span>
              </li>
            );
          })}
        </ol>
      )}
    </Panel>
  );
}
