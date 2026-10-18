import type { Language } from "../../i18n";

/// Interactive figures a lesson can embed by id; rendered by the figure registry.
export type GuideFigureId =
  | "compounding"
  | "volatility-horizon"
  | "random-walk"
  | "payoff"
  | "strategy"
  | "forward-arbitrage"
  | "put-call-parity"
  | "one-step-tree"
  | "real-vs-risk-neutral"
  | "tree-convergence"
  | "delta-tangent"
  | "gbm-paths"
  | "black-scholes-price"
  | "two-asset-frontier"
  | "capital-market-line"
  | "security-market-line"
  | "price-yield"
  | "duration-convexity"
  | "spot-forward"
  | "npv-profile"
  | "wacc-leverage"
  | "dcf-terminal"
  | "quadratic-variation"
  | "monte-carlo-convergence"
  | "ctd-switch"
  | "vol-smile"
  | "greeks-profile"
  | "implied-vol"
  | "bl-density"
  | "var-es"
  | "ou-paths"
  | "american-boundary"
  | "swap-rate"
  | "girsanov-shift"
  | "real-option-tree"
  | "exotic-prices"
  | "jump-density"
  | "credit-spread"
  | "factor-variance"
  | "cashflow-builder"
  | "american-tree"
  | "mc-histogram"
  | "iv-surface"
  | "swap-timeline"
  | "capital-split"
  | "drag-assets"
  | "duration-balance"
  | "galton-walk"
  | "hedge-simulation"
  | "amortization-schedule"
  | "multiples-peers"
  | "utility-indifference"
  | "performance-ranking"
  | "immunization-shock"
  | "callable-price-yield"
  | "martingale-betting"
  | "euler-convergence";

/// One block of lesson text. Inline text supports `$tex$`, `**bold**` and `*italic*`.
export type GuideBlock =
  | { kind: "p"; text: string }
  /// Section heading; feeds the lesson's table of contents.
  | { kind: "h"; text: string }
  | { kind: "math"; tex: string }
  | { kind: "list"; items: string[]; ordered?: boolean }
  /// A short highlighted statement: a definition or result worth remembering.
  | { kind: "note"; text: string }
  | { kind: "figure"; id: GuideFigureId }
  /// Link to the lab where the idea can be tried.
  | { kind: "lab"; to: string; text: string };

/// A lesson's body in every language.
export type GuideLessonContent = Record<Language, GuideBlock[]>;
