import type { Book, Fill, FlowEvent, Side } from "../../lib/market/market.types";

export type ObkMode = "simulate" | "predict" | "challenge";
export type Liquidity = "thin" | "normal" | "deep";
export type TicketKind = "market" | "limit";

/// A market order you sent: the book before it, its fills and cost.
export type SentOrder = { side: Side; size: number; t: number; before: Book; fills: Fill[]; avgPrice: number | null; unfilled: number; slipBp: number };

/// One of your executions, from your side (buy = you bought), with the mid when it happened.
export type MyFill = { t: number; side: Side; price: number; size: number; mid: number; passive: boolean };

/// The execution challenge: buy `target` shares by `deadline` (sim seconds from the reset).
export type ExecChallenge = { target: number; deadline: number; arrival: number; done: boolean };

export type SimState = {
  t: number;
  book: Book;
  centre: number;
  events: FlowEvent[];
  sent: SentOrder[];
  myFills: MyFill[];
  /// Mid at the start of every simulated second (for markouts).
  mids: number[];
  challenge: ExecChallenge | null;
};

/// A previewed market order: from the ticket, or "take everything to this row".
export type Preview = { side: Side; size: number; toPrice: number | null };
