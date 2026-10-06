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

/// Bootstrap par (market) quotes into the full term structure: discount factors, zero
/// (spot) rates and node-to-node forwards. Maturities ≤ 1y are treated as single
/// payments (money-market), longer maturities as annual-coupon par bonds. Intermediate
/// coupon-date discount factors are interpolated from already-solved zero rates.
export function buildTermStructure(nodes: CurveNode[]): TermPoint[] {
  const sorted = [...nodes].sort((a, b) => a.t - b.t);
  const solvedT: number[] = [];
  const solvedZero: number[] = [];
  const zeroAt = (tau: number) =>
    solvedT.length ? interp(solvedT, solvedZero, tau) : 0;
  const dfAt = (tau: number) => dfFromZero(zeroAt(tau), tau);

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
      let sumPrev = 0;
      for (let k = 1; k < T; k++) sumPrev += dfAt(k);
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

/// Preset factor nudges (rate deltas) for the one-click shape scenarios.
export function scenarioDelta(id: FactorScenario): Factors {
  switch (id) {
    case "parallel":
      return { level: 0.005, slope: 0, curvature: 0 };
    case "steepen":
      return { level: 0, slope: 0.006, curvature: 0 };
    case "flatten":
      return { level: 0, slope: -0.006, curvature: 0 };
    case "curvature":
      return { level: 0, slope: 0, curvature: 0.008 };
  }
}
