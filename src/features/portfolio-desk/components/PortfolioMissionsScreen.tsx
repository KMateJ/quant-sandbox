import { useState } from "react";
import { DeskRules, MissionBriefing, MissionList, useProgress } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { PORTFOLIO_MISSIONS, portfolioMissionById } from "../engine/missions.data";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../portfolioCopy";
import { spct } from "../portfolioFormat";
import { PORTFOLIO_PROGRESS } from "../portfolioProgress";
import { missionSetup, RULE_KEYS } from "../missionSetup";
import { evaluatePortfolio } from "../engine/objectives.math";
import { startPortfolio } from "../engine/book.math";
import type { PortfolioDeskModel } from "../usePortfolioDesk";

/// Mission list with saved progress, the selected mission's briefing and the desk rules.
export default function PortfolioMissionsScreen({ desk }: { desk: PortfolioDeskModel }) {
  const { t } = useI18n();
  const progress = useProgress(PORTFOLIO_PROGRESS);
  const [selected, setSelected] = useState(desk.mission.id);
  const m = portfolioMissionById(selected);
  const items = PORTFOLIO_MISSIONS.map((x) => {
    const p = progress[x.id];
    return {
      id: x.id,
      title: t(missionKeys(x.id).title),
      tagline: t(`pmgrMsTagline_${x.id}` as TranslationKey),
      tags: t(x.stressStart === "random" ? "pmgrMsTagRandom" : "pmgrMsTagStress"),
      done: Boolean(p?.completed),
      best: p?.best != null ? spct(p.best) : undefined,
    };
  });
  const objectives = evaluatePortfolio(m, startPortfolio(m, 1)).map((r) => objectiveView(r, t).label);
  const start = () => {
    if (m.id === desk.mission.id) desk.restart();
    else desk.selectMission(m.id);
  };

  return (
    <div className="gdesk-missions">
      <MissionList items={items} selectedId={selected} onSelect={setSelected} />
      <div className="gdesk-missions-main">
        <MissionBriefing id={m.id} title={t(missionKeys(m.id).title)} brief={t(missionKeys(m.id).brief)} setup={missionSetup(m, t)}
          objectives={objectives} onStart={start} onDemo={m.id === "P1" ? desk.startDemo : undefined} />
        <DeskRules rules={RULE_KEYS.map((r) => ({ title: t(r.title), body: t(r.body) }))} />
      </div>
    </div>
  );
}
