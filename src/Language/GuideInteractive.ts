// Strings of the second-generation interactive guide figures, one file per figure in ./figures.
import { cashflowBuilderEn } from "./figures/cashflowBuilder";
import { americanTreeEn } from "./figures/americanTree";
import { mcHistogramEn } from "./figures/mcHistogram";
import { ivSurfaceEn } from "./figures/ivSurface";
import { swapTimelineEn } from "./figures/swapTimeline";
import { capitalSplitEn } from "./figures/capitalSplit";
import { annuityScheduleEn } from "./figures/annuitySchedule";
import { multiplesPeersEn } from "./figures/multiplesPeers";
import { utilityIndifferenceEn } from "./figures/utilityIndifference";
import { performanceRankingEn } from "./figures/performanceRanking";
import { immunizationShockEn } from "./figures/immunizationShock";
import { callablePriceYieldEn } from "./figures/callablePriceYield";
import { martingaleBettingEn } from "./figures/martingaleBetting";
import { eulerConvergenceEn } from "./figures/eulerConvergence";
import type { guideInteractiveHu } from "./GuideInteractive.hu";

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
