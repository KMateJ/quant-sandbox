/// A point on the yield curve at maturity `t`: par (coupon) yield and bootstrapped spot rate.
export type YieldCurvePoint = {
  t: number;
  par: number;
  spot: number;
};
