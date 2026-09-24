import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";
import { useTheme } from "../theme";

export type PageKey =
  | "home"
  | "diffusion"
  | "black-scholes"
  | "binomial"
  | "payoff"
  | "heston"
  | "guide";

type NavbarProps = {
  hidden?: boolean;
};

const items: { key: PageKey; to: string; end?: boolean }[] = [
  { key: "home", to: "/", end: true },
  { key: "guide", to: "/guide" },
  { key: "payoff", to: "/payoff" },
  { key: "binomial", to: "/binomial" },
  { key: "diffusion", to: "/diffusion" },
  { key: "black-scholes", to: "/black-scholes" },
  { key: "heston", to: "/heston" },
];

export default function Navbar({ hidden = false }: NavbarProps) {
  const { language, setLanguage, t } = useI18n();
  const { resolvedTheme, setTheme } = useTheme();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const isDark = resolvedTheme === "dark";

  const labels: Record<PageKey, string> = {
    home: t("navHome"),
    payoff: t("navPayoff"),
    binomial: t("navBinomial"),
    diffusion: t("navDiffusion"),
    "black-scholes": t("navBlackScholes"),
    heston: t("navHeston"),
    guide: t("navGuide"),
  };

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the mobile menu when clicking outside of it.
  useEffect(() => {
    if (!menuOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [menuOpen]);

  // Close the language menu when clicking outside of it.
  useEffect(() => {
    if (!langOpen) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, [langOpen]);

  return (
    <header className={`topbar ${hidden ? "topbar-hidden" : ""}`}>
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-title">{t("brandTitle")}</div>
        </div>

        <div className="topbar-right">
          <nav
            className="nav-tabs nav-tabs-desktop"
            aria-label="Main navigation"
          >
            {items.map((item) => (
              <NavLink
                key={item.key}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  isActive ? "nav-tab active" : "nav-tab"
                }
              >
                {labels[item.key]}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            className="nav-icon-button"
            aria-label={isDark ? t("themeLight") : t("themeDark")}
            onClick={() => setTheme(isDark ? "light" : "dark")}
          >
            {isDark ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            )}
          </button>

          <div className="nav-lang" ref={langRef}>
            <button
              type="button"
              className={`nav-lang-button ${langOpen ? "active" : ""}`}
              aria-label={t("languageLabel")}
              aria-expanded={langOpen}
              aria-haspopup="menu"
              onClick={() => setLangOpen((open) => !open)}
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

            {langOpen && (
              <div className="nav-lang-menu" role="menu">
                <button
                  type="button"
                  className={
                    language === "en"
                      ? "nav-lang-item active"
                      : "nav-lang-item"
                  }
                  onClick={() => {
                    setLanguage("en");
                    setLangOpen(false);
                  }}
                >
                  {t("languageEn")}
                </button>
                <button
                  type="button"
                  className={
                    language === "hu"
                      ? "nav-lang-item active"
                      : "nav-lang-item"
                  }
                  onClick={() => {
                    setLanguage("hu");
                    setLangOpen(false);
                  }}
                >
                  {t("languageHu")}
                </button>
              </div>
            )}
          </div>

          <div className="nav-mobile" ref={menuRef}>
            <button
              type="button"
              className="nav-toggle"
              aria-label={t("navMenuLabel")}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="nav-toggle-bars" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            </button>

            {menuOpen && (
              <nav className="nav-menu" aria-label="Main navigation">
                {items.map((item) => (
                  <NavLink
                    key={item.key}
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      isActive ? "nav-menu-item active" : "nav-menu-item"
                    }
                  >
                    {labels[item.key]}
                  </NavLink>
                ))}
              </nav>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}