import { GuideAccordion, GuideList, GuidePanels, GuidePlaybook, type GameHelp } from "../../../components/game";
import { useI18n, type TranslationKey } from "../../../i18n";
import { RATES_MISSIONS } from "../engine/missions.data";
import { missionText, objectiveViews } from "../ratesCopy";
import type { RatesDeskModel } from "../useRatesDesk";
import { GUIDE_KEYS, GUIDE_MISTAKES, GUIDE_PANELS, GUIDE_TERMS, PLAYBOOKS } from "./guide.data";

const range = (n: number) => Array.from({ length: n }, (_, i) => i + 1);

/// Guide tab: this mission's playbook, the other missions, panels with "Show me", keys, mistakes and terms.
export default function RatesGuide({ desk, help }: { desk: RatesDeskModel; help: GameHelp }) {
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
          brief={missionText(id, t).brief}
          objectives={objectiveViews(desk, t)}
          steps={range(book.steps).map((i) => k(`ratdGdPlay_${id}_step${i}`))}
          traps={range(book.traps).map((i) => k(`ratdGdPlay_${id}_trap${i}`))}
        />
      ),
    },
    {
      id: "other",
      title: t("gkGuideOtherMissions"),
      body: (
        <GuideList
          items={RATES_MISSIONS.filter((m) => m.id !== id).map((m) => ({
            term: t("ratdGdOther", { id: m.id, title: missionText(m.id, t).heading }),
            text: k(`ratdGdPlay_${m.id}_step1`),
          }))}
        />
      ),
    },
    {
      id: "panels",
      title: t("gkGuidePanels"),
      body: <GuidePanels panels={GUIDE_PANELS.map((a) => ({ anchor: a, text: k(`ratdGdPanel_${a}`) }))} onPoint={help.point} />,
    },
    { id: "keys", title: t("gkGuideKeys"), body: <GuideList items={GUIDE_KEYS.map((c) => ({ term: c, text: k(`ratdGdKey_${c}`) }))} /> },
    {
      id: "mistakes",
      title: t("gkGuideMistakes"),
      body: <GuideList items={range(GUIDE_MISTAKES).map((i) => ({ term: String(i), text: k(`ratdGdMistake${i}`) }))} />,
    },
    {
      id: "terms",
      title: t("gkGuideTerms"),
      body: <GuideList items={GUIDE_TERMS.map((x) => ({ term: k(`ratdGdTerm_${x}`), text: k(`ratdGdTermText_${x}`) }))} />,
    },
  ];
  return <GuideAccordion sections={sections} />;
}
