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
import { gbmEn } from "./Gbm";
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
import { hedgingDeskEn } from "./HedgingDesk";
import { hedgingDeskMissionsEn } from "./HedgingDeskMissions";
import { hedgingDeskSideEn } from "./HedgingDeskSide";
import { hedgingDeskDebriefEn } from "./HedgingDeskDebrief";
import { hedgingDeskChartsEn } from "./HedgingDeskCharts";
import { hedgingDeskMissionScreenEn } from "./HedgingDeskMissionScreen";
import { hedgingDeskDemoEn } from "./HedgingDeskDemo";
import { hedgingDeskDemoStepsEn } from "./HedgingDeskDemoSteps";
import { hedgingDeskHelpEn } from "./HedgingDeskHelp";
import { hedgingDeskHelpAdviceEn } from "./HedgingDeskHelpAdvice";
import { hedgingDeskHelpGuideEn } from "./HedgingDeskHelpGuide";
import { hedgingDeskHelpWhatIfEn } from "./HedgingDeskHelpWhatIf";

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
  ...gbmEn,
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
  ...hedgingDeskEn,
  ...hedgingDeskMissionsEn,
  ...hedgingDeskSideEn,
  ...hedgingDeskDebriefEn,
  ...hedgingDeskChartsEn,
  ...hedgingDeskMissionScreenEn,
  ...hedgingDeskDemoEn,
  ...hedgingDeskDemoStepsEn,
  ...hedgingDeskHelpEn,
  ...hedgingDeskHelpAdviceEn,
  ...hedgingDeskHelpGuideEn,
  ...hedgingDeskHelpWhatIfEn,
  navGuide: "Guide",
};

export type TranslationKey = keyof typeof en;
