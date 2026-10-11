import { npv } from "../../lib/finance/annuity";
import { projectMetrics } from "./npvIrr.math";
import type { ProjectModel, RealOptionConfig, RealOptionResult } from "./npvIrr.types";

/// Incremental present value (today) of exercising the expansion: an extra outlay at
/// `expansionYear` followed by additional level inflows through the project horizon.
export function expansionIncrementNpv(model: ProjectModel, config: RealOptionConfig): number {
  const horizon = model.years;
  const start = Math.min(Math.max(1, config.expansionYear), horizon);
  const arr = new Array<number>(horizon + 1).fill(0);
  arr[start] -= config.expansionInvestment;
  for (let year = start + 1; year <= horizon; year++) arr[year] += config.additionalAnnual;
  return npv(model.rate, arr);
}

/// Value an option to expand: you capture the expansion upside only when favourable.
/// `probability` is the chance the favourable state is reached; the downside is walk-away (0).
export function realOptionValue(model: ProjectModel, config: RealOptionConfig): RealOptionResult {
  const baseNpv = projectMetrics(model).npv;
  const expansionNpvIfTaken = config.enabled ? expansionIncrementNpv(model, config) : 0;
  const optionValue = config.enabled
    ? config.probability * Math.max(expansionNpvIfTaken, 0)
    : 0;
  return {
    baseNpv,
    expansionNpvIfTaken,
    optionValue,
    flexibleNpv: baseNpv + optionValue,
  };
}
