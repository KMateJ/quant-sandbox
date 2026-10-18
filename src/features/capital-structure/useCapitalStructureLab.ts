import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import {
  capitalStructureCurve,
  debtRatioFromDebtEquity,
  leveredCostOfEquity,
  waccFromDebtEquity,
  worldValue,
  worldsCurve,
  type CapitalWorld,
} from "./capitalStructure.math";

import { CAPITAL_URL_SCHEMA, MAX_DE } from "./capitalStructure.url";

export { MAX_DE };
const STEPS = 60;

/// State of the capital-structure lab: the MM II inputs, the leverage, and the world chosen for the comparison.
export function useCapitalStructureLab() {
  // Inputs and the compared world live in the query string, so a configuration can be linked.
  const [url, setUrl] = useUrlState(CAPITAL_URL_SCHEMA);
  const { ru: unleveredKe, kd: costOfDebt, tax: taxRate, de: debtEquity, world } = url;
  const setUnleveredKe = (v: number) => setUrl({ ru: v });
  const setCostOfDebt = (v: number) => setUrl({ kd: v });
  const setTaxRate = (v: number) => setUrl({ tax: v });
  const setWorld = (v: CapitalWorld) => setUrl({ world: v });
  const setDebtEquity = (v: number) => setUrl({ de: Math.round(Math.min(MAX_DE, Math.max(0, v)) * 100) / 100 });

  const data = useMemo(() => capitalStructureCurve(unleveredKe, costOfDebt, taxRate, MAX_DE, STEPS), [unleveredKe, costOfDebt, taxRate]);
  const worldsData = useMemo(() => worldsCurve(unleveredKe, taxRate, MAX_DE, STEPS), [unleveredKe, taxRate]);
  const debtRatio = debtRatioFromDebtEquity(debtEquity);

  return {
    unleveredKe, setUnleveredKe, costOfDebt, setCostOfDebt, taxRate, setTaxRate, debtEquity, setDebtEquity, world, setWorld,
    data, worldsData, debtRatio,
    keL: leveredCostOfEquity(unleveredKe, costOfDebt, taxRate, debtEquity),
    wacc: waccFromDebtEquity(unleveredKe, costOfDebt, taxRate, debtEquity),
    taxShieldWeight: debtRatio * taxRate,
    value: worldValue(world, debtRatio, taxRate),
  };
}

export type CapitalStructureLab = ReturnType<typeof useCapitalStructureLab>;
