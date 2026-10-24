import { GuideAccordion, GuideList, GuidePanels, GuidePlaybook, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { RETIREMENT_MISSIONS } from "../engine/missions.data";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../retirementCopy";
import type { RetirementDeskModel } from "../useRetirementDesk";
import { GUIDE_KEYS, GUIDE_MISTAKES, GUIDE_PANELS, GUIDE_TERMS, PLAYBOOKS } from "./guide.data";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Guide tab: this mission's playbook, the other missions, panels with "Show me", keys, mistakes and terms.
export default function RetirementGuide({ desk, help }: { desk: RetirementDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const id = desk.mission.id;
  const k = (key: string) => t(key as TranslationKey);
  const book = PLAYBOOKS[id];
  const sections = [
    {
      id: "mission",
      title: t("gkGuideThisMission", { id }),
      body: (
        <GuidePlaybook
          brief={t(missionKeys(id).brief)}
          objectives={desk.objectives.map((r) => objectiveView(r, k, desk.mission.years))}
          steps={range(book.steps).map((i) => k(`retrGdPlay_${id}_step${i}`))}
          traps={range(book.traps).map((i) => k(`retrGdPlay_${id}_trap${i}`))}
        />
      ),
    },
    {
      id: "other",
      title: t("gkGuideOtherMissions"),
      body: (
        <GuideList
          items={RETIREMENT_MISSIONS.filter((m) => m.id !== id).map((m) => ({
            term: t(missionKeys(m.id).title),
            text: k(`retrMs_${m.id}_tagline`),
          }))}
        />
      ),
    },
    {
      id: "panels",
      title: t("gkGuidePanels"),
      body: <GuidePanels panels={GUIDE_PANELS.map((a) => ({ anchor: a, text: k(`retrGdPanel_${a}`) }))} onPoint={help.point} />,
    },
    { id: "keys", title: t("gkGuideKeys"), body: <GuideList items={GUIDE_KEYS.map((c) => ({ term: c, text: k(`retrGdKey_${c}`) }))} /> },
    {
      id: "mistakes",
      title: t("gkGuideMistakes"),
      body: <GuideList items={range(GUIDE_MISTAKES).map((i) => ({ term: String(i), text: k(`retrGdMistake${i}`) }))} />,
    },
    {
      id: "terms",
      title: t("gkGuideTerms"),
      body: <GuideList items={GUIDE_TERMS.map((x) => ({ term: k(`retrGdTerm_${x}`), text: k(`retrGdTermText_${x}`) }))} />,
    },
  ];
  return <GuideAccordion sections={sections} />;
}
