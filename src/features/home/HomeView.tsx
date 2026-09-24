import { NavLink } from "react-router-dom";
import type { ReactNode } from "react";
import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";

type Teaser = {
  to: string;
  accent: string;
  titleKey: Parameters<ReturnType<typeof useI18n>["t"]>[0];
  descKey: Parameters<ReturnType<typeof useI18n>["t"]>[0];
  icon: ReactNode;
  preview: ReactNode;
};

const teasers: Teaser[] = [
  {
    to: "/guide",
    accent: "#a855f7",
    titleKey: "teaserGuideTitle",
    descKey: "teaserGuideDesc",
    icon: (
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM20 18v3H6.5A2.5 2.5 0 0 1 4 18.5" />
    ),
    preview: (
      <g>
        <rect x="30" y="14" width="60" height="42" rx="4" className="tp-soft" />
        <path d="M60 16v40" className="tp-line" />
        <path d="M37 25h16M37 32h16M37 39h11" className="tp-line" />
        <path d="M67 25h16M67 32h16M67 39h11" className="tp-line" />
      </g>
    ),
  },
  {
    to: "/payoff",
    accent: "#22c55e",
    titleKey: "teaserPayoffTitle",
    descKey: "teaserPayoffDesc",
    icon: <path d="M3 20h18M6 20V4l6 8 3-4 3 5v7" />,
    preview: (
      <g>
        <path d="M12 46h96" className="tp-axis" />
        <path d="M60 10v46" className="tp-axis" />
        <path d="M14 34h46l40-26" className="tp-fill-line" />
        <path d="M14 34h46l40-26V56H14z" className="tp-fill" />
      </g>
    ),
  },
  {
    to: "/binomial",
    accent: "#3b82f6",
    titleKey: "teaserBinomialTitle",
    descKey: "teaserBinomialDesc",
    icon: (
      <path d="M6 6h.01M6 18h.01M18 12h.01M6 6l12 6M6 18l12-6M6 6v12" />
    ),
    preview: (
      <g>
        <path
          d="M22 33 54 18M22 33 54 48M54 18 88 10M54 18 88 33M54 48 88 33M54 48 88 55"
          className="tp-line"
        />
        <circle cx="22" cy="33" r="5" className="tp-node" />
        <circle cx="54" cy="18" r="5" className="tp-node" />
        <circle cx="54" cy="48" r="5" className="tp-node" />
        <circle cx="88" cy="10" r="5" className="tp-node" />
        <circle cx="88" cy="33" r="5" className="tp-node" />
        <circle cx="88" cy="55" r="5" className="tp-node" />
      </g>
    ),
  },
  {
    to: "/diffusion",
    accent: "#06b6d4",
    titleKey: "teaserDiffusionTitle",
    descKey: "teaserDiffusionDesc",
    icon: (
      <path d="M3 8c2.5-3 4.5-3 7 0s4.5 3 7 0M3 14c2.5-3 4.5-3 7 0s4.5 3 7 0" />
    ),
    preview: (
      <g>
        <path d="M12 50h96" className="tp-axis" />
        <path d="M12 50C44 50 52 12 60 12s16 38 48 38" className="tp-line" />
        <path
          d="M12 50C40 50 48 24 60 24s20 26 48 26"
          className="tp-line tp-line-soft"
        />
        <path
          d="M12 50C36 50 46 34 60 34s24 16 48 16"
          className="tp-line tp-line-softer"
        />
      </g>
    ),
  },
  {
    to: "/black-scholes",
    accent: "#f59e0b",
    titleKey: "teaserBlackScholesTitle",
    descKey: "teaserBlackScholesDesc",
    icon: <path d="M3 19c4 0 5-13 9-13s5 13 9 13" />,
    preview: (
      <g>
        <path d="M12 50h96" className="tp-axis" />
        <path
          d="M64 50C74 50 76 14 84 14s10 36 20 36z"
          className="tp-fill"
        />
        <path d="M12 50C40 50 48 14 60 14s20 36 48 36" className="tp-fill-line" />
      </g>
    ),
  },
  {
    to: "/heston",
    accent: "#ec4899",
    titleKey: "teaserHestonTitle",
    descKey: "teaserHestonDesc",
    icon: (
      <path d="M3 15c1.5 0 1.5-6 3-6s1.5 8 3 8 1.5-10 3-10 1.5 6 3 6 1.5-3 3-3" />
    ),
    preview: (
      <g>
        <path
          d="M12 34c8-6 14 8 22 4s14-14 22-10 14 16 22 8 14-6 18-9"
          className="tp-line"
        />
        <path
          d="M12 42c8 4 14-10 22-4s14 12 22 4 14-12 22-6 14 10 18 6"
          className="tp-line tp-line-soft"
        />
        <path
          d="M12 26c8 2 14 6 22 2s14-8 22-2 14 10 22 2 14-4 18-1"
          className="tp-line tp-line-softer"
        />
      </g>
    ),
  },
];

export function HomeView() {
  const { language, setLanguage, t } = useI18n();
  const { theme, setTheme } = useTheme();

  return (
    <div className="view-main">
      <SectionCard title={t("homeTitle")}>
        <div className="text-block">
          <p>{t("homeIntro")}</p>
          <p>{t("homeBody")}</p>
        </div>
      </SectionCard>

      <SectionCard title={t("exploreTitle")} subtitle={t("exploreSubtitle")}>
        <div className="teaser-grid">
          {teasers.map((teaser) => (
            <NavLink
              key={teaser.to}
              to={teaser.to}
              className="teaser-card"
              style={{ ["--teaser-accent" as string]: teaser.accent }}
            >
              <span className="teaser-preview" aria-hidden="true">
                <svg viewBox="0 0 120 64" preserveAspectRatio="xMidYMid meet">
                  {teaser.preview}
                </svg>
                <span className="teaser-icon">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {teaser.icon}
                  </svg>
                </span>
              </span>
              <span className="teaser-title">{t(teaser.titleKey)}</span>
              <span className="teaser-desc">{t(teaser.descKey)}</span>
              <span className="teaser-cta">
                {t("exploreCta")}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </NavLink>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title={t("settingsTitle")}
        subtitle={""}
      >
        <div className="settings-stack">
          <div className="settings-row">
            <div className="settings-label">{t("languageLabel")}</div>

            <div className="metric-switch settings-actions">
              <button
                type="button"
                className={
                  language === "hu" ? "metric-button active" : "metric-button"
                }
                onClick={() => setLanguage("hu")}
              >
                {t("languageHu")}
              </button>

              <button
                type="button"
                className={
                  language === "en" ? "metric-button active" : "metric-button"
                }
                onClick={() => setLanguage("en")}
              >
                {t("languageEn")}
              </button>
            </div>
          </div>

          <div className="settings-row">
            <div className="settings-label">{t("themeLabel")}</div>

            <div className="metric-switch settings-actions">
              <button
                type="button"
                className={
                  theme === "dark" ? "metric-button active" : "metric-button"
                }
                onClick={() => setTheme("dark")}
              >
                {t("themeDark")}
              </button>

              <button
                type="button"
                className={
                  theme === "light" ? "metric-button active" : "metric-button"
                }
                onClick={() => setTheme("light")}
              >
                {t("themeLight")}
              </button>

              <button
                type="button"
                className={
                  theme === "system" ? "metric-button active" : "metric-button"
                }
                onClick={() => setTheme("system")}
              >
                {t("themeSystem")}
              </button>
            </div>
          </div>
        </div>
      </SectionCard>
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
    </div>
  );
}