import type { AlmMission } from "./alm.types";

const GAP = { kind: "gapMisses", band: 0.25, allowed: 1 } as const;
const BOND_5Y = [0, 1, 0, 0];

/// Final surplus floor: −1% of the liability (twist noise alone moves a matched book by about that much).
const END = { kind: "surplusAtEnd", floor: -10_000 } as const;

/// Convexity gap band for A5 (calibrated, see plan 04 Findings).
export const A5_CONVEXITY_BAND = 15;

/// The five ALM desk missions, in play order.
export const ALM_MISSIONS: readonly AlmMission[] = [
  {
    id: "A1",
    config: {},
    startWeights: BOND_5Y,
    objectives: [END, GAP, { kind: "costsBelow", limit: 2_500 }],
  },
  {
    id: "A2",
    config: { maxParallelBp: 30, maxTwistBp: 100 },
    startWeights: BOND_5Y,
    objectives: [{ kind: "surplusFloor", floor: -10_000 }, GAP],
  },
  {
    id: "A3",
    config: {},
    startWeights: BOND_5Y,
    maxTrades: 3,
    objectives: [END, { kind: "maxTrades", limit: 3 }],
  },
  {
    id: "A4",
    config: { extraLiabilities: [{ amount: 500_000, year: 5, from: 3 }] },
    startWeights: BOND_5Y,
    contributionOnAdd: true,
    objectives: [END, GAP],
  },
  {
    id: "A5",
    config: {},
    startWeights: BOND_5Y,
    objectives: [GAP, { kind: "convexityMisses", band: A5_CONVEXITY_BAND, allowed: 1 }, END],
  },
];

/// Mission by id; throws on an unknown id.
export function almMissionById(id: string): AlmMission {
  const m = ALM_MISSIONS.find((x) => x.id === id);
  if (!m) throw new Error(`Unknown ALM mission ${id}`);
  return m;
}
