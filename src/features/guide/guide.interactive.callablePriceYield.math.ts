/// A 10-year 6% annual-coupon bond, callable at 100 from the end of its call protection period.
export const CALLABLE = {
  coupon: 6,
  years: 10,
  callPrice: 100,
  /// Volatility of the yield at the call date (lognormal, per year).
  yieldVol: 0.2,
  minYield: 0.02,
  maxYield: 0.1,
};

/// Years of call protection offered in the figure; "1" stands for "callable from the first coupon date".
export const PROTECTION_YEARS = [1, 3, 5] as const;
export type Protection = (typeof PROTECTION_YEARS)[number];

/// Price per 100 face of an `m`-year bond with the callable's coupon, at annually compounded yield `y`.
export function straightPrice(y: number, m: number = CALLABLE.years): number {
  let p = 0;
  for (let t = 1; t <= m; t++) p += CALLABLE.coupon / (1 + y) ** t;
  return p + 100 / (1 + y) ** m;
}

/// Price if the bond is surely called at the first call date `k`: coupons to `k`, then the call price.
export function priceToCall(y: number, k: number): number {
  let p = 0;
  for (let t = 1; t <= k; t++) p += CALLABLE.coupon / (1 + y) ** t;
  return p + CALLABLE.callPrice / (1 + y) ** k;
}

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/// Value of the issuer's call, a European call on the bond at the first call date `k`.
/// The yield then is lognormal around today's `y`; the issuer calls exactly when the remaining bond is above
/// the call price, i.e. when that yield is below the coupon rate, so the payoff is integrated over that region.
export function callValue(y: number, k: number): number {
  const { yieldVol: s, coupon, callPrice, years } = CALLABLE;
  const sd = s * Math.sqrt(k);
  const zStar = (Math.log(coupon / 100 / y) + 0.5 * sd * sd) / sd;
  const lo = -8;
  if (zStar <= lo) return 0;
  // Simpson's rule on a smooth integrand (no kink inside the interval).
  const n = 256;
  const h = (zStar - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const z = lo + i * h;
    const yk = y * Math.exp(sd * z - 0.5 * sd * sd);
    const payoff = Math.max(0, straightPrice(yk, years - k) - callPrice);
    sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * payoff * normalPdf(z);
  }
  return (sum * h) / 3 / (1 + y) ** k;
}

/// Callable price = straight bond − the issuer's call.
export const callablePrice = (y: number, k: number) => straightPrice(y) - callValue(y, k);

/// The yield `f` must be discounted at to equal `price` (bisection; `f` decreasing in the yield).
function yieldFor(f: (y: number) => number, price: number): number {
  let lo = -0.05;
  let hi = 0.6;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > price) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

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
  const callable = callablePrice(y, k);
  const d = 0.001;
  const up = callablePrice(y + d, k);
  const down = callablePrice(y - d, k);
  const ytm = yieldFor((z) => straightPrice(z), callable);
  const ytc = yieldFor((z) => priceToCall(z, k), callable);
  return {
    straight: straightPrice(y),
    callable,
    call: callValue(y, k),
    ytm,
    ytc,
    ytw: Math.min(ytm, ytc),
    duration: (down - up) / (2 * callable * d),
    convexity: (up + down - 2 * callable) / (callable * d * d),
  };
}

/// Straight and callable price curves over the figure's yield range.
export function priceCurves(k: number, points = 81): { y: number; straight: number; callable: number }[] {
  const { minYield, maxYield } = CALLABLE;
  return Array.from({ length: points }, (_, i) => {
    const y = minYield + ((maxYield - minYield) * i) / (points - 1);
    return { y, straight: straightPrice(y), callable: callablePrice(y, k) };
  });
}
