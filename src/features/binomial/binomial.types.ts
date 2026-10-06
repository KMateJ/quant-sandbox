export type OptionKind = "call" | "put";
export type TreeMode = "equity" | "rates";
export type BinomialValidationKey =
  | "binomialValidationInvalidParameters"
  | "binomialValidationUGreaterThanD"
  | "binomialValidationDPositive"
  | "binomialValidationRatePositiveOnePlusR"
  | "binomialValidationQNotComputable"
  | "binomialValidationQOutOfRange";

export type BinomialControlValues = {
  mode: TreeMode;
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  q: number;
  h: number;
  steps: number;
};

export type BinomialControlHandlers = {
  onS0Change: (value: number) => void;
  onKChange: (value: number) => void;
  onUChange: (value: number) => void;
  onDChange: (value: number) => void;
  onRChange: (value: number) => void;
  onQChange: (value: number) => void;
  onHChange: (value: number) => void;
  onStepsChange: (value: number) => void;
};

export type BinomialParams = {
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  steps: number;
  optionKind: OptionKind;
};

export type RateTreeParams = {
  r0: number;
  u?: number;
  d?: number;
  h?: number;
  q: number;
  steps: number;
};

export type BinomialNode = {
  id: string;
  step: number;
  downMoves: number;
  upMoves: number;
  stockPrice?: number;
  optionValue?: number;
  shortRate?: number;
  bondValue?: number;
  statePrice?: number;
  x: number;
  y: number;
};

export type BinomialEdge = {
  id: string;
  fromId: string;
  toId: string;
  kind: "up" | "down";
  probabilityLabel: string;
};

export type BinomialTreeResult = {
  mode: TreeMode;
  u: number;
  d: number;
  q: number;
  r: number;
  h?: number;
  discount: number;
  price: number;
  isValid: boolean;
  validationKey: BinomialValidationKey | null;
  nodes: BinomialNode[];
  edges: BinomialEdge[];
  width: number;
  height: number;
  replicatingPortfolio: {
    delta: number;
    bond: number;
  } | null;
  deltaT: number;
  maturity: number;
  yieldToMaturity?: number;
  steps: number;
};
