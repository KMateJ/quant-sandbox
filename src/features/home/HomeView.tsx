import { useI18n } from "../../i18n";
import HomeHero from "./HomeHero";
import HomeStats from "./HomeStats";
import HomeLabs from "./HomeLabs";
import HomeTracks from "./HomeTracks";
import HomeRoadmap from "./HomeRoadmap";

export function HomeView() {
  const { t } = useI18n();

  return (
    <div className="view-main home-view">
      <HomeHero />
      <HomeStats />
      <HomeLabs />
      <HomeTracks />
      <HomeRoadmap />
      <footer className="home-footnote">
        <strong>{t("homeTitle")}</strong> {t("homeIntro")} {t("homeBody")}
      </footer>
    </div>
  );
}
