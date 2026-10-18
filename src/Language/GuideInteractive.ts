// Strings of the second-generation interactive guide figures, one file per figure in ./figures.
import { cashflowBuilderEn, cashflowBuilderHu } from "./figures/cashflowBuilder";
import { americanTreeEn, americanTreeHu } from "./figures/americanTree";
import { mcHistogramEn, mcHistogramHu } from "./figures/mcHistogram";
import { ivSurfaceEn, ivSurfaceHu } from "./figures/ivSurface";
import { swapTimelineEn, swapTimelineHu } from "./figures/swapTimeline";
import { capitalSplitEn, capitalSplitHu } from "./figures/capitalSplit";
import { annuityScheduleEn, annuityScheduleHu } from "./figures/annuitySchedule";
import { multiplesPeersEn, multiplesPeersHu } from "./figures/multiplesPeers";
import { utilityIndifferenceEn, utilityIndifferenceHu } from "./figures/utilityIndifference";
import { performanceRankingEn, performanceRankingHu } from "./figures/performanceRanking";
import { immunizationShockEn, immunizationShockHu } from "./figures/immunizationShock";
import { callablePriceYieldEn, callablePriceYieldHu } from "./figures/callablePriceYield";
import { martingaleBettingEn, martingaleBettingHu } from "./figures/martingaleBetting";
import { eulerConvergenceEn, eulerConvergenceHu } from "./figures/eulerConvergence";

export const guideInteractiveHu = {
  ...cashflowBuilderHu,
  ...americanTreeHu,
  ...mcHistogramHu,
  ...ivSurfaceHu,
  ...swapTimelineHu,
  ...capitalSplitHu,
  ...annuityScheduleHu,
  ...multiplesPeersHu,
  ...utilityIndifferenceHu,
  ...performanceRankingHu,
  ...immunizationShockHu,
  ...callablePriceYieldHu,
  ...martingaleBettingHu,
  ...eulerConvergenceHu,
};

export const guideInteractiveEn: Record<keyof typeof guideInteractiveHu, string> = {
  ...cashflowBuilderEn,
  ...americanTreeEn,
  ...mcHistogramEn,
  ...ivSurfaceEn,
  ...swapTimelineEn,
  ...capitalSplitEn,
  ...annuityScheduleEn,
  ...multiplesPeersEn,
  ...utilityIndifferenceEn,
  ...performanceRankingEn,
  ...immunizationShockEn,
  ...callablePriceYieldEn,
  ...martingaleBettingEn,
  ...eulerConvergenceEn,
};
