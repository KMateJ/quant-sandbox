import { useState } from "react";
import { MISSIONS } from "../engine/missions.data";
import type { HedgingDeskModel } from "../useHedgingDesk";
import { useDeskProgress } from "../useDeskProgress";
import DeskRules from "./missions/DeskRules";
import MissionBriefing from "./missions/MissionBriefing";
import MissionList from "./missions/MissionList";

/// Mission picker: list with unlock status, briefing for the selected mission, desk rules.
export default function MissionsScreen({ desk }: { desk: HedgingDeskModel }) {
  const progress = useDeskProgress();
  const [selectedId, setSelectedId] = useState(desk.url.m);
  const selected = MISSIONS.find((m) => m.id === selectedId) ?? MISSIONS[0];
  return (
    <div className="hdesk-missions">
      <div className="hdesk-missions-main">
        <MissionList selectedId={selected.id} progress={progress} onSelect={setSelectedId} />
        <MissionBriefing mission={selected} onStart={desk.selectMission} onDemo={desk.startDemo} />
      </div>
      <DeskRules />
    </div>
  );
}
