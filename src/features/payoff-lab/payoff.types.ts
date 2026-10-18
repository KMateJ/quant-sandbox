export type InstrumentType =
  | "stock"
  | "call"
  | "put"
  | "forward"
  | "cash"
  | "digital-call"
  | "digital-put"
  | "asset-call"
  | "asset-put"
  | "gap-call"
  | "gap-put"
  | "double-digital"
  | "supershare";
export type Direction = "long" | "short";
export type ViewMode = "payoff" | "profit";

export type StrategyLeg = {
  id: string;
  type: InstrumentType;
  direction: Direction;
  quantity: number;

  strike?: number;
  forwardPrice?: number;
  premium?: number;
  entryPrice?: number;
  cashAmount?: number;
  rate?: number;

  payout?: number;
  lowerStrike?: number;
  upperStrike?: number;
  triggerStrike?: number;
  settlementStrike?: number;

  /// Position this leg belongs to; grouped legs scale and flip together.
  groupId?: string;
};

/// Several legs handled as one instrument: its quantity multiplies every member,
/// a short position flips every member's direction.
export type PositionGroup = {
  id: string;
  name: string;
  direction: Direction;
  quantity: number;
};

/// One curve in the components view: a stand-alone leg or a whole position.
export type ChartComponent = { key: string; label: string; legs: StrategyLeg[] };

export type PayoffChartPoint = {
  S: number;
  total: number;
  syntheticForward?: number;
  syntheticOverlay?: number;
  [key: string]: number | string | undefined;
};

export type PresetKey =
  | "long-call"
  | "long-put"
  | "covered-call"
  | "protective-put"
  | "synthetic-long-forward"
  | "synthetic-short-forward"
  | "long-stock"
  | "cash"
  | "long-call-butterfly"
  | "bull-call-spread"
  | "bear-put-spread"
  | "long-straddle"
  | "short-straddle"
  | "long-strangle"
  | "short-strangle"
  | "collar"
  | "risk-reversal"
  | "box-spread"
  | "digital-call"
  | "digital-put"
  | "asset-call"
  | "gap-call"
  | "double-digital"
  | "supershare";
