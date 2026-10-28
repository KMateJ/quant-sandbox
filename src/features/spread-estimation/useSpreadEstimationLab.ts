import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import {
  autocorrelation,
  convergence,
  effectiveSpread,
  huangStoll,
  rollEstimate,
  simulateTape,
  tickTest,
  classifyAccuracy,
} from "./spreadEstimation.math";
import { SPE_URL_SCHEMA } from "./spreadEstimation.url";
import type { Print } from "./spreadEstimation.types";

/// Every estimator on one tape, for readouts.
export function useEstimates(tape: Print[]) {
  return useMemo(
    () => ({
      roll: rollEstimate(tape),
      effective: effectiveSpread(tape),
      hs: huangStoll(tape),
      autocorr: autocorrelation(tape),
      tickAccuracy: classifyAccuracy(tickTest(tape), tape),
    }),
    [tape],
  );
}

/// Spread estimation lab state: market settings in the URL, the simulated tape and its estimates.
export function useSpreadEstimationLab() {
  const [state, setState] = useUrlState(SPE_URL_SCHEMA);
  const { S, sigma, alpha, n, seed } = state;
  const params = useMemo(() => ({ S, sigma, alpha, n }), [S, sigma, alpha, n]);
  const tape = useMemo(() => simulateTape(params, seed), [params, seed]);
  const estimates = useEstimates(tape);
  const conv = useMemo(() => convergence(params, seed), [params, seed]);
  return { ...state, setState, params, tape, estimates, conv };
}

export type SpreadEstimationLab = ReturnType<typeof useSpreadEstimationLab>;
