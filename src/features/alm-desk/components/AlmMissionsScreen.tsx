import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList, signedMoney, useProgress } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { ALM_PROGRESS } from "../almProgress";
import { ALM_DEMO_MISSION } from "../demo/demo.script";
import { ALM_MISSIONS, almMissionById } from "../engine/missions.data";
import { missionBriefKey, missionTitleKey, objectiveText } from "../missionCopy";
import { setupRows } from "../missionSetup";
import type { AlmDeskModel } from "../useAlmDesk";

const RULES = [1, 2, 3, 4];

/// Mission list with saved status, the briefing of the selected mission and the desk rules.
export default function AlmMissionsScreen({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const progress = useProgress(ALM_PROGRESS);
  const [selected, setSelected] = useState(desk.mission.id);
  const mission = almMissionById(selected);
  const items = ALM_MISSIONS.map((m) => {
    const p = progress[m.id];
    return {
      id: m.id,
      title: t(missionTitleKey(m.id)).replace(/^A\d · /, ""),
      tagline: t(`almdMission${m.id}Tagline` as TranslationKey),
      done: !!p?.completed,
      best: p?.best !== null && p?.best !== undefined ? signedMoney(p.best) : undefined,
    };
  });
  const start = () => (selected === desk.mission.id ? desk.restart() : desk.selectMission(selected));
  const canDemo = selected === ALM_DEMO_MISSION && desk.demoSteps.length > 0;

  return (
    <div className="gdesk-missions">
      <div className="gdesk-missions-main">
        <MissionList items={items} selectedId={selected} onSelect={setSelected} />
        <MissionBriefing
          id={mission.id}
          title={t(missionTitleKey(mission.id)).replace(/^A\d · /, "")}
          brief={t(missionBriefKey(mission.id))}
          setup={setupRows(mission, t)}
          objectives={mission.objectives.map((o) => objectiveText(o, 0, t).label)}
          onStart={start}
          onDemo={canDemo ? desk.startDemo : undefined}
        />
      </div>
      <DeskRules rules={RULES.map((n) => ({ title: t(`almdRule${n}Title` as TranslationKey), body: t(`almdRule${n}Body` as TranslationKey) }))} />
    </div>
  );
}
