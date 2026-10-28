/// Order side; a resting buy is a bid, a resting sell is an ask.
export type Side = "buy" | "sell";
export type Owner = "you" | "crowd";
export type Taker = Owner | "noise" | "informed";

/// A resting limit order; `price` is in integer ticks.
export type RestingOrder = { id: number; side: Side; price: number; size: number; owner: Owner; t: number };
/// One price level; FIFO, index 0 fills first.
export type Level = { price: number; orders: RestingOrder[] };
/// Bids sorted price-descending, asks price-ascending.
export type Book = { bids: Level[]; asks: Level[]; nextId: number };

/// One execution against a resting order; `side` is the aggressor's side.
export type Fill = { makerId: number; makerOwner: Owner; taker: Taker; side: Side; price: number; size: number; t: number };

export type FlowSpec = {
  tick: number;
  levels: number;
  depthPerLevel: number;
  limitRate: number;
  cancelRate: number;
  marketRate: number;
  informedShare: number;
  buyShare: number;
  meanMarketSize: number;
  sigmaTicks: number;
  horizon: number;
  jump?: { t: number; sizeTicks: number };
};

/// The crowd's random draws for one second, fixed by the seed before any player action.
export type TickDraws = {
  limits: { buy: boolean; dist: number; size: number }[];
  cancels: number[];
  markets: { informedU: number; buy: boolean; size: number }[];
};

export type FlowEvent = {
  t: number;
  kind: "limit" | "cancel" | "market" | "skip";
  side?: Side;
  price?: number;
  size?: number;
  taker?: Taker;
};
