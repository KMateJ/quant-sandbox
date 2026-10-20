import type { TranslationKey } from "../../i18n";

/// One track per large module area.
export type GuideTrackId = "derivatives" | "portfolio" | "fixed-income" | "corporate" | "stochastic";

export type GuideId =
  | "interest-discounting"
  | "returns-volatility"
  | "random-walks"
  | "instruments"
  | "strategies"
  | "no-arbitrage"
  | "put-call-parity"
  | "one-step-binomial"
  | "risk-neutral"
  | "multi-step-trees"
  | "delta-hedging"
  | "gbm"
  | "toward-black-scholes"
  | "diversification"
  | "efficient-frontier"
  | "capm"
  | "bond-pricing"
  | "duration-convexity"
  | "yield-curve"
  | "npv-irr"
  | "wacc"
  | "capital-structure"
  | "dcf-valuation"
  | "ito-lemma"
  | "monte-carlo-pricing"
  | "greeks"
  | "implied-volatility"
  | "static-replication"
  | "risk-measures"
  | "mean-reversion"
  | "treasury-futures"
  | "stochastic-volatility"
  | "american-options"
  | "interest-rate-swaps"
  | "change-of-measure"
  | "real-options"
  | "exotic-options"
  | "jump-diffusion"
  | "credit-risk"
  | "factor-models"
  | "annuities"
  | "valuation-multiples"
  | "risk-aversion"
  | "performance-measures"
  | "immunization"
  | "callable-bonds"
  | "martingales"
  | "sde-simulation"
  | "probability-spaces"
  | "filtrations"
  | "brownian-properties"
  | "reflection-principle"
  | "brownian-bridge"
  | "ito-integral"
  | "feynman-kac"
  | "options-on-other-underlyings"
  | "portfolio-constraints"
  | "input-estimation"
  | "curve-risk"
  | "real-rates-inflation"
  | "capital-budgeting-risk"
  | "dividend-policy"
  | "law-of-large-numbers-clt"
  | "correlated-brownian-motions";

/// A single ordered lesson inside a track.
export type GuideLessonMeta = {
  id: GuideId;
  track: GuideTrackId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  /// Registry module ids of the labs the lesson practises.
  labs: string[];
};

/// A learning track: an ordered sequence of lessons that build on each other.
export type GuideTrackMeta = {
  id: GuideTrackId;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  lessons: GuideId[];
};

/// Where a lesson sits in its track, with its neighbours.
export type GuideLessonLocation = {
  lesson: GuideLessonMeta;
  track: GuideTrackMeta;
  index: number;
  previous?: GuideLessonMeta;
  next?: GuideLessonMeta;
};

/// One entry of a lesson's table of contents.
export type GuideHeading = {
  id: string;
  label: string;
};
