export type PageKey = "home" | "diffusion" | "black-scholes" | "binomial";

type NavbarProps = {
  current: PageKey;
  onNavigate: (page: PageKey) => void;
  hidden?: boolean;
};

const items: { key: PageKey; label: string }[] = [
  { key: "home", label: "Home" },
  { key: "diffusion", label: "Diffusion" },
  { key: "black-scholes", label: "Black-Scholes" },
  { key: "binomial", label: "Binomial" },
];

export default function Navbar({
  current,
  onNavigate,
  hidden = false,
}: NavbarProps) {
  return (
    <header className={`topbar ${hidden ? "topbar-hidden" : ""}`}>
      <div className="topbar-inner">
        <div className="brand-block">
          <div className="brand-title">Quant Sandbox</div>
          <div className="brand-subtitle">Interactive math & finance demos</div>
        </div>

        <nav className="nav-tabs" aria-label="Main navigation">
          {items.map((item) => (
            <button
              key={item.key}
              type="button"
              className={current === item.key ? "nav-tab active" : "nav-tab"}
              onClick={() => onNavigate(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}