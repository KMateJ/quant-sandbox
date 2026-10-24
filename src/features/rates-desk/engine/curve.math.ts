import { KEY_RATES, keyWeight, type ZeroPoint } from "../../../lib/finance/curveRisk";
import { makeRng, nextNormal } from "../../../lib/math/random";
import { factorLoadings } from "../../yield-curve/yieldCurve.math";
import type { CurveFactors, RatesMission } from "./rates.types";

/// Maturities (years) of the desk's zero grid.
export const GRID = [0.25, 0.5, 1, 2, 3, 5, 7, 10, 15, 20, 25, 30];

/// Daily Nelson–Siegel factors, `days + 1` long: day 0 is `start`, then `drift + sigma·z` steps from `makeRng(seed)`.
export function factorPath(mission: RatesMission, seed: number): CurveFactors[] {
  const rng = makeRng(seed);
  const { sigma, drift } = mission.shock;
  const out = [mission.start];
  for (let d = 0; d < mission.days; d++) {
    const f = out[d];
    out.push({
      level: f.level + drift.level + sigma.level * nextNormal(rng),
      slope: f.slope + drift.slope + sigma.slope * nextNormal(rng),
      curvature: f.curvature + drift.curvature + sigma.curvature * nextNormal(rng),
    });
  }
  return out;
}

/// Zero rate at maturity `t` for factors `f`.
export function zeroRate(f: CurveFactors, t: number): number {
  const L = factorLoadings(t);
  return f.level + f.slope * L.slope + f.curvature * L.curvature;
}

/// Zero curve on `GRID` for factors `f`.
export function zeroGrid(f: CurveFactors): ZeroPoint[] {
  return GRID.map((t) => ({ t, z: zeroRate(f, t) }));
}

/// Curve with each key rate (`KEY_RATES`) moved by `bps[k]` basis points, spread by triangular key weights.
export function shiftKeys(zeros: ZeroPoint[], bps: number[]): ZeroPoint[] {
  return zeros.map((p) => ({ t: p.t, z: p.z + bps.reduce((s, bp, k) => s + (bp / 1e4) * keyWeight(KEY_RATES, k, p.t), 0) }));
}

/// Curve after `bp` at one key node, or across the whole curve with `"parallel"`.
export function bump(zeros: ZeroPoint[], node: number | "parallel", bp: number): ZeroPoint[] {
  return shiftKeys(zeros, KEY_RATES.map((_, k) => (node === "parallel" || node === k ? bp : 0)));
}
