/// A callable bond: annual `coupon` rate (decimal), `maturity` and `protection` in years, `freq` coupons per year,
/// `callPrice` per 100 face. The issuer may call at any coupon date from `protection` (inclusive) until maturity.
export type CallableSpec = {
  coupon: number;
  maturity: number;
  freq: number;
  callPrice: number;
  protection: number;
  /// Lognormal volatility of the yield at the call date; defaults to {@link CALLABLE_YIELD_VOL}.
  vol?: number;
};

/// Default yield volatility (per year) behind the call's value.
export const CALLABLE_YIELD_VOL = 0.2;

const YIELD_LO = -0.05;
const YIELD_HI = 0.6;

const normalPdf = (z: number) => Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);

/// Price per 100 face of a bullet bond: `rate` coupons `freq` times a year for `years`, redeemed at `redemption`,
/// discounted at the periodically compounded yield `y`.
export function bulletPrice(rate: number, freq: number, y: number, years: number, redemption = 100): number {
  const n = Math.round(years * freq);
  const c = (100 * rate) / freq;
  const r = y / freq;
  let p = 0;
  for (let t = 1; t <= n; t++) p += c / (1 + r) ** t;
  return p + redemption / (1 + r) ** n;
}

/// Price of the same bond without the call.
export const straightPriceAt = (spec: CallableSpec, y: number) => bulletPrice(spec.coupon, spec.freq, y, spec.maturity);

/// Years at which the issuer may call: every coupon date from the end of protection until (excluding) maturity.
export function callDates(spec: CallableSpec): number[] {
  const out: number[] = [];
  for (let t = spec.protection; t < spec.maturity - 1e-9; t += 1 / spec.freq) out.push(Number(t.toFixed(6)));
  return out;
}

/// Yield at which the remaining bond (after `t` years) is worth exactly the call price: the issuer calls below it.
function callThreshold(spec: CallableSpec, t: number): number {
  let lo = YIELD_LO;
  let hi = YIELD_HI;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (bulletPrice(spec.coupon, spec.freq, mid, spec.maturity - t) > spec.callPrice) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/// Value of the issuer's call, modelled as a European call on the bond at the first call date.
/// The yield then is lognormal around today's `y`; the issuer calls when the remaining bond is worth more than the
/// call price, i.e. when that yield is below a threshold, so the payoff is integrated over that region.
export function callValueAt(spec: CallableSpec, y: number): number {
  const dates = callDates(spec);
  if (!dates.length) return 0;
  const k = dates[0];
  const threshold = callThreshold(spec, k);
  if (threshold <= 0) return 0;
  const sd = (spec.vol ?? CALLABLE_YIELD_VOL) * Math.sqrt(k);
  const zStar = (Math.log(threshold / y) + 0.5 * sd * sd) / sd;
  const lo = -8;
  if (zStar <= lo) return 0;
  // Simpson's rule on a smooth integrand (no kink inside the interval).
  const n = 256;
  const h = (zStar - lo) / n;
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    const z = lo + i * h;
    const yk = y * Math.exp(sd * z - 0.5 * sd * sd);
    const payoff = Math.max(0, bulletPrice(spec.coupon, spec.freq, yk, spec.maturity - k) - spec.callPrice);
    sum += (i === 0 || i === n ? 1 : i % 2 ? 4 : 2) * payoff * normalPdf(z);
  }
  return (sum * h) / 3 / (1 + y / spec.freq) ** Math.round(k * spec.freq);
}

/// Straight price, the call's value to the issuer and the callable price (straight − call) at yield `y`.
export function callablePriceAt(spec: CallableSpec, y: number): { straight: number; callable: number; call: number } {
  const straight = straightPriceAt(spec, y);
  const call = callValueAt(spec, y);
  return { straight, callable: straight - call, call };
}

/// The yield that discounts `f` to `price` (bisection on [-5%, 60%]; `f` decreasing in the yield), or NaN when
/// `price` lies outside what that range can produce.
function yieldFor(f: (y: number) => number, price: number): number {
  let lo = YIELD_LO;
  let hi = YIELD_HI;
  if (!(f(lo) >= price && f(hi) <= price)) return NaN;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > price) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/// Yield to maturity, yield to the first call, and yield to worst (the lowest over maturity and every call date)
/// for a bond trading at `price`. Entries are NaN where no yield reproduces the price.
export function yieldToWorst(spec: CallableSpec, price: number): { ytm: number; ytc: number; ytw: number; worstDate: number } {
  const ytm = yieldFor((y) => straightPriceAt(spec, y), price);
  const toCall = callDates(spec).map((t) => ({ t, y: yieldFor((y) => bulletPrice(spec.coupon, spec.freq, y, t, spec.callPrice), price) }));
  let worst = { t: spec.maturity, y: ytm };
  for (const c of toCall) if (Number.isFinite(c.y) && (!Number.isFinite(worst.y) || c.y < worst.y)) worst = c;
  return { ytm, ytc: toCall.length ? toCall[0].y : NaN, ytw: worst.y, worstDate: worst.t };
}

/// Effective duration and convexity of the callable price from ±`bp` basis-point finite differences.
export function effectiveRisk(spec: CallableSpec, y: number, bp = 25): { dEff: number; cEff: number } {
  const d = bp / 10_000;
  const mid = callablePriceAt(spec, y).callable;
  const up = callablePriceAt(spec, y + d).callable;
  const down = callablePriceAt(spec, y - d).callable;
  return { dEff: (down - up) / (2 * mid * d), cEff: (up + down - 2 * mid) / (mid * d * d) };
}

/// For each call date, whether the issuer would call at yield `y`: refinancing at `y` is cheaper than the coupons
/// when the remaining bond is worth more than the call price.
export function callSchedule(spec: CallableSpec, y: number): { t: number; call: boolean }[] {
  return callDates(spec).map((t) => ({ t, call: bulletPrice(spec.coupon, spec.freq, y, spec.maturity - t) > spec.callPrice }));
}

/// The first call date the issuer would use at yield `y`, or null if the bond runs to maturity.
export const expectedRedemption = (spec: CallableSpec, y: number): number | null =>
  callSchedule(spec, y).find((d) => d.call)?.t ?? null;

/// Contiguous yield ranges (from the sample `ys`) where the callable's effective convexity is negative.
export function negativeConvexityRanges(spec: CallableSpec, ys: number[], bp = 25): [number, number][] {
  const out: [number, number][] = [];
  let start: number | null = null;
  ys.forEach((y, i) => {
    const neg = effectiveRisk(spec, y, bp).cEff < 0;
    if (neg && start === null) start = y;
    if (!neg && start !== null) {
      out.push([start, ys[i - 1]]);
      start = null;
    }
  });
  if (start !== null) out.push([start, ys[ys.length - 1]]);
  return out;
}
