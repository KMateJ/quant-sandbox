import type { Greeks, InstrumentId, ObjectiveResult, Order, Side } from "../engine/desk.types";

/// Scenario ids, in display order.
export type WhatIfId =
  | "ticket"
  | "doNothing"
  | "stockHedge"
  | "optionDelta"
  | "otmOptionDelta"
  | "gammaNeutral"
  | "vegaNeutral"
  | "shortOptionDelta"
  | "closeOut";
/// Why a scenario cannot be applied.
export type WhatIfBlock = "expired" | "stockOnly" | "tradeLimit" | "emptyTicket" | "nothingToDo";
/// One-day P&L at a spot move of `sigmas` daily standard deviations (`move` in dollars).
export type ShockRow = { sigmas: number; move: number; pnl: number };
/// Plain-language findings about a scenario.
export type WhatIfVerdict =
  | "fixesDelta"
  | "missesBand"
  | "addsShortGamma"
  | "cutsGamma"
  | "flipsGamma"
  | "addsVega"
  | "cutsVega"
  | "losesTheta"
  | "closesBook"
  | "wrongWay"
  | "costly";
/// The ticket as the scenario engine needs it (qty a positive integer, or 0 when empty).
export type WhatIfTicket = { id: InstrumentId; side: Side; qty: number };
/// A candidate trade applied to a copy of the book, measured with today's market only.
export type WhatIfResult = {
  id: WhatIfId;
  orders: Order[];
  block?: WhatIfBlock;
  /// Half-spreads and fees of these orders.
  cost: number;
  /// Cash out (+) / in (-) for option legs, excluding cost.
  premium: number;
  before: Greeks;
  after: Greeks;
  inBand: boolean;
  /// P(|delta at tomorrow's close| > band), 0..1.
  breachChance: number;
  /// One day ahead at -2, -1, 0, +1, +2 daily sigmas.
  shocks: ShockRow[];
  /// P&L of an instant +2 vol-point move after the trade.
  volUp: number;
  /// Objectives evaluated on the copy after the orders.
  objectives: ObjectiveResult[];
  verdicts: WhatIfVerdict[];
};
