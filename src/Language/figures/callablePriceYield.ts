// Strings for the "callable-price-yield" guide figure. Keys are prefixed ixCb to stay unique.
import type { callablePriceYieldHu } from "./callablePriceYield.hu";

export const callablePriceYieldEn: Record<keyof typeof callablePriceYieldHu, string> = {
  ixCbTitle: "Callable bond: price against yield",
  ixCbProtection: "Call protection",
  ixCbProtection1: "None (callable from year 1)",
  ixCbProtection3: "3 years",
  ixCbProtection5: "5 years",
  ixCbHint: "Drag the point along the curve, or use the arrow keys.",
  ixCbAria: "Price–yield curves of the straight bond and the callable bond",
  ixCbStraight: "Straight bond",
  ixCbCallable: "Callable bond",
  ixCbCallValue: "Value of the call",
  ixCbTangent: "Tangent at the chosen point",
  ixCbHandle: "Market yield",
  ixCbHandleText: "yield {{y}}, callable price {{p}}",
  ixCbNegative: "negative convexity",
  ixCbPositive: "positive convexity",
  ixCbYield: "Yield",
  ixCbStraightPrice: "Straight price",
  ixCbCallablePrice: "Callable price",
  ixCbYtm: "Yield to maturity",
  ixCbYtc: "Yield to call",
  ixCbYtw: "Yield to worst",
  ixCbDuration: "Effective duration",
  ixCbConvexity: "Effective convexity",
};
