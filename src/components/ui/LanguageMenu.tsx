import { useEffect, useRef, useState } from "react";
import { useI18n } from "../../i18n";

export default function LanguageMenu() {
  const { language, setLanguage, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [open]);

  return (
    <div className="nav-lang" ref={ref}>
      <button
        type="button"
        className={`nav-lang-button ${open ? "active" : ""}`}
        aria-label={t("languageLabel")}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((o) => !o)}
      >
        <span>{language.toUpperCase()}</span>
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="nav-lang-chevron"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div className="nav-lang-menu" role="menu">
          <button
            type="button"
            className={language === "en" ? "nav-lang-item active" : "nav-lang-item"}
            onClick={() => {
              setLanguage("en");
              setOpen(false);
            }}
          >
            {t("languageEn")}
          </button>
          <button
            type="button"
            className={language === "hu" ? "nav-lang-item active" : "nav-lang-item"}
            onClick={() => {
              setLanguage("hu");
              setOpen(false);
            }}
          >
            {t("languageHu")}
          </button>
        </div>
      )}
    </div>
  );
}
