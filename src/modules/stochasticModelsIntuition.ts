import type { IntuitionDocument } from "../components/intuition";

export const stochasticModelsIntuition: IntuitionDocument = {
  titleKey: "stochStudioTitle",
  sections: [
    {
      id: "walk-randomness",
      titleKey: "stochIntuitionRandomWalkTitle",
      summaryKey: "stochIntuitionRandomWalkSummary",
      bodyKey: "stochIntuitionRandomWalkBody",
      formula: "S_n=\\sum_{i=1}^{n}X_i,\\quad X_i\\in\\{-1,+1\\}",
    },
    {
      id: "walk-variance",
      titleKey: "stochIntuitionVarianceTitle",
      summaryKey: "stochIntuitionVarianceSummary",
      bodyKey: "stochIntuitionVarianceBody",
      formula: "\\operatorname{Var}(S_n)=4np(1-p),\\quad \\operatorname{Var}(S_n)=n\\text{ when }p=\\frac12",
    },
    {
      id: "walk-bias",
      titleKey: "stochIntuitionBiasTitle",
      summaryKey: "stochIntuitionBiasSummary",
      bodyKey: "stochIntuitionBiasBody",
      formula: "\\mathbb{E}[S_n]=n(2p-1)",
    },
    {
      id: "walk-steps",
      titleKey: "stochIntuitionStepsTitle",
      summaryKey: "stochIntuitionStepsSummary",
      bodyKey: "stochIntuitionStepsBody",
    },
    {
      id: "rescaled-definition",
      titleKey: "stochIntuitionRescaledTitle",
      summaryKey: "stochIntuitionRescaledSummary",
      bodyKey: "stochIntuitionRescaledBody",
      formula: "W^{(n)}(t)=\\frac{S_{\\lfloor nt\\rfloor}}{\\sqrt{n}},\\quad \\operatorname{Var}(W^{(n)}(t))=\\frac{\\lfloor nt\\rfloor}{n}\\to t",
    },
    {
      id: "donsker",
      titleKey: "stochIntuitionDonskerTitle",
      summaryKey: "stochIntuitionDonskerSummary",
      bodyKey: "stochIntuitionDonskerBody",
      formula: "W^{(n)}\\;\\Rightarrow\\;W\\quad(n\\to\\infty)",
    },
    {
      id: "convergence-types",
      titleKey: "stochIntuitionConvergenceTitle",
      summaryKey: "stochIntuitionConvergenceSummary",
      bodyKey: "stochIntuitionConvergenceBody",
    },
    {
      id: "scaling-law",
      titleKey: "stochIntuitionScalingTitle",
      summaryKey: "stochIntuitionScalingSummary",
      bodyKey: "stochIntuitionScalingBody",
      formula: "\\operatorname{sd}(S_n)=\\sqrt{n},\\quad \\operatorname{sd}(W(t))=\\sqrt{t}",
    },
    {
      id: "scaling-exponents",
      titleKey: "stochIntuitionExponentTitle",
      summaryKey: "stochIntuitionExponentSummary",
      bodyKey: "stochIntuitionExponentBody",
      formula: "\\operatorname{sd}(S_n)\\sim n^{\\alpha},\\quad \\alpha=\\tfrac12",
    },
    {
      id: "clt-statement",
      titleKey: "stochIntuitionCltTitle",
      summaryKey: "stochIntuitionCltSummary",
      bodyKey: "stochIntuitionCltBody",
      formula: "Z_n=\\frac{S_n-n\\mu}{\\sigma\\sqrt{n}}\\;\\xrightarrow{d}\\;\\mathcal{N}(0,1)",
    },
    {
      id: "clt-universality",
      titleKey: "stochIntuitionUniversalityTitle",
      summaryKey: "stochIntuitionUniversalitySummary",
      bodyKey: "stochIntuitionUniversalityBody",
      formula: "\\operatorname{skew}(Z_n)=\\frac{\\gamma}{\\sqrt{n}}\\to 0",
    },
    {
      id: "berry-esseen",
      titleKey: "stochIntuitionBerryEsseenTitle",
      summaryKey: "stochIntuitionBerryEsseenSummary",
      bodyKey: "stochIntuitionBerryEsseenBody",
      formula: "\\sup_x\\left|P(Z_n\\le x)-\\Phi(x)\\right|\\le\\frac{C\\,\\mathbb{E}|X|^3}{\\sigma^3\\sqrt{n}}",
    },
  ],
};
