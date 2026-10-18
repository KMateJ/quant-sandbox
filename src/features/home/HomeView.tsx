import { useI18n } from "../../i18n";
import HomeHero from "./HomeHero";
import HomeCatalogue from "./HomeCatalogue";
import HomeRoadmap from "./HomeRoadmap";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="view-main home-view">
      <HomeHero />

      <HomeCatalogue />

      <HomeRoadmap />

      <footer className="home-footnote">
        <strong>{t("homeTitle")}</strong> {t("homeIntro")} {t("homeBody")}
      </footer>
    </div>
  );
}
