import type { ObjectiveResult, ObjectiveStatus } from "./game.types";

/// "Stay at or below a limit": fail above, pass once settled, at risk from `warnFrom`.
export function capStatus(value: number, limit: number, warnFrom: number, settled: boolean): ObjectiveStatus {
  if (value > limit) return "fail";
  if (settled) return "pass";
  return value >= warnFrom ? "atRisk" : "onTrack";
}

/// "End at or above a floor": judged at settlement; at risk while live below `warnBelow`.
export function floorStatus(value: number, floor: number, warnBelow: number, settled: boolean): ObjectiveStatus {
  if (settled) return value < floor ? "fail" : "pass";
  return value < warnBelow ? "atRisk" : "onTrack";
}

/// "Inside [lo, hi] at settlement": while live it only warns when outside.
export function bandAtSettle(value: number, lo: number, hi: number, settled: boolean): ObjectiveStatus {
  const inside = value >= lo && value <= hi;
  if (settled) return inside ? "pass" : "fail";
  return inside ? "onTrack" : "atRisk";
}

/// "At most `allowed` misses": at risk once the allowance is used up.
export function countStatus(misses: number, allowed: number, settled: boolean): ObjectiveStatus {
  return capStatus(misses, allowed, allowed, settled);
}

/// True when every objective passed; an empty list never counts as passed.
export function allPassed<D>(results: readonly ObjectiveResult<D>[]): boolean {
  return results.length > 0 && results.every((r) => r.status === "pass");
}
