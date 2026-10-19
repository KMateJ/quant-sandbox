// Strings for the "capital-split" guide figure. Keys are prefixed ixCs to stay unique.
import type { capitalSplitHu } from "./capitalSplit.hu";

export const capitalSplitEn: Record<keyof typeof capitalSplitHu, string> = {
  ixCsTitle: "Firm value split into debt and equity (MM with taxes)",
  ixCsTaxes: "Corporate tax",
  ixCsNoTax: "None",
  ixCsUnlevered: "Unlevered",
  ixCsLevered: "Levered",
  ixCsDebt: "Debt D",
  ixCsEquity: "Equity E",
  ixCsShield: "Tax shield tD",
  ixCsVuMark: "V_U = 100",
  ixCsHandle: "Boundary between debt and equity",
  ixCsHandleText: "Debt ratio {{dv}}, debt {{debt}}",
  ixCsHint: "Drag the boundary, or focus it and use the arrow keys.",
  ixCsCostEquity: "Cost of equity r_E",
  ixCsCostDebt: "After-tax cost of debt",
  ixCsRuMark: "r_U",
  ixCsDebtRatio: "Debt ratio D/V",
  ixCsLeveredValue: "Firm value V_L",
  ixCsAria:
    "Two horizontal bars: the unlevered firm's value, and below it the levered firm's value split into debt, equity and the tax shield; underneath, the costs of capital.",
};
