import type { RatesMission } from "./rates.types";

/// The DV01 band and key-rate limit checked at each close, or null when the mission sets none.
export function objectiveLimits(mission: RatesMission): { dv01Band: number | null; krdLimit: number | null } {
  let dv01Band: number | null = null;
  let krdLimit: number | null = null;
  for (const o of mission.objectives) {
    if (o.kind === "dv01Misses") dv01Band = o.band;
    if (o.kind === "krdMisses") krdLimit = o.limit;
  }
  return { dv01Band, krdLimit };
}
