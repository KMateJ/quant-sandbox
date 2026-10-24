import { GuideAccordion, GuideList, GuidePanels, GuidePlaybook, type GameHelp } from "../../../components/game";
import { useI18n } from "../../../i18n";
import { objectiveView } from "../objectiveViews";
import { missionKeys } from "../portfolioCopy";
import type { PortfolioDeskModel } from "../usePortfolioDesk";
import { GUIDE_KEYS, GUIDE_PANELS, GUIDE_TERMS, guideKeys } from "./guide.data";

/// Guide tab: this mission's playbook, the panels (with "Show me"), keys, common mistakes and terms.
export default function PortfolioGuide({ desk, help }: { desk: PortfolioDeskModel; help: GameHelp }) {
  const { t } = useI18n();
  const id = desk.mission.id;
  const sections = [
    {
      id: "mission",
      title: t("gkGuideThisMission"),
      body: (
        <GuidePlaybook brief={t(missionKeys(id).brief)} objectives={desk.objectives.map((r) => objectiveView(r, t))}
          steps={guideKeys.steps(id).map((k) => t(k))} traps={guideKeys.traps(id).map((k) => t(k))} />
      ),
    },
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
  ];
  return <GuideAccordion sections={sections} />;
}
