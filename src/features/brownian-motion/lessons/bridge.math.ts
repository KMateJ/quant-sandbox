import { variancePop } from "../../../lib/stats";
import type { BrownianCloud } from "./brownianFundamentals.types";

type Pt = { x: number; y: number };

/// Brownian bridges on [0, T] pinned at B(T) = b, from a unit-horizon Brownian cloud:
/// B(t) = W(t) − (t/T)(W(T) − b) with W(t) = √T·W₁(t/T). Same step-major layout as the cloud.
export function bridgeValues(cloud: BrownianCloud, T: number, b: number): Float64Array {
  const { values, pathCount, steps } = cloud;
  const out = new Float64Array(values.length);
  const root = Math.sqrt(T);
  for (let k = 0; k <= steps; k++) {
    const u = k / steps;
    for (let p = 0; p < pathCount; p++) {
      out[k * pathCount + p] = root * (values[k * pathCount + p] - u * values[steps * pathCount + p]) + b * u;
    }
  }
  return out;
}

/// E[B(t)] = b·t/T.
export const bridgeMean = (t: number, T: number, b: number) => (b * t) / T;

/// Var B(t) = t(T − t)/T, zero at both ends.
export const bridgeVariance = (t: number, T: number) => (t * (T - t)) / T;

/// Mean line and mean ± z·sd curves over the grid, drawn on the cloud.
export function bridgeEnvelope(steps: number, T: number, b: number, z = 1): { mean: Pt[]; upper: Pt[]; lower: Pt[] } {
  const grid = Array.from({ length: steps + 1 }, (_, k) => (k / steps) * T);
  const sd = (t: number) => z * Math.sqrt(Math.max(0, bridgeVariance(t, T)));
  return {
    mean: grid.map((x) => ({ x, y: bridgeMean(x, T, b) })),
    upper: grid.map((x) => ({ x, y: bridgeMean(x, T, b) + sd(x) })),
    lower: grid.map((x) => ({ x, y: bridgeMean(x, T, b) - sd(x) })),
  };
}

/// Empirical Var B(t) across the paths at `points` evenly spaced times in (0, T).
export function bridgeVarianceProfile(values: Float64Array, cloud: BrownianCloud, T: number, points = 24): Pt[] {
  const { pathCount, steps } = cloud;
  return Array.from({ length: points }, (_, i) => {
    const k = Math.round(((i + 1) / (points + 1)) * steps);
    const column = Array.from({ length: pathCount }, (_, p) => values[k * pathCount + p]);
    return { x: (k / steps) * T, y: variancePop(column) };
  });
}
