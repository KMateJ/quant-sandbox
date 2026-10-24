import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList, signedMoney, useProgress } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { RATES_DEMO_MISSION } from "../demo/demo.script";
import { RATES_MISSIONS, ratesMissionById } from "../engine/missions.data";
import { deskRules, setupRows } from "../missionSetup";
import { missionText, objectiveLabel } from "../ratesCopy";
import { RATES_PROGRESS } from "../ratesProgress";
import type { RatesDeskModel } from "../useRatesDesk";

const title = (heading: string) => heading.replace(/^R\d · /, "");

/// Mission list with saved status, the selected mission's briefing and the desk rules.
export default function RatesMissionsScreen({ desk }: { desk: RatesDeskModel }) {
  const { t } = useI18n();
  const progress = useProgress(RATES_PROGRESS);
  const [selected, setSelected] = useState(desk.mission.id);
  const mission = ratesMissionById(selected);
  const items = RATES_MISSIONS.map((m) => {
    const p = progress[m.id];
    return {
      id: m.id,
      title: title(missionText(m.id, t).heading),
      tagline: t(`ratdMs_${m.id}Tagline` as TranslationKey),
      done: !!p?.completed,
      best: p?.best != null ? signedMoney(p.best) : undefined,
    };
  });
  const start = () => (selected === desk.mission.id ? desk.restart() : desk.selectMission(selected));
  const canDemo = selected === RATES_DEMO_MISSION && desk.demoSteps.length > 0;

  return (
    <div className="gdesk-missions">
      <div className="gdesk-missions-main">
        <MissionList items={items} selectedId={selected} onSelect={setSelected} />
        <MissionBriefing
          id={mission.id}
          title={title(missionText(mission.id, t).heading)}
          brief={missionText(mission.id, t).brief}
          setup={setupRows(mission, t)}
          objectives={mission.objectives.map((o) => objectiveLabel(o, t))}
          onStart={start}
          onDemo={canDemo ? desk.startDemo : undefined}
        />
      </div>
      <DeskRules rules={deskRules(t)} />
    </div>
  );
}
