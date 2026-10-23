import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { START_LESSON } from "./home.data";
import HomeHeroFigure from "./HomeHeroFigure";

/// Landing hero: headline, lede, two calls to action and the fan figure.
export default function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="home-hero ruled-grid">
      <div className="home-hero-text">
        <p className="home-eyebrow">{t("homeEyebrow")}</p>
        <h1 className="home-hero-title">
          {t("heroTitleLead")} <em>{t("heroTitleAccent")}</em>.
        </h1>
        <p className="home-hero-lede">{t("heroLede")}</p>
        <div className="home-cta">
          <Link to={START_LESSON.path} className="home-btn home-btn--primary">{t("homeCtaBegin")}</Link>
          <a href="#labs" className="home-btn">{t("homeCtaLabs")}</a>
        </div>
      </div>
      <HomeHeroFigure />
    </section>
  );
}
