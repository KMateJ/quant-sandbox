import { GuideAccordion, GuideList, GuidePanels, GuidePlaybook, type GuideSection as KitSection } from "../../../../components/game";
import { useI18n } from "../../../../i18n";
import type { HedgingDeskModel } from "../../useHedgingDesk";
import { MISSIONS } from "../../engine/missions.data";
import { GUIDE_KEYS, GUIDE_MISTAKES, GUIDE_PANELS, GUIDE_PLAYBOOKS, GUIDE_SECTIONS, GUIDE_TERMS } from "../../help/guide.data";
import {
  keyKey, mistakeBodyKey, mistakeTitleKey, panelKey, playbookStepKey, playbookTrapKey, termDefKey, termKey,
} from "../../help/guideCopy";
import { missionBriefKey, missionTitleKey, objectiveViews } from "../../missionCopy";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Guide tab: playbook of the current mission, panel guide, keys, mistakes, glossary, other missions.
export default function GuideTab({ desk, point }: { desk: HedgingDeskModel; point: (anchor: string) => void }) {
  const { t } = useI18n();
  const id = desk.mission.id;
  const playbook = (missionId: string, live: boolean) => {
    const book = GUIDE_PLAYBOOKS[missionId];
    return (
      <GuidePlaybook
        brief={t(missionBriefKey(missionId))}
        objectives={live ? objectiveViews(t, desk.objectives, desk.mission.band) : undefined}
        steps={range(book.steps).map((n) => t(playbookStepKey(missionId, n)))}
        traps={range(book.traps).map((n) => t(playbookTrapKey(missionId, n)))}
      />
    );
  };

  const heads = {
    mission: t("gkGuideThisMission", { id }),
    panels: t("gkGuidePanels"),
    keys: t("gkGuideKeys"),
    mistakes: t("gkGuideMistakes"),
    terms: t("gkGuideTerms"),
    others: t("gkGuideOtherMissions"),
  };
  const bodies = {
    mission: playbook(id, true),
    panels: <GuidePanels panels={GUIDE_PANELS.map((a) => ({ anchor: a, text: t(panelKey(a)) }))} onPoint={point} />,
    keys: <GuideList items={GUIDE_KEYS.map((c) => ({ term: c, text: t(keyKey(c)) }))} />,
    mistakes: <GuideList items={range(GUIDE_MISTAKES).map((n) => ({ term: t(mistakeTitleKey(n)), text: t(mistakeBodyKey(n)) }))} />,
    terms: <GuideList items={GUIDE_TERMS.map((x) => ({ term: t(termKey(x)), text: t(termDefKey(x)) }))} />,
    others: (
      <>
        {MISSIONS.filter((m) => m.id !== id).map((m) => (
          <section key={m.id}>
            <h4 className="gdesk-guide-sub">{t("hdGuideOtherTitle", { id: m.id, title: t(missionTitleKey(m.id)) })}</h4>
            {playbook(m.id, false)}
          </section>
        ))}
      </>
    ),
  };
  const sections: KitSection[] = GUIDE_SECTIONS.map((s) => ({ id: s, title: heads[s], body: bodies[s] }));
  return <GuideAccordion sections={sections} defaultOpen="mission" />;
}
