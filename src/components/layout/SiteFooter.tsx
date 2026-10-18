import { useI18n } from "../../i18n";

/// Site-wide footer with an honest privacy/data note (progressive disclosure).
export default function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-label={t("footerAria")}>
      <div className="site-footer-inner">
        <p className="site-footer-meta">
          © {year} {t("brandTitle")} · {t("footerTagline")}
        </p>

        <details className="site-footer-legal">
          <summary className="site-footer-legal-summary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 3l7 3v5c0 4.2-2.8 7.6-7 9-4.2-1.4-7-4.8-7-9V6l7-3z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="site-footer-legal-label">{t("privacySummary")}</span>
            <span className="site-footer-legal-hint">{t("privacyHint")}</span>
          </summary>
          <p className="site-footer-legal-body">{t("privacyBody")}</p>
        </details>
      </div>
    </footer>
  );
}
