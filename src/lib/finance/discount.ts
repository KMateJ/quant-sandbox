/// Compounding convention used by discounting helpers.
export type Compounding = "continuous" | "discrete";

/// Discount factor for rate `r` over time `t`.
/// `continuous` → e^(−r·t); `discrete` → 1 / (1 + r)^t. Default is continuous.
export function discountFactor(
  r: number,
  t: number,
  mode: Compounding = "continuous"
): number {
  return mode === "continuous" ? Math.exp(-r * t) : 1 / Math.pow(1 + r, t);
}

/// Present value of a single future cashflow.
/// `continuous` → fv·e^(−r·t); `discrete` → fv / (1 + r)^t.
export function pv(
  fv: number,
  r: number,
  t: number,
  mode: Compounding = "continuous"
): number {
  return fv * discountFactor(r, t, mode);
}

/// Future value of a present amount.
/// `continuous` → pv·e^(r·t); `discrete` → pv·(1 + r)^t.
export function fv(
  pv: number,
  r: number,
  t: number,
  mode: Compounding = "continuous"
): number {
  return mode === "continuous" ? pv * Math.exp(r * t) : pv * Math.pow(1 + r, t);
}

/// Present value of a series of cashflows at times `t[i]` discounted at a flat rate `r`.
export function pvCashflows(
  cashflows: number[],
  times: number[],
  r: number,
  mode: Compounding = "continuous"
): number {
  if (cashflows.length !== times.length) {
    throw new Error("pvCashflows: cashflows and times must be equal length");
  }
  let total = 0;
  for (let i = 0; i < cashflows.length; i++) {
    total += pv(cashflows[i], r, times[i], mode);
  }
  return total;
}

/// Convert a continuously compounded rate to its discrete annual equivalent, or vice versa.
/// `to === "discrete"` returns e^r − 1; `to === "continuous"` returns ln(1 + r).
export function convertRate(r: number, to: Compounding): number {
  return to === "discrete" ? Math.exp(r) - 1 : Math.log(1 + r);
}
