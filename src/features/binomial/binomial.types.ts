export type OptionKind = "call" | "put";

export type BinomialParams = {
  S0: number;
  K: number;
  u: number;
  d: number;
  r: number;
  steps: number;
  optionKind: OptionKind;
};

export type BinomialNode = {
  id: string;
  step: number;
  downMoves: number;
  upMoves: number;
  stockPrice: number;
  optionValue: number;
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
  u: number;
  d: number;
  q: number;
  r: number;
  discount: number;
  price: number;
  isValid: boolean;
  validationKey: string | null;
  nodes: BinomialNode[];
  edges: BinomialEdge[];
  width: number;
  height: number;
  replicatingPortfolio: {
    delta: number;
    bond: number;
  } | null;
  deltaT: number;
};

