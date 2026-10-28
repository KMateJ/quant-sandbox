import type { ExposureType, InstKind } from "../engine/systemic.types";

export type SizeBy = "assets" | "equity" | "debtRank";
export type ColorBy = "kind" | "leverage" | "capital";
export type ViewMode = "graph" | "matrix";
export type EditTool = "select" | "connect" | "delete";

export const SIZE_BY: readonly SizeBy[] = ["assets", "equity", "debtRank"];
export const COLOR_BY: readonly ColorBy[] = ["kind", "leverage", "capital"];

/// Display order of institution kinds (also the colour order and the matrix sort order).
export const KIND_ORDER: readonly InstKind[] = ["dealer", "bank", "regional", "mmf", "hedgeFund", "insurer", "ccp"];
export const TYPE_ORDER: readonly ExposureType[] = ["interbank", "repo", "derivatives"];

export type NodeOptions = {
  sizeBy: SizeBy;
  colorBy: ColorBy;
  kinds: ReadonlySet<InstKind>;
  /// DebtRank of each institution when it alone fails (see `systemicRanking`).
  debtRank?: ReadonlyMap<string, number>;
  /// Display name of a kind (the page passes the translated one).
  label?: (kind: InstKind) => string;
};

/// One row of the counterparty table of an institution.
export type CounterpartyRow = {
  exposureId: string;
  other: string;
  type: ExposureType;
  direction: "lent" | "borrowed";
  amount: number;
  shareOfEquity: number;
};

export type SegKey =
  | "cash" | "loans" | "gov" | "corp" | "mbs" | "equityHold" | "claimInterbank" | "claimRepo" | "claimDerivatives"
  | "deposits" | "shortFunding" | "owedInterbank" | "owedRepo" | "owedDerivatives" | "otherLiab" | "equity";
export type Segment = { key: SegKey; value: number };

export type SystemStatsData = {
  totalAssets: number;
  meanLeverage: number;
  density: number;
  /// Largest single exposure ÷ the lender's equity.
  largestExposure: number;
  topDebtRank: number;
  singlePoints: number;
};
