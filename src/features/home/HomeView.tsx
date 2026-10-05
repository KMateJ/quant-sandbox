import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";
import HomeHero from "./HomeHero";
import HomeCategories from "./HomeCategories";
import HomeModules from "./HomeModules";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="view-main">
      <HomeHero />

      <HomeCategories />

      <HomeModules />

      <SectionCard
        title={t("devTitle")}
        subtitle={""}
      >
        <div className="dev-stack">
          <div className="dev-card dev-card-success">
            <div className="dev-title">{t("devRecent")}</div>
            <ul className="dev-list">
              <li>{t("devItemUrlParams")}</li>
              <li>{t("devItemLanguage")}</li>
              <li>{t("devItemHeston")}</li>
            </ul>
          </div>

          <div className="dev-card dev-card-info">
            <div className="dev-title">{t("devUpcoming")}</div>
            <ul className="dev-list">
              <li>{t("devItemGuides")}</li>
              <li>{t("devItemMonteCarlo")}</li>
              <li>{t("devItemPDE")}</li>
            </ul>
          </div>

          <div className="dev-card dev-card-neutral">
            <div className="dev-title">{t("devFuture")}</div>
            <ul className="dev-list">
              <li>{t("devItemMacro")}</li>
              <li>{t("devItemMicro")}</li>
              <li>{t("devItemAnalysis")}</li>
              <li>{t("devItemLinearAlgebra")}</li>
              <li>{t("devItemProbability")}</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      <footer className="home-footnote">
        <strong>{t("homeTitle")}</strong> {t("homeIntro")} {t("homeBody")}
      </footer>
    </div>
  );
}