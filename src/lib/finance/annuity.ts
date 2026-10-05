import { bisection, newton, type RootResult } from "../math/roots";

/// Present value of an ordinary annuity: `payment` received for `n` periods at per-period rate `r`.
/// Falls back to `payment · n` when `r === 0`.
export function annuityPV(payment: number, r: number, n: number): number {
  if (r === 0) return payment * n;
  return (payment * (1 - Math.pow(1 + r, -n))) / r;
}

/// Future value of an ordinary annuity after `n` periods at per-period rate `r`.
/// Falls back to `payment · n` when `r === 0`.
export function annuityFV(payment: number, r: number, n: number): number {
  if (r === 0) return payment * n;
  return (payment * (Math.pow(1 + r, n) - 1)) / r;
}

/// Present value of a level perpetuity: `payment / r`. Throws when `r <= 0`.
export function perpetuityPV(payment: number, r: number): number {
  if (r <= 0) throw new Error("perpetuityPV: rate must be positive");
  return payment / r;
}

/// Net present value of `cashflows` (index 0 at t=0, index i at t=i) at per-period `rate`.
export function npv(rate: number, cashflows: number[]): number {
  let total = 0;
  for (let t = 0; t < cashflows.length; t++) {
    total += cashflows[t] / Math.pow(1 + rate, t);
  }
  return total;
}

/// Derivative of NPV with respect to `rate`, used by the Newton step in `irr`.
function npvDerivative(rate: number, cashflows: number[]): number {
  let total = 0;
  for (let t = 1; t < cashflows.length; t++) {
    total += (-t * cashflows[t]) / Math.pow(1 + rate, t + 1);
  }
  return total;
}

/// Internal rate of return: the `rate` solving `npv(rate, cashflows) = 0`.
/// Tries Newton from `guess`, then falls back to bisection over [-0.9999, 10].
/// Returns `NaN` if no sign change brackets a root for the fallback.
export function irr(cashflows: number[], guess = 0.1): number {
  const newtonResult: RootResult = newton(
    (r) => npv(r, cashflows),
    (r) => npvDerivative(r, cashflows),
    guess,
    { tol: 1e-8, maxIter: 100 }
  );
  if (newtonResult.converged && newtonResult.root > -1) return newtonResult.root;

  const lo = -0.9999;
  const hi = 10;
  if (npv(lo, cashflows) * npv(hi, cashflows) > 0) return NaN;
  return bisection((r) => npv(r, cashflows), lo, hi, { tol: 1e-8, maxIter: 200 }).root;
}
