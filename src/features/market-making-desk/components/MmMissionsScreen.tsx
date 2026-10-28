import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList, useProgress } from "../../../components/game";
import { signedMoney } from "../../../components/game/gameFormat";
import { useI18n, type TranslationKey } from "../../../i18n";
import { MM_DEMO_MISSION } from "../demo/demo.script";
import { MM_MISSIONS, mmMissionById } from "../engine/missions.data";
import { missionSetup, RULE_KEYS } from "../missionSetup";
import { missionKeys } from "../mmCopy";
import { MM_PROGRESS } from "../mmProgress";
import { objectiveView } from "../objectiveViews";
import type { MmDeskModel } from "../useMarketMakingDesk";

/// Mission list with saved progress, the selected mission's briefing and the desk rules.
export default function MmMissionsScreen({ desk }: { desk: MmDeskModel }) {
  const { t } = useI18n();
  const progress = useProgress(MM_PROGRESS);
  const [selected, setSelected] = useState(desk.mission.id);
  const m = mmMissionById(selected) ?? desk.mission;
  const items = MM_MISSIONS.map((x) => {
    const p = progress[x.id];
    return {
      id: x.id,
      title: t(missionKeys(x.id).title),
      tagline: t(`mmdMsTagline_${x.id}` as TranslationKey),
      tags: t(`mmdMsTag_${x.id}` as TranslationKey),
      done: Boolean(p?.completed),
      best: p?.best != null ? signedMoney(p.best) : undefined,
    };
  });
  const objectives = m.objectives.map((def) => objectiveView({ def, status: "onTrack", value: 0 }, t).label);
  const start = () => {
    if (m.id === desk.mission.id && !desk.demo) desk.restart();
    else desk.selectMission(m.id);
  };

  return (
    <div className="gdesk-missions">
      <MissionList items={items} selectedId={selected} onSelect={setSelected} />
      <div className="gdesk-missions-main">
        <MissionBriefing id={m.id} title={t(missionKeys(m.id).title)} brief={t(missionKeys(m.id).brief)} setup={missionSetup(m, t)}
          objectives={objectives} onStart={start} onDemo={m.id === MM_DEMO_MISSION ? desk.startDemo : undefined} />
        <DeskRules rules={RULE_KEYS.map((r) => ({ title: t(r.title), body: t(r.body) }))} />
      </div>
    </div>
  );
}
