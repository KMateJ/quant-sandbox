import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { DEMO_MISSION } from "../demo/demo.config";
import { MISSIONS } from "../engine/missions.data";
import { missionBriefKey, missionTitleKey, objectiveText } from "../missionCopy";
import { setupRows } from "../missionSetup";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { useDeskProgress } from "../useDeskProgress";
import { missionItems, RULES } from "./missions/missionViews";
import { useSetupText } from "./missions/useSetupText";

/// Mission picker: list with completion status, briefing for the selected mission, desk rules.
export default function MissionsScreen({ desk }: { desk: HedgingDeskModel }) {
  const { t } = useI18n();
  const progress = useDeskProgress();
  const setupText = useSetupText();
  const [selectedId, setSelectedId] = useState(desk.url.m);
  const selected = MISSIONS.find((m) => m.id === selectedId) ?? MISSIONS[0];
  const setup = [
    ...setupRows(selected).map(setupText),
    { label: t("hdMsInstruments"), value: t(selected.instruments === "stock" ? "hdMsInstrumentsStock" : "hdMsInstrumentsAll") },
  ];
  return (
    <div className="gdesk-missions">
      <div className="gdesk-missions-main">
        <MissionList items={missionItems(t, progress)} selectedId={selected.id} onSelect={setSelectedId} />
        <MissionBriefing
          id={selected.id}
          title={t(missionTitleKey(selected.id))}
          brief={t(missionBriefKey(selected.id))}
          setup={setup}
          objectives={selected.objectives.map((o) => objectiveText(t, o, selected.band))}
          onStart={() => desk.selectMission(selected.id)}
          onDemo={selected.id === DEMO_MISSION ? desk.startDemo : undefined}
        />
      </div>
      <DeskRules rules={RULES.map(([title, body]) => ({ title: t(title), body: t(body) }))} />
    </div>
  );
}
