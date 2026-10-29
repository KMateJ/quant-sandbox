import { lazy, type ComponentType, type LazyExoticComponent } from "react";
import type { TranslationKey } from "../i18n";
import type { IntuitionDocument } from "../components/intuition";
import { binomialIntuition, blackScholesIntuition, bondIntuition, deltaHedgingIntuition, durationIntuition, frontierIntuition, hestonIntuition, payoffIntuition, treasuryFuturesIntuition, yieldCurveIntuition } from "./intuition";
import { stochasticModelsIntuition } from "./stochasticModelsIntuition";
import { lessonSubNav } from "../components/lesson/labLessons";
import { RANDOM_WALK_PATH, randomWalkLessons } from "../features/random-walk/lessons";
import { BROWNIAN_PATH, brownianLessons } from "../features/brownian-motion/lessons/lessons";
import { stochasticRedirects } from "./stochasticRedirects";
import { moduleAbout, type ModuleAbout } from "./moduleAbout";
import { guideNavItems, guideRedirects, guideTrackById, guideTrackPath } from "../features/guide/guide.meta";
import type { GuideTrackId } from "../features/guide/guide.types";
import { withDeskCopy } from "../languageLoader";
import { GUIDE_SEO_DESC_SUFFIX, guideSeoTitles } from "../features/guide/guide.seo";

/// Top-level navigation categories for the Quant Sandbox module tree.
export type ModuleCategory =
  | "derivatives"
  | "portfolio"
  | "fixed-income"
  | "corporate"
  | "stochastic"
  | "microstructure"
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
  /// Shown as the large tile of its area on the home page.
  homeFeatured?: boolean;
  /// Release date (YYYY-MM-DD); the newest modules head the home page.
  added?: string;
}

export const CATEGORY_ORDER: ModuleCategory[] = [
  "derivatives",
  "portfolio",
  "fixed-income",
  "corporate",
  "stochastic",
  "microstructure",
  "guides",
];

export const CATEGORY_LABEL_KEYS: Record<ModuleCategory, TranslationKey> = {
  derivatives: "catDerivatives",
  portfolio: "catPortfolio",
  "fixed-income": "catFixedIncome",
  corporate: "catCorporate",
  stochastic: "catStochastic",
  microstructure: "catMicrostructure",
  guides: "navGuide",
};

export const CATEGORY_DESC_KEYS: Record<ModuleCategory, TranslationKey> = {
  derivatives: "catDerivativesDesc",
  portfolio: "catPortfolioDesc",
  "fixed-income": "catFixedIncomeDesc",
  corporate: "catCorporateDesc",
  stochastic: "catStochasticDesc",
  microstructure: "catMicrostructureDesc",
  guides: "catGuidesDesc",
};

/// Accent colour per category, used by home cards for visual variety.
export const CATEGORY_ACCENT: Record<ModuleCategory, string> = {
  derivatives: "#22c55e",
  portfolio: "#3b82f6",
  "fixed-income": "#f59e0b",
  corporate: "#ec4899",
  stochastic: "#a855f7",
  microstructure: "#2bb3a3",
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
    homeFeatured: true,
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
    intuition: deltaHedgingIntuition,
    path: "/delta-hedging",
    navKey: "navDeltaHedging",
    category: "derivatives",
    status: "beta",
    seo: { titleKey: "seoTitleDeltaHedging", descKey: "seoDescDeltaHedging" },
    about: moduleAbout("DeltaHedging"),
    relatedGuides: ["delta-hedging", "multi-step-trees"],
    subNav: [
      { id: "lab", labelKey: "navDeltaHedgingLab", to: "/delta-hedging" },
      { id: "desk", labelKey: "navHedgingDesk", descKey: "seoDescHedgingDesk", seoTitle: "Delta Hedging Trading Simulator", to: "/delta-hedging/desk" },
    ],
    Component: lazy(() => import("../features/delta-hedging/DeltaHedgingPages")),
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
    homeFeatured: true,
    intuition: yieldCurveIntuition,
    path: "/yield-curve",
    navKey: "navYieldCurve",
    category: "fixed-income",
    status: "beta",
    seo: { titleKey: "seoTitleYieldCurve", descKey: "seoDescYieldCurve" },
    about: moduleAbout("YieldCurve", 4),
    relatedGuides: ["yield-curve", "bond-pricing"],
    subNav: [
      { id: "lab", labelKey: "navYieldCurveLab", to: "/yield-curve" },
      { id: "desk", labelKey: "navRatesDesk", descKey: "seoDescRatesDesk", seoTitle: "Rates Desk: Hedge a Bond Book with Futures", to: "/yield-curve/desk" },
    ],
    Component: lazy(() => import("../features/yield-curve/YieldCurvePages")),
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
    id: "interest-rate-swap",
    added: "2026-10-24",
    path: "/interest-rate-swap",
    navKey: "navInterestRateSwap",
    category: "fixed-income",
    status: "beta",
    seo: { titleKey: "seoTitleInterestRateSwap", descKey: "seoDescInterestRateSwap" },
    about: moduleAbout("InterestRateSwap", 4),
    relatedGuides: ["interest-rate-swaps", "yield-curve"],
    Component: lazy(() => import("../features/interest-rate-swap/SwapView")),
  },
  {
    id: "callable-bond",
    added: "2026-10-29",
    intuition: bondIntuition,
    path: "/callable-bond",
    navKey: "navCallableBond",
    category: "fixed-income",
    status: "beta",
    seo: { titleKey: "seoTitleCallableBond", descKey: "seoDescCallableBond" },
    about: moduleAbout("CallableBond", 4),
    relatedGuides: ["callable-bonds", "duration-convexity"],
    Component: lazy(() => import("../features/callable-bond/CallableView")),
  },
  {
    id: "immunization",
    added: "2026-10-20",
    path: "/immunization",
    navKey: "navImmunization",
    category: "fixed-income",
    status: "beta",
    seo: { titleKey: "seoTitleImmunization", descKey: "seoDescImmunization" },
    about: moduleAbout("Immunization", 4),
    relatedGuides: ["immunization", "duration-convexity"],
    subNav: [
      { id: "lab", labelKey: "navImmunizationLab", to: "/immunization" },
      { id: "desk", labelKey: "navAlmDesk", descKey: "seoDescAlmDesk", seoTitle: "ALM Desk: Pension Immunization Game", to: "/immunization/desk" },
    ],
    Component: lazy(() => import("../features/immunization/ImmunizationPages")),
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
    id: "fama-french",
    added: "2026-10-29",
    path: "/fama-french",
    navKey: "navFamaFrench",
    category: "portfolio",
    status: "beta",
    seo: { titleKey: "seoTitleFamaFrench", descKey: "seoDescFamaFrench" },
    about: moduleAbout("FamaFrench", 4),
    relatedGuides: ["factor-models", "capm"],
    Component: lazy(() => import("../features/fama-french/FamaFrenchView")),
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
    subNav: [
      { id: "lab", labelKey: "navPortfolioLabLab", to: "/portfolio-lab" },
      { id: "desk", labelKey: "navPortfolioDesk", descKey: "seoDescPortfolioDesk", seoTitle: "Portfolio Manager Desk: Volatility Target Game", to: "/portfolio-lab/desk" },
    ],
    Component: lazy(() => import("../features/portfolio-lab/PortfolioLabPages")),
  },
  {
    id: "efficient-frontier",
    homeFeatured: true,
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
    id: "systemic-risk",
    added: "2026-10-29",
    path: "/systemic-risk",
    navKey: "navSystemicRisk",
    category: "portfolio",
    status: "beta",
    seo: { titleKey: "seoTitleSystemicRisk", descKey: "seoDescSystemicRisk" },
    about: moduleAbout("SystemicRisk", 4),
    relatedGuides: ["credit-risk", "risk-measures"],
    subNav: [
      { id: "network", labelKey: "navSystemicNetwork", to: "/systemic-risk" },
      { id: "shocks", labelKey: "navSystemicShocks", descKey: "seoDescSystemicShocks", seoTitle: "Contagion Simulator: Defaults, Fire Sales and Runs", to: "/systemic-risk/shocks" },
      { id: "episodes", labelKey: "navSystemicEpisodes", descKey: "seoDescSystemicEpisodes", seoTitle: "Systemic Risk Episodes: 2008, LTCM, March 2020, SVB", to: "/systemic-risk/episodes" },
    ],
    Component: lazy(() => import("../features/systemic-risk/SystemicRiskPages")),
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
    homeFeatured: true,
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
    subNav: [
      { id: "lab", labelKey: "navTvmLab", to: "/tvm" },
      { id: "desk", labelKey: "navRetirementDesk", descKey: "seoDescRetirementDesk", seoTitle: "Retirement Desk: Withdrawal and Sequence Risk Game", to: "/tvm/desk" },
    ],
    Component: lazy(() => import("../features/tvm/TvmPages")),
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
    id: "random-walk",
    added: "2026-10-29",
    path: RANDOM_WALK_PATH,
    navKey: "navRandomWalk",
    category: "stochastic",
    status: "beta",
    intuition: stochasticModelsIntuition,
    subNav: lessonSubNav(RANDOM_WALK_PATH, "navRandomWalkLab", randomWalkLessons),
    seo: { titleKey: "seoTitleRandomWalk", descKey: "seoDescRandomWalk" },
    about: moduleAbout("RandomWalk", 4),
    relatedGuides: ["random-walks", "law-of-large-numbers-clt"],
    Component: lazy(() => import("../features/random-walk/RandomWalkPages")),
  },
  {
    id: "brownian-motion",
    homeFeatured: true,
    path: BROWNIAN_PATH,
    navKey: "navBrownianMotion",
    category: "stochastic",
    status: "beta",
    intuition: stochasticModelsIntuition,
    subNav: lessonSubNav(BROWNIAN_PATH, "navBrownianLab", brownianLessons),
    seo: { titleKey: "seoTitleBrownianMotion", descKey: "seoDescBrownianMotion" },
    about: moduleAbout("BrownianMotion", 4),
    relatedGuides: ["random-walks", "ito-lemma"],
    Component: lazy(() => import("../features/brownian-motion/BrownianMotionPages")),
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
    subNav: [
      { id: "lab", labelKey: "navGbmLab", to: "/gbm" },
      { id: "definition", labelKey: "navGbmDefinition", descKey: "seoDescGbmDefinition", seoTitle: "Geometric vs Arithmetic Brownian Motion: Definition", to: "/gbm/definition" },
      { id: "euler-maruyama", labelKey: "navGbmEuler", descKey: "seoDescGbmEuler", seoTitle: "Euler–Maruyama vs Exact GBM: Strong and Weak Error", to: "/gbm/euler-maruyama" },
      { id: "mean-reversion", labelKey: "navGbmMeanReversion", descKey: "seoDescGbmMeanReversion", seoTitle: "Mean Reversion: Ornstein–Uhlenbeck (Vasicek) Simulator", to: "/gbm/mean-reversion" },
      { id: "jumps", labelKey: "navGbmJumps", descKey: "seoDescGbmJumps", seoTitle: "Merton Jump-Diffusion Simulator", to: "/gbm/jumps" },
      { id: "correlated", labelKey: "navGbmCorrelated", descKey: "seoDescGbmCorrelated", seoTitle: "Correlated Brownian Motions (Cholesky)", to: "/gbm/correlated" },
    ],
    Component: lazy(() => import("../features/gbm/GbmPages")),
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
    subNav: [
      { id: "lab", labelKey: "navItoLab", to: "/ito-process" },
      { id: "ito-integral", labelKey: "navItoIntegral", descKey: "seoDescItoIntegral", seoTitle: "Itô Integral: Left, Midpoint and Right Riemann Sums", to: "/ito-process/ito-integral" },
      { id: "itos-lemma", labelKey: "navItosLemma", descKey: "seoDescItosLemma", seoTitle: "Itô's Lemma on a Brownian Path", to: "/ito-process/itos-lemma" },
      { id: "martingales", labelKey: "navMartingales", descKey: "seoDescMartingales", seoTitle: "Martingales and Betting Strategies on a Fair Coin", to: "/ito-process/martingales" },
      { id: "girsanov", labelKey: "navGirsanov", descKey: "seoDescGirsanov", seoTitle: "Girsanov Theorem: Change of Drift by Reweighting", to: "/ito-process/girsanov" },
    ],
    Component: lazy(() => import("../features/ito-process/ItoProcessPages")),
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
    subNav: [
      { id: "lab", labelKey: "navMonteCarloLab", to: "/monte-carlo" },
      { id: "variance-reduction", labelKey: "navMonteCarloVr", descKey: "seoDescMonteCarloVr", seoTitle: "Monte Carlo Variance Reduction", to: "/monte-carlo/variance-reduction" },
      { id: "feynman-kac", labelKey: "navMonteCarloFk", descKey: "seoDescMonteCarloFk", seoTitle: "Feynman-Kac: PDE and Monte Carlo", to: "/monte-carlo/feynman-kac" },
    ],
    Component: lazy(() => import("../features/monte-carlo/MonteCarloPages")),
  },
  {
    id: "order-book",
    path: "/order-book",
    navKey: "navOrderBook",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleOrderBook", descKey: "seoDescOrderBook" },
    about: moduleAbout("OrderBook", 4),
    relatedGuides: ["limit-order-book", "queue-position", "price-impact"],
    Component: lazy(() => import("../features/order-book/OrderBookView")),
  },
  {
    id: "market-making",
    added: "2026-10-29",
    path: "/market-making",
    navKey: "navMarketMaking",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleMarketMaking", descKey: "seoDescMarketMaking" },
    about: moduleAbout("MarketMaking", 4),
    relatedGuides: ["market-makers", "adverse-selection", "market-making-pnl"],
    homeFeatured: true,
    subNav: [
      { id: "lab", labelKey: "navMarketMakingLab", to: "/market-making" },
      { id: "desk", labelKey: "navMarketMakingDesk", descKey: "seoDescMarketMakingDesk", seoTitle: "Market Making Desk: Quote, Hedge, Survive Toxic Flow", to: "/market-making/desk" },
    ],
    Component: lazy(() => import("../features/market-making/MarketMakingPages")),
  },
  {
    id: "avellaneda-stoikov",
    path: "/avellaneda-stoikov",
    navKey: "navAvellanedaStoikov",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleAvellanedaStoikov", descKey: "seoDescAvellanedaStoikov" },
    about: moduleAbout("AvellanedaStoikov", 4),
    relatedGuides: ["inventory-risk", "avellaneda-stoikov"],
    Component: lazy(() => import("../features/avellaneda-stoikov/AvellanedaStoikovView")),
  },
  {
    id: "glosten-milgrom",
    path: "/glosten-milgrom",
    navKey: "navGlostenMilgrom",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleGlostenMilgrom", descKey: "seoDescGlostenMilgrom" },
    about: moduleAbout("GlostenMilgrom", 4),
    relatedGuides: ["glosten-milgrom", "adverse-selection"],
    Component: lazy(() => import("../features/glosten-milgrom/GlostenMilgromView")),
  },
  {
    id: "kyle",
    path: "/kyle",
    navKey: "navKyle",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleKyle", descKey: "seoDescKyle" },
    about: moduleAbout("Kyle", 4),
    relatedGuides: ["kyle-model", "price-impact"],
    Component: lazy(() => import("../features/kyle/KyleView")),
  },
  {
    id: "spread-estimation",
    path: "/spread-estimation",
    navKey: "navSpreadEstimation",
    category: "microstructure",
    status: "beta",
    seo: { titleKey: "seoTitleSpreadEstimation", descKey: "seoDescSpreadEstimation" },
    about: moduleAbout("SpreadEstimation", 4),
    relatedGuides: ["spread-measurement", "glosten-milgrom"],
    Component: lazy(() => import("../features/spread-estimation/SpreadEstimationView")),
  },
  guideModule("derivatives", { titleKey: "seoTitleGuideDerivatives", descKey: "seoDescGuideDerivatives" }),
  guideModule("portfolio", { titleKey: "seoTitleGuidePortfolio", descKey: "seoDescGuidePortfolio" }),
  guideModule("fixed-income", { titleKey: "seoTitleGuideFixedIncome", descKey: "seoDescGuideFixedIncome" }),
  guideModule("corporate", { titleKey: "seoTitleGuideCorporate", descKey: "seoDescGuideCorporate" }),
  guideModule("stochastic", { titleKey: "seoTitleGuideStochastic", descKey: "seoDescGuideStochastic" }),
  guideModule("microstructure", { titleKey: "seoTitleGuideMicrostructure", descKey: "seoDescGuideMicrostructure" }),
  {
    id: "guide-graph",
    path: "/guide/graph",
    navKey: "navGuideGraph",
    icon: "graph",
    category: "guides",
    status: "live",
    seo: { titleKey: "seoTitleGuideGraph", descKey: "seoDescGuideGraph" },
    Component: lazy(() => import("../features/guide/components/graph/GuideGraphPage")),
  },
  {
    id: "sandbox",
    added: "2026-10-24",
    path: "/sandbox",
    navKey: "navSandbox",
    status: "beta",
    seo: { titleKey: "seoTitleSandbox", descKey: "seoDescSandbox" },
    Component: lazy(withDeskCopy(() => import("../features/sandbox/SandboxView"))),
  },
];

/// Old URLs that now live elsewhere.
export const redirects = [...guideRedirects(), ...stochasticRedirects()];

/// A module by its registry id.
export function moduleById(id: string): ModuleDef | undefined {
  return modules.find((m) => m.id === id);
}

/// Modules belonging to a category, in registry order.
export function modulesInCategory(category: ModuleCategory): ModuleDef[] {
  return modules.filter((m) => m.category === category);
}
