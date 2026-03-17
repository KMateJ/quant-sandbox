import { NavLink } from "react-router-dom";

export type PageKey =
  | "home"
  | "diffusion"
  | "black-scholes"
  | "binomial"
  | "payoff";

type NavbarProps = {
  hidden?: boolean;
};

const items: { key: PageKey; label: string; to: string; end?: boolean }[] = [
  { key: "home", label: "Home", to: "/", end: true },
  { key: "payoff", label: "Payoff Lab", to: "/payoff" },
  { key: "binomial", label: "Binomial", to: "/binomial" },
  { key: "diffusion", label: "Diffusion", to: "/diffusion" },
  { key: "black-scholes", label: "Black-Scholes", to: "/black-scholes" },
];

export default function Navbar({ hidden = false }: NavbarProps) {
  return (
    <header className={`topbar ${hidden ? "topbar-hidden" : ""}`}>
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-title">Quant Sandbox</div>
          <div className="brand-subtitle">Interactive math & finance demos</div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          {items.map((item) => (
            <NavLink
              key={item.key}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? "nav-tab active" : "nav-tab")}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
