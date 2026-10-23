import { DEFAULT_COSTS } from "./desk.config";
import type { MarketSpec, MissionDef } from "./desk.types";

const M1_MARKET: MarketSpec = {
  s0: 100,
  rate: 0.03,
  impliedVol: 0.22,
  realizedVol: 0.26,
  days: 63,
  strikes: [90, 92.5, 95, 97.5, 100, 102.5, 105, 107.5, 110],
};

/// All missions in play order.
export const MISSIONS: MissionDef[] = [
  {
    id: "M1",
    greeks: ["delta"],
    market: M1_MARKET,
    costs: DEFAULT_COSTS,
    band: 100,
    opening: [{ id: "C100", side: "sell", qty: 10, tag: "client" }],
    objectives: [
      { kind: "maxBreaches", limit: 3 },
      { kind: "pnlWithin", limit: 400 },
      { kind: "costsBelow", limit: 300 },
    ],
    instruments: "all",
    settlement: "cash",
  },
  {
    id: "M2",
    greeks: ["delta"],
    market: M1_MARKET,
    costs: { ...DEFAULT_COSTS, ticketFee: 15 },
    band: 100,
    opening: [{ id: "C100", side: "sell", qty: 10, tag: "client" }],
    objectives: [
      { kind: "pnlWithin", limit: 600 },
      { kind: "maxTrades", limit: 10 },
      { kind: "beatPolicy", every: 5 },
    ],
    instruments: "stock",
    maxTrades: 10,
    settlement: "cash",
  },
  {
    id: "M3",
    greeks: ["delta", "gamma"],
    market: { ...M1_MARKET, realizedVol: 0.24, days: 45, gap: { from: 25, to: 35, size: 0.08 } },
    costs: DEFAULT_COSTS,
    band: 100,
    opening: [{ id: "C100", side: "sell", qty: 20, tag: "client" }],
    objectives: [
      { kind: "gammaLimitFrom", limit: 40, fromDay: 25 },
      { kind: "gapLoss", limit: 1500 },
      { kind: "maxBreaches", limit: 3 },
    ],
    instruments: "all",
    settlement: "cash",
  },
  {
    id: "M4",
    greeks: ["delta", "vega"],
    market: { ...M1_MARKET, days: 40, ivSchedule: [{ day: 20, iv: 0.3 }] },
    costs: DEFAULT_COSTS,
    band: 100,
    opening: [
      { id: "C105", side: "buy", qty: 15, tag: "client" },
      { id: "P95", side: "sell", qty: 5, tag: "client" },
    ],
    objectives: [
      { kind: "vegaLimitBy", limit: 1500, byDay: 20 },
      { kind: "maxBreaches", limit: 3 },
      { kind: "pnlAbove", limit: -500 },
    ],
    instruments: "all",
    settlement: "cash",
  },
  {
    id: "M5",
    greeks: ["delta", "gamma"],
    market: { ...M1_MARKET, s0: 100.2, days: 10 },
    costs: DEFAULT_COSTS,
    band: 100,
    opening: [{ id: "C100", side: "sell", qty: 10, tag: "client" }],
    objectives: [
      { kind: "flatStock" },
      { kind: "maxBreaches", limit: 2 },
      { kind: "pnlWithin", limit: 300 },
    ],
    instruments: "all",
    settlement: "physical",
  },
];

/// Mission by id, or undefined.
export function missionById(id: string): MissionDef | undefined {
  return MISSIONS.find((m) => m.id === id);
}
