// Strings for the "martingale-betting" guide figure. Keys are prefixed ixMg to stay unique.
import type { martingaleBettingHu } from "./martingaleBetting.hu";

export const martingaleBettingEn: Record<keyof typeof martingaleBettingHu, string> = {
  ixMgTitle: "Betting strategies in a fair coin game",
  ixMgStrategyAria: "Betting strategy",
  ixMgConstant: "Constant stake 1",
  ixMgDoubling: "Double after a loss",
  ixMgFraction: "Bet 5% of wealth",
  ixMgControlsAria: "Game controls",
  ixMgFlip: "Flip once",
  ixMgPlay100: "Play 100 rounds",
  ixMgCrowd: "Simulate 1000 players",
  ixMgReset: "Reset",
  ixMgPathHead: "One player's wealth, round by round",
  ixMgPathAria: "Step plot of one player's wealth against the number of rounds played",
  ixMgRound: "round {{n}}",
  ixMgStart: "starting wealth",
  ixMgHistHead: "Final wealth of 1000 players after 100 rounds",
  ixMgHistAria: "Histogram of the final wealth of 1000 players, with the average and the starting wealth marked",
  ixMgHistEmpty: "Press \"Simulate 1000 players\" to see how final wealth is spread out.",
  ixMgMean: "average",
  ixMgWealth: "Wealth now",
  ixMgNextStake: "Next stake",
  ixMgCrowdMean: "Average final wealth",
  ixMgAhead: "Ended ahead",
  ixMgWorst: "Worst outcome",
};
