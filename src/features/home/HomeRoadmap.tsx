import { useI18n } from "../../i18n";

/// Roadmap as a ruled three-column list: recently shipped, coming next, planned areas.
export default function HomeRoadmap() {
  const { t } = useI18n();

  const groups = [
    { title: t("devRecent"), items: [t("devItemSwapLab"), t("devItemDesks"), t("devItemSandbox"), t("devItemChallenges"), t("devItemGuideChecks"), t("devItemGuidesUi")] },
    { title: t("devUpcoming"), items: [t("devItemCallableLab"), t("devItemLabUpgrades"), t("devItemDeskSandbox"), t("devItemStudioChapters")] },
    { title: t("devFuture"), items: [t("devItemCredit"), t("devItemPDE"), t("devItemMacro"), t("devItemMicro"), t("devItemAnalysis"), t("devItemLinearAlgebra"), t("devItemProbability")] },
  ];

  return (
    <section className="home-roadmap">
      <header className="home-section-head">
        <div>
          <p className="home-eyebrow">{t("devSubtitle")}</p>
          <h2 className="home-h2">{t("devTitle")}</h2>
        </div>
      </header>
      <div className="home-roadmap-grid ruled-grid">
        {groups.map((g) => (
          <div key={g.title} className="home-roadmap-col">
            <h3 className="home-roadmap-title">{g.title}</h3>
            <ul className="home-roadmap-list">
              {g.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
