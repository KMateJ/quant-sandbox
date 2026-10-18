import type { BondSpec } from "../../lib/finance/bond";
/// A point on the price–yield curve: yield to maturity and the resulting bond price.
export type PriceYieldPoint = {
  ytm: number;
  price: number;
};

/// Whether the bond trades above, at, or below its face value.
export type BondState = "premium" | "par" | "discount";

/// A broken/split vertical axis: a full-resolution lower band plus a compressed
/// upper band separated by a pixel gap, so tiny coupons stay visible next to a
/// large principal. When there is no large outlier it degrades to a single band.
export type BrokenAxis = {
  hasBreak: boolean;
  base: number;
  gapBottomY: number;
  gapTopY: number;
  lowerMax: number;
  upperMax: number;
  y: (v: number) => number;
  /// Value at pixel `py` (inverse of `y`): the gap reads as the lower band's top, and the upper band
  /// extrapolates past its top so a dragged bar can grow beyond the current scale.
  invert: (py: number) => number;
};

/// Full parameter set describing a fixed-coupon bond.
export type BondInputs = BondSpec;

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
