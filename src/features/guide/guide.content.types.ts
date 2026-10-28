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
  | "ff-loadings"
  | "contagion-cascade"
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
  | "euler-convergence"
  | "sigma-partition"
  | "filtration-tree"
  | "bm-transformations"
  | "reflection-max"
  | "brownian-bridge"
  | "ito-sums"
  | "feynman-kac"
  | "dividend-yield-price"
  | "constrained-frontier"
  | "estimation-noise"
  | "key-rate-shocks"
  | "fisher-real-rate"
  | "npv-distribution"
  | "payout-ddm"
  | "clt-convergence"
  | "correlated-paths"
  | "round-trip"
  | "book-walk"
  | "queue-fill"
  | "toxic-income"
  | "gm-learning"
  | "roll-bounce"
  | "kyle-schedule"
  | "execution-frontier"
  | "inventory-skew"
  | "as-quotes"
  | "pnl-attribution";

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
  | { kind: "lab"; to: string; text: string }
  /// Retrieval check after the section it tests; `id` (`<lessonId>/<slug>`) is shared by both languages
  /// and keys the review queue.
  | { kind: "check"; id: string; prompt: string; answer: GuideCheckAnswer; explain: string }
  /// Worked example: shown in full first, then faded step by step into blanks the reader fills in.
  | { kind: "worked"; title: string; steps: GuideWorkedStep[] };

/// A numeric answer (accepted within `tolerance`, in the displayed `unit`) or one correct option.
export type GuideCheckAnswer =
  | { type: "number"; value: number; tolerance: number; unit?: string }
  | { type: "choice"; options: string[]; correct: number };

/// A numeric result shown after a worked step; it becomes a blank when the step is faded.
export type GuideWorkedResult = { value: number; tolerance: number; unit?: string };

export type GuideWorkedStep = { text: string; tex?: string; result?: GuideWorkedResult };

export type GuideCheckBlock = Extract<GuideBlock, { kind: "check" }>;
export type GuideWorkedBlock = Extract<GuideBlock, { kind: "worked" }>;

/// A lesson's body in every language.
export type GuideLessonContent = Record<Language, GuideBlock[]>;
