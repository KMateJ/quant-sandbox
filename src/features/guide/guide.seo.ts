import type { GuideId } from "./guide.types";

/// English page titles for search results, phrased the way the topic is searched for.
/// The on-page lesson title stays the translated display title; lessons missing here fall back to it.
/// Appended to a lesson's meta description when the result still fits in a search snippet.
export const GUIDE_SEO_DESC_SUFFIX = "Free interactive lesson with worked examples.";

export const guideSeoTitles: Partial<Record<GuideId, string>> = {
  "interest-discounting": "Compound Interest and Discounting Explained",
  "npv-irr": "NPV and IRR Explained: Capital Budgeting Basics",
  wacc: "WACC Explained: Weighted Average Cost of Capital",
  "capital-structure": "Modigliani–Miller Theorem and Capital Structure",
  "dcf-valuation": "DCF Valuation: Free Cash Flow and Terminal Value",
  "real-options": "Real Options Valuation: Delay, Expand and Abandon",

  "returns-volatility": "Log Returns, Volatility and the Square-Root-of-Time Rule",
  diversification: "Diversification and Correlation in a Two-Asset Portfolio",
  "efficient-frontier": "Efficient Frontier, Capital Market Line and Sharpe Ratio",
  capm: "CAPM, Beta and the Security Market Line Explained",
  "risk-measures": "Value at Risk (VaR) and Expected Shortfall Explained",
  "factor-models": "Factor Models: Single-Index Model and Systematic Risk",

  "random-walks": "Random Walks and Brownian Motion Explained",
  "ito-lemma": "Itô's Lemma Explained: Quadratic Variation and Drift",
  "change-of-measure": "Girsanov's Theorem and Change of Measure Explained",
  "monte-carlo-pricing": "Monte Carlo Option Pricing and Standard Error",
  "mean-reversion": "Ornstein–Uhlenbeck Process and the Vasicek Model",
  "jump-diffusion": "Merton Jump-Diffusion Model and Poisson Jumps",

  instruments: "Forwards, Calls and Puts: Option Payoffs Explained",
  strategies: "Option Strategies: Spreads, Straddles and Butterflies",
  "no-arbitrage": "No-Arbitrage Pricing and the Forward Price Formula",
  "put-call-parity": "Put–Call Parity Explained with Examples",
  "one-step-binomial": "One-Step Binomial Option Pricing Model",
  "risk-neutral": "Risk-Neutral Probability in Option Pricing",
  "multi-step-trees": "Binomial Trees and Backward Induction (CRR Model)",
  "american-options": "American Options and Early Exercise in Binomial Trees",
  "delta-hedging": "Delta Hedging Explained: Delta, Gamma and Rebalancing",
  greeks: "Option Greeks Explained: Gamma, Vega, Theta and Rho",
  gbm: "Geometric Brownian Motion: The Stock Price Model",
  "toward-black-scholes": "Black–Scholes Formula Explained: d1, d2 and N(d2)",
  "implied-volatility": "Implied Volatility and the Volatility Smile",
  "stochastic-volatility": "Heston Model: Stochastic Volatility and the Smile",
  "static-replication": "Breeden–Litzenberger and Static Option Replication",
  "exotic-options": "Exotic Options: Barrier, Asian and Digital Options",

  "bond-pricing": "Bond Pricing and Yield to Maturity Explained",
  "duration-convexity": "Bond Duration and Convexity Explained",
  "yield-curve": "Spot Rates, Forward Rates and Yield Curve Bootstrapping",
  "treasury-futures": "Treasury Bond Futures: Conversion Factors and CTD",
  "interest-rate-swaps": "Interest Rate Swaps: Valuation and the Par Swap Rate",
  "credit-risk": "Credit Risk: Default Probability, Credit Spreads and CDS",
};
