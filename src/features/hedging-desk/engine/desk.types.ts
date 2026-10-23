/// Option type letter used in instrument ids.
export type OptionType = "C" | "P";
/// "STOCK" or an option id such as "C100" / "P97.5" (type letter + strike).
export type InstrumentId = string;
/// Direction of an order.
export type Side = "buy" | "sell";
/// Who originated an order.
export type OrderTag = "client" | "manual" | "auto";
/// A request to trade `qty` units (shares or contracts) of one instrument.
export type Order = { id: InstrumentId; side: Side; qty: number; tag: OrderTag };
/// An executed order with its day, fill price (per unit) and half-spread cost paid.
export type Fill = Order & { day: number; price: number; cost: number };
/// Market parameters a mission is played on.
export type MarketSpec = {
  s0: number;
  rate: number;
  impliedVol: number;
  realizedVol: number;
  days: number;
  strikes: number[];
  /// One overnight jump of ±size (fraction) on a day drawn from [from, to] (plan 07 implements).
  gap?: { from: number; to: number; size: number };
  /// Implied vol changes to `iv` from `day` on (plan 07 implements).
  ivSchedule?: { day: number; iv: number }[];
};
/// Spot and implied vol for days 0..days (length days + 1).
export type Market = {
  spot: number[];
  iv: number[];
  rate: number;
  days: number;
  strikes: number[];
  gapDay: number | null;
};
/// Trading frictions: half-spreads per unit and a per-ticket fee.
export type Costs = { stockHalfSpread: number; optionHalfSpread: number; ticketFee: number };
/// Per-unit quote and Greeks (vega per vol point, theta per calendar day).
export type Quote = {
  mid: number;
  bid: number;
  ask: number;
  half: number;
  mult: number;
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
};
/// End-of-day snapshot of the book.
export type DayRecord = {
  day: number;
  openDelta: number;
  closeDelta: number;
  sharesHeld: number;
  sharesNeeded: number;
  gamma: number;
  vega: number;
  pnl: number;
  breach: boolean;
};
/// Every event kind the desk can ever emit. M1 uses only fill/breach/expiry/start; the rest are
/// produced by plan 07's mechanics, but are declared now so UI switches are exhaustive from day one.
export type DeskEvent =
  | { day: number; kind: "fill"; fill: Fill }
  | { day: number; kind: "breach"; delta: number }
  | { day: number; kind: "expiry" }
  | { day: number; kind: "start" }
  | { day: number; kind: "gap"; move: number }
  | { day: number; kind: "ivShift"; iv: number }
  | { day: number; kind: "rejected"; reason: "tradeLimit" }
  | { day: number; kind: "assignment"; id: InstrumentId; shares: number };
/// Full state of a run.
export type BookState = {
  missionId: string;
  seed: number;
  day: number;
  /// Shares for STOCK, contracts for options.
  positions: Record<InstrumentId, number>;
  cash: number;
  costsPaid: number;
  breaches: number;
  fills: Fill[];
  history: DayRecord[];
  /// Newest first.
  events: DeskEvent[];
  openDelta: number;
  settled: boolean;
};
/// Book-level Greeks in shares / dollars.
export type Greeks = {
  delta: number;
  gamma: number;
  vega: number;
  theta: number;
  dollarDelta: number;
  dollarGamma1pct: number;
};
/// Every objective kind any mission uses (M1 uses the first three).
export type ObjectiveDef =
  | { kind: "maxBreaches"; limit: number }
  | { kind: "pnlWithin"; limit: number }
  | { kind: "costsBelow"; limit: number }
  | { kind: "maxTrades"; limit: number }
  | { kind: "pnlAbove"; limit: number }
  | { kind: "gammaLimitFrom"; limit: number; fromDay: number }
  | { kind: "gapLoss"; limit: number }
  | { kind: "vegaLimitBy"; limit: number; byDay: number }
  | { kind: "beatPolicy"; every: number }
  | { kind: "flatStock" };
/// Live or final status of an objective.
export type ObjectiveStatus = "onTrack" | "atRisk" | "pass" | "fail";
/// An objective with its status and the value it was judged on.
export type ObjectiveResult = { def: ObjectiveDef; status: ObjectiveStatus; value: number };
/// A mission: market, starting trades, risk band and objectives.
export type MissionDef = {
  id: string;
  greeks: ("delta" | "gamma" | "vega")[];
  market: MarketSpec;
  costs: Costs;
  band: number;
  /// Opening trades executed at day 0 (e.g. the client buying calls from you).
  opening: Order[];
  objectives: ObjectiveDef[];
  instruments: "stock" | "all";
  /// Manual + auto trades allowed over the run (plan 07 enforces).
  maxTrades?: number;
  /// How options settle at expiry (plan 07 implements "physical").
  settlement: "cash" | "physical";
};
/// Outcome of replaying a hedging policy on a path.
export type PolicyResult = { pnl: number; breaches: number; trades: number; costs: number; series: number[] };
/// Actions the desk reducer accepts.
export type DeskAction =
  | { type: "order"; order: Order }
  | { type: "autoHedge" }
  | { type: "step"; days: number }
  /// Demo only: replaces the whole book (used to jump between scripted states).
  | { type: "restore"; state: BookState };
