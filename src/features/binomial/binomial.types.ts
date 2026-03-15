export type OptionKind = "call" | "put";
export type ExerciseStyle = "european" | "american";

export type BinomialParams = {
  S0: number;
  K: number;
  r: number;
  sigma: number;
  T: number;
  steps: number;
  optionKind: OptionKind;
  exerciseStyle: ExerciseStyle;
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
  p: number;
  dt: number;
  discount: number;
  price: number;
  nodes: BinomialNode[];
  edges: BinomialEdge[];
  width: number;
  height: number;
};