import {
  CALLABLE_YIELD_VOL,
  bulletPrice,
  callValueAt,
  callablePriceAt,
  effectiveRisk,
  yieldToWorst,
  type CallableSpec,
} from "../../lib/finance/callable";

/// A 10-year 6% annual-coupon bond, callable at 100 from the end of its call protection period.
export const CALLABLE = {
  coupon: 6,
  years: 10,
  callPrice: 100,
  /// Volatility of the yield at the call date (lognormal, per year).
  yieldVol: CALLABLE_YIELD_VOL,
  minYield: 0.02,
  maxYield: 0.1,
};

/// Years of call protection offered in the figure; "1" stands for "callable from the first coupon date".
export const PROTECTION_YEARS = [1, 3, 5] as const;
export type Protection = (typeof PROTECTION_YEARS)[number];

const specFor = (k: number): CallableSpec => ({
  coupon: CALLABLE.coupon / 100,
  maturity: CALLABLE.years,
  freq: 1,
  callPrice: CALLABLE.callPrice,
  protection: k,
  vol: CALLABLE.yieldVol,
});

/// Price per 100 face of an `m`-year bond with the callable's coupon, at annually compounded yield `y`.
export const straightPrice = (y: number, m: number = CALLABLE.years) => bulletPrice(CALLABLE.coupon / 100, 1, y, m);

/// Price if the bond is surely called at the first call date `k`: coupons to `k`, then the call price.
export const priceToCall = (y: number, k: number) => bulletPrice(CALLABLE.coupon / 100, 1, y, k, CALLABLE.callPrice);

/// Value of the issuer's call, a European call on the bond at the first call date `k` (see `callValueAt`).
export const callValue = (y: number, k: number) => callValueAt(specFor(k), y);

/// Callable price = straight bond − the issuer's call.
export const callablePrice = (y: number, k: number) => callablePriceAt(specFor(k), y).callable;

export type CallableQuote = {
  straight: number;
  callable: number;
  call: number;
  ytm: number;
  ytc: number;
  ytw: number;
  /// Effective duration and convexity of the callable price, from ±10 bp finite differences.
  duration: number;
  convexity: number;
};

/// Everything the figure reads at yield `y` with `k` years of call protection.
export function callableQuote(y: number, k: number): CallableQuote {
  const spec = specFor(k);
  const { straight, callable, call } = callablePriceAt(spec, y);
  const { ytm, ytc, ytw } = yieldToWorst(spec, callable);
  const { dEff, cEff } = effectiveRisk(spec, y, 10);
  return { straight, callable, call, ytm, ytc, ytw, duration: dEff, convexity: cEff };
}

/// Straight and callable price curves over the figure's yield range.
export function priceCurves(k: number, points = 81): { y: number; straight: number; callable: number }[] {
  const { minYield, maxYield } = CALLABLE;
  return Array.from({ length: points }, (_, i) => {
    const y = minYield + ((maxYield - minYield) * i) / (points - 1);
    return { y, straight: straightPrice(y), callable: callablePrice(y, k) };
  });
}
