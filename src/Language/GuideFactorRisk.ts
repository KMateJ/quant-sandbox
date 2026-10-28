// Guide strings for the Fama–French and systemic-risk lessons (Portfolio track); each lesson's figure strings live in its own region.
import type { guideFactorRiskHu } from "./GuideFactorRisk.hu";

export const guideFactorRiskEn: Record<keyof typeof guideFactorRiskHu, string> = {
  guideFfFactorsTitle: "The Fama–French factor models",
  guideFfFactorsDesc: "Size, value, profitability, investment and momentum: multi-factor regressions, factor loadings, what alpha means and why CAPM alpha shrinks once the factors are added.",
  guideSysContagionTitle: "Systemic risk and contagion",
  guideSysContagionDesc: "Networks of interbank exposures, default cascades, fire sales and runs: how a small shock grows into a system-wide crisis and what makes a network fragile.",
  // #region fama-french-factors
  gfFfLoadingsTitle: "Factor loadings and alpha from a fund's returns",
  gfFfSize: "True size loading (SMB)",
  gfFfValue: "True value loading (HML)",
  gfFfMonths: "Sample length",
  gfFfMonthsValue: "{{n}} months",
  gfFfModel: "Model",
  gfFfAria: "Bars of the estimated factor loadings with markers at the true loadings",
  gfFfOmitted: "not in the model",
  gfFfTruth: "True loading",
  gfFfAlpha: "Alpha (annualised)",
  gfFfAlphaT: "t-statistic of alpha",
  gfFfNote: "Bars are the estimated loadings, vertical marks the simulated fund's true ones (market 1, RMW 0.3, CMA 0, true alpha 0). Whatever the model leaves out ends up in alpha.",
  // #endregion
  // #region systemic-contagion
  gfSysCascadeTitle: "A default cascade in an interbank network",
  gfSysCcShock: "Shock to the first bank's external assets",
  gfSysCcEquity: "Equity buffer (% of assets)",
  gfSysCcRecovery: "Recovery rate",
  gfSysCcNetwork: "Network",
  gfSysCcRing: "Ring",
  gfSysCcTwo: "Two neighbours",
  gfSysCcComplete: "Complete",
  gfSysCcShocked: "Shocked bank",
  gfSysCcNext: "Next round",
  gfSysCcRunAll: "All rounds",
  gfSysCcReset: "Reset",
  gfSysCcAria: "Eight banks on a circle with arrows from lender to borrower; defaulted banks are filled and labelled",
  gfSysCcFailed: "default",
  gfSysCcBuffer: "buffer",
  gfSysCcRound: "Step",
  gfSysCcRoundOf: "{{r}} / {{n}}",
  gfSysCcDefaulted: "Banks defaulted",
  gfSysCcRounds: "Default rounds",
  gfSysCcLosses: "Losses as % of system equity",
  gfSysCcHint: "Each bank lends 20 of its 100 units of assets to other banks, so it has {{exposure}} units of exposure to each borrower; its equity is {{equity}} units. You can also click a bank to shock it.",
  // #endregion
};
