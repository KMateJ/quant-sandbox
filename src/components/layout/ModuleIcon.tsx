import type { ReactNode } from "react";

/// Line-style glyphs per module id, drawn on a 24x24 stroke grid.
const ICONS: Record<string, ReactNode> = {
  payoff: <path d="M3 16h8l8-10" />,
  binomial: (
    <>
      <circle cx="5" cy="12" r="1.6" />
      <circle cx="15" cy="6.5" r="1.6" />
      <circle cx="15" cy="17.5" r="1.6" />
      <path d="M6.4 11.2 13.6 7.3M6.4 12.8 13.6 16.7" />
    </>
  ),
  "black-scholes": (
    <>
      <path d="M3 18h18" opacity=".4" />
      <path d="M3 18c4 0 4.5-10 9-10s5 10 9 10" />
    </>
  ),
  heston: <path d="M4 8c2 7 4 9 8 9s6-2 8-9" />,
  diffusion: (
    <>
      <path d="M4 15a8 8 0 0 1 16 0" />
      <path d="M7 15a5 5 0 0 1 10 0" />
      <path d="M10 15a2 2 0 0 1 4 0" />
    </>
  ),
  "bond-pricing": (
    <>
      <path d="M7 3h7l4 4v14H7z" />
      <path d="M14 3v4h4" />
      <path d="M9.5 13h5M9.5 16h5" />
    </>
  ),
  "yield-curve": <path d="M4 18c5 0 10-3 15-11" />,
  "duration-convexity": (
    <>
      <path d="M4 18 20 6" opacity=".45" />
      <path d="M4 18c5 0 11-4 16-12" />
    </>
  ),
  "risk-return": (
    <>
      <path d="M4 4v16h16" opacity=".4" />
      <path d="M5 18 19 8" />
    </>
  ),
  capm: (
    <>
      <path d="M4 20 20 6" />
      <circle cx="13" cy="11" r="1.7" />
    </>
  ),
  "portfolio-lab": (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 12V4M12 12l6.9 4" />
    </>
  ),
  "efficient-frontier": (
    <>
      <path d="M8 4c-4 3-4 13 0 16" />
      <circle cx="8" cy="4" r="1.3" />
      <circle cx="8" cy="20" r="1.3" />
    </>
  ),
  "npv-irr": (
    <>
      <path d="M12 3v18" />
      <path d="M16 6.5c-1-1.2-2.5-2-4-2-2.2 0-4 1.3-4 3.2 0 4.4 8 2.1 8 6.6 0 2-2 3.2-4.2 3.2-1.7 0-3.3-.8-4.3-2.2" />
    </>
  ),
  valuation: (
    <>
      <path d="M5 21V6l7-3 7 3v15" />
      <path d="M3 21h18" />
      <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01M11 21v-3h2v3" />
    </>
  ),
  "brownian-motion": <path d="M3 13l2.5-4 2.5 6 2.5-7 2.5 5 2.5-3 2.5 4 2.5-6" />,
  gbm: (
    <>
      <path d="M3 17 21 6" opacity=".35" />
      <path d="M3 18l3-2 3 1 3-4 3 1 3-6 3-3" />
    </>
  ),
  "ito-process": (
    <>
      <path d="M3 16 21 8" opacity=".35" />
      <path d="M3 15l2-3 2 2 2-4 2 3 2-5 2 2 2-3 2 1" />
    </>
  ),
  "monte-carlo": (
    <>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M9 9h.01M15 9h.01M12 12h.01M9 15h.01M15 15h.01" />
    </>
  ),
  "delta-hedging": (
    <>
      <path d="M3 17c4 0 6-11 10-11s4 8 8 8" />
      <path d="M3 19h3v-3h3v-4h3v-3h3" opacity=".5" />
    </>
  ),
  tvm: (
    <>
      <path d="M4 19V5" opacity=".4" />
      <path d="M4 19h15" opacity=".4" />
      <path d="M6 17c5 0 8-9 13-11" />
      <path d="M15 6h4v4" />
    </>
  ),
  wacc: (
    <>
      <path d="M12 4v16" />
      <path d="M6 20h12" />
      <path d="M4 8h16" />
      <path d="M2 12l2-4 2 4a2 2 0 0 1-4 0z" />
      <path d="M18 12l2-4 2 4a2 2 0 0 1-4 0z" />
    </>
  ),
  "capital-structure": (
    <>
      <rect x="5" y="4" width="14" height="7" rx="1.5" />
      <rect x="5" y="13" width="14" height="7" rx="1.5" />
    </>
  ),
  guide: (
    <>
      <path d="M12 6c-1.6-1-4-1.6-6-1.6-1 0-2 .1-3 .4v12c1-.3 2-.4 3-.4 2 0 4.4.6 6 1.6" />
      <path d="M12 6c1.6-1 4-1.6 6-1.6 1 0 2 .1 3 .4v12c-1-.3-2-.4-3-.4-2 0-4.4.6-6 1.6z" />
      <path d="M12 6v13" />
    </>
  ),
};

/// Renders the glyph for a module id, falling back to a neutral dot.
export default function ModuleIcon({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[id] ?? <circle cx="12" cy="12" r="6" />}
    </svg>
  );
}
