// #region Capital split: Modigliani–Miller with corporate taxes and perpetual debt

/// Fixed inputs of the capital-split figure: unlevered value, costs of capital, the taxed rate and the debt-ratio cap.
export const CAPITAL_SPLIT = { vU: 100, rU: 0.1, rD: 0.05, tax: 0.25, maxDebtRatio: 0.8 } as const;

/// Largest firm value the bars must show: V_L at the highest debt ratio under the taxed rate.
export const CAPITAL_SPLIT_SCALE_MAX = 130;

export type CapitalSplit = {
  /// Debt ratio D/V_L.
  dv: number;
  debt: number;
  equity: number;
  leveredValue: number;
  /// Present value of the tax shield, t·D.
  shield: number;
  rE: number;
  rDAfterTax: number;
  wacc: number;
};

/// Debt that gives debt ratio `dv` of the levered value: from V_L = V_U + tD and D = dv·V_L, D = dv·V_U / (1 − t·dv).
export function debtForRatio(dv: number, tax: number, vU: number = CAPITAL_SPLIT.vU): number {
  return (dv * vU) / (1 - tax * dv);
}

/// Debt ratio D/V_L of a firm that carries debt `debt`, with V_L = V_U + t·D.
export function ratioForDebt(debt: number, tax: number, vU: number = CAPITAL_SPLIT.vU): number {
  return debt / (vU + tax * debt);
}

/// Debt ratio clamped to [0, cap] and snapped to whole percentage points.
export function clampDebtRatio(dv: number, cap: number = CAPITAL_SPLIT.maxDebtRatio): number {
  return Math.round(Math.min(cap, Math.max(0, dv)) * 100) / 100;
}

/// Value split and costs of capital at debt ratio `dv`:
/// V_L = V_U + tD, E = V_L − D, r_E = r_U + (r_U − r_D)(1 − t)·D/E, WACC = r_U(1 − t·D/V).
export function capitalSplit(dv: number, tax: number, p = CAPITAL_SPLIT): CapitalSplit {
  const debt = debtForRatio(dv, tax, p.vU);
  const leveredValue = p.vU + tax * debt;
  const equity = leveredValue - debt;
  return {
    dv,
    debt,
    equity,
    leveredValue,
    shield: tax * debt,
    rE: p.rU + (p.rU - p.rD) * (1 - tax) * (debt / equity),
    rDAfterTax: p.rD * (1 - tax),
    wacc: p.rU * (1 - tax * dv),
  };
}

// #endregion
