import type { desksEn } from "./desks.en";
import { homeEn } from "./Home";
import { binomialEn } from "./Binomial";
import { payoffEn } from "./Payoff";
import { payoffReplicationEn } from "./PayoffReplication";
import { diffusionEn } from "./Diffusion";
import { blackScholesEn } from "./BlackScholes";
import { themeEn } from "./Theme";
import { notFoundEn } from "./NotFound";
import { seoEn } from "./Seo";
import { hestonEn } from "./Heston";
import { riskReturnEn } from "./RiskReturn";
import { capmEn } from "./Capm";
import { famaFrenchEn } from "./FamaFrench";
import { famaFrenchFundEn } from "./FamaFrenchFund";
import { famaFrenchSortEn } from "./FamaFrenchSort";
import { portfolioLabEn } from "./PortfolioLab";
import { bondPricingEn } from "./BondPricing";
import { efficientFrontierEn } from "./EfficientFrontier";
import { npvIrrEn } from "./NpvIrr";
import { valuationEn } from "./Valuation";
import { tvmEn } from "./Tvm";
import { waccEn } from "./Wacc";
import { capitalStructureEn } from "./CapitalStructure";
import { yieldCurveEn } from "./YieldCurve";
import { durationConvexityEn } from "./DurationConvexity";
import { brownianMotionEn } from "./BrownianMotion";
import { randomWalkEn } from "./RandomWalk";
import { gbmEn } from "./Gbm";
import { sdePagesEn } from "./SdePages";
import { itoProcessEn } from "./ItoProcess";
import { monteCarloEn } from "./MonteCarlo";
import { stochasticModelsEn } from "./StochasticModels";
import { brownianFundamentalsEn } from "./BrownianFundamentals";
import { wienerProcessEn } from "./WienerProcess";
import { moduleAboutEn } from "./ModuleAbout";
import { pathGeometryEn } from "./PathGeometry";
import { deltaHedgingEn } from "./DeltaHedging";
import { intuitionEn } from "./Intuition";
import { legacyIntuitionEn } from "./LegacyIntuition";
import { treasuryFuturesEn } from "./TreasuryFutures";
import { interestRateSwapEn } from "./InterestRateSwap";
import { callableBondEn } from "./CallableBond";
import { immunizationEn } from "./Immunization";
import { guideEn } from "./Guide";
import { guidePortfolioEn } from "./GuidePortfolio";
import { guideFixedIncomeEn } from "./GuideFixedIncome";
import { guideCorporateEn } from "./GuideCorporate";
import { guideStochasticEn } from "./GuideStochastic";
import { guideStochasticTheoryEn } from "./GuideStochasticTheory";
import { guideWave2En } from "./GuideWave2";
import { guideWave3En } from "./GuideWave3";
import { guideWave4En } from "./GuideWave4";
import { guideGraphEn } from "./GuideGraph";
import { guideInteractiveEn } from "./GuideInteractive";
import { guideInteractive2En } from "./GuideInteractive2";
import { playbackEn } from "./Playback";
import { labControlsEn } from "./LabControls";
import { bondInputsEn } from "./BondInputs";
import { labPrimitivesEn } from "./LabPrimitives";
import { challengesEn } from "./Challenges";
import { orderBookEn } from "./OrderBook";
import { marketMakingEn } from "./MarketMaking";
import { avellanedaStoikovEn } from "./AvellanedaStoikov";
import { glostenMilgromEn } from "./GlostenMilgrom";
import { kyleEn } from "./Kyle";
import { spreadEstimationEn } from "./SpreadEstimation";
import { networkChartEn } from "./NetworkChart";
import { systemicRiskEn } from "./SystemicRisk";
import { systemicRiskShocksEn } from "./SystemicRiskShocks";
import { systemicRiskEpisodesEn } from "./SystemicRiskEpisodes";
import { guideMicrostructureEn } from "./GuideMicrostructure";
import { guideFactorRiskEn } from "./GuideFactorRisk";

/// Every English UI string; the source of truth for `TranslationKey`.
export const en = {
  ...intuitionEn,
  ...legacyIntuitionEn,
  ...homeEn,
  ...binomialEn,
  ...payoffEn,
  ...payoffReplicationEn,
  ...diffusionEn,
  ...blackScholesEn,
  ...hestonEn,
  ...riskReturnEn,
  ...capmEn,
  ...famaFrenchEn,
  ...famaFrenchFundEn,
  ...famaFrenchSortEn,
  ...portfolioLabEn,
  ...efficientFrontierEn,
  ...npvIrrEn,
  ...valuationEn,
  ...tvmEn,
  ...waccEn,
  ...capitalStructureEn,
  ...bondPricingEn,
  ...yieldCurveEn,
  ...durationConvexityEn,
  ...treasuryFuturesEn,
  ...interestRateSwapEn,
  ...callableBondEn,
  ...immunizationEn,
  ...guideEn,
  ...guidePortfolioEn,
  ...guideFixedIncomeEn,
  ...guideCorporateEn,
  ...guideStochasticEn,
  ...guideStochasticTheoryEn,
  ...guideWave2En,
  ...guideWave3En,
  ...guideWave4En,
  ...guideGraphEn,
  ...guideInteractiveEn,
  ...guideInteractive2En,
  ...playbackEn,
  ...labControlsEn,
  ...bondInputsEn,
  ...labPrimitivesEn,
  ...brownianMotionEn,
  ...randomWalkEn,
  ...gbmEn,
  ...sdePagesEn,
  ...itoProcessEn,
  ...monteCarloEn,
  ...stochasticModelsEn,
  ...brownianFundamentalsEn,
  ...wienerProcessEn,
  ...moduleAboutEn,
  ...pathGeometryEn,
  ...deltaHedgingEn,
  ...themeEn,
  ...notFoundEn,
  ...seoEn,
  ...challengesEn,
  ...orderBookEn,
  ...marketMakingEn,
  ...avellanedaStoikovEn,
  ...glostenMilgromEn,
  ...kyleEn,
  ...spreadEstimationEn,
  ...networkChartEn,
  ...systemicRiskEn,
  ...systemicRiskShocksEn,
  ...systemicRiskEpisodesEn,
  ...guideMicrostructureEn,
  ...guideFactorRiskEn,
  navGuide: "Guide",
};

/// Keys of the tables loaded up front.
export type BaseKey = keyof typeof en;
/// Keys of the desk tables, loaded with the desk routes.
export type DeskKey = keyof typeof desksEn;
export type TranslationKey = BaseKey | DeskKey;
