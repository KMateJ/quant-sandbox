import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { usePredictReveal } from "../../components/ui";
import { afterTaxCostOfDebt, hamadaCostOfEquity, minimumWaccRatio, realisticCostOfDebt, realisticCurve, realisticWaccAt, waccAt, waccCurve } from "./wacc.math";

import { MAX_DEBT_RATIO, WACC_URL_SCHEMA, type WaccMode } from "./wacc.url";

export { MAX_DEBT_RATIO, type WaccMode };
const STEPS = 60;

/// State of the WACC lab. In the constant mode the two cost sliders are ke and kd; in the realistic mode they are
/// the unlevered cost rU and the zero-leverage cost of debt rf, and kd and ke follow from the leverage.
export function useWaccLab() {
  // Inputs live in the query string, so a configuration can be linked.
  const [url, setUrl] = useUrlState(WACC_URL_SCHEMA);
  const { mode, ke: costOfEquity, kd: costOfDebt, tax: taxRate, dv: debtRatio } = url;
  const setMode = (v: WaccMode) => setUrl({ mode: v });
  const setCostOfEquity = (v: number) => setUrl({ ke: v });
  const setCostOfDebt = (v: number) => setUrl({ kd: v });
  const setTaxRate = (v: number) => setUrl({ tax: v });
  const setDebtRatio = (v: number) => setUrl({ dv: Math.round(Math.min(MAX_DEBT_RATIO, Math.max(0, v)) * 100) / 100 });
  const realistic = mode === "realistic";

  const data = useMemo(
    () => (realistic
      ? realisticCurve(costOfEquity, costOfDebt, taxRate, MAX_DEBT_RATIO, STEPS)
      : waccCurve(costOfEquity, costOfDebt, taxRate, MAX_DEBT_RATIO, STEPS)),
    [realistic, costOfEquity, costOfDebt, taxRate]
  );
  const minimum = useMemo(
    () => minimumWaccRatio(costOfEquity, costOfDebt, taxRate, MAX_DEBT_RATIO),
    [costOfEquity, costOfDebt, taxRate]
  );
  // A new round whenever the question changes (other inputs or mode), not when D/V moves.
  const predict = usePredictReveal({ truth: minimum, tolerance: 0.05, resetKey: `${mode}:${costOfEquity}:${costOfDebt}:${taxRate}` });

  const waccValue = realistic ? realisticWaccAt(costOfEquity, costOfDebt, taxRate, debtRatio) : waccAt(costOfEquity, costOfDebt, taxRate, debtRatio);
  const kd = realistic ? realisticCostOfDebt(costOfDebt, debtRatio) : costOfDebt;
  const ke = realistic ? hamadaCostOfEquity(costOfEquity, costOfDebt, taxRate, debtRatio) : costOfEquity;

  return {
    mode, setMode, realistic,
    costOfEquity, setCostOfEquity, costOfDebt, setCostOfDebt, taxRate, setTaxRate, debtRatio, setDebtRatio,
    data, minimum, predict,
    waccValue, ke, afterTaxDebt: afterTaxCostOfDebt(kd, taxRate), equityWeight: 1 - debtRatio,
  };
}

export type WaccLab = ReturnType<typeof useWaccLab>;
