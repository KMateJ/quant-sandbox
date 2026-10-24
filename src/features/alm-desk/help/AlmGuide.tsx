import { GuideAccordion, GuideList, GuidePanels, GuidePlaybook, type GameHelp, type GuideSection } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { ALM_MISSIONS } from "../engine/missions.data";
import { missionBriefKey, missionTitleKey, objectiveViews } from "../missionCopy";
import type { AlmDeskModel } from "../useAlmDesk";
import { GUIDE_KEYS, GUIDE_PANELS, GUIDE_TERMS, guideKeys } from "./guide.data";

/// Guide tab: this mission's playbook, panels with "Show me", keys, mistakes, terms and the other missions.
export default function AlmGuide({ desk, help }: { desk: AlmDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const id = desk.mission.id;
  const playbook = (mid: string, live: boolean) => (
    <GuidePlaybook
      brief={t(missionBriefKey(mid))}
      objectives={live ? objectiveViews(desk.objectives, t) : undefined}
      steps={guideKeys.steps(mid).map((k) => t(k))}
      traps={guideKeys.traps(mid).map((k) => t(k))}
    />
  );
  const sections: GuideSection[] = [
    { id: "mission", title: t("gkGuideThisMission", { id }), body: playbook(id, true) },
    {
      id: "panels",
      title: t("gkGuidePanels"),
      body: <GuidePanels panels={GUIDE_PANELS.map((a) => ({ anchor: a, text: t(guideKeys.panel(a)) }))} onPoint={help.point} />,
    },
    { id: "keys", title: t("gkGuideKeys"), body: <GuideList items={GUIDE_KEYS.map((k) => ({ term: k, text: t(guideKeys.key(k)) }))} /> },
    { id: "mistakes", title: t("gkGuideMistakes"), body: <GuideList items={guideKeys.mistakes().map((m) => ({ term: t(m.term), text: t(m.text) }))} /> },
    {
      id: "terms",
      title: t("gkGuideTerms"),
      body: <GuideList items={GUIDE_TERMS.map((x) => guideKeys.term(x)).map((k) => ({ term: t(k.term), text: t(k.text) }))} />,
    },
    {
      id: "others",
      title: t("gkGuideOtherMissions"),
      body: (
        <GuideAccordion
          sections={ALM_MISSIONS.filter((m) => m.id !== id).map((m) => ({ id: m.id, title: t(missionTitleKey(m.id)), body: playbook(m.id, false) }))}
          defaultOpen=""
        />
      ),
    },
  ];
  return <GuideAccordion sections={sections} />;
}
