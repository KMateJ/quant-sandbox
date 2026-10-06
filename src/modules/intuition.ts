import type { IntuitionDocument, IntuitionSection } from "../components/intuition";

const bondSections: readonly IntuitionSection[] = [
  { id: "ytm", titleKey: "intuitionYtmTitle", summaryKey: "intuitionYtmSummary", bodyKey: "intuitionYtmBody" },
  { id: "coupon-rate", titleKey: "intuitionCouponTitle", summaryKey: "intuitionCouponSummary", bodyKey: "intuitionCouponBody" },
  { id: "price", titleKey: "intuitionPriceTitle", summaryKey: "intuitionPriceSummary", bodyKey: "intuitionPriceBody", formula: "P=\\sum_i \\frac{CF_i}{(1+y/m)^{m t_i}}" },
  { id: "macaulay-duration", titleKey: "intuitionMacaulayTitle", summaryKey: "intuitionMacaulaySummary", bodyKey: "intuitionMacaulayBody", formula: "D_{Mac}=\\frac{\\sum_i t_i\\,PV(CF_i)}{P}" },
  { id: "modified-duration", titleKey: "intuitionModifiedTitle", summaryKey: "intuitionModifiedSummary", bodyKey: "intuitionModifiedBody", formula: "D_{mod}=\\frac{D_{Mac}}{1+y/m},\\quad \\frac{\\Delta P}{P}\\approx -D_{mod}\\Delta y", exampleKey: "intuitionModifiedExample" },
  { id: "convexity", titleKey: "intuitionConvexityTitle", summaryKey: "intuitionConvexitySummary", bodyKey: "intuitionConvexityBody", formula: "\\frac{\\Delta P}{P}\\approx -D_{mod}\\Delta y+\\frac12 C(\\Delta y)^2" },
];

export const bondIntuition: IntuitionDocument = { titleKey: "bondPricingTitle", sections: bondSections };
export const durationIntuition: IntuitionDocument = {
  titleKey: "durationConvexityTitle",
  sections: [
    ...bondSections,
    { id: "dv01", titleKey: "intuitionDv01Title", summaryKey: "intuitionDv01Summary", bodyKey: "intuitionDv01Body", formula: "DV01\\approx P\\,D_{mod}\\,10^{-4}" },
    { id: "yield-shock", titleKey: "intuitionShockTitle", summaryKey: "intuitionShockSummary", bodyKey: "intuitionShockBody" },
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
  ],
};
export const blackScholesIntuition: IntuitionDocument = {
  titleKey: "navBlackScholes",
  sections: [
    { id: "price", titleKey: "intuitionOptionPriceTitle", summaryKey: "intuitionOptionPriceSummary", bodyKey: "intuitionOptionPriceBody" },
    { id: "delta", titleKey: "intuitionDeltaTitle", summaryKey: "intuitionDeltaSummary", bodyKey: "intuitionDeltaBody", formula: "\\Delta=\\frac{\\partial V}{\\partial S}" },
    { id: "gamma", titleKey: "intuitionGammaTitle", summaryKey: "intuitionGammaSummary", bodyKey: "intuitionGammaBody", formula: "\\Gamma=\\frac{\\partial^2 V}{\\partial S^2}" },
    { id: "vega", titleKey: "intuitionVegaTitle", summaryKey: "intuitionVegaSummary", bodyKey: "intuitionVegaBody" },
    { id: "theta", titleKey: "intuitionThetaTitle", summaryKey: "intuitionThetaSummary", bodyKey: "intuitionThetaBody" },
    { id: "rho", titleKey: "intuitionRhoTitle", summaryKey: "intuitionRhoSummary", bodyKey: "intuitionRhoBody" },
  ],
};
export const hestonIntuition: IntuitionDocument = {
  titleKey: "navHeston",
  sections: [
    { id: "stochastic-volatility", titleKey: "intuitionStochasticVolTitle", summaryKey: "intuitionStochasticVolSummary", bodyKey: "intuitionStochasticVolBody", formula: "dS=\\mu S\\,dt+\\sqrt v\\,S\\,dW_1" },
    { id: "mean-reversion", titleKey: "intuitionMeanReversionTitle", summaryKey: "intuitionMeanReversionSummary", bodyKey: "intuitionMeanReversionBody", formula: "dv=\\kappa(\\theta-v)\\,dt+\\xi\\sqrt v\\,dW_2" },
    { id: "vol-of-vol", titleKey: "intuitionVolOfVolTitle", summaryKey: "intuitionVolOfVolSummary", bodyKey: "intuitionVolOfVolBody" },
    { id: "correlation", titleKey: "intuitionCorrelationTitle", summaryKey: "intuitionCorrelationSummary", bodyKey: "intuitionCorrelationBody" },
    { id: "smile", titleKey: "intuitionSmileTitle", summaryKey: "intuitionSmileSummary", bodyKey: "intuitionSmileBody" },
    { id: "feller-condition", titleKey: "intuitionFellerTitle", summaryKey: "intuitionFellerSummary", bodyKey: "intuitionFellerBody" },
  ],
};
export const diffusionIntuition: IntuitionDocument = {
  titleKey: "navDiffusion",
  sections: [
    { id: "diffusion", titleKey: "intuitionDiffusionTitle", summaryKey: "intuitionDiffusionSummary", bodyKey: "intuitionDiffusionBody", formula: "u(x,t)=e^{-\\kappa n^2t}\\sin(nx)" },
    { id: "negative-time", titleKey: "intuitionBackwardTitle", summaryKey: "intuitionBackwardSummary", bodyKey: "intuitionBackwardBody" },
  ],
};
