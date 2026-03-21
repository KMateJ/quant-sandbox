import { NavLink } from "react-router-dom";
import { useI18n } from "../i18n";

export type PageKey =
  | "home"
  | "diffusion"
  | "black-scholes"
  | "binomial"
  | "payoff";

type NavbarProps = {
  hidden?: boolean;
};

const items: { key: PageKey; to: string; end?: boolean }[] = [
  { key: "home", to: "/", end: true },
  { key: "payoff", to: "/payoff" },
  { key: "binomial", to: "/binomial" },
  { key: "diffusion", to: "/diffusion" },
  { key: "black-scholes", to: "/black-scholes" },
];

export default function Navbar({ hidden = false }: NavbarProps) {
  const { t } = useI18n();

  const labels: Record<PageKey, string> = {
    home: t("navHome"),
    payoff: t("navPayoff"),
    binomial: t("navBinomial"),
    diffusion: t("navDiffusion"),
    "black-scholes": t("navBlackScholes"),
  };

  return (
    <header className={`topbar ${hidden ? "topbar-hidden" : ""}`}>
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-title">{t("brandTitle")}</div>
          <div className="brand-subtitle">{t("brandSubtitle")}</div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-tab active" : "nav-tab")}
            >
              {labels[item.key]}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}