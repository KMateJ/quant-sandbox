import { makeRng, nextNormal } from "../../lib/math/random";
import { sortedQuantile } from "../../lib/stats/ensemble";

// #region Capital budgeting under uncertainty
export type ProjectInputs = { investment: number; years: number; units: number; price: number; unitCost: number; fixedCost: number; rate: number };

export const PROJECT_DEFAULTS: ProjectInputs = { investment: 1000, years: 5, units: 100, price: 15, unitCost: 8, fixedCost: 200, rate: 0.08 };
export const PROJECT_SD = { units: 20, price: 1.5 };
export const PROJECT_SIMS = 5000;
export const PROJECT_SEED = 1;

/// Present value of 1 a year for `years` years at `rate`.
export function annuityFactor(rate: number, years: number): number {
  return rate === 0 ? years : (1 - (1 + rate) ** -years) / rate;
}

/// NPV of a level project: annual cash flow (units·(price − unitCost) − fixedCost) for `years`, minus the investment.
export function projectNpv(p: ProjectInputs): number {
  const cf = p.units * (p.price - p.unitCost) - p.fixedCost;
  return cf * annuityFactor(p.rate, p.years) - p.investment;
}

/// NPV after changing one input by ±pct, for the sensitivity table.
export function sensitivity(p: ProjectInputs, key: keyof ProjectInputs, pct: number): { low: number; high: number } {
  return { low: projectNpv({ ...p, [key]: p[key] * (1 - pct) }), high: projectNpv({ ...p, [key]: p[key] * (1 + pct) }) };
}

/// Break-even value of one input (NPV = 0), by bisection; NaN if NPV does not change sign on [0, 10·value].
export function breakEven(p: ProjectInputs, key: "units" | "price" | "unitCost"): number {
  const f = (v: number) => projectNpv({ ...p, [key]: v });
  let lo = 0;
  let hi = 10 * Math.max(p[key], 1);
  if (Math.sign(f(lo)) === Math.sign(f(hi))) return NaN;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (Math.sign(f(mid)) === Math.sign(f(lo))) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/// Seeded Monte Carlo of NPV with units ~ N(mean, sd) and price ~ N(mean, sd), truncated at 0.
export function npvSimulation(p: ProjectInputs, sd: { units: number; price: number }, n: number, seed: number): { npvs: number[]; mean: number; probLoss: number; p5: number } {
  const rng = makeRng(seed);
  const npvs: number[] = [];
  let losses = 0;
  for (let i = 0; i < n; i++) {
    const units = Math.max(0, p.units + sd.units * nextNormal(rng));
    const price = Math.max(0, p.price + sd.price * nextNormal(rng));
    const v = projectNpv({ ...p, units, price });
    npvs.push(v);
    if (v < 0) losses++;
  }
  const sorted = [...npvs].sort((a, b) => a - b);
  return { npvs, mean: npvs.reduce((s, v) => s + v, 0) / n, probLoss: losses / n, p5: sortedQuantile(sorted, 0.05) };
}
// #endregion

// #region Dividend policy
export const DDM_DEFAULTS = { eps: 5, roe: 0.12, k: 0.1, payout: 0.4 };

/// Gordon growth price D1/(k − g) with D1 = payout × next-year EPS and g = retention × ROE; NaN when g ≥ k.
export function gordonPrice(eps: number, payout: number, roe: number, k: number): { g: number; d1: number; price: number } {
  const g = (1 - payout) * roe;
  const d1 = eps * payout;
  return { g, d1, price: g < k ? d1 / (k - g) : NaN };
}

/// Price against payout ratio for the figure (0.05 … 1).
export function payoutSeries(eps: number, roe: number, k: number): { payout: number; price: number; g: number }[] {
  return Array.from({ length: 20 }, (_, i) => {
    const payout = (i + 1) * 0.05;
    const { g, price } = gordonPrice(eps, payout, roe, k);
    return { payout, price, g };
  });
}

/// Present value of growth opportunities: price minus EPS/k.
export function pvgo(price: number, eps: number, k: number): number {
  return price - eps / k;
}
// #endregion
