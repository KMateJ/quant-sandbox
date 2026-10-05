import type { CapitalStructurePoint } from "./capitalStructure.types";

/// Modigliani–Miller Proposition II (with taxes): levered cost of equity
/// keL = keU + (keU − kd)·(D/E)·(1 − tax).
export function leveredCostOfEquity(
  unleveredCostOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  debtEquity: number
): number {
  return (
    unleveredCostOfEquity +
    (unleveredCostOfEquity - costOfDebt) * debtEquity * (1 - taxRate)
  );
}

/// WACC from a debt-to-equity ratio, using the MM Prop II levered cost of equity.
export function waccFromDebtEquity(
  unleveredCostOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  debtEquity: number
): number {
  const equityWeight = 1 / (1 + debtEquity);
  const debtWeight = debtEquity / (1 + debtEquity);
  const keL = leveredCostOfEquity(
    unleveredCostOfEquity,
    costOfDebt,
    taxRate,
    debtEquity
  );
  return equityWeight * keL + debtWeight * costOfDebt * (1 - taxRate);
}

/// Levered firm value with the interest tax shield: VL = VU + tax·D.
export function leveredFirmValue(
  unleveredValue: number,
  taxRate: number,
  debt: number
): number {
  return unleveredValue + taxRate * debt;
}

/// Cost-of-equity and WACC curves across debt-to-equity ratios in [0, maxDebtEquity].
export function capitalStructureCurve(
  unleveredCostOfEquity: number,
  costOfDebt: number,
  taxRate: number,
  maxDebtEquity: number,
  steps: number
): CapitalStructurePoint[] {
  const points: CapitalStructurePoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const debtEquity = (i / steps) * maxDebtEquity;
    points.push({
      debtEquity,
      costOfEquity: leveredCostOfEquity(
        unleveredCostOfEquity,
        costOfDebt,
        taxRate,
        debtEquity
      ),
      wacc: waccFromDebtEquity(
        unleveredCostOfEquity,
        costOfDebt,
        taxRate,
        debtEquity
      ),
    });
  }
  return points;
}
