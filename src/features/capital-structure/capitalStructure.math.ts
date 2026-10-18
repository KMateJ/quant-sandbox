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

// #region Three worlds: MM without taxes, MM with taxes, trade-off with distress costs

export type CapitalWorld = "noTax" | "tax" | "tradeoff";

/// Unlevered firm value of the comparison (the firm's operating cash flow is r_U · V_U a year, forever).
export const UNLEVERED_VALUE = 100;

/// Distress-cost schedule of the trade-off world: PV of expected distress costs C(L) = 40% · V_U · L², L = D/V.
export const DISTRESS_COEFF = 0.4;

export const debtRatioFromDebtEquity = (debtEquity: number) => debtEquity / (1 + debtEquity);

export type WorldValue = { leveredValue: number; debt: number; equity: number; shield: number; distress: number };

/// Firm value at debt ratio L = D/V_L. V_L = V_U + t·D − C(L) and D = L·V_L give V_L = (V_U − C(L)) / (1 − t·L);
/// taxes are ignored in the no-tax world and C = 0 outside the trade-off world.
export function worldValue(world: CapitalWorld, debtRatio: number, taxRate: number, vU = UNLEVERED_VALUE, k = DISTRESS_COEFF): WorldValue {
  const t = world === "noTax" ? 0 : taxRate;
  const distress = world === "tradeoff" ? k * vU * debtRatio * debtRatio : 0;
  const leveredValue = (vU - distress) / (1 - t * debtRatio);
  const debt = debtRatio * leveredValue;
  return { leveredValue, debt, equity: leveredValue - debt, shield: t * debt, distress };
}

/// WACC implied by the firm value: the same operating cash flow r_U · V_U is discounted at WACC, so WACC = r_U · V_U / V_L.
/// It is r_U in the no-tax world and r_U(1 − tL) with taxes; distress costs bend it back up.
export function worldWacc(world: CapitalWorld, debtRatio: number, unleveredCost: number, taxRate: number): number {
  return (unleveredCost * UNLEVERED_VALUE) / worldValue(world, debtRatio, taxRate).leveredValue;
}

/// Cost of equity from the WACC identity WACC = E/V·r_E + D/V·r_D·(1 − t): r_E = (WACC − L·r_D(1 − t)) / (1 − L).
export function worldCostOfEquity(world: CapitalWorld, debtRatio: number, unleveredCost: number, costOfDebt: number, taxRate: number): number {
  const t = world === "noTax" ? 0 : taxRate;
  return (worldWacc(world, debtRatio, unleveredCost, taxRate) - debtRatio * costOfDebt * (1 - t)) / (1 - debtRatio);
}

export type WorldsPoint = { debtEquity: number; noTax: number; tax: number; tradeoff: number };

/// WACC of the three worlds across D/E in [0, maxDebtEquity].
export function worldsCurve(unleveredCost: number, taxRate: number, maxDebtEquity: number, steps: number): WorldsPoint[] {
  return Array.from({ length: steps + 1 }, (_, i) => {
    const debtEquity = (i / steps) * maxDebtEquity;
    const L = debtRatioFromDebtEquity(debtEquity);
    return {
      debtEquity,
      noTax: worldWacc("noTax", L, unleveredCost, taxRate),
      tax: worldWacc("tax", L, unleveredCost, taxRate),
      tradeoff: worldWacc("tradeoff", L, unleveredCost, taxRate),
    };
  });
}

/// D/V that maximises the trade-off value (1 − kL²)/(1 − tL): the root of k·t·L² − 2k·L + t = 0 below 1.
export function optimalTradeoffRatio(taxRate: number, k = DISTRESS_COEFF): number {
  if (taxRate <= 0) return 0;
  return (k - Math.sqrt(k * k - k * taxRate * taxRate)) / (k * taxRate);
}

/// Debt ratio whose debt is `debt` in a world, by bisection (D = L·V_L rises with L on the range shown).
export function debtRatioForDebt(world: CapitalWorld, debt: number, taxRate: number, maxRatio: number): number {
  let [lo, hi] = [0, maxRatio];
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (worldValue(world, mid, taxRate).debt < debt) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// #endregion
