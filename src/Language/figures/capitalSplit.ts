// Strings for the "capital-split" guide figure. Keys are prefixed ixCs to stay unique.

export const capitalSplitHu = {
  ixCsTitle: "A vállalatérték felosztása hitelre és saját tőkére (MM adóval)",
  ixCsTaxes: "Társasági adó",
  ixCsNoTax: "Nincs",
  ixCsUnlevered: "Tőkeáttétel nélkül",
  ixCsLevered: "Tőkeáttétellel",
  ixCsDebt: "Hitel D",
  ixCsEquity: "Saját tőke E",
  ixCsShield: "Adópajzs tD",
  ixCsVuMark: "V_U = 100",
  ixCsHandle: "A hitel és a saját tőke határa",
  ixCsHandleText: "Hitelarány {{dv}}, hitel {{debt}}",
  ixCsHint: "Húzd a határvonalat, vagy fókuszálj rá és használd a nyílbillentyűket.",
  ixCsCostEquity: "Saját tőke költsége r_E",
  ixCsCostDebt: "Adózás utáni hitelköltség",
  ixCsRuMark: "r_U",
  ixCsDebtRatio: "Hitelarány D/V",
  ixCsLeveredValue: "Vállalatérték V_L",
  ixCsAria:
    "Két vízszintes sáv: a tőkeáttétel nélküli vállalat értéke, és alatta a tőkeáttételes vállalaté hitelre, saját tőkére és adópajzsra bontva; alatta a tőkeköltségek.",
};

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
