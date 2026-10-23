import Panel from "../../../../components/layout/Panel";
import { useI18n } from "../../../../i18n";
import { objectiveText, objectiveValueText, statusKey } from "../../missionCopy";
import type { HedgingDeskModel } from "../../useHedgingDesk";

/// Each objective with its final status word and measured value.
export default function DebriefObjectives({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  return (
    <Panel title={t("hdDebriefObjectivesTitle")} className="hdesk-panel">
      <ol className="hdesk-debrief-objectives">
        {desk.objectives.map((o, i) => (
          <li key={i}>
            <span>{objectiveText(t, o.def, desk.mission.band)}</span>
            <span className="hdesk-label">{objectiveValueText(t, o)}</span>
            <strong className={o.status === "pass" ? "hdesk-up" : o.status === "fail" ? "hdesk-down" : ""}>
              {t(statusKey(o.status))}
            </strong>
          </li>
        ))}
      </ol>
    </Panel>
  );
}
