import Panel from "../../../components/layout/Panel";
import { useI18n } from "../../../i18n";
import { missionBriefKey, missionTitleKey, objectiveText, objectiveValueText, statusKey } from "../missionCopy";
import type { HedgingDeskModel } from "../useHedgingDesk";

/// Mission title, brief, day clock and live objective statuses.
export default function MissionPanel({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const { mission, market, day, objectives } = desk;
  const progress = (day / market.days) * 100;
  return (
    <Panel id="hd-mission" title={t("hdMissionPanelTitle")} className="hdesk-panel">
      <h3 className="hdesk-mission-title">{t(missionTitleKey(mission.id))}</h3>
      <p className="hdesk-mission-brief">{t(missionBriefKey(mission.id))}</p>
      <div
        className="hdesk-clock"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={market.days}
        aria-valuenow={day}
        aria-label={t("hdSideClockAria", { day, days: market.days })}
      >
        <span className="hdesk-clock-fill" style={{ width: `${progress}%` }} />
      </div>
      <p className="hdesk-label hdesk-num">{t("hdSideClock", { day, days: market.days })}</p>
      <ul className="hdesk-objectives">
        {objectives.map((o, i) => (
          <li key={i} className={`hdesk-objective hdesk-objective--${o.status}`}>
            <span className="hdesk-objective-text">{objectiveText(t, o.def, mission.band)}</span>
            <span className="hdesk-objective-status">{t(statusKey(o.status))}</span>
            <span className="hdesk-objective-value">{objectiveValueText(t, o)}</span>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
