import { MissionPanel } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { missionBriefKey, missionTitleKey, objectiveViews } from "../missionCopy";
import type { AlmDeskModel } from "../useAlmDesk";

/// Mission title, brief, year clock and live objectives.
export default function AlmMissionCard({ desk }: { desk: AlmDeskModel }) {
  const { t } = useI18n();
  const { mission, cfg, state } = desk;
  const n = state.game.round;
  return (
    <MissionPanel
      id="almd-mission"
      title={t("almdMissionTitle")}
      heading={t(missionTitleKey(mission.id))}
      brief={t(missionBriefKey(mission.id))}
      clockLabel={t("almdClock", { n, years: cfg.years, left: cfg.years - n })}
      progress={n / cfg.years}
      objectives={objectiveViews(desk.objectives, t)}
    />
  );
}
