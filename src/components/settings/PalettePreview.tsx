import { useI18n } from "../../i18n";

const PATHS = [
  "M8 120 C60 112 90 96 130 88 S210 60 292 50",
  "M8 120 C60 124 100 116 140 112 S220 104 292 96",
  "M8 120 C50 110 80 70 130 74 S220 30 292 22",
];

/// Live sample of the UI in the current tokens: type, buttons, input, ruled stats, a chart and a tile.
export default function PalettePreview() {
  const { t } = useI18n();

  return (
    <section className="palette-preview" aria-label={t("settingsPreview")}>
      <span className="settings-label">{t("settingsPreview")}</span>
      <div className="palette-preview-page">
        <p className="home-eyebrow">{t("settingsPreviewEyebrow")}</p>
        <h3 className="palette-preview-title">
          {t("heroTitleLead")} <em>{t("heroTitleAccent")}</em>.
        </h3>
        <p className="palette-preview-body">{t("settingsPreviewBody")}</p>
        <div className="palette-preview-actions">
          <span className="home-btn home-btn--primary">{t("homeCtaBegin")}</span>
          <span className="home-btn">{t("homeCtaLabs")}</span>
          <input className="palette-preview-input" defaultValue="σ = 0.30" aria-label={t("settingsPreviewInput")} />
        </div>

        <div className="ruled-grid palette-preview-stats">
          <div><b>24</b><span>{t("homeStatLabs")}</span></div>
          <div><b>55</b><span>{t("homeStatLessons")}</span></div>
          <div>
            <span className="home-eyebrow">{t("homeContinue")}</span>
            <span className="home-progress"><span className="home-progress-fill" style={{ width: "40%" }} /></span>
          </div>
        </div>

        <div className="palette-preview-split">
          <svg className="palette-preview-chart" viewBox="0 0 300 140" aria-hidden="true">
            {[30, 60, 90].map((y) => <line key={y} x1={8} x2={292} y1={y} y2={y} className="home-fan-grid" />)}
            <path d="M8 10 V130 H292" className="home-fan-axis" fill="none" />
            <path d={`${PATHS[2]} L292 130 L8 130 Z`} className="home-viz-area" />
            {PATHS.slice(0, 2).map((d) => <path key={d} d={d} fill="none" className="palette-preview-line" />)}
            <path d={PATHS[2]} fill="none" className="palette-preview-key" />
            <circle cx={130} cy={74} r={4} className="home-fan-dot" />
          </svg>
          <div className="home-tile palette-preview-tile">
            <span className="home-tile-meta"><span>01.2</span><span className="home-tile-status">{t("statusBeta")}</span></span>
            <span className="home-tile-name">{t("navBlackScholes")}</span>
            <span className="home-tile-desc">{t("homeLabDesc_blackScholes")}</span>
            <span className="home-link">{t("homeResume")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
