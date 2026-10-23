import Panel from "../../../../components/layout/Panel";
import { useI18n } from "../../../../i18n";
import type { MissionDef } from "../../engine/desk.types";
import { missionBriefKey, missionTitleKey, objectiveText } from "../../missionCopy";
import { setupRows } from "../../missionSetup";
import { useSetupText } from "./useSetupText";
import { DEMO_MISSION } from "../../demo/demo.config";

type Props = { mission: MissionDef; onStart: (id: string) => void; onDemo?: () => void };

/// Briefing for one mission: setup table from data, numbered objectives, instruments, start button.
export default function MissionBriefing({ mission, onStart, onDemo }: Props) {
  const { t } = useI18n();
  const setupText = useSetupText();
  return (
    <Panel title={t("hdMsBriefingTitle")} className="hdesk-panel">
      <div className="hdesk-brief">
        <h2 className="hdesk-brief-title">
          <span className="hdesk-mlist-id">{mission.id}</span> {t(missionTitleKey(mission.id))}
        </h2>
        <p className="hdesk-brief-text">{t(missionBriefKey(mission.id))}</p>

        <h3 className="hdesk-label">{t("hdMsSetup")}</h3>
        <dl className="hdesk-brief-setup">
          {setupRows(mission).map((row, i) => {
            const { label, value } = setupText(row);
            return (
              <div key={i}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            );
          })}
        </dl>

        <h3 className="hdesk-label">{t("hdMsObjectives")}</h3>
        <ol className="hdesk-brief-objectives">
          {mission.objectives.map((o, i) => (
            <li key={i}>{objectiveText(t, o, mission.band)}</li>
          ))}
        </ol>

        <h3 className="hdesk-label">{t("hdMsInstruments")}</h3>
        <p className="hdesk-brief-text">
          {t(mission.instruments === "stock" ? "hdMsInstrumentsStock" : "hdMsInstrumentsAll")}
        </p>

        <button type="button" className="hdesk-brief-start" onClick={() => onStart(mission.id)}>
          {t("hdMsStart", { id: mission.id })}
        </button>
        {mission.id === DEMO_MISSION && onDemo && (
          <button type="button" className="hdesk-btn hdesk-brief-demo" onClick={onDemo}>
            {t("hdDemoWatchFirst")}
          </button>
        )}
      </div>
    </Panel>
  );
}
