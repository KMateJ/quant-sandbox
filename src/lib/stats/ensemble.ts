// Statistics over an ensemble of simulated paths stored step-major: `values[step * pathCount + path]`.

/// Linear-interpolated quantile of an ascending array (p in [0, 1]).
export function sortedQuantile(sorted: ArrayLike<number>, p: number): number {
  const n = sorted.length;
  if (n === 0) return NaN;
  const pos = Math.min(n - 1, Math.max(0, p * (n - 1)));
  const lo = Math.floor(pos);
  const hi = Math.min(n - 1, lo + 1);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

/// Every path's value at time index `step` (clamped to the grid).
export function valuesAtStep(values: ArrayLike<number>, pathCount: number, stepCount: number, step: number): Float64Array {
  const s = Math.min(stepCount - 1, Math.max(0, Math.round(step)));
  const out = new Float64Array(pathCount);
  const base = s * pathCount;
  for (let p = 0; p < pathCount; p++) out[p] = values[base + p];
  return out;
}

/// The last value of every path.
export function terminalValues(values: ArrayLike<number>, pathCount: number, stepCount: number): Float64Array {
  return valuesAtStep(values, pathCount, stepCount, stepCount - 1);
}

/// A density curve over `domain`, renormalised to the mass inside it (matching `binDensity` of the values inside).
/// Non-finite points (e.g. a degenerate law at t = 0) are left out, so the result may be empty.
export function densityCurve(
  law: { pdf: (x: number) => number; cdf: (x: number) => number },
  domain: [number, number],
  points = 121
): { x: number; y: number }[] {
  const [lo, hi] = domain;
  const inside = law.cdf(hi) - law.cdf(lo);
  if (!(inside > 1e-12)) return [];
  const out: { x: number; y: number }[] = [];
  for (let i = 0; i < points; i++) {
    const x = lo + ((hi - lo) * i) / (points - 1);
    const y = law.pdf(x) / inside;
    if (Number.isFinite(y)) out.push({ x, y });
  }
  return out;
}

/// Empirical quantile curves over time: one curve per probability, sampled every `stride` steps
/// (the last step is always included), as {step, value} points.
export function pathQuantiles(values: ArrayLike<number>, pathCount: number, stepCount: number, probs: number[], stride = 1) {
  const curves = probs.map(() => [] as { step: number; value: number }[]);
  const column = new Float64Array(pathCount);
  const steps: number[] = [];
  for (let s = 0; s < stepCount - 1; s += Math.max(1, stride)) steps.push(s);
  steps.push(stepCount - 1);
  for (const s of steps) {
    for (let p = 0; p < pathCount; p++) column[p] = values[s * pathCount + p];
    column.sort();
    probs.forEach((prob, i) => curves[i].push({ step: s, value: sortedQuantile(column, prob) }));
  }
  return curves;
}

/// Share of values strictly below `level`.
export function shareBelow(values: ArrayLike<number>, level: number): number {
  if (values.length === 0) return NaN;
  let below = 0;
  for (let i = 0; i < values.length; i++) if (values[i] < level) below++;
  return below / values.length;
}

/// Indices of the paths whose terminal value lies in [lo, hi], at most `limit` of them.
export function pathsEndingIn(terminal: ArrayLike<number>, lo: number, hi: number, limit = Infinity): number[] {
  const out: number[] = [];
  for (let p = 0; p < terminal.length && out.length < limit; p++) if (terminal[p] >= lo && terminal[p] <= hi) out.push(p);
  return out;
}

/// One path as {x, y} points, with x = step · dx, up to and including time index `upTo` (default: the whole path).
export function pathPoints(values: ArrayLike<number>, pathCount: number, stepCount: number, path: number, dx: number, upTo = stepCount - 1) {
  const last = Math.min(stepCount - 1, Math.max(0, upTo));
  return Array.from({ length: last + 1 }, (_, s) => ({ x: s * dx, y: values[s * pathCount + path] }));
}
