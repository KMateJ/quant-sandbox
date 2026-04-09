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
};

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
