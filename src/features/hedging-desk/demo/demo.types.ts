import type { BookState, DeskAction, InstrumentId, Side } from "../engine/desk.types";
import type { DeskScreen } from "../hedgingDesk.url";

/// Element a step points at; the DOM gives each one `id="hd-<anchor>"` (plan 02).
export type DemoAnchor =
  | "quotes"
  | "tabs"
  | "mission"
  | "risk"
  | "blotter"
  | "price"
  | "delta"
  | "pnl"
  | "matrix"
  | "profile"
  | "positions"
  | "ticket"
  | "submit"
  | "chain"
  | "keys"
  | "debrief-banner"
  | "debrief-attribution"
  | "debrief-history"
  | "debrief-policies";

/// What the order ticket shows during a step (UI only; the book is driven by `actions`).
export type DemoTicket = { id: InstrumentId; side: Side; qty: number };

/// One scripted step of the playthrough.
export type DemoStep = {
  /// Caption keys are `hdDemo<Id>Title` / `hdDemo<Id>Body` with the id capitalised (plan 03).
  id: string;
  screen: DeskScreen;
  anchor: DemoAnchor;
  /// Engine actions applied on entering the step, on top of the previous step's state.
  actions: DeskAction[];
  ticket?: DemoTicket;
  /// Auto-play dwell time before the next step.
  holdMs: number;
};

/// The script with the book state after each step (`states[k]` belongs to `steps[k]`).
export type DemoRun = { steps: DemoStep[]; states: BookState[] };
