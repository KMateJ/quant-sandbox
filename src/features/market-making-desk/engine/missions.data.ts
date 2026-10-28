import { DEFAULT_FLOW } from "../../../lib/market/flow";
import type { MmMission } from "./mm.types";

/// Thinner book and bigger, more frequent takers than the lab default, so a desk session trades often.
const DESK_FLOW = { ...DEFAULT_FLOW, depthPerLevel: 250, marketRate: 1.5, meanMarketSize: 250, sigmaTicks: 0.5, horizon: 10 };

const BASE: Omit<MmMission, "id" | "objectives"> = {
  seconds: 600,
  flow: DESK_FLOW,
  quoteSize: 200,
  rebate: 0.002,
  takerFee: 0.003,
  markout: 10,
  limit: 2000,
  gamma: 0.005,
  k: 1.5,
};

/// Missions MM1–MM5 of the market making desk.
export const MM_MISSIONS: readonly MmMission[] = [
  {
    ...BASE,
    id: "MM1",
    objectives: [{ kind: "pnlFloor", floor: 150 }, { kind: "inventoryCap", limit: 2000, allowed: 0 }],
  },
  {
    ...BASE,
    id: "MM2",
    flow: { ...DESK_FLOW, buyShare: 0.65 },
    limit: 1500,
    objectives: [{ kind: "inventoryCap", limit: 1500, allowed: 1 }, { kind: "pnlFloor", floor: 100 }],
  },
  {
    ...BASE,
    id: "MM3",
    flow: { ...DESK_FLOW, informedShare: 0.3 },
    objectives: [{ kind: "adverseCap", limit: 40 }, { kind: "pnlFloor", floor: 30 }],
  },
  {
    ...BASE,
    id: "MM4",
    news: { t: 300, announced: true, sizeTicks: 8 },
    objectives: [{ kind: "maxDrawdown", limit: 40 }, { kind: "pnlFloor", floor: 50 }],
  },
  {
    ...BASE,
    id: "MM5",
    flow: { ...DESK_FLOW, informedShare: 0.15 },
    objectives: [{ kind: "beatPolicy", policy: "as" }, { kind: "inventoryCap", limit: 2000, allowed: 0 }],
  },
];

/// Mission by id, or undefined.
export const mmMissionById = (id: string) => MM_MISSIONS.find((m) => m.id === id);
