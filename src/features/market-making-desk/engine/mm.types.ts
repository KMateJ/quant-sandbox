import type { GameEventBase, MissionBase } from "../../../lib/game/game.types";
import type { Ledger } from "../../../lib/market/maker";
import type { Book, FlowSpec, Side, TickDraws } from "../../../lib/market/market.types";

export type MmPolicyId = "join" | "wide" | "as" | "flatten";

export type MmObjective =
  | { kind: "pnlFloor"; floor: number }
  | { kind: "inventoryCap"; limit: number; allowed: number }
  | { kind: "adverseCap"; limit: number }
  | { kind: "maxDrawdown"; limit: number }
  | { kind: "beatPolicy"; policy: MmPolicyId };

/// One desk mission; money in $, `rebate`/`takerFee` per share, `markout` and `seconds` in ticks.
export type MmMission = MissionBase<MmObjective> & {
  seconds: number;
  flow: FlowSpec;
  quoteSize: number;
  rebate: number;
  takerFee: number;
  markout: number;
  limit: number;
  gamma: number;
  k: number;
  news?: { t: number; announced: boolean; sizeTicks: number };
};

/// Your quote; offsets in ticks from mid (≥ 0.5). `auto` re-places after fills and touch moves.
export type MmQuote = { bidOffset: number; askOffset: number; size: number; live: boolean; auto: boolean };

export type MmEvent = GameEventBase &
  (
    | { kind: "start" }
    | { kind: "fill"; side: Side; price: number; size: number }
    | { kind: "hedge"; side: Side; size: number; avg: number }
    | { kind: "limitBreach"; inventory: number }
    | { kind: "news"; jump: number }
    | { kind: "requote" }
    | { kind: "pulled" }
    | { kind: "end"; pnl: number }
  );

/// One tick of history; `mid`, `pnl`, `bid`, `ask` in $.
export type MmHist = { t: number; mid: number; inv: number; pnl: number; bid: number | null; ask: number | null };

/// One trade on the public tape (prices in $); `you` marks your fills. Informed flags are never stored here.
export type MmTrade = { t: number; side: Side; price: number; size: number; you: boolean };

export type MmState = {
  missionId: string;
  seed: number;
  t: number;
  book: Book;
  ledger: Ledger;
  quote: MmQuote;
  peak: number;
  mdd: number;
  breaches: number;
  informedFills: number;
  hist: MmHist[];
  tape: MmTrade[];
  events: MmEvent[];
  settled: boolean;
};

export type MmAction =
  | { type: "setQuote"; quote: Partial<MmQuote> }
  | { type: "pull" }
  | { type: "hedge"; size: number }
  | { type: "step"; ticks: number }
  | { type: "restore"; state: MmState };

/// Pre-built market for one (mission, seed); `jump` is the signed news jump in ticks (0 without news).
export type MmMarket = { fair: number[]; schedule: TickDraws[]; book0: Book; jump: number };
