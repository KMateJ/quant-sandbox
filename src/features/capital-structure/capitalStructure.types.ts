/// A point on the capital-structure curves at a given debt-to-equity ratio.
export type CapitalStructurePoint = {
  debtEquity: number;
  costOfEquity: number;
  wacc: number;
};
