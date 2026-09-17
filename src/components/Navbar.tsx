import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useI18n } from "../i18n";

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
  const { t } = useI18n();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className={`topbar ${hidden ? "topbar-hidden" : ""}`}>
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-title">{t("brandTitle")}</div>
        </div>

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
    </header>
  );
}