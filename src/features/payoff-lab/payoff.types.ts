export type InstrumentType = "stock" | "call" | "put" | "forward" | "cash";
export type Direction = "long" | "short";
export type ViewMode = "payoff" | "profit";

export type StrategyLeg = {
  id: string;
  type: InstrumentType;
  direction: Direction;
  quantity: number;

  strike?: number;
  forwardPrice?: number;

  // későbbi bővítéshez
  premium?: number;
  entryPrice?: number;
};

export type PayoffChartPoint = {
  S: number;
  total: number;
  syntheticForward?: number;
  [key: string]: number | string | undefined;
};

export type PresetKey =
  | "long-call"
  | "long-put"
  | "covered-call"
  | "protective-put"
  | "synthetic-long-forward"
  | "synthetic-short-forward";