import type { DemoAnchor } from "./demo.types";

export const DEMO_MISSION = "M1";
export const DEMO_SEED = 49;
export const DEMO_HOLD_MS = 7000;
export const DEMO_HOLD_LONG_MS = 10000;

/// Every anchor a step may point at, in declaration order.
export const DEMO_ANCHORS: readonly DemoAnchor[] = [
  "quotes",
  "tabs",
  "mission",
  "risk",
  "blotter",
  "price",
  "delta",
  "pnl",
  "matrix",
  "profile",
  "positions",
  "ticket",
  "submit",
  "chain",
  "keys",
  "debrief-banner",
  "debrief-attribution",
  "debrief-history",
  "debrief-policies",
];
