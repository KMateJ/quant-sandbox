import { useI18n } from "../../i18n";
import HomeHero from "./HomeHero";
import HomeNews from "./HomeNews";
import HomeStats from "./HomeStats";
import HomeFeatures from "./HomeFeatures";
import HomeLabs from "./HomeLabs";
import HomeTracks from "./HomeTracks";
import HomeRoadmap from "./HomeRoadmap";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="view-main home-view">
      <HomeHero />
      <HomeNews />
      <HomeStats />
      <HomeFeatures />
      <HomeLabs />
      <HomeTracks />
      <HomeRoadmap />
      <footer className="home-footnote">
        <strong>{t("homeTitle")}</strong> {t("homeIntro")} {t("homeBody")}
      </footer>
    </div>
  );
}
