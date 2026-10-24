import type { GameEventBase, MissionBase } from "../../../lib/game/game.types";

export type CurveFactors = { level: number; slope: number; curvature: number };
/// Daily factor move: `drift + sigma·z`, in rate units.
export type FactorShock = { sigma: CurveFactors; drift: CurveFactors };
export type BookBond = { id: string; coupon: number; maturity: number; face: number };
/// Futures contract: face `size` per contract, deliverable basket as [coupon, maturity] pairs.
export type FutureSpec = { id: string; size: number; basket: [coupon: number, maturity: number][]; expiryDay?: number; calendarSpread?: number };
export type RatesObjective =
  | { kind: "dv01Misses"; band: number; allowed: number }
  | { kind: "krdMisses"; limit: number; allowed: number }
  | { kind: "pnlWithin"; limit: number }
  | { kind: "pnlAbove"; target: number }
  | { kind: "costsBelow"; limit: number };
export type RatesMission = MissionBase<RatesObjective> & {
  days: number;
  start: CurveFactors;
  shock: FactorShock;
  book: BookBond[];
  futures: FutureSpec[];
  opening: number[];
  costPerContract: number;
};
export type RatesEvent = GameEventBase &
  (
    | { kind: "start" }
    | { kind: "move"; d2: number; d10: number }
    | { kind: "fill"; future: string; qty: number; price: number; tag: "manual" | "auto" }
    | { kind: "dv01Miss"; net: number }
    | { kind: "krdMiss"; node: number; value: number } // node: bucket 0 = 2y, 1 = 5y, 2 = 10y+30y
    | { kind: "ctdSwitch"; future: string; to: number }
    | { kind: "expired"; future: string; qty: number; price: number }
    | { kind: "end"; pnl: number }
  );
export type RatesState = {
  missionId: string;
  seed: number;
  day: number;
  contracts: number[];
  futPnl: number;
  costs: number;
  traded: number;
  misses: number;
  krdMisses: number;
  book0: number;
  hist: { day: number; hedged: number; naked: number }[];
  events: RatesEvent[];
  settled: boolean;
};
export type RatesAction =
  | { type: "trade"; future: number; qty: number; tag: "manual" | "auto" }
  | { type: "dv01Hedge"; future: number }
  | { type: "krdHedge" }
  | { type: "step"; days: number }
  | { type: "restore"; state: RatesState };
/// Dollar risk of the book and hedge: DV01 is the value lost for +1 bp; key-rate arrays follow `KEY_RATES`.
export type RatesRisk = { bookValue: number; bookDv01: number; futDv01: number; net: number; kBook: number[]; kFut: number[]; kNet: number[] };
export type FutureQuote = { F: number; ctd: number; prices: number[]; cfs: number[] };
export type CurveScenario = { id: "parallelUp" | "parallelDown" | "steepener" | "flattener" | "belly"; naked: number; hedged: number };
export type RatesPolicy = "dv01Daily10Y" | "dv01Weekly10Y" | "krdDaily" | "none";
