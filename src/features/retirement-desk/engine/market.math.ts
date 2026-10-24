import { makeRng, nextNormal } from "../../../lib/math/random";
import type { RetirementMission } from "./retirement.types";

const FLOOR = -0.9;

/// One standard-normal pair per year (equity driver first), drawn in year order from `makeRng(seed)`.
export function yearShocks(mission: RetirementMission, seed: number): [number, number][] {
  const rng = makeRng(seed);
  return Array.from({ length: mission.years }, () => {
    const z1 = nextNormal(rng);
    return [z1, nextNormal(rng)];
  });
}

/// Mix return for equity real return `re`; the bond leg is correlated `rho` with the equity driver `z1`.
export function mixReturn(m: RetirementMission, equity: number, re: number, z1: number, z2: number): number {
  const rb = m.muB + m.sigmaB * (m.rho * z1 + Math.sqrt(1 - m.rho * m.rho) * z2);
  return Math.max(FLOOR, equity * re + (1 - equity) * rb);
}

/// Real portfolio return of `year` (1-based); a forced equity return for that year replaces the drawn one.
export function portfolioReturn(m: RetirementMission, equity: number, z1: number, z2: number, year: number): number {
  const forced = m.forced.find((f) => f.year === year);
  return mixReturn(m, equity, forced ? forced.equity : m.muE + m.sigmaE * z1, z1, z2);
}

/// Annual mean and volatility of the mix (closed form, ignoring the −90% floor).
export function portfolioStats(m: RetirementMission, equity: number): { mu: number; vol: number } {
  const e = equity;
  const b = 1 - e;
  const variance = e * e * m.sigmaE ** 2 + b * b * m.sigmaB ** 2 + 2 * e * b * m.rho * m.sigmaE * m.sigmaB;
  return { mu: e * m.muE + b * m.muB, vol: Math.sqrt(variance) };
}
