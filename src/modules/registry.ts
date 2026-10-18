import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TranslationKey } from "../i18n";
import type { IntuitionDocument } from "../components/intuition";
import { binomialIntuition, blackScholesIntuition, bondIntuition, durationIntuition, frontierIntuition, hestonIntuition, payoffIntuition, treasuryFuturesIntuition, yieldCurveIntuition } from "./intuition";
import { stochasticModelsIntuition } from "./stochasticModelsIntuition";
import { STUDIO_PATH, lessonNavItems } from "../features/stochastic-models/stochasticModels.curriculum";
import { moduleAbout, type ModuleAbout } from "./moduleAbout";
import { guideNavItems, guideRedirects, guideTrackById, guideTrackPath } from "../features/guide/guide.meta";
import type { GuideTrackId } from "../features/guide/guide.types";
import { GUIDE_SEO_DESC_SUFFIX, guideSeoTitles } from "../features/guide/guide.seo";

/// Top-level navigation categories for the Quant Sandbox module tree.
export type ModuleCategory =
  | "derivatives"
  | "portfolio"
  | "fixed-income"
  | "corporate"
  | "stochastic"
  | "guides";

export type ModuleStatus = "live" | "beta" | "planned";

/// Nested sidebar link shown under a module while it is active.
export interface ModuleSubNavItem {
  id: string;
  labelKey: TranslationKey;
  /// Page description for SEO when the item is a page of its own.
  descKey?: TranslationKey;
  /// English search-result title when it should differ from the label.
  seoTitle?: string;
  /// Sentence appended to the meta description when the result stays snippet-length.
  seoDescSuffix?: string;
  prefix?: string;
  to: string;
}

/// A single Quant Sandbox module. Single source of truth for routing, nav and home.
export interface ModuleDef {
  id: string;
  path: string;
  navKey: TranslationKey;
  /// Glyph id for `ModuleIcon` when it differs from the module id.
  icon?: string;
  category?: ModuleCategory; // home has none (landing page)
  status: ModuleStatus;
  seo: { title: string; description: string };
  /// Searchable intro and FAQ shown below the workspace.
  about?: ModuleAbout;
  Component: LazyExoticComponent<ComponentType>;
  end?: boolean; // exact route match (home)
  relatedGuides?: string[];
  intuition?: IntuitionDocument;
  subNav?: ModuleSubNavItem[];
}

export const CATEGORY_ORDER: ModuleCategory[] = [
  "derivatives",
  "portfolio",
  "fixed-income",
  "corporate",
  "stochastic",
  "guides",
];

export const CATEGORY_LABEL_KEYS: Record<ModuleCategory, TranslationKey> = {
  derivatives: "catDerivatives",
  portfolio: "catPortfolio",
  "fixed-income": "catFixedIncome",
  corporate: "catCorporate",
  stochastic: "catStochastic",
  guides: "navGuide",
};

export const CATEGORY_DESC_KEYS: Record<ModuleCategory, TranslationKey> = {
  derivatives: "catDerivativesDesc",
  portfolio: "catPortfolioDesc",
  "fixed-income": "catFixedIncomeDesc",
  corporate: "catCorporateDesc",
  stochastic: "catStochasticDesc",
  guides: "catGuidesDesc",
};

/// Accent colour per category, used by home cards for visual variety.
export const CATEGORY_ACCENT: Record<ModuleCategory, string> = {
  derivatives: "#22c55e",
  portfolio: "#3b82f6",
  "fixed-income": "#f59e0b",
  corporate: "#ec4899",
  stochastic: "#a855f7",
  guides: "#06b6d4",
};

const GuideView = lazy(() => import("../features/guide/GuideView"));

/// One sidebar node per guide track; tracks without lessons yet show as planned.
function guideModule(trackId: GuideTrackId, seo: ModuleDef["seo"]): ModuleDef {
  const track = guideTrackById(trackId);
  return {
    id: `guide-${trackId}`,
    path: guideTrackPath(trackId),
    navKey: track.titleKey,
    icon: "guide",
    category: "guides",
    status: track.lessons.length ? "live" : "planned",
    subNav: guideNavItems(track).map((item) => ({ ...item, seoTitle: guideSeoTitles[item.id], seoDescSuffix: GUIDE_SEO_DESC_SUFFIX })),
    seo,
    about: moduleAbout("Guide"),
    Component: GuideView,
  };
}

export const modules: ModuleDef[] = [
  {
    id: "home",
    path: "/",
    navKey: "navHome",
    status: "live",
    end: true,
    seo: {
      title: "Interactive Quant Finance Visualizations & Simulators",
      description:
        "Free interactive tools for quantitative finance: option payoffs, Black–Scholes Greeks, binomial trees, portfolio optimization, bonds, yield curves and stochastic calculus.",
    },
    Component: lazy(() => import("../features/home/HomeView").then((m) => ({ default: m.HomeView }))),
  },
  {
    id: "payoff",
    intuition: payoffIntuition,
    path: "/payoff",
    navKey: "navPayoff",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Option Payoff Diagram & Strategy Builder",
      description:
        "Build option strategies and see payoff and profit diagrams instantly: calls, puts, covered calls, spreads, straddles, strangles, butterflies and synthetic forwards.",
    },
    about: moduleAbout("Payoff"),
    relatedGuides: ["instruments", "strategies", "no-arbitrage", "put-call-parity"],
    Component: lazy(() => import("../features/payoff-lab/PayofView")),
  },
  {
    id: "binomial",
    intuition: binomialIntuition,
    path: "/binomial",
    navKey: "navBinomial",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Binomial Option Pricing Tree Calculator",
      description:
        "Price options on an interactive binomial tree: risk-neutral probabilities, backward induction and the replicating portfolio at every node.",
    },
    about: moduleAbout("Binomial"),
    relatedGuides: ["one-step-binomial", "risk-neutral", "multi-step-trees"],
    Component: lazy(() => import("../features/binomial/BinomialView")),
  },
  {
    id: "black-scholes",
    intuition: blackScholesIntuition,
    path: "/black-scholes",
    navKey: "navBlackScholes",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Black–Scholes Calculator & Option Greeks Visualizer",
      description:
        "Price European calls and puts with the Black–Scholes formula and visualize delta, gamma, vega and theta across stock prices and maturities, in 2D and 3D.",
    },
    about: moduleAbout("BlackScholes"),
    relatedGuides: ["toward-black-scholes", "delta-hedging", "put-call-parity"],
    Component: lazy(() => import("../features/black-scholes/BlackScholesView")),
  },
  {
    id: "heston",
    intuition: hestonIntuition,
    path: "/heston",
    navKey: "navHeston",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Heston Stochastic Volatility Model Simulator",
      description:
        "Simulate the Heston model: mean-reverting stochastic variance, vol-of-vol and correlation, with sample paths and Monte Carlo option pricing.",
    },
    about: moduleAbout("Heston"),
    relatedGuides: ["toward-black-scholes", "gbm"],
    Component: lazy(() => import("../features/heston/HestonView")),
  },
  {
    id: "delta-hedging",
    path: "/delta-hedging",
    navKey: "navDeltaHedging",
    category: "derivatives",
    status: "beta",
    seo: {
      title: "Delta Hedging Simulator for Options",
      description:
        "Simulate discrete delta hedging of a call option: a replicating portfolio tracks the option value, rebalanced along a simulated stock path, with the residual hedge error.",
    },
    about: moduleAbout("DeltaHedging"),
    relatedGuides: ["delta-hedging", "multi-step-trees"],
    Component: lazy(() => import("../features/delta-hedging/DeltaHedgingView")),
  },
  {
    id: "bond-pricing",
    intuition: bondIntuition,
    path: "/bond-pricing",
    navKey: "navBondPricing",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Bond Pricing Calculator & Price–Yield Curve",
      description:
        "Value a bond from its cash flows: discounting to present value, price, duration, convexity and a draggable price–yield curve.",
    },
    about: moduleAbout("BondPricing"),
    relatedGuides: ["bond-pricing", "duration-convexity"],
    Component: lazy(() => import("../features/bond-pricing/BondPricingView")),
  },
  {
    id: "yield-curve",
    intuition: yieldCurveIntuition,
    path: "/yield-curve",
    navKey: "navYieldCurve",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Yield Curve Bootstrapping, Spot & Forward Rates",
      description:
        "Shape a par yield curve by level, slope and curvature, bootstrap the spot curve and read off forward rates interactively.",
    },
    about: moduleAbout("YieldCurve"),
    relatedGuides: ["yield-curve", "bond-pricing"],
    Component: lazy(() => import("../features/yield-curve/YieldCurveView")),
  },
  {
    id: "duration-convexity",
    intuition: durationIntuition,
    path: "/duration-convexity",
    navKey: "navDurationConvexity",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Bond Duration & Convexity Approximation",
      description:
        "Compare a bond's exact price–yield curve with its duration and duration-plus-convexity approximations, and see where each one breaks down.",
    },
    about: moduleAbout("DurationConvexity"),
    relatedGuides: ["duration-convexity", "bond-pricing"],
    Component: lazy(() => import("../features/duration-convexity/DurationConvexityView")),
  },
  {
    id: "treasury-futures",
    intuition: treasuryFuturesIntuition,
    path: "/treasury-futures",
    navKey: "navTreasuryFutures",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Treasury Futures: Conversion Factors & Cheapest-to-Deliver",
      description:
        "Explore Treasury bond futures: conversion factors, invoice prices, deliverable cash flows and cheapest-to-deliver switching as yields move.",
    },
    about: moduleAbout("TreasuryFutures"),
    relatedGuides: ["yield-curve", "duration-convexity"],
    Component: lazy(() => import("../features/treasury-futures/TreasuryFuturesView")),
  },
  {
    id: "risk-return",
    path: "/risk-return",
    navKey: "navRiskReturn",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Capital Allocation Line & Sharpe Ratio Visualizer",
      description:
        "Combine a risky asset with the risk-free rate: expected return, volatility, the Sharpe ratio and leverage along the capital allocation line.",
    },
    about: moduleAbout("RiskReturn"),
    relatedGuides: ["returns-volatility", "diversification"],
    Component: lazy(() => import("../features/risk-return/RiskReturnView")),
  },
  {
    id: "capm",
    path: "/capm",
    navKey: "navCapm",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "CAPM Calculator & Security Market Line",
      description:
        "Interactive Capital Asset Pricing Model: beta, the market risk premium, the security market line and Jensen's alpha for individual assets.",
    },
    about: moduleAbout("Capm"),
    relatedGuides: ["capm", "efficient-frontier"],
    Component: lazy(() => import("../features/capm/CapmView")),
  },
  {
    id: "portfolio-lab",
    path: "/portfolio-lab",
    navKey: "navPortfolioLab",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Two-Asset Portfolio: Diversification & Correlation",
      description:
        "See how correlation drives diversification: expected return, volatility and the minimum-variance portfolio of two assets on an interactive frontier.",
    },
    about: moduleAbout("PortfolioLab"),
    relatedGuides: ["diversification", "efficient-frontier"],
    Component: lazy(() => import("../features/portfolio-lab/PortfolioLabView")),
  },
  {
    id: "efficient-frontier",
    intuition: frontierIntuition,
    path: "/efficient-frontier",
    navKey: "navEfficientFrontier",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Efficient Frontier & Markowitz Portfolio Optimization",
      description:
        "Markowitz mean–variance optimization: the efficient frontier, minimum-variance and maximum-Sharpe (tangency) portfolios, target return or volatility, and the cost of constraints.",
    },
    about: moduleAbout("EfficientFrontier"),
    relatedGuides: ["efficient-frontier", "diversification", "capm"],
    Component: lazy(() => import("../features/efficient-frontier/PortfolioOptimizationView")),
  },
  {
    id: "npv-irr",
    path: "/npv-irr",
    navKey: "navNpvIrr",
    category: "corporate",
    status: "beta",
    seo: {
      title: "NPV & IRR Calculator with NPV Profile",
      description:
        "Capital budgeting made visual: net present value, internal rate of return, profitability index and the NPV profile across discount rates.",
    },
    about: moduleAbout("NpvIrr"),
    relatedGuides: ["npv-irr", "interest-discounting"],
    Component: lazy(() => import("../features/npv-irr/NpvIrrView")),
  },
  {
    id: "valuation",
    path: "/valuation",
    navKey: "navValuation",
    category: "corporate",
    status: "beta",
    seo: {
      title: "DCF Valuation Model: Free Cash Flow & Terminal Value",
      description:
        "Build a discounted cash flow valuation: free cash flow projection, terminal value, discounting at WACC and enterprise value.",
    },
    about: moduleAbout("Valuation"),
    relatedGuides: ["dcf-valuation", "wacc"],
    Component: lazy(() => import("../features/valuation/ValuationView")),
  },
  {
    id: "tvm",
    path: "/tvm",
    navKey: "navTvm",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Time Value of Money & Compound Interest Calculator",
      description:
        "Compound growth of a principal and regular contributions over time, splitting the final balance into interest earned and money paid in.",
    },
    about: moduleAbout("Tvm"),
    relatedGuides: ["interest-discounting", "npv-irr"],
    Component: lazy(() => import("../features/tvm/TvmView")),
  },
  {
    id: "wacc",
    path: "/wacc",
    navKey: "navWacc",
    category: "corporate",
    status: "beta",
    seo: {
      title: "WACC Calculator: Weighted Average Cost of Capital",
      description:
        "Compute the weighted average cost of capital: cost of equity, after-tax cost of debt, the tax shield and how leverage changes WACC.",
    },
    about: moduleAbout("Wacc"),
    relatedGuides: ["wacc", "capital-structure"],
    Component: lazy(() => import("../features/wacc/WaccView")),
  },
  {
    id: "capital-structure",
    path: "/capital-structure",
    navKey: "navCapitalStructure",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Modigliani–Miller Capital Structure Visualizer",
      description:
        "Modigliani–Miller with and without taxes: levered cost of equity, WACC and the interest tax shield as leverage changes.",
    },
    about: moduleAbout("CapitalStructure"),
    relatedGuides: ["capital-structure", "wacc"],
    Component: lazy(() => import("../features/capital-structure/CapitalStructureView")),
  },
  {
    id: "stochastic-models",
    path: STUDIO_PATH,
    navKey: "navStochasticStudio",
    category: "stochastic",
    status: "beta",
    intuition: stochasticModelsIntuition,
    subNav: lessonNavItems(),
    seo: {
      title: "Stochastic Calculus Course: Random Walks to Brownian Motion",
      description:
        "Interactive stochastic calculus lessons: random walks, the central limit theorem, the Wiener process, the reflection principle and first passage times, learned by experiment.",
    },
    about: moduleAbout("StochasticModels"),
    Component: lazy(() => import("../features/stochastic-models/StochasticModelsView")),
  },
  {
    id: "brownian-motion",
    path: "/brownian-motion",
    navKey: "navBrownianMotion",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Brownian Motion Simulator with Drift & Volatility",
      description:
        "Simulate arithmetic Brownian motion: drift, volatility and reproducible seeded sample paths, with the mean and spread over time.",
    },
    about: moduleAbout("BrownianMotion"),
    relatedGuides: ["random-walks", "ito-lemma"],
    Component: lazy(() => import("../features/brownian-motion/BrownianMotionView")),
  },
  {
    id: "gbm",
    path: "/gbm",
    navKey: "navGbm",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Geometric Brownian Motion (GBM) Simulator",
      description:
        "Simulate geometric Brownian motion, the stock price model behind Black–Scholes: drift, volatility, sample paths and the theoretical expected value.",
    },
    about: moduleAbout("Gbm"),
    relatedGuides: ["gbm", "returns-volatility"],
    Component: lazy(() => import("../features/gbm/GbmView")),
  },
  {
    id: "ito-process",
    path: "/ito-process",
    navKey: "navItoProcess",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Itô's Lemma Visualized: the −½σ² Drift Correction",
      description:
        "See Itô's lemma at work on log prices: why the log of geometric Brownian motion drifts at μ − ½σ² instead of μ.",
    },
    about: moduleAbout("ItoProcess"),
    relatedGuides: ["ito-lemma", "random-walks"],
    Component: lazy(() => import("../features/ito-process/ItoProcessView")),
  },
  {
    id: "monte-carlo",
    path: "/monte-carlo",
    navKey: "navMonteCarlo",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Monte Carlo Option Pricing Simulator",
      description:
        "Price a European option by Monte Carlo: simulate terminal stock prices and watch the estimate and its confidence interval converge to Black–Scholes.",
    },
    about: moduleAbout("MonteCarlo"),
    relatedGuides: ["monte-carlo-pricing", "gbm"],
    Component: lazy(() => import("../features/monte-carlo/MonteCarloView")),
  },
  guideModule("derivatives", {
    title: "Option Pricing Course: From Payoffs to Black–Scholes and Heston",
    description:
      "Free step-by-step option pricing lessons: payoffs, no-arbitrage, binomial trees, delta hedging, the Greeks, Black–Scholes, implied volatility and Heston.",
  }),
  guideModule("portfolio", {
    title: "Portfolio Theory Course: Diversification, Efficient Frontier & CAPM",
    description:
      "Free step-by-step lessons on returns and volatility, diversification and correlation, the efficient frontier, the Sharpe ratio, CAPM and beta, and Value at Risk.",
  }),
  guideModule("fixed-income", {
    title: "Fixed Income Course: Bond Pricing, Yield Curves & Duration",
    description:
      "Free step-by-step lessons on bond prices and yields, duration and convexity, spot and forward rates, Treasury futures and interest rate swaps.",
  }),
  guideModule("corporate", {
    title: "Corporate Finance Course: NPV, IRR, WACC & DCF Valuation",
    description:
      "Free step-by-step lessons on compounding and discounting, NPV and IRR, the cost of capital, Modigliani–Miller capital structure and DCF valuation.",
  }),
  guideModule("stochastic", {
    title: "Stochastic Calculus for Finance: Brownian Motion, Itô & Monte Carlo",
    description:
      "Free step-by-step lessons on random walks and Brownian motion, Itô's lemma, change of measure, Monte Carlo option pricing and mean-reverting processes.",
  }),
  {
    id: "guide-graph",
    path: "/guide/graph",
    navKey: "navGuideGraph",
    icon: "guide",
    category: "guides",
    status: "live",
    seo: {
      title: "Knowledge graph of the quant finance guides",
      description:
        "Interactive map of every guide lesson and lab: which lessons build on which, by track, with links to each lesson.",
    },
    Component: lazy(() => import("../features/guide/components/graph/GuideGraphPage")),
  },
];

/// Old URLs that now live elsewhere.
export const redirects = guideRedirects();

/// A module by its registry id.
export function moduleById(id: string): ModuleDef | undefined {
  return modules.find((m) => m.id === id);
}

/// Modules belonging to a category, in registry order.
export function modulesInCategory(category: ModuleCategory): ModuleDef[] {
  return modules.filter((m) => m.category === category);
}
