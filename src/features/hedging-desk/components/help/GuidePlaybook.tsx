import { useI18n } from "../../../../i18n";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import { GUIDE_PLAYBOOKS } from "../../help/guide.data";
import { playbookStepKey, playbookTrapKey } from "../../help/guideCopy";
import { missionBriefKey, objectiveText, statusKey } from "../../missionCopy";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Brief, live objectives (current mission only), numbered steps and traps of one mission.
export default function GuidePlaybook({ missionId, desk }: { missionId: string; desk?: HedgingDeskModel }) {
  const { t } = useI18n();
  const book = GUIDE_PLAYBOOKS[missionId];
  if (!book) return null;
  return (
    <div className="hdesk-guide-playbook">
      <p className="hdesk-help-p">{t(missionBriefKey(missionId))}</p>
      {desk && (
        <ul className="hdesk-guide-objectives">
          {desk.objectives.map((o, i) => (
            <li key={i} data-status={o.status}>
              <span>{objectiveText(t, o.def, desk.mission.band)}</span>
              <strong>{t(statusKey(o.status))}</strong>
            </li>
          ))}
        </ul>
      )}
      <h4 className="hdesk-guide-sub">{t("hdGuideHowToWin")}</h4>
      <ol>
        {range(book.steps).map((n) => <li key={n}>{t(playbookStepKey(missionId, n))}</li>)}
      </ol>
      <h4 className="hdesk-guide-sub">{t("hdGuideTraps")}</h4>
      <ul>
        {range(book.traps).map((n) => <li key={n}>{t(playbookTrapKey(missionId, n))}</li>)}
      </ul>
    </div>
  );
}
