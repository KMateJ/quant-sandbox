import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TranslationKey } from "../i18n";

/// Top-level navigation categories for the Quant Sandbox module tree.
export type ModuleCategory =
  | "derivatives"
  | "portfolio"
  | "fixed-income"
  | "corporate"
  | "stochastic"
  | "guides";

export type ModuleStatus = "live" | "beta" | "planned";

/// A single Quant Sandbox module. Single source of truth for routing, nav and home.
export interface ModuleDef {
  id: string;
  path: string;
  navKey: TranslationKey;
  category?: ModuleCategory; // home has none (landing page)
  status: ModuleStatus;
  seo: { title: string; description: string };
  Component: LazyExoticComponent<ComponentType>;
  end?: boolean; // exact route match (home)
  relatedGuides?: string[];
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

export const modules: ModuleDef[] = [
  {
    id: "home",
    path: "/",
    navKey: "navHome",
    status: "live",
    end: true,
    seo: {
      title: "Home",
      description:
        "Interactive study aid for ELTE and Corvinus Insurance and Financial Mathematics students.",
    },
    Component: lazy(() => import("../features/home/HomeView").then((m) => ({ default: m.HomeView }))),
  },
  {
    id: "payoff",
    path: "/payoff",
    navKey: "navPayoff",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Payoff Lab",
      description:
        "Interactive payoff and profit diagrams for options, forwards, stock and synthetic strategies.",
    },
    relatedGuides: ["instruments", "no-arbitrage"],
    Component: lazy(() => import("../features/payoff-lab/PayofView")),
  },
  {
    id: "binomial",
    path: "/binomial",
    navKey: "navBinomial",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Binomial Tree Model",
      description:
        "Interactive binomial pricing tree for option pricing, risk-neutral probability and replicating portfolios.",
    },
    relatedGuides: ["no-arbitrage", "risk-neutral", "delta-hedging"],
    Component: lazy(() => import("../features/binomial/BinomialView")),
  },
  {
    id: "black-scholes",
    path: "/black-scholes",
    navKey: "navBlackScholes",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Black–Scholes Model",
      description:
        "Interactive Black–Scholes option pricing and Greeks visualization across stock prices and maturities.",
    },
    relatedGuides: ["toward-black-scholes", "delta-hedging"],
    Component: lazy(() => import("../features/black-scholes/BlackScholesView")),
  },
  {
    id: "heston",
    path: "/heston",
    navKey: "navHeston",
    category: "derivatives",
    status: "live",
    seo: {
      title: "Heston Model",
      description:
        "Interactive Heston stochastic volatility model with simulated paths and parameter intuition.",
    },
    relatedGuides: ["risk-neutral"],
    Component: lazy(() => import("../features/heston/HestonView")),
  },
  {
    id: "delta-hedging",
    path: "/delta-hedging",
    navKey: "navDeltaHedging",
    category: "derivatives",
    status: "beta",
    seo: {
      title: "Delta Hedging",
      description:
        "Interactive discrete delta hedging of a call: a replicating portfolio tracking the option value with residual hedge error.",
    },
    relatedGuides: ["delta-hedging"],
    Component: lazy(() => import("../features/delta-hedging/DeltaHedgingView")),
  },
  {
    id: "bond-pricing",
    path: "/bond-pricing",
    navKey: "navBondPricing",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Bond Lab",
      description:
        "Interactive bond valuation workbench: cash-flow timeline, discounting to present values, bond price, duration, convexity and a draggable price–yield curve.",
    },
    Component: lazy(() => import("../features/bond-pricing/BondPricingView")),
  },
  {
    id: "yield-curve",
    path: "/yield-curve",
    navKey: "navYieldCurve",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Yield Curve",
      description:
        "Interactive par and bootstrapped spot yield curve shaped by level, slope and curvature.",
    },
    Component: lazy(() => import("../features/yield-curve/YieldCurveView")),
  },
  {
    id: "duration-convexity",
    path: "/duration-convexity",
    navKey: "navDurationConvexity",
    category: "fixed-income",
    status: "beta",
    seo: {
      title: "Duration & Convexity",
      description:
        "Interactive comparison of a bond's actual price–yield curve with its duration and duration-plus-convexity approximations.",
    },
    Component: lazy(() => import("../features/duration-convexity/DurationConvexityView")),
  },
  {
    id: "risk-return",
    path: "/risk-return",
    navKey: "navRiskReturn",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Risk & Return",
      description:
        "Interactive capital allocation line: expected return, volatility, Sharpe ratio and leverage between a risky asset and the risk-free rate.",
    },
    Component: lazy(() => import("../features/risk-return/RiskReturnView")),
  },
  {
    id: "capm",
    path: "/capm",
    navKey: "navCapm",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "CAPM",
      description:
        "Interactive Capital Asset Pricing Model: security market line, beta, market risk premium and Jensen's alpha.",
    },
    Component: lazy(() => import("../features/capm/CapmView")),
  },
  {
    id: "portfolio-lab",
    path: "/portfolio-lab",
    navKey: "navPortfolioLab",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Portfolio Lab",
      description:
        "Interactive two-asset efficient frontier: expected return, volatility, correlation, diversification and the minimum-variance portfolio.",
    },
    Component: lazy(() => import("../features/portfolio-lab/PortfolioLabView")),
  },
  {
    id: "efficient-frontier",
    path: "/efficient-frontier",
    navKey: "navEfficientFrontier",
    category: "portfolio",
    status: "beta",
    seo: {
      title: "Portfolio Optimization",
      description:
        "Interactive Markowitz portfolio optimization: objectives, constraints, the efficient frontier, global minimum variance, tangency portfolio and the cost of constraints.",
    },
    Component: lazy(() => import("../features/efficient-frontier/PortfolioOptimizationView")),
  },
  {
    id: "npv-irr",
    path: "/npv-irr",
    navKey: "navNpvIrr",
    category: "corporate",
    status: "beta",
    seo: {
      title: "NPV / IRR",
      description:
        "Interactive capital budgeting: net present value, internal rate of return, profitability index and the NPV profile.",
    },
    Component: lazy(() => import("../features/npv-irr/NpvIrrView")),
  },
  {
    id: "valuation",
    path: "/valuation",
    navKey: "navValuation",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Valuation (DCF)",
      description:
        "Interactive discounted cash flow valuation: free cashflow projection, terminal value, WACC and enterprise value.",
    },
    Component: lazy(() => import("../features/valuation/ValuationView")),
  },
  {
    id: "tvm",
    path: "/tvm",
    navKey: "navTvm",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Time Value of Money",
      description:
        "Interactive time value of money: compound growth of a principal and annual contributions, interest versus contributions over time.",
    },
    Component: lazy(() => import("../features/tvm/TvmView")),
  },
  {
    id: "wacc",
    path: "/wacc",
    navKey: "navWacc",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Cost of Capital (WACC)",
      description:
        "Interactive weighted average cost of capital: cost of equity, after-tax cost of debt, tax shield and the effect of leverage.",
    },
    Component: lazy(() => import("../features/wacc/WaccView")),
  },
  {
    id: "capital-structure",
    path: "/capital-structure",
    navKey: "navCapitalStructure",
    category: "corporate",
    status: "beta",
    seo: {
      title: "Capital Structure",
      description:
        "Interactive Modigliani–Miller capital structure: levered cost of equity, WACC and the interest tax shield as leverage changes.",
    },
    Component: lazy(() => import("../features/capital-structure/CapitalStructureView")),
  },
  {
    id: "brownian-motion",
    path: "/brownian-motion",
    navKey: "navBrownianMotion",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Brownian Motion",
      description:
        "Interactive arithmetic Brownian motion simulation with drift, volatility and seeded sample paths.",
    },
    Component: lazy(() => import("../features/brownian-motion/BrownianMotionView")),
  },
  {
    id: "gbm",
    path: "/gbm",
    navKey: "navGbm",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Geometric Brownian Motion",
      description:
        "Interactive geometric Brownian motion simulation with drift, volatility, seeded sample paths and the theoretical expected value.",
    },
    Component: lazy(() => import("../features/gbm/GbmView")),
  },
  {
    id: "ito-process",
    path: "/ito-process",
    navKey: "navItoProcess",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Itô Process",
      description:
        "Interactive illustration of Itô's lemma on log prices: the −½σ² drift correction for geometric Brownian motion.",
    },
    Component: lazy(() => import("../features/ito-process/ItoProcessView")),
  },
  {
    id: "monte-carlo",
    path: "/monte-carlo",
    navKey: "navMonteCarlo",
    category: "stochastic",
    status: "beta",
    seo: {
      title: "Monte Carlo",
      description:
        "Interactive Monte Carlo option pricing: simulate terminal prices and watch the estimate converge to Black–Scholes.",
    },
    Component: lazy(() => import("../features/monte-carlo/MonteCarloView")),
  },
  {
    id: "guide",
    path: "/guide",
    navKey: "navGuide",
    category: "guides",
    status: "live",
    seo: {
      title: "Guide",
      description:
        "Narrative guides to understand financial instruments, pricing and hedging concepts.",
    },
    Component: lazy(() => import("../features/guide/GuideView")),
  },
];

/// Modules belonging to a category, in registry order.
export function modulesInCategory(category: ModuleCategory): ModuleDef[] {
  return modules.filter((m) => m.category === category);
}
