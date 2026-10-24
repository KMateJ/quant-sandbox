/// Zero-curve point (annual compounding) and a dated cash flow per 100 face.
export type ZeroPoint = { t: number; z: number };
export type CashFlow = { t: number; cf: number };

/// Key maturities (years) of the key-rate durations.
export const KEY_RATES = [2, 5, 10, 30];

/// Zero rate at `t` by linear interpolation of the knots, flat beyond the ends.
export function zeroAt(zeros: ZeroPoint[], t: number): number {
  if (t <= zeros[0].t) return zeros[0].z;
  for (let i = 1; i < zeros.length; i++) {
    if (t <= zeros[i].t) {
      const w = (t - zeros[i - 1].t) / (zeros[i].t - zeros[i - 1].t);
      return zeros[i - 1].z + w * (zeros[i].z - zeros[i - 1].z);
    }
  }
  return zeros[zeros.length - 1].z;
}

/// Present value of cash flows discounted off the zero curve (annual compounding).
export function priceOnCurve(cashflows: CashFlow[], zeros: ZeroPoint[]): number {
  return cashflows.reduce((s, c) => s + c.cf / Math.pow(1 + zeroAt(zeros, c.t), c.t), 0);
}

/// Duration against a parallel move of the zero curve: Σ t·PV_t/(1+z_t) / P.
export function curveDuration(cashflows: CashFlow[], zeros: ZeroPoint[]): number {
  const total = priceOnCurve(cashflows, zeros);
  const weighted = cashflows.reduce((s, c) => {
    const z = zeroAt(zeros, c.t);
    return s + (c.t * c.cf) / Math.pow(1 + z, c.t) / (1 + z);
  }, 0);
  return weighted / total;
}

/// Weight of key rate `k` at maturity `t`: 1 at the key, falling linearly to 0 at the neighbouring keys, flat past the ends.
export function keyWeight(keys: number[], k: number, t: number): number {
  const lo = k > 0 ? keys[k - 1] : undefined;
  const hi = k < keys.length - 1 ? keys[k + 1] : undefined;
  if (t <= keys[k]) return lo === undefined ? 1 : Math.max(0, (t - lo) / (keys[k] - lo));
  return hi === undefined ? 1 : Math.max(0, (hi - t) / (hi - keys[k]));
}

/// Key-rate durations −(ΔP/P)/Δy for a 1 bp move of each key rate, spread over the cash flows by `keyWeight`.
/// The weights sum to 1 at every maturity, so the key-rate durations add up to `curveDuration`.
export function keyRateDurations(cashflows: CashFlow[], zeros: ZeroPoint[], keys: number[]): number[] {
  const h = 1e-4;
  const total = priceOnCurve(cashflows, zeros);
  return keys.map((_, k) => {
    const bumped = (sign: number) =>
      cashflows.reduce((s, c) => s + c.cf / Math.pow(1 + zeroAt(zeros, c.t) + sign * h * keyWeight(keys, k, c.t), c.t), 0);
    return -(bumped(1) - bumped(-1)) / (2 * h * total);
  });
}

/// Annual-coupon bullet bond: face 100, coupon rate `coupon`, `years` payments.
export function bulletCashflows(coupon: number, years: number): CashFlow[] {
  return Array.from({ length: years }, (_, i) => ({ t: i + 1, cf: 100 * coupon + (i + 1 === years ? 100 : 0) }));
}

/// Two zero-coupon positions (at `short` and `long` years) with the same price and curve duration as `target`.
export function barbellCashflows(target: CashFlow[], zeros: ZeroPoint[], short: number, long: number): CashFlow[] {
  const price = priceOnCurve(target, zeros);
  const dur = (t: number) => t / (1 + zeroAt(zeros, t));
  const wShort = (dur(long) - curveDuration(target, zeros)) / (dur(long) - dur(short));
  return [
    { t: short, cf: wShort * price * Math.pow(1 + zeroAt(zeros, short), short) },
    { t: long, cf: (1 - wShort) * price * Math.pow(1 + zeroAt(zeros, long), long) },
  ];
}

/// Annual-coupon cash flows per 100 face for a bond with `maturity` years left (may be fractional): flows at maturity, maturity − 1, … > 0.
export function couponCashflows(coupon: number, maturity: number): CashFlow[] {
  const out: CashFlow[] = [];
  for (let t = maturity; t > 1e-9; t -= 1) out.unshift({ t, cf: 100 * coupon + (t === maturity ? 100 : 0) });
  return out;
}
