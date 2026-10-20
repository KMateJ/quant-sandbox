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
  /// Search-result title and description, as keys into the Seo tables (EN and HU).
  seo: { titleKey: TranslationKey; descKey: TranslationKey };
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
    seo: { titleKey: "seoTitleHome", descKey: "seoDescHome" },
    Component: lazy(() => import("../features/home/HomeView").then((m) => ({ default: m.HomeView }))),
  },
  {
    id: "payoff",
    intuition: payoffIntuition,
    path: "/payoff",
    navKey: "navPayoff",
    category: "derivatives",
    status: "live",
    seo: { titleKey: "seoTitlePayoff", descKey: "seoDescPayoff" },
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
    seo: { titleKey: "seoTitleBinomial", descKey: "seoDescBinomial" },
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
    seo: { titleKey: "seoTitleBlackScholes", descKey: "seoDescBlackScholes" },
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
    seo: { titleKey: "seoTitleHeston", descKey: "seoDescHeston" },
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
    seo: { titleKey: "seoTitleDeltaHedging", descKey: "seoDescDeltaHedging" },
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
    seo: { titleKey: "seoTitleBondPricing", descKey: "seoDescBondPricing" },
    about: moduleAbout("BondPricing", 4),
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
    seo: { titleKey: "seoTitleYieldCurve", descKey: "seoDescYieldCurve" },
    about: moduleAbout("YieldCurve", 4),
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
    seo: { titleKey: "seoTitleDurationConvexity", descKey: "seoDescDurationConvexity" },
    about: moduleAbout("DurationConvexity", 4),
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
    seo: { titleKey: "seoTitleTreasuryFutures", descKey: "seoDescTreasuryFutures" },
    about: moduleAbout("TreasuryFutures", 4),
    relatedGuides: ["yield-curve", "duration-convexity"],
    Component: lazy(() => import("../features/treasury-futures/TreasuryFuturesView")),
  },
  {
    id: "immunization",
    path: "/immunization",
    navKey: "navImmunization",
    category: "fixed-income",
    status: "beta",
    seo: { titleKey: "seoTitleImmunization", descKey: "seoDescImmunization" },
    about: moduleAbout("Immunization", 4),
    relatedGuides: ["immunization", "duration-convexity"],
    Component: lazy(() => import("../features/immunization/ImmunizationView")),
  },
  {
    id: "risk-return",
    path: "/risk-return",
    navKey: "navRiskReturn",
    category: "portfolio",
    status: "beta",
    seo: { titleKey: "seoTitleRiskReturn", descKey: "seoDescRiskReturn" },
    about: moduleAbout("RiskReturn", 4),
    relatedGuides: ["returns-volatility", "diversification"],
    Component: lazy(() => import("../features/risk-return/RiskReturnView")),
  },
  {
    id: "capm",
    path: "/capm",
    navKey: "navCapm",
    category: "portfolio",
    status: "beta",
    seo: { titleKey: "seoTitleCapm", descKey: "seoDescCapm" },
    about: moduleAbout("Capm", 4),
    relatedGuides: ["capm", "efficient-frontier"],
    Component: lazy(() => import("../features/capm/CapmView")),
  },
  {
    id: "portfolio-lab",
    path: "/portfolio-lab",
    navKey: "navPortfolioLab",
    category: "portfolio",
    status: "beta",
    seo: { titleKey: "seoTitlePortfolioLab", descKey: "seoDescPortfolioLab" },
    about: moduleAbout("PortfolioLab", 4),
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
    seo: { titleKey: "seoTitleEfficientFrontier", descKey: "seoDescEfficientFrontier" },
    about: moduleAbout("EfficientFrontier", 4),
    relatedGuides: ["efficient-frontier", "diversification", "capm"],
    Component: lazy(() => import("../features/efficient-frontier/PortfolioOptimizationView")),
  },
  {
    id: "npv-irr",
    path: "/npv-irr",
    navKey: "navNpvIrr",
    category: "corporate",
    status: "beta",
    seo: { titleKey: "seoTitleNpvIrr", descKey: "seoDescNpvIrr" },
    about: moduleAbout("NpvIrr", 4),
    relatedGuides: ["npv-irr", "interest-discounting"],
    Component: lazy(() => import("../features/npv-irr/NpvIrrView")),
  },
  {
    id: "valuation",
    path: "/valuation",
    navKey: "navValuation",
    category: "corporate",
    status: "beta",
    seo: { titleKey: "seoTitleValuation", descKey: "seoDescValuation" },
    about: moduleAbout("Valuation", 4),
    relatedGuides: ["dcf-valuation", "wacc"],
    Component: lazy(() => import("../features/valuation/ValuationView")),
  },
  {
    id: "tvm",
    path: "/tvm",
    navKey: "navTvm",
    category: "corporate",
    status: "beta",
    seo: { titleKey: "seoTitleTvm", descKey: "seoDescTvm" },
    about: moduleAbout("Tvm", 4),
    relatedGuides: ["interest-discounting", "npv-irr"],
    Component: lazy(() => import("../features/tvm/TvmView")),
  },
  {
    id: "wacc",
    path: "/wacc",
    navKey: "navWacc",
    category: "corporate",
    status: "beta",
    seo: { titleKey: "seoTitleWacc", descKey: "seoDescWacc" },
    about: moduleAbout("Wacc", 4),
    relatedGuides: ["wacc", "capital-structure"],
    Component: lazy(() => import("../features/wacc/WaccView")),
  },
  {
    id: "capital-structure",
    path: "/capital-structure",
    navKey: "navCapitalStructure",
    category: "corporate",
    status: "beta",
    seo: { titleKey: "seoTitleCapitalStructure", descKey: "seoDescCapitalStructure" },
    about: moduleAbout("CapitalStructure", 4),
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
    seo: { titleKey: "seoTitleStochasticModels", descKey: "seoDescStochasticModels" },
    about: moduleAbout("StochasticModels", 4),
    Component: lazy(() => import("../features/stochastic-models/StochasticModelsView")),
  },
  {
    id: "brownian-motion",
    path: "/brownian-motion",
    navKey: "navBrownianMotion",
    category: "stochastic",
    status: "beta",
    seo: { titleKey: "seoTitleBrownianMotion", descKey: "seoDescBrownianMotion" },
    about: moduleAbout("BrownianMotion", 4),
    relatedGuides: ["random-walks", "ito-lemma"],
    Component: lazy(() => import("../features/brownian-motion/BrownianMotionView")),
  },
  {
    id: "gbm",
    path: "/gbm",
    navKey: "navGbm",
    category: "stochastic",
    status: "beta",
    seo: { titleKey: "seoTitleGbm", descKey: "seoDescGbm" },
    about: moduleAbout("Gbm", 4),
    relatedGuides: ["gbm", "returns-volatility"],
    Component: lazy(() => import("../features/gbm/GbmView")),
  },
  {
    id: "ito-process",
    path: "/ito-process",
    navKey: "navItoProcess",
    category: "stochastic",
    status: "beta",
    seo: { titleKey: "seoTitleItoProcess", descKey: "seoDescItoProcess" },
    about: moduleAbout("ItoProcess", 4),
    relatedGuides: ["ito-lemma", "random-walks"],
    Component: lazy(() => import("../features/ito-process/ItoProcessView")),
  },
  {
    id: "monte-carlo",
    path: "/monte-carlo",
    navKey: "navMonteCarlo",
    category: "stochastic",
    status: "beta",
    seo: { titleKey: "seoTitleMonteCarlo", descKey: "seoDescMonteCarlo" },
    about: moduleAbout("MonteCarlo", 4),
    relatedGuides: ["monte-carlo-pricing", "gbm"],
    Component: lazy(() => import("../features/monte-carlo/MonteCarloView")),
  },
  guideModule("derivatives", { titleKey: "seoTitleGuideDerivatives", descKey: "seoDescGuideDerivatives" }),
  guideModule("portfolio", { titleKey: "seoTitleGuidePortfolio", descKey: "seoDescGuidePortfolio" }),
  guideModule("fixed-income", { titleKey: "seoTitleGuideFixedIncome", descKey: "seoDescGuideFixedIncome" }),
  guideModule("corporate", { titleKey: "seoTitleGuideCorporate", descKey: "seoDescGuideCorporate" }),
  guideModule("stochastic", { titleKey: "seoTitleGuideStochastic", descKey: "seoDescGuideStochastic" }),
  {
    id: "guide-graph",
    path: "/guide/graph",
    navKey: "navGuideGraph",
    icon: "guide",
    category: "guides",
    status: "live",
    seo: { titleKey: "seoTitleGuideGraph", descKey: "seoDescGuideGraph" },
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
