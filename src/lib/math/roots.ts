/// Options shared by the root-finding routines.
export interface RootOptions {
  /// Absolute convergence tolerance on the residual / step size. Default 1e-10.
  tol?: number;
  /// Maximum iterations before giving up. Default 100.
  maxIter?: number;
}

/// Result of a root-finding attempt, including convergence diagnostics.
export interface RootResult {
  /// Best estimate of the root found.
  root: number;
  /// Whether the method converged within `tol` before `maxIter`.
  converged: boolean;
  /// Number of iterations actually performed.
  iterations: number;
}

const DEFAULT_TOL = 1e-10;
const DEFAULT_MAX_ITER = 100;

/// Find a root of `f` on the bracket `[a, b]` by bisection.
/// Requires a sign change: `f(a) * f(b) <= 0`, otherwise throws.
export function bisection(
  f: (x: number) => number,
  a: number,
  b: number,
  options: RootOptions = {}
): RootResult {
  const tol = options.tol ?? DEFAULT_TOL;
  const maxIter = options.maxIter ?? DEFAULT_MAX_ITER;

  let lo = a;
  let hi = b;
  let fLo = f(lo);
  let fHi = f(hi);

  if (fLo === 0) return { root: lo, converged: true, iterations: 0 };
  if (fHi === 0) return { root: hi, converged: true, iterations: 0 };
  if (fLo * fHi > 0) {
    throw new Error("bisection: f(a) and f(b) must bracket a root (opposite signs)");
  }

  let mid = lo;
  for (let i = 1; i <= maxIter; i++) {
    mid = 0.5 * (lo + hi);
    const fMid = f(mid);
    if (fMid === 0 || 0.5 * (hi - lo) < tol) {
      return { root: mid, converged: true, iterations: i };
    }
    if (fLo * fMid < 0) {
      hi = mid;
      fHi = fMid;
    } else {
      lo = mid;
      fLo = fMid;
    }
  }
  return { root: mid, converged: false, iterations: maxIter };
}

/// Find a root of `f` near `x0` using Newton–Raphson with derivative `df`.
/// Falls back to a non-converged result if the derivative vanishes or `maxIter` is reached.
export function newton(
  f: (x: number) => number,
  df: (x: number) => number,
  x0: number,
  options: RootOptions = {}
): RootResult {
  const tol = options.tol ?? DEFAULT_TOL;
  const maxIter = options.maxIter ?? DEFAULT_MAX_ITER;

  let x = x0;
  for (let i = 1; i <= maxIter; i++) {
    const fx = f(x);
    if (Math.abs(fx) < tol) {
      return { root: x, converged: true, iterations: i };
    }
    const dfx = df(x);
    if (dfx === 0 || !Number.isFinite(dfx)) {
      return { root: x, converged: false, iterations: i };
    }
    const next = x - fx / dfx;
    if (Math.abs(next - x) < tol) {
      return { root: next, converged: true, iterations: i };
    }
    x = next;
  }
  return { root: x, converged: false, iterations: maxIter };
}
