import { assetsValue, exposure, liabilityConvexity, liabilityDuration, liabilityPv, surplusOf, weightsOf, yieldAt } from "../../immunization/immunization.math";
import type { Curve } from "../../immunization/immunization.types";
import type { AlmMission, AlmState } from "./alm.types";
import { almConfig } from "./book.math";

export type AlmRisk = {
  assets: number;
  liability: number;
  surplus: number;
  /// Assets ÷ liability PV.
  funded: number;
  durA: number;
  durL: number;
  gap: number;
  convA: number;
  convL: number;
  dv01A: number;
  dv01L: number;
  netDv01: number;
  weights: number[];
};

/// Risk snapshot of the book (modified durations; DV01 = value × dMod × 1 bp).
export function almRisk(state: AlmState, mission: AlmMission): AlmRisk {
  const cfg = almConfig(mission);
  const g = state.game;
  const assets = assetsValue(g);
  const liability = liabilityPv(g, cfg);
  const e = exposure(g);
  const durL = liabilityDuration(g, cfg);
  const dv01A = assets * e.dMod * 1e-4;
  const dv01L = liability * durL * 1e-4;
  return {
    assets,
    liability,
    surplus: assets - liability,
    funded: assets / liability,
    durA: e.dMod,
    durL,
    gap: e.dMod - durL,
    convA: e.convexity,
    convL: liabilityConvexity(g, cfg),
    dv01A,
    dv01L,
    netDv01: dv01A - dv01L,
    weights: weightsOf(g),
  };
}

/// Instant surplus change for each (parallel, twist) shock in bp, rows by parallel; no time passes.
export function surplusGrid(state: AlmState, mission: AlmMission, parallelsBp: number[], twistsBp: number[]): number[][] {
  const cfg = almConfig(mission);
  const g = state.game;
  const now = surplusOf(g, cfg);
  return parallelsBp.map((p) =>
    twistsBp.map((t) => surplusOf({ ...g, curve: { level: g.curve.level + p / 1e4, slope: g.curve.slope + t / 1e4 } }, cfg) - now),
  );
}

/// Points of the curve for the chart, from `step` to `maxT` years.
export function curvePoints(curve: Curve, maxT = 15, step = 0.25): { t: number; y: number }[] {
  const n = Math.round(maxT / step);
  return Array.from({ length: n }, (_, i) => {
    const t = (i + 1) * step;
    return { t, y: yieldAt(curve, t) };
  });
}
