import { homeHu } from "./Home.hu";
import { binomialHu } from "./Binomial.hu";
import { payoffHu } from "./Payoff.hu";
import { payoffReplicationHu } from "./PayoffReplication.hu";
import { diffusionHu } from "./Diffusion.hu";
import { blackScholesHu } from "./BlackScholes.hu";
import { themeHu } from "./Theme.hu";
import { notFoundHu } from "./NotFound.hu";
import { seoHu } from "./Seo.hu";
import { hestonHu } from "./Heston.hu";
import { riskReturnHu } from "./RiskReturn.hu";
import { capmHu } from "./Capm.hu";
import { portfolioLabHu } from "./PortfolioLab.hu";
import { bondPricingHu } from "./BondPricing.hu";
import { efficientFrontierHu } from "./EfficientFrontier.hu";
import { npvIrrHu } from "./NpvIrr.hu";
import { valuationHu } from "./Valuation.hu";
import { tvmHu } from "./Tvm.hu";
import { waccHu } from "./Wacc.hu";
import { capitalStructureHu } from "./CapitalStructure.hu";
import { yieldCurveHu } from "./YieldCurve.hu";
import { durationConvexityHu } from "./DurationConvexity.hu";
import { brownianMotionHu } from "./BrownianMotion.hu";
import { gbmHu } from "./Gbm.hu";
import { itoProcessHu } from "./ItoProcess.hu";
import { monteCarloHu } from "./MonteCarlo.hu";
import { stochasticModelsHu } from "./StochasticModels.hu";
import { brownianFundamentalsHu } from "./BrownianFundamentals.hu";
import { wienerProcessHu } from "./WienerProcess.hu";
import { moduleAboutHu } from "./ModuleAbout.hu";
import { pathGeometryHu } from "./PathGeometry.hu";
import { deltaHedgingHu } from "./DeltaHedging.hu";
import { intuitionHu } from "./Intuition.hu";
import { legacyIntuitionHu } from "./LegacyIntuition.hu";
import { treasuryFuturesHu } from "./TreasuryFutures.hu";
import { immunizationHu } from "./Immunization.hu";
import { guideHu } from "./Guide.hu";
import { guidePortfolioHu } from "./GuidePortfolio.hu";
import { guideFixedIncomeHu } from "./GuideFixedIncome.hu";
import { guideCorporateHu } from "./GuideCorporate.hu";
import { guideStochasticHu } from "./GuideStochastic.hu";
import { guideStochasticTheoryHu } from "./GuideStochasticTheory.hu";
import { guideWave2Hu } from "./GuideWave2.hu";
import { guideWave3Hu } from "./GuideWave3.hu";
import { guideWave4Hu } from "./GuideWave4.hu";
import { guideGraphHu } from "./GuideGraph.hu";
import { guideInteractiveHu } from "./GuideInteractive.hu";
import { guideInteractive2Hu } from "./GuideInteractive2.hu";
import { playbackHu } from "./Playback.hu";
import { labControlsHu } from "./LabControls.hu";
import { bondInputsHu } from "./BondInputs.hu";
import { labPrimitivesHu } from "./LabPrimitives.hu";
import type { TranslationKey } from "./index.en";

/// Every Hungarian UI string, loaded lazily (`loadLanguage` in languageLoader.ts) and checked to have exactly the English keys.
export const hu = {
  ...intuitionHu,
  ...legacyIntuitionHu,
  ...homeHu,
  ...binomialHu,
  ...payoffHu,
  ...payoffReplicationHu,
  ...diffusionHu,
  ...blackScholesHu,
  ...hestonHu,
  ...riskReturnHu,
  ...capmHu,
  ...portfolioLabHu,
  ...efficientFrontierHu,
  ...npvIrrHu,
  ...valuationHu,
  ...tvmHu,
  ...waccHu,
  ...capitalStructureHu,
  ...bondPricingHu,
  ...yieldCurveHu,
  ...durationConvexityHu,
  ...treasuryFuturesHu,
  ...immunizationHu,
  ...guideHu,
  ...guidePortfolioHu,
  ...guideFixedIncomeHu,
  ...guideCorporateHu,
  ...guideStochasticHu,
  ...guideStochasticTheoryHu,
  ...guideWave2Hu,
  ...guideWave3Hu,
  ...guideWave4Hu,
  ...guideGraphHu,
  ...guideInteractiveHu,
  ...guideInteractive2Hu,
  ...playbackHu,
  ...labControlsHu,
  ...bondInputsHu,
  ...labPrimitivesHu,
  ...brownianMotionHu,
  ...gbmHu,
  ...itoProcessHu,
  ...monteCarloHu,
  ...stochasticModelsHu,
  ...brownianFundamentalsHu,
  ...wienerProcessHu,
  ...moduleAboutHu,
  ...pathGeometryHu,
  ...deltaHedgingHu,
  ...themeHu,
  ...notFoundHu,
  ...seoHu,
  navGuide: "Útmutató",
} satisfies Record<TranslationKey, string>;

type NoExtraKeys<T extends never> = T;
/// Fails to compile when a Hungarian table has a key English lacks.
export type HuOnlyKeys = NoExtraKeys<Exclude<keyof typeof hu, TranslationKey>>;
