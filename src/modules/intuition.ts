import type { IntuitionDocument, IntuitionSection } from "../components/intuition";

export const yieldCurveIntuition: IntuitionDocument = {
  titleKey: "yieldCurveTitle",
  sections: [
    { id: "par-rate", titleKey: "ycParRate", summaryKey: "ycParIntuitionSummary", bodyKey: "ycParIntuitionBody" },
    { id: "zero-rate", titleKey: "ycZeroRate", summaryKey: "ycZeroIntuitionSummary", bodyKey: "ycZeroIntuitionBody", formula: "DF(T)=(1+z_T)^{-T}" },
    { id: "forward-rate", titleKey: "ycForwardRate", summaryKey: "ycForwardIntuitionSummary", bodyKey: "ycForwardIntuitionBody", formula: "1+f_{a,b}=\\left(\\frac{DF(a)}{DF(b)}\\right)^{1/(b-a)}" },
    { id: "discount-factor", titleKey: "ycDiscountFactor", summaryKey: "ycDfIntuitionSummary", bodyKey: "ycDfIntuitionBody" },
    { id: "local-amplification", titleKey: "ycAmplificationTitle", summaryKey: "ycAmplificationSummary", bodyKey: "ycAmplificationBody" },
  ],
};

const bondSections: readonly IntuitionSection[] = [
  { id: "face-value", titleKey: "intuitionFaceTitle", summaryKey: "intuitionFaceSummary", bodyKey: "intuitionFaceBody" },
  { id: "maturity", titleKey: "intuitionBondMaturityTitle", summaryKey: "intuitionBondMaturitySummary", bodyKey: "intuitionBondMaturityBody" },
  { id: "payment-frequency", titleKey: "intuitionFrequencyTitle", summaryKey: "intuitionFrequencySummary", bodyKey: "intuitionFrequencyBody", formula: "CF_{coupon}=Fc/m,\\quad DF_i=(1+y/m)^{-i}" },
  { id: "ytm", titleKey: "intuitionYtmTitle", summaryKey: "intuitionYtmSummary", bodyKey: "intuitionYtmBody" },
  { id: "coupon-rate", titleKey: "intuitionCouponTitle", summaryKey: "intuitionCouponSummary", bodyKey: "intuitionCouponBody" },
  { id: "price", titleKey: "intuitionPriceTitle", summaryKey: "intuitionPriceSummary", bodyKey: "intuitionPriceBody", formula: "P=\\sum_i \\frac{CF_i}{(1+y/m)^{m t_i}}" },
  { id: "macaulay-duration", titleKey: "intuitionMacaulayTitle", summaryKey: "intuitionMacaulaySummary", bodyKey: "intuitionMacaulayBody", formula: "D_{Mac}=\\frac{\\sum_i t_i\\,PV(CF_i)}{P}" },
  { id: "modified-duration", titleKey: "intuitionModifiedTitle", summaryKey: "intuitionModifiedSummary", bodyKey: "intuitionModifiedBody", formula: "D_{mod}=\\frac{D_{Mac}}{1+y/m},\\quad \\frac{\\Delta P}{P}\\approx -D_{mod}\\Delta y", exampleKey: "intuitionModifiedExample" },
  { id: "convexity", titleKey: "intuitionConvexityTitle", summaryKey: "intuitionConvexitySummary", bodyKey: "intuitionConvexityBody", formula: "\\frac{\\Delta P}{P}\\approx -D_{mod}\\Delta y+\\frac12 C(\\Delta y)^2" },
];

export const bondIntuition: IntuitionDocument = {
  titleKey: "bondPricingTitle",
  sections: [
    ...bondSections,
    { id: "cash-flows", titleKey: "intuitionCashflowsTitle", summaryKey: "intuitionCashflowsSummary", bodyKey: "intuitionCashflowsBody" },
    { id: "discount-factor", titleKey: "intuitionDiscountFactorTitle", summaryKey: "intuitionDiscountFactorSummary", bodyKey: "intuitionDiscountFactorBody" },
    { id: "price-yield", titleKey: "intuitionPriceYieldTitle", summaryKey: "intuitionPriceYieldSummary", bodyKey: "intuitionPriceYieldBody" },
    { id: "split-scale", titleKey: "intuitionSplitScaleTitle", summaryKey: "intuitionSplitScaleSummary", bodyKey: "intuitionSplitScaleBody" },
  ],
};
export const durationIntuition: IntuitionDocument = {
  titleKey: "durationConvexityTitle",
  sections: [
    ...bondSections,
    { id: "dv01", titleKey: "intuitionDv01Title", summaryKey: "intuitionDv01Summary", bodyKey: "intuitionDv01Body", formula: "DV01\\approx P\\,D_{mod}\\,10^{-4}" },
    { id: "yield-shock", titleKey: "intuitionShockTitle", summaryKey: "intuitionShockSummary", bodyKey: "intuitionShockBody" },
    { id: "exact-repricing", titleKey: "intuitionRepricingTitle", summaryKey: "intuitionRepricingSummary", bodyKey: "intuitionRepricingBody", formula: "\\Delta P\\%=100\\frac{P_{new}-P_0}{P_0}" },
    { id: "approximation-error", titleKey: "intuitionErrorTitle", summaryKey: "intuitionErrorSummary", bodyKey: "intuitionErrorBody", formula: "e=\\widehat{\\Delta P\\%}-\\Delta P\\%_{exact},\\quad |e|_{bp}=100|e|" },
  ],
};
export const treasuryFuturesIntuition: IntuitionDocument = {
  titleKey: "tfIntuitionTitle",
  sections: [
    { id: "conversion-factor", titleKey: "tfFactor", summaryKey: "tfFactorSummary", bodyKey: "tfFactorBody", formula: "CF=\\frac{P_{notional}(6\\%)}{100}" },
    { id: "invoice-price", titleKey: "tfInvoice", summaryKey: "tfInvoiceSummary", bodyKey: "tfInvoiceBody", formula: "Invoice_{dirty}=F\\times CF+AI_{delivery}" },
    { id: "net-basis", titleKey: "tfBasis", summaryKey: "tfBasisSummary", bodyKey: "tfBasisBody", formula: "NetBasis=P_{clean}-F\\times CF" },
    { id: "accrued-interest", titleKey: "tfAccrued", summaryKey: "tfAccruedSummary", bodyKey: "tfAccruedBody" },
  ],
};
export const frontierIntuition: IntuitionDocument = {
  titleKey: "optTitle",
  sections: [
    { id: "efficient-frontier", titleKey: "intuitionFrontierTitle", summaryKey: "intuitionFrontierSummary", bodyKey: "intuitionFrontierBody" },
    { id: "expected-return", titleKey: "intuitionReturnTitle", summaryKey: "intuitionReturnSummary", bodyKey: "intuitionReturnBody", formula: "\\mathbb E[R_p]=w^\\top\\mu" },
    { id: "volatility", titleKey: "intuitionVolTitle", summaryKey: "intuitionVolSummary", bodyKey: "intuitionVolBody", formula: "\\sigma_p=\\sqrt{w^\\top\\Sigma w}" },
    { id: "sharpe-ratio", titleKey: "intuitionSharpeTitle", summaryKey: "intuitionSharpeSummary", bodyKey: "intuitionSharpeBody", formula: "SR=\\frac{\\mathbb E[R_p]-r_f}{\\sigma_p}" },
    { id: "capital-market-line", titleKey: "intuitionCmlTitle", summaryKey: "intuitionCmlSummary", bodyKey: "intuitionCmlBody", formula: "\\mathbb E[R_p]=r_f+SR_{tan}\\,\\sigma_p" },
    { id: "constraints", titleKey: "intuitionConstraintsTitle", summaryKey: "intuitionConstraintsSummary", bodyKey: "intuitionConstraintsBody" },
    { id: "target-return", titleKey: "intuitionTargetReturnTitle", summaryKey: "intuitionTargetReturnSummary", bodyKey: "intuitionTargetReturnBody" },
    { id: "target-volatility", titleKey: "intuitionTargetVolTitle", summaryKey: "intuitionTargetVolSummary", bodyKey: "intuitionTargetVolBody" },
    { id: "weight-bounds", titleKey: "intuitionBoundsTitle", summaryKey: "intuitionBoundsSummary", bodyKey: "intuitionBoundsBody", formula: "\\sum_i w_i=1,\\quad l\\le w_i\\le u" },
    { id: "risk-free-rate", titleKey: "intuitionRiskFreeTitle", summaryKey: "intuitionRiskFreeSummary", bodyKey: "intuitionRiskFreeBody" },
    { id: "gross-exposure", titleKey: "intuitionGrossTitle", summaryKey: "intuitionGrossSummary", bodyKey: "intuitionGrossBody", formula: "G=\\sum_i|w_i|" },
    { id: "allocation", titleKey: "intuitionAllocationTitle", summaryKey: "intuitionAllocationSummary", bodyKey: "intuitionAllocationBody" },
    { id: "constraint-cost", titleKey: "intuitionCostTitle", summaryKey: "intuitionCostSummary", bodyKey: "intuitionCostBody" },
    { id: "portfolio-selection", titleKey: "intuitionSelectionTitle", summaryKey: "intuitionSelectionSummary", bodyKey: "intuitionSelectionBody" },
  ],
};
export const payoffIntuition: IntuitionDocument = {
  titleKey: "navPayoff",
  sections: [
    { id: "payoff-profit", titleKey: "intuitionPayoffTitle", summaryKey: "intuitionPayoffSummary", bodyKey: "intuitionPayoffBody" },
    { id: "positions", titleKey: "intuitionPositionsTitle", summaryKey: "intuitionPositionsSummary", bodyKey: "intuitionPositionsBody" },
    { id: "instruments", titleKey: "intuitionInstrumentsTitle", summaryKey: "intuitionInstrumentsSummary", bodyKey: "intuitionInstrumentsBody" },
    { id: "synthetic-strategies", titleKey: "intuitionSyntheticTitle", summaryKey: "intuitionSyntheticSummary", bodyKey: "intuitionSyntheticBody", formula: "(S_T-K)^+-(K-S_T)^+=S_T-K" },
  ],
};
export const binomialIntuition: IntuitionDocument = {
  titleKey: "navBinomial",
  sections: [
    { id: "stock-tree", titleKey: "intuitionTreeTitle", summaryKey: "intuitionTreeSummary", bodyKey: "intuitionTreeBody" },
    { id: "risk-neutral-probability", titleKey: "intuitionRiskNeutralTitle", summaryKey: "intuitionRiskNeutralSummary", bodyKey: "intuitionRiskNeutralBody", formula: "q=\\frac{1+r-d}{u-d}" },
    { id: "replication", titleKey: "intuitionReplicationTitle", summaryKey: "intuitionReplicationSummary", bodyKey: "intuitionReplicationBody" },
    { id: "short-rate-tree", titleKey: "intuitionRateTreeTitle", summaryKey: "intuitionRateTreeSummary", bodyKey: "intuitionRateTreeBody", formula: "B=\\frac{q B_{up}+(1-q)B_{down}}{1+r}" },
    { id: "spot-strike", titleKey: "intuitionBinomialSpotTitle", summaryKey: "intuitionBinomialSpotSummary", bodyKey: "intuitionBinomialSpotBody" },
    { id: "up-down-factors", titleKey: "intuitionBinomialFactorsTitle", summaryKey: "intuitionBinomialFactorsSummary", bodyKey: "intuitionBinomialFactorsBody", formula: "S_{i,j}=S_0 u^{i-j}d^j" },
    { id: "discounting", titleKey: "intuitionBinomialDiscountTitle", summaryKey: "intuitionBinomialDiscountSummary", bodyKey: "intuitionBinomialDiscountBody", formula: "D_{1y}=\\frac{1}{1+r}" },
    { id: "tree-horizon", titleKey: "intuitionBinomialHorizonTitle", summaryKey: "intuitionBinomialHorizonSummary", bodyKey: "intuitionBinomialHorizonBody", formula: "T=N\\Delta t,\\quad\\Delta t=1\\text{ year}" },
    { id: "rate-probability", titleKey: "intuitionBinomialRateProbabilityTitle", summaryKey: "intuitionBinomialRateProbabilitySummary", bodyKey: "intuitionBinomialRateProbabilityBody" },
    { id: "rate-step-size", titleKey: "intuitionBinomialRateStepTitle", summaryKey: "intuitionBinomialRateStepSummary", bodyKey: "intuitionBinomialRateStepBody", formula: "r_{up}=r\\,e^h,\\quad r_{down}=r\\,e^{-h}" },
  ],
};
const optionGreeks: readonly IntuitionSection[] = [
    { id: "delta", titleKey: "intuitionDeltaTitle", summaryKey: "intuitionDeltaSummary", bodyKey: "intuitionDeltaBody", formula: "\\Delta=\\frac{\\partial V}{\\partial S}" },
    { id: "gamma", titleKey: "intuitionGammaTitle", summaryKey: "intuitionGammaSummary", bodyKey: "intuitionGammaBody", formula: "\\Gamma=\\frac{\\partial^2 V}{\\partial S^2}" },
    { id: "vega", titleKey: "intuitionVegaTitle", summaryKey: "intuitionVegaSummary", bodyKey: "intuitionVegaBody" },
    { id: "theta", titleKey: "intuitionThetaTitle", summaryKey: "intuitionThetaSummary", bodyKey: "intuitionThetaBody" },
    { id: "rho", titleKey: "intuitionRhoTitle", summaryKey: "intuitionRhoSummary", bodyKey: "intuitionRhoBody" },
];
export const blackScholesIntuition: IntuitionDocument = {
  titleKey: "navBlackScholes",
  sections: [
    { id: "price", titleKey: "intuitionOptionPriceTitle", summaryKey: "intuitionOptionPriceSummary", bodyKey: "intuitionOptionPriceBody" },
    ...optionGreeks,
  ],
};
export const hestonIntuition: IntuitionDocument = {
  titleKey: "navHeston",
  sections: [
    { id: "spot-strike", titleKey: "intuitionHestonSpotTitle", summaryKey: "intuitionHestonSpotSummary", bodyKey: "intuitionHestonSpotBody", formula: "V=e^{-rT}\\,\\mathbb E^Q[(S_T-K)^+]" },
    { id: "maturity", titleKey: "intuitionHestonMaturityTitle", summaryKey: "intuitionHestonMaturitySummary", bodyKey: "intuitionHestonMaturityBody" },
    { id: "stochastic-volatility", titleKey: "intuitionStochasticVolTitle", summaryKey: "intuitionStochasticVolSummary", bodyKey: "intuitionStochasticVolBody", formula: "dS=rS\\,dt+\\sqrt v\\,S\\,dW_1^Q" },
    { id: "mean-reversion", titleKey: "intuitionMeanReversionTitle", summaryKey: "intuitionMeanReversionSummary", bodyKey: "intuitionMeanReversionBody", formula: "dv=\\kappa(\\theta-v)\\,dt+\\xi\\sqrt v\\,dW_2" },
    { id: "vol-of-vol", titleKey: "intuitionVolOfVolTitle", summaryKey: "intuitionVolOfVolSummary", bodyKey: "intuitionVolOfVolBody" },
    { id: "correlation", titleKey: "intuitionCorrelationTitle", summaryKey: "intuitionCorrelationSummary", bodyKey: "intuitionCorrelationBody" },
    { id: "smile", titleKey: "intuitionSmileTitle", summaryKey: "intuitionSmileSummary", bodyKey: "intuitionSmileBody" },
    { id: "feller-condition", titleKey: "intuitionFellerTitle", summaryKey: "intuitionFellerSummary", bodyKey: "intuitionFellerBody" },
    { id: "time-steps", titleKey: "intuitionHestonStepsTitle", summaryKey: "intuitionHestonStepsSummary", bodyKey: "intuitionHestonStepsBody", formula: "\\Delta t=T/N" },
    { id: "visual-paths", titleKey: "intuitionHestonVisualTitle", summaryKey: "intuitionHestonVisualSummary", bodyKey: "intuitionHestonVisualBody" },
    { id: "pricing-paths", titleKey: "intuitionHestonSamplesTitle", summaryKey: "intuitionHestonSamplesSummary", bodyKey: "intuitionHestonSamplesBody" },
    ...optionGreeks.map((section): IntuitionSection => section.id === "vega"
      ? { ...section, summaryKey: "intuitionHestonVegaSummary", bodyKey: "intuitionHestonVegaBody" }
      : section),
  ],
};
export const diffusionIntuition: IntuitionDocument = {
  titleKey: "navDiffusion",
  sections: [
    { id: "diffusion", titleKey: "intuitionDiffusionTitle", summaryKey: "intuitionDiffusionSummary", bodyKey: "intuitionDiffusionBody", formula: "u(x,t)=e^{-\\kappa n^2t}\\sin(nx)" },
    { id: "negative-time", titleKey: "intuitionBackwardTitle", summaryKey: "intuitionBackwardSummary", bodyKey: "intuitionBackwardBody" },
  ],
};
