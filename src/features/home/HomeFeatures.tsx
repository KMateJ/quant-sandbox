import { useState } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "../../i18n";
import { FEATURE_INTERVAL_MS, HOME_FEATURES } from "./home.features";
import { categoryNumber } from "./home.model";
import { useRotation } from "./useRotation";

/// Rotating showcase of the richest screens: a list of features beside a large screenshot.
export default function HomeFeatures() {
  const { t } = useI18n();
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useRotation(HOME_FEATURES.length, FEATURE_INTERVAL_MS, paused);
  const current = HOME_FEATURES[active];

  return (
    <section
      className="home-features"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <header className="home-section-head">
        <div>
          <p className="home-eyebrow">{t("homeFeaturesEyebrow")}</p>
          <h2 className="home-h2">{t("homeFeaturesTitle")}</h2>
        </div>
      </header>
      <div className="home-features-grid ruled-grid">
        <ol className="home-features-list" role="tablist">
          {HOME_FEATURES.map((f, i) => (
            <li key={f.id}>
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                className={`home-feature${i === active ? " is-active" : ""}`}
                onClick={() => setActive(i)}
              >
                <span className="home-category-num">{categoryNumber(i)}</span>
                <span className="home-feature-text">
                  <span className="home-feature-name">{t(`homeFeature_${f.id}_title`)}</span>
                  <span className="home-feature-body">{t(`homeFeature_${f.id}_body`)}</span>
                </span>
                {i === active && !paused && (
                  <span className="home-feature-timer" style={{ animationDuration: `${FEATURE_INTERVAL_MS}ms` }} />
                )}
              </button>
            </li>
          ))}
        </ol>
        <Link to={current.path} className="home-feature-shot" role="tabpanel">
          <img key={current.id} src={current.image} alt={t(`homeFeature_${current.id}_title`)} loading="lazy" />
          <span className="home-feature-open">{t("homeFeatureOpen")} →</span>
        </Link>
      </div>
    </section>
  );
}
