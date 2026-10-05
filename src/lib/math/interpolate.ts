/// Constrain `x` to the closed interval `[min, max]`.
export function clamp(x: number, min: number, max: number): number {
  if (min > max) [min, max] = [max, min];
  return x < min ? min : x > max ? max : x;
}

/// Linear interpolation between `a` and `b` by fraction `t` (t in [0, 1] stays in range).
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/// Inverse of `lerp`: the fraction `t` such that `lerp(a, b, t) === value`.
/// Returns 0 when `a === b` to avoid division by zero.
export function inverseLerp(a: number, b: number, value: number): number {
  return a === b ? 0 : (value - a) / (b - a);
}

/// Piecewise-linear interpolation of `y` at `x`, given strictly increasing `xs` and matching `ys`.
/// Values outside `[xs[0], xs[n-1]]` are clamped to the nearest endpoint.
export function linearInterp(xs: number[], ys: number[], x: number): number {
  const n = xs.length;
  if (n === 0 || ys.length !== n) {
    throw new Error("linearInterp: xs and ys must be non-empty and equal length");
  }
  if (x <= xs[0]) return ys[0];
  if (x >= xs[n - 1]) return ys[n - 1];

  let lo = 0;
  let hi = n - 1;
  while (hi - lo > 1) {
    const mid = (lo + hi) >> 1;
    if (xs[mid] <= x) lo = mid;
    else hi = mid;
  }
  const t = inverseLerp(xs[lo], xs[hi], x);
  return lerp(ys[lo], ys[hi], t);
}

/// `n` evenly spaced points from `start` to `stop` inclusive (n >= 2; n === 1 yields `[start]`).
export function linspace(start: number, stop: number, n: number): number[] {
  if (n < 0 || !Number.isInteger(n)) {
    throw new Error("linspace: n must be a non-negative integer");
  }
  if (n === 0) return [];
  if (n === 1) return [start];
  const step = (stop - start) / (n - 1);
  const out = new Array<number>(n);
  for (let i = 0; i < n; i++) out[i] = start + step * i;
  out[n - 1] = stop;
  return out;
}

/// Half-open numeric range `[start, stop)` advancing by `step` (default 1). Supports negative steps.
export function range(start: number, stop: number, step = 1): number[] {
  if (step === 0) throw new Error("range: step must be non-zero");
  const out: number[] = [];
  if (step > 0) {
    for (let x = start; x < stop; x += step) out.push(x);
  } else {
    for (let x = start; x > stop; x += step) out.push(x);
  }
  return out;
}
