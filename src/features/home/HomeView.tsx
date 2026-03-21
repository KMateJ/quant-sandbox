import SectionCard from "../../components/SectionCard";
import { useI18n } from "../../i18n";
import { useTheme } from "../../theme";

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

      <SectionCard
        title={t("settingsTitle")}
        subtitle={t("settingsSubtitle")}
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
    </div>
  );
}