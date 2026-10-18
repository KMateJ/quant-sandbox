import { urlBool, urlEnum, urlNumber, type UrlField, type UrlSchema } from "../../lib/urlState";
import { reconcileConstraints } from "./portfolioOptimization.math";
import type { OptConstraints, OptObjective } from "./portfolioOptimization.types";

/// Everything the optimizer keeps in the query string. `riskFree: null` inherits the universe's rate.
export type FrontierUrlState = Omit<OptConstraints, "riskFree"> & {
  riskFree: number | null;
  objective: OptObjective;
  targetReturn: number;
  targetVol: number;
};

const OBJECTIVES = ["minVariance", "maxSharpe", "targetReturn", "targetVolatility"] as const;

/// Optional number in [min, max]; absent or invalid → `null`, which is never written.
function urlOptionalNumber(min: number, max: number, decimals: number): UrlField<number | null> {
  const inner = urlNumber(NaN, min, max, decimals);
  return {
    parse: (raw) => {
      const value = inner.parse(raw);
      return Number.isFinite(value) ? value : null;
    },
    serialize: (value) => (value === null ? null : String(Number(value.toFixed(decimals)))),
  };
}

export const FRONTIER_URL_SCHEMA: UrlSchema<FrontierUrlState> = {
  objective: urlEnum(OBJECTIVES, "minVariance"),
  longOnly: urlBool(true),
  allowShort: urlBool(false),
  minWeight: urlNumber(0, -1, 1, 4),
  maxWeight: urlNumber(1, -1, 1, 4),
  useRiskFree: urlBool(false),
  riskFree: urlOptionalNumber(0, 0.2, 4),
  allowLeverage: urlBool(false),
  maxGross: urlNumber(1, 1, 3, 4),
  targetReturn: urlNumber(0.1, -0.5, 1, 4),
  targetVol: urlNumber(0.15, 0, 1, 4),
};

/// Constraints from the URL state; an unset risk-free rate falls back to the universe's.
export function constraintsFromUrl(s: FrontierUrlState, universeRf: number): OptConstraints {
  return {
    longOnly: s.longOnly,
    allowShort: s.allowShort,
    minWeight: s.minWeight,
    maxWeight: s.maxWeight,
    useRiskFree: s.useRiskFree,
    riskFree: s.riskFree ?? universeRf,
    allowLeverage: s.allowLeverage,
    maxGross: s.maxGross,
  };
}

/// URL patch for changing one constraint, keeping the toggles coherent. The inherited risk-free rate
/// stays unset unless the rate itself is edited.
export function constraintPatch<K extends keyof OptConstraints>(
  prev: FrontierUrlState,
  key: K,
  value: OptConstraints[K],
  universeRf: number
): Partial<FrontierUrlState> {
  const next = reconcileConstraints({ ...constraintsFromUrl(prev, universeRf), [key]: value }, key);
  return { ...next, riskFree: key === "riskFree" ? next.riskFree : prev.riskFree };
}
