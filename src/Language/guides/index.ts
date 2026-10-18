import type { GuideLessonContent } from "../../features/guide/guide.content.types";
import type { GuideId } from "../../features/guide/guide.types";
import { blackScholes } from "./blackScholes";
import { deltaHedging } from "./deltaHedging";
import { gbm } from "./gbm";
import { instruments } from "./instruments";
import { interestDiscounting } from "./interestDiscounting";
import { multiStepTrees } from "./multiStepTrees";
import { noArbitrage } from "./noArbitrage";
import { oneStepBinomial } from "./oneStepBinomial";
import { putCallParity } from "./putCallParity";
import { randomWalks } from "./randomWalks";
import { returnsVolatility } from "./returnsVolatility";
import { riskNeutral } from "./riskNeutral";
import { strategies } from "./strategies";
import { diversification } from "./diversification";
import { efficientFrontier } from "./efficientFrontier";
import { capm } from "./capm";
import { bondPricing } from "./bondPricing";
import { durationConvexity } from "./durationConvexity";
import { yieldCurve } from "./yieldCurve";
import { npvIrr } from "./npvIrr";
import { wacc } from "./wacc";
import { capitalStructure } from "./capitalStructure";
import { dcfValuation } from "./dcfValuation";
import { itoLemma } from "./itoLemma";
import { monteCarloPricing } from "./monteCarloPricing";
import { greeks } from "./greeks";
import { impliedVolatility } from "./impliedVolatility";
import { staticReplication } from "./staticReplication";
import { riskMeasures } from "./riskMeasures";
import { meanReversion } from "./meanReversion";
import { treasuryFutures } from "./treasuryFutures";
import { stochasticVolatility } from "./stochasticVolatility";
import { americanOptions } from "./americanOptions";
import { interestRateSwaps } from "./interestRateSwaps";
import { changeOfMeasure } from "./changeOfMeasure";
import { realOptions } from "./realOptions";
import { exoticOptions } from "./exoticOptions";
import { jumpDiffusion } from "./jumpDiffusion";
import { creditRisk } from "./creditRisk";
import { factorModels } from "./factorModels";
import { annuities } from "./annuities";
import { valuationMultiples } from "./valuationMultiples";
import { riskAversion } from "./riskAversion";
import { performanceMeasures } from "./performanceMeasures";
import { immunization } from "./immunization";
import { callableBonds } from "./callableBonds";
import { martingales } from "./martingales";
import { sdeSimulation } from "./sdeSimulation";
import { probabilitySpaces } from "./probabilitySpaces";
import { filtrations } from "./filtrations";
import { brownianProperties } from "./brownianProperties";
import { reflectionPrinciple } from "./reflectionPrinciple";
import { brownianBridge } from "./brownianBridge";
import { itoIntegral } from "./itoIntegral";
import { feynmanKac } from "./feynmanKac";

/// Body text of every lesson, per language.
export const guideContent: Record<GuideId, GuideLessonContent> = {
  "interest-discounting": interestDiscounting,
  "returns-volatility": returnsVolatility,
  "random-walks": randomWalks,
  instruments,
  strategies,
  "no-arbitrage": noArbitrage,
  "put-call-parity": putCallParity,
  "one-step-binomial": oneStepBinomial,
  "risk-neutral": riskNeutral,
  "multi-step-trees": multiStepTrees,
  "delta-hedging": deltaHedging,
  gbm,
  "toward-black-scholes": blackScholes,
  diversification,
  "efficient-frontier": efficientFrontier,
  capm,
  "bond-pricing": bondPricing,
  "duration-convexity": durationConvexity,
  "yield-curve": yieldCurve,
  "npv-irr": npvIrr,
  wacc,
  "capital-structure": capitalStructure,
  "dcf-valuation": dcfValuation,
  "ito-lemma": itoLemma,
  "monte-carlo-pricing": monteCarloPricing,
  greeks,
  "implied-volatility": impliedVolatility,
  "static-replication": staticReplication,
  "risk-measures": riskMeasures,
  "mean-reversion": meanReversion,
  "treasury-futures": treasuryFutures,
  "stochastic-volatility": stochasticVolatility,
  "american-options": americanOptions,
  "interest-rate-swaps": interestRateSwaps,
  "change-of-measure": changeOfMeasure,
  "real-options": realOptions,
  "exotic-options": exoticOptions,
  "jump-diffusion": jumpDiffusion,
  "credit-risk": creditRisk,
  "factor-models": factorModels,
  annuities,
  "valuation-multiples": valuationMultiples,
  "risk-aversion": riskAversion,
  "performance-measures": performanceMeasures,
  immunization,
  "callable-bonds": callableBonds,
  martingales,
  "sde-simulation": sdeSimulation,
  "probability-spaces": probabilitySpaces,
  filtrations,
  "brownian-properties": brownianProperties,
  "reflection-principle": reflectionPrinciple,
  "brownian-bridge": brownianBridge,
  "ito-integral": itoIntegral,
  "feynman-kac": feynmanKac,
};
