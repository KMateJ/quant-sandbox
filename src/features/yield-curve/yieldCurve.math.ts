import type { CurveNode, TermPoint, Factors, FactorScenario } from "./yieldCurve.types";

/// Linear interpolation of `vals` over sorted knot `times`, flat-extrapolated at the ends.
function interp(times: number[], vals: number[], x: number): number {
  const n = times.length;
  if (n === 0) return 0;
  if (x <= times[0]) return vals[0];
  if (x >= times[n - 1]) return vals[n - 1];
  for (let i = 1; i < n; i++) {
    if (x <= times[i]) {
      const w = (x - times[i - 1]) / (times[i] - times[i - 1]);
      return vals[i - 1] + w * (vals[i] - vals[i - 1]);
    }
  }
  return vals[n - 1];
}

/// Discount factor for an annually-compounded zero rate `z` at maturity `t`.
export function dfFromZero(z: number, t: number): number {
  return Math.pow(1 + z, -t);
}

/// Annually-compounded forward rate implied between two discount factors.
export function forwardRate(dfStart: number, dfEnd: number, dt: number): number {
  if (dt <= 0 || dfEnd <= 0) return 0;
  return Math.pow(dfStart / dfEnd, 1 / dt) - 1;
}

/// Discount factors at the whole-year coupon dates before maturity `T`, from the zero rates solved so far
/// (linear in between, flat beyond the last solved node).
export function couponDiscounts(solvedT: number[], solvedZero: number[], T: number): { t: number; df: number }[] {
  const out: { t: number; df: number }[] = [];
  for (let k = 1; k < T; k++) out.push({ t: k, df: dfFromZero(solvedT.length ? interp(solvedT, solvedZero, k) : 0, k) });
  return out;
}

/// The bootstrap equation at node `i`: the already-known coupon-date discount factors, their sum and the
/// discount factor the par quote then pins down. Maturities ≤ 1y are single payments with no coupon dates.
export function bootstrapStep(term: TermPoint[], i: number): { known: { t: number; df: number }[]; couponSum: number; solvedDf: number } {
  const { t, par } = term[i];
  const solved = term.slice(0, i);
  const known = t <= 1 ? [] : couponDiscounts(solved.map((p) => p.t), solved.map((p) => p.zero), t);
  const couponSum = known.reduce((sum, k) => sum + k.df, 0);
  return { known, couponSum, solvedDf: t <= 1 ? dfFromZero(par, t) : (1 - par * couponSum) / (1 + par) };
}

/// Whether the par `nodes` bootstrap into positive discount factors.
export function isFeasible(nodes: CurveNode[]): boolean {
  try {
    buildTermStructure(nodes);
    return true;
  } catch (cause) {
    if (cause instanceof RangeError) return false;
    throw cause;
  }
}

/// Bootstrap par (market) quotes into the full term structure: discount factors, zero
/// (spot) rates and node-to-node forwards. Maturities ≤ 1y are treated as single
/// payments (money-market), longer maturities as annual-coupon par bonds. Intermediate
/// coupon-date discount factors are interpolated from already-solved zero rates.
export function buildTermStructure(nodes: CurveNode[]): TermPoint[] {
  const sorted = [...nodes].sort((a, b) => a.t - b.t);
  const solvedT: number[] = [];
  const solvedZero: number[] = [];
  const out: TermPoint[] = [];
  let prevT = 0;
  let prevDf = 1;

  for (const n of sorted) {
    const c = n.rate;
    const T = n.t;
    let df: number;
    if (T <= 1) {
      df = dfFromZero(c, T);
    } else {
      const sumPrev = couponDiscounts(solvedT, solvedZero, T).reduce((sum, k) => sum + k.df, 0);
      df = (1 - c * sumPrev) / (1 + c);
    }
    if (!Number.isFinite(df) || df <= 0) {
      throw new RangeError(`Invalid discount factor at ${n.label}`);
    }
    const zero = Math.pow(df, -1 / T) - 1;
    solvedT.push(T);
    solvedZero.push(zero);
    out.push({
      t: T,
      label: n.label,
      par: c,
      zero,
      df,
      fwd: forwardRate(prevDf, df, T - prevT),
      fwdFrom: prevT,
    });
    prevT = T;
    prevDf = df;
  }
  return out;
}

const NS_LAMBDA = 0.6;

/// Nelson–Siegel factor loadings at maturity `t`: how strongly level, slope and
/// curvature each move that point on the curve.
export function factorLoadings(t: number): {
  level: number;
  slope: number;
  curvature: number;
} {
  const x = NS_LAMBDA * Math.max(t, 1e-6);
  const slope = (1 - Math.exp(-x)) / x;
  return { level: 1, slope, curvature: slope - Math.exp(-x) };
}

/// Contribution of the shape factors to the rate at maturity `t` (a rate delta).
export function factorContribution(t: number, f: Factors): number {
  const L = factorLoadings(t);
  return f.level * L.level + f.slope * L.slope + f.curvature * L.curvature;
}

/// Size (bp) of the one-click scenario nudges.
export const SCENARIO_BASE_BP: Record<FactorScenario, number> = { parallel: 50, steepen: 60, flatten: 60, curvature: 80 };

/// Factor nudges (rate deltas) for a shape scenario of `bp` basis points. The slope loading is large at
/// short maturities, so a negative slope factor lowers short rates most (steepens) and a positive one flattens.
export function scenarioDelta(id: FactorScenario, bp = SCENARIO_BASE_BP[id]): Factors {
  const d = bp / 10000;
  switch (id) {
    case "parallel":
      return { level: d, slope: 0, curvature: 0 };
    case "steepen":
      return { level: 0, slope: -d, curvature: 0 };
    case "flatten":
      return { level: 0, slope: d, curvature: 0 };
    case "curvature":
      return { level: 0, slope: 0, curvature: d };
  }
}

// #region Shocks

/// A parallel, slope or curvature move of `sizeBp` basis points (signed for parallel and curvature).
export type Shock = { scenario: FactorScenario; sizeBp: number };

/// Three shocks played back to back by the "history" mini-sequence.
export const SHOCK_SEQUENCE: Shock[] = [
  { scenario: "parallel", sizeBp: 100 },
  { scenario: "steepen", sizeBp: 50 },
  { scenario: "curvature", sizeBp: -30 },
];

const MAX_RATE = 0.12;

/// Par nodes after `shock`; rates are clamped to the lab's 0–12% window.
export function shockedNodes(nodes: CurveNode[], { scenario, sizeBp }: Shock): CurveNode[] {
  const factors = scenarioDelta(scenario, sizeBp);
  return nodes.map((n) => ({ ...n, rate: Math.min(MAX_RATE, Math.max(0, n.rate + factorContribution(n.t, factors))) }));
}

/// Linear interpolation between two node sets (same maturities) at t∈[0,1].
export function lerpNodes(a: CurveNode[], b: CurveNode[], t: number): CurveNode[] {
  return a.map((n, i) => ({ ...n, rate: n.rate + (b[i].rate - n.rate) * t }));
}

/// The curves a sequence of shocks passes through: `start`, then the curve after each shock in turn.
export function shockPath(start: CurveNode[], shocks: Shock[]): CurveNode[][] {
  return shocks.reduce<CurveNode[][]>((path, shock) => [...path, shockedNodes(path[path.length - 1], shock)], [start]);
}

/// The curve at `step` of a playback that spends `stepsPerShock` steps on each leg of `path`.
export function pathAt(path: CurveNode[][], step: number, stepsPerShock: number): CurveNode[] {
  const leg = Math.min(path.length - 2, Math.floor(step / stepsPerShock));
  return leg < 0 ? path[0] : lerpNodes(path[leg], path[leg + 1], Math.min(1, (step - leg * stepsPerShock) / stepsPerShock));
}

const SCENARIOS: FactorScenario[] = ["parallel", "steepen", "flatten", "curvature"];

/// Deterministic random shock for the predict round: parallel and curvature moves may point either way,
/// steepen and flatten are positive sizes; sizes are multiples of 10 bp between 30 and 100.
export function drawScenario(seed: number): Shock {
  let s = seed >>> 0;
  const next = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let x = Math.imul(s ^ (s >>> 15), 1 | s);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
  const scenario = SCENARIOS[Math.floor(next() * SCENARIOS.length)];
  const size = 30 + 10 * Math.floor(next() * 8);
  const signed = scenario === "parallel" || scenario === "curvature";
  return { scenario, sizeBp: signed && next() < 0.5 ? -size : size };
}

// #endregion

// #region Forward interval brush

/// Snaps a brushed x-range (node-index units, either order) to two distinct node indices `[lo, hi]`.
export function snapInterval(a: number, b: number, count: number): [number, number] {
  const node = (v: number) => Math.min(count - 1, Math.max(0, Math.round(v)));
  let lo = node(Math.min(a, b));
  let hi = node(Math.max(a, b));
  if (lo === hi) {
    if (hi < count - 1) hi += 1;
    else lo -= 1;
  }
  return [lo, hi];
}

/// Forward rate between two points of the curve, with the growth of 1 both ways: rolling
/// (1+z₁)^t₁·(1+f)^(t₂−t₁) equals investing directly (1+z₂)^t₂ — that equality defines f.
export function forwardBetween(start: TermPoint, end: TermPoint) {
  const dt = end.t - start.t;
  const fwd = forwardRate(start.df, end.df, dt);
  const toStart = 1 / start.df;
  return { fwd, dt, toStart, rolled: toStart * Math.pow(1 + fwd, dt), direct: 1 / end.df };
}

// #endregion
