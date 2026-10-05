import type { ReactNode } from "react";
import { useI18n } from "../../i18n";
import type { TranslationKey } from "../../i18n";

type Pillar = {
  titleKey: TranslationKey;
  descKey: TranslationKey;
  icon: ReactNode;
};

const pillars: Pillar[] = [
  {
    titleKey: "pillarVisualizeTitle",
    descKey: "pillarVisualizeDesc",
    icon: (
      <>
        <path d="M4 20V4" opacity=".4" />
        <path d="M4 20h16" opacity=".4" />
        <path d="M7 16l4-5 3 3 5-7" />
      </>
    ),
  },
  {
    titleKey: "pillarIntuitionTitle",
    descKey: "pillarIntuitionDesc",
    icon: (
      <>
        <path d="M9 18h6" />
        <path d="M10 21h4" />
        <path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.2 1 2h6c0-.8.3-1.3 1-2A6 6 0 0 0 12 3z" />
      </>
    ),
  },
  {
    titleKey: "pillarInteractTitle",
    descKey: "pillarInteractDesc",
    icon: (
      <>
        <path d="M4 9h16" />
        <circle cx="9" cy="9" r="2.4" />
        <path d="M4 16h16" opacity=".5" />
        <circle cx="15" cy="16" r="2.4" />
      </>
    ),
  },
];

/// Landing hero: the teaching goal plus the three guiding pillars.
export default function HomeHero() {
  const { t } = useI18n();

  return (
    <section className="home-hero">
      <h1 className="home-hero-title">{t("heroTitle")}</h1>
      <p className="home-hero-lede">{t("heroLede")}</p>

      <div className="home-pillars">
        {pillars.map((p) => (
          <div key={p.titleKey} className="home-pillar">
            <span className="home-pillar-icon" aria-hidden="true">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {p.icon}
              </svg>
            </span>
            <span className="home-pillar-title">{t(p.titleKey)}</span>
            <span className="home-pillar-desc">{t(p.descKey)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
