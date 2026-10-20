import type { ModuleViz } from "./home.types";

const BROWNIAN_WALK = "M6 34 L20 40 L34 36 L48 44 L62 40 L76 48 L90 42 L104 50 L114 46";

/// Mini drawing per lab id (viewBox 0 0 120 64); the last line of each is the key line.
export const MODULE_VIZ: Record<string, ModuleViz> = {
  payoff: { lines: [{ d: "M6 52 H114", w: 1, o: 0.25 }, { d: "M6 52 H60 L114 10", w: 1.6, o: 1, area: true }] },
  binomial: {
    lines: [{ d: "M10 32 L60 14 M10 32 L60 50 M60 14 L110 4 M60 14 L110 32 M60 50 L110 32 M60 50 L110 60", w: 1, o: 0.5 }],
    dots: [{ x: 10, y: 32, key: true }, { x: 60, y: 14 }, { x: 60, y: 50 }, { x: 110, y: 4 }, { x: 110, y: 32 }, { x: 110, y: 60 }],
  },
  "black-scholes": {
    lines: [
      { d: "M6 56 H60 L114 6", w: 1, o: 0.3 },
      { d: "M6 56 C46 56 62 50 76 40 S104 18 114 12", w: 1, o: 0.45 },
      { d: "M6 55 C40 54 56 46 70 34 S100 10 114 4", w: 1.8, o: 1, area: true },
    ],
    dots: [{ x: 70, y: 34, key: true }],
  },
  heston: {
    lines: [
      { d: "M6 22 C30 44 58 50 74 48 S104 34 114 24", w: 1, o: 0.4 },
      { d: "M6 12 C30 46 58 54 74 50 S104 30 114 14", w: 1.6, o: 1 },
    ],
  },
  "delta-hedging": {
    lines: [
      { d: "M6 55 C40 54 56 46 70 34 S100 10 114 4", w: 1, o: 0.35 },
      { d: "M6 54 H24 V48 H42 V40 H60 V30 H78 V20 H96 V11 H114", w: 1.4, o: 1 },
    ],
  },
  "bond-pricing": { lines: [{ d: "M6 8 C30 30 60 46 114 56", w: 1.6, o: 1, area: true }], dots: [{ x: 40, y: 33, key: true }] },
  "yield-curve": {
    lines: [
      { d: "M6 50 C30 26 54 14 76 24 S104 20 114 10", w: 1, o: 0.4 },
      { d: "M6 50 C30 32 60 22 114 16", w: 1.8, o: 1, area: true },
    ],
    dots: [{ x: 6, y: 50 }, { x: 20, y: 41 }, { x: 38, y: 32 }, { x: 60, y: 25 }, { x: 86, y: 20, key: true }, { x: 114, y: 16 }],
  },
  "duration-convexity": {
    lines: [{ d: "M16 4 L98 62", w: 1, o: 0.4 }, { d: "M6 10 C34 36 70 50 114 56", w: 1.6, o: 1, area: true }],
    dots: [{ x: 52, y: 40, key: true }],
  },
  "treasury-futures": {
    lines: [
      { d: "M6 44 L114 30", w: 1, o: 0.35 },
      { d: "M6 56 L114 14", w: 1, o: 0.35 },
      { d: "M6 50 L114 20", w: 1.6, o: 1 },
    ],
  },
  immunization: {
    lines: [{ d: "M6 22 C40 46 80 46 114 22", w: 1, o: 0.4 }, { d: "M6 42 C40 18 80 18 114 42", w: 1.6, o: 1 }],
    dots: [{ x: 60, y: 32, key: true }],
  },
  "risk-return": {
    lines: [{ d: "M6 58 L114 6", w: 1, o: 0.25 }],
    dots: [
      { x: 18, y: 50 }, { x: 30, y: 44 }, { x: 38, y: 48 }, { x: 50, y: 36 }, { x: 58, y: 40 },
      { x: 70, y: 28 }, { x: 78, y: 34 }, { x: 92, y: 20, key: true }, { x: 104, y: 24 },
    ],
  },
  capm: {
    lines: [{ d: "M6 54 L114 10", w: 1.6, o: 1 }],
    dots: [{ x: 24, y: 44 }, { x: 44, y: 40 }, { x: 62, y: 26 }, { x: 82, y: 26, key: true }, { x: 98, y: 14 }],
  },
  "portfolio-lab": { lines: [{ d: "M74 6 C30 18 30 46 74 58", w: 1.6, o: 1 }], dots: [{ x: 74, y: 6 }, { x: 74, y: 58 }, { x: 41, y: 32, key: true }] },
  "efficient-frontier": {
    lines: [{ d: "M6 46 L114 4", w: 1, o: 0.4 }, { d: "M84 6 C40 16 30 38 62 58", w: 1.8, o: 1 }],
    dots: [{ x: 52, y: 22, key: true }],
  },
  "npv-irr": {
    lines: [{ d: "M6 34 H114", w: 1, o: 0.3 }, { d: "M6 10 C40 24 70 38 114 54", w: 1.6, o: 1 }],
    dots: [{ x: 62, y: 34, key: true }],
  },
  valuation: {
    lines: [
      { d: "M14 58 V46 M30 58 V42 M46 58 V37 M62 58 V32 M78 58 V28", w: 7, o: 0.55 },
      { d: "M102 58 V12", w: 12, o: 1 },
    ],
  },
  tvm: { lines: [{ d: "M6 56 C50 54 82 40 114 6", w: 1.6, o: 1, area: true }] },
  wacc: { lines: [{ d: "M6 18 C40 50 70 52 114 22", w: 1.6, o: 1 }], dots: [{ x: 58, y: 44, key: true }] },
  "capital-structure": {
    lines: [{ d: "M6 50 C50 46 80 34 114 30", w: 1, o: 0.4 }, { d: "M6 50 L114 16", w: 1.6, o: 1 }],
  },
  "stochastic-models": {
    lines: [
      { d: "M6 34 L18 38 L30 30 L42 36 L54 40 L66 34 L78 42 L90 38 L102 46 L114 42", w: 1, o: 0.35 },
      { d: "M6 34 L18 30 L30 24 L42 28 L54 16 L66 20 L78 12 L90 16 L102 8 L114 10", w: 1, o: 0.35 },
      { d: "M6 34 L14 28 L22 32 L30 24 L38 30 L46 22 L54 26 L62 18 L70 24 L78 20 L86 28 L94 22 L102 26 L114 16", w: 1.6, o: 1 },
    ],
  },
  "brownian-motion": { lines: [{ d: BROWNIAN_WALK, w: 1, o: 0.4 }, { d: BROWNIAN_WALK, w: 1.5, o: 1 }] },
  gbm: {
    lines: [
      { d: "M6 46 C50 44 80 34 114 22", w: 1, o: 0.3 },
      { d: "M6 46 L20 48 L34 44 L48 46 L62 42 L76 44 L90 40 L104 42 L114 38", w: 1, o: 0.4 },
      { d: "M6 46 L20 42 L34 44 L48 36 L62 38 L76 28 L90 30 L104 18 L114 12", w: 1.5, o: 1 },
    ],
  },
  "ito-process": {
    lines: [
      { d: "M6 50 L114 14", w: 1, o: 0.35 },
      { d: "M6 50 L18 44 L30 46 L42 38 L54 40 L66 32 L78 30 L90 24 L102 22 L114 16", w: 1.5, o: 1 },
    ],
  },
  "monte-carlo": {
    lines: [
      { d: "M6 32 H114", w: 1, o: 0.35 },
      { d: "M6 10 L18 50 L30 18 L42 44 L54 24 L66 38 L78 28 L90 35 L102 30 L114 33", w: 1.5, o: 1 },
    ],
  },
};

/// Stand-in drawing for a guide tile that closes a bento row.
export const GUIDE_FILLER_VIZ: ModuleViz = {
  lines: [{ d: "M6 14 H70 M6 26 H96 M6 38 H84", w: 1, o: 0.4 }, { d: "M6 50 H60", w: 1.5, o: 1 }],
};

/// Closed area under an `area` line, down to the box bottom.
export function areaPath(d: string): string {
  return `${d} L114 64 L6 64 Z`;
}
