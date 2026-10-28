import { guideHu } from "./Guide.hu";
import { guideCorporateHu } from "./GuideCorporate.hu";
import { guideFixedIncomeHu } from "./GuideFixedIncome.hu";
import { guidePortfolioHu } from "./GuidePortfolio.hu";
import { guideStochasticHu } from "./GuideStochastic.hu";
import { guideStochasticTheoryHu } from "./GuideStochasticTheory.hu";
import { guideWave2Hu } from "./GuideWave2.hu";
import { guideWave3Hu } from "./GuideWave3.hu";
import { guideWave4Hu } from "./GuideWave4.hu";
import { guideMicrostructureHu } from "./GuideMicrostructure.hu";
import { guideFactorRiskHu } from "./GuideFactorRisk.hu";

/// The Hungarian tables holding the guide lesson titles. The knowledge graph needs them to find citations in
/// Hungarian lesson text; importing these instead of `index.hu` keeps the rest of the Hungarian table out of the
/// guide chunk English readers download. A new lesson's title key must live in one of these files
/// (checked by `scripts/guide-graph.test.mjs`).
export const guideTitleTablesHu = {
  ...guideHu,
  ...guideCorporateHu,
  ...guideFixedIncomeHu,
  ...guidePortfolioHu,
  ...guideStochasticHu,
  ...guideStochasticTheoryHu,
  ...guideWave2Hu,
  ...guideWave3Hu,
  ...guideWave4Hu,
  ...guideMicrostructureHu,
  ...guideFactorRiskHu,
};
