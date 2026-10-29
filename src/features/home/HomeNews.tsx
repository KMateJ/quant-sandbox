import { useI18n } from "../../i18n";
import { NEW_MODULES } from "./home.data";
import { labDescKey } from "./home.model";
import { MODULE_VIZ } from "./home.viz";
import HomeLabTile from "./HomeLabTile";

/// The newest modules from the registry's `added` dates, right under the hero.
export default function HomeNews() {
  const { t, language } = useI18n();
  const date = new Intl.DateTimeFormat(language, { month: "short", day: "numeric" });
  if (!NEW_MODULES.length) return null;

  return (
    <section className="home-news">
      <header className="home-section-head">
        <div>
          <p className="home-eyebrow">{t("homeNewEyebrow")}</p>
          <h2 className="home-h2">{t("homeNewTitle")}</h2>
        </div>
      </header>
      <div className="home-news-grid">
        {NEW_MODULES.map((m) => (
          <HomeLabTile
            key={m.id}
            code={date.format(new Date(`${m.added}T12:00:00Z`))}
            to={m.path}
            name={t(m.navKey)}
            desc={t(labDescKey(m.id))}
            viz={MODULE_VIZ[m.id]}
            status={m.status}
          />
        ))}
      </div>
    </section>
  );
}
