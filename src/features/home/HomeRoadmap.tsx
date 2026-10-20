import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";

/// Lightweight roadmap: recently shipped, coming next, and planned areas.
export default function HomeRoadmap() {
  const { t } = useI18n();

  const groups = [
    { tone: "success", title: t("devRecent"), items: [t("devItemFixedIncomeLabs"), t("devItemGuides"), t("devItemLabs"), t("devItemSharing")] },
    { tone: "info", title: t("devUpcoming"), items: [t("devItemSwapLab"), t("devItemCallableLab"), t("devItemLabUpgrades"), t("devItemGuideChecks")] },
    { tone: "neutral", title: t("devFuture"), items: [t("devItemCredit"), t("devItemPDE"), t("devItemMacro"), t("devItemMicro"), t("devItemAnalysis"), t("devItemLinearAlgebra"), t("devItemProbability")] },
  ];

  return (
    <SectionCard title={t("devTitle")} subtitle={t("devSubtitle")}>
      <div className="dev-stack">
        {groups.map((g) => (
          <div key={g.title} className={`dev-card dev-card-${g.tone}`}>
            <div className="dev-title">{g.title}</div>
            <ul className="dev-list">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
