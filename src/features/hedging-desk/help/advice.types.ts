import type { InstrumentId, Side } from "../engine/desk.types";

export type AdviceTone = "urgent" | "suggest" | "info" | "done";

/// One button an advice item can carry. The unions mirror the help shell's tabs and anchors.
export type AdviceAction =
  | { kind: "ticket"; id: InstrumentId; side: Side; qty: number }
  | { kind: "key"; code: "F2" | "F3" | "F4" | "F5" | "F8" | "F9" }
  | { kind: "screen"; screen: "debrief" }
  | { kind: "tab"; tab: "whatIf" | "guide" }
  | {
      kind: "point";
      anchor: "risk" | "delta" | "mission" | "ticket" | "chain" | "matrix" | "profile" | "blotter" | "positions";
    };

export const ADVICE_IDS = [
  "expired", "noTradesLeft", "outsideBand", "wrongWay", "lastBreach", "gammaDeadline", "vegaDeadline",
  "pinRisk", "nearBand", "oneBreachLeft", "costsHigh", "tradesLow", "pnlDrift", "expirySoon", "gapWindow",
  "ivShiftAhead", "firstHedge", "inBand", "thetaVsGamma", "optionsLocked", "ticketFee",
] as const;

export type AdviceId = (typeof ADVICE_IDS)[number];

/// A piece of advice: copy id, urgency, numbers for the copy and at most one action.
export type Advice = { id: AdviceId; tone: AdviceTone; vars: Record<string, number>; action?: AdviceAction };
