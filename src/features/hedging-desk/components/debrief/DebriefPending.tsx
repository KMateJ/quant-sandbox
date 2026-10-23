import Panel from "../../../../components/layout/Panel";
import { useI18n } from "../../../../i18n";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Shown before expiry: run the remaining days or go back to the desk.
export default function DebriefPending({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { day, market, step, setScreen } = desk;
  return (
    <Panel title={t("hdDebriefPendingTitle")} className="hdesk-panel">
      <p className="hdesk-debrief-note">{t("hdDebriefPendingNote", { day, days: market.days })}</p>
      <div className="hdesk-debrief-actions">
        <button type="button" className="hdesk-debrief-btn hdesk-debrief-btn--primary" onClick={() => step(market.days - day)}>
          {t("hdDebriefRunToExpiry")}
        </button>
        <button type="button" className="hdesk-debrief-btn" onClick={() => setScreen("desk")}>
          {t("hdDebriefBackToDesk")}
        </button>
      </div>
    </Panel>
  );
}
