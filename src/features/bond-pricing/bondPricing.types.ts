/// A point on the price–yield curve: yield to maturity and the resulting bond price.
export type PriceYieldPoint = {
  ytm: number;
  price: number;
};

/// Whether the bond trades above, at, or below its face value.
export type BondState = "premium" | "par" | "discount";

/// Full parameter set describing a fixed-coupon bond.
export type BondInputs = {
  face: number;
  couponRate: number;
  ytm: number;
  years: number;
  freq: number;
};

/// One scheduled payment: its nominal cash flow, discount factor and present value.
export type CashFlowRow = {
  period: number;
  time: number;
  coupon: number;
  principal: number;
  cashflow: number;
  discountFactor: number;
  presentValue: number;
};

/// Everything the Bond Lab derives from a set of inputs.
export type BondAnalytics = {
  rows: CashFlowRow[];
  price: number;
  macaulay: number;
  modified: number;
  convexity: number;
};
