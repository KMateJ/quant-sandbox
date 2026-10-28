import { fairPath, flowSchedule, seedBook } from "../../../lib/market/flow";
import type { FlowSpec } from "../../../lib/market/market.types";
import type { MmMarket, MmMission } from "./mm.types";

/// The mission's crowd spec, with its news mapped to a fair-value jump.
export function missionFlow(mission: MmMission): FlowSpec {
  const { news } = mission;
  return news ? { ...mission.flow, jump: { t: news.t, sizeTicks: news.sizeTicks } } : mission.flow;
}

/// Fair path, pre-drawn crowd flow and opening book for (mission, seed); cache it in the caller.
export function mmMarket(mission: MmMission, seed: number): MmMarket {
  const flow = missionFlow(mission);
  const fair = fairPath(flow, mission.seconds, seed);
  const news = mission.news;
  const jump = news ? fair[news.t] - fairPath(mission.flow, mission.seconds, seed)[news.t] : 0;
  return { fair, schedule: flowSchedule(flow, mission.seconds, seed), book0: seedBook(flow, fair[0], seed), jump };
}
