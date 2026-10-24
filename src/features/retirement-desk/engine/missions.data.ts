import type { RetirementMission } from "./retirement.types";

/// Shared market and plan defaults (real terms).
export const DEFAULT_RETIREMENT: Omit<RetirementMission, "id" | "objectives"> = {
  years: 30,
  start: 1_000_000,
  target: 40_000,
  equity0: 0.6,
  muE: 0.05,
  sigmaE: 0.17,
  muB: 0.01,
  sigmaB: 0.06,
  rho: 0.1,
  forced: [],
  paths: 400,
  equityLocked: false,
};

const WEAK_START = [-0.18, -0.12, 0.02, -0.09, -0.06].map((equity, i) => ({ year: i + 1, equity }));

/// The five retirement desk missions, in play order.
export const RETIREMENT_MISSIONS: readonly RetirementMission[] = [
  {
    ...DEFAULT_RETIREMENT,
    id: "T1",
    objectives: [{ kind: "moneyLasts" }, { kind: "avgSpendAtLeast", amount: 34_000 }, { kind: "cutsAtMost", allowed: 3 }],
  },
  {
    ...DEFAULT_RETIREMENT,
    id: "T2",
    forced: WEAK_START,
    objectives: [{ kind: "moneyLasts" }, { kind: "avgSpendAtLeast", amount: 33_000 }, { kind: "cutsAtMost", allowed: 4 }],
  },
  {
    ...DEFAULT_RETIREMENT,
    id: "T3",
    equityLocked: true,
    objectives: [{ kind: "moneyLasts" }, { kind: "oddsNeverBelow", floor: 0.5 }, { kind: "cutsAtMost", allowed: 3 }],
  },
  {
    ...DEFAULT_RETIREMENT,
    id: "T4",
    years: 35,
    target: 36_000,
    objectives: [{ kind: "moneyLasts" }, { kind: "avgSpendAtLeast", amount: 30_000 }],
  },
  {
    ...DEFAULT_RETIREMENT,
    id: "T5",
    objectives: [{ kind: "moneyLasts" }, { kind: "avgSpendAtLeast", amount: 34_000 }, { kind: "legacyAtLeast", amount: 300_000 }],
  },
];

/// Mission by id; throws on an unknown id.
export function retirementMissionById(id: string): RetirementMission {
  const m = RETIREMENT_MISSIONS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown retirement mission ${id}`);
  return m;
}
