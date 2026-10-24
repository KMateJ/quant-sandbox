import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList, useProgress } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { RETIREMENT_DEMO_MISSION } from "../demo/demo.script";
import { RETIREMENT_MISSIONS, retirementMissionById } from "../engine/missions.data";
import { deskRules, setupRows } from "../missionSetup";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../retirementCopy";
import { amount } from "../retirementFormat";
import { RETIREMENT_PROGRESS } from "../retirementProgress";
import type { RetirementDeskModel } from "../useRetirementDesk";

const title = (heading: string) => heading.replace(/^T\d · /, "");

/// Mission list with saved status (best = total spent), the selected mission's briefing and the desk rules.
export default function RetirementMissionsScreen({ desk }: { desk: RetirementDeskModel }) {
  const { t } = useI18n();
  const k = (key: string, vars?: Record<string, string | number>) => t(key as TranslationKey, vars);
  const progress = useProgress(RETIREMENT_PROGRESS);
  const [selected, setSelected] = useState(desk.mission.id);
  const mission = retirementMissionById(selected);
  const items = RETIREMENT_MISSIONS.map((m) => {
    const p = progress[m.id];
    return {
      id: m.id,
      title: title(t(missionKeys(m.id).title)),
      tagline: k(`retrMs_${m.id}_tagline`),
      done: !!p?.completed,
      best: p?.best != null ? amount(p.best) : undefined,
    };
  });
  const start = () => (selected === desk.mission.id ? desk.restart() : desk.selectMission(selected));
  const objectives = mission.objectives.map((def) => objectiveView({ def, status: "onTrack", value: 0 }, k, mission.years).label);

  return (
    <div className="gdesk-missions">
      <div className="gdesk-missions-main">
        <MissionList items={items} selectedId={selected} onSelect={setSelected} />
        <MissionBriefing
          id={mission.id}
          title={title(t(missionKeys(mission.id).title))}
          brief={t(missionKeys(mission.id).brief)}
          setup={setupRows(mission, t)}
          objectives={objectives}
          onStart={start}
          onDemo={selected === RETIREMENT_DEMO_MISSION ? desk.startDemo : undefined}
        />
      </div>
      <DeskRules rules={deskRules(t)} />
    </div>
  );
}
