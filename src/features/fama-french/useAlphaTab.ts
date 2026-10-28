import { useCallback, useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { alphaFit, alphaLadder, customModel, matchingModel } from "./alpha.math";
import { FACTOR_IDS, MODEL_FACTORS, returnAttribution } from "./famaFrench.math";
import type { FactorId, FfData, ModelId, Window } from "./famaFrench.types";
import { fundChoice, fundSeries } from "./fund.math";
import { ALPHA_URL_SCHEMA } from "./fund.url";

const ALPHA_SEED = 1;

const parseFactors = (raw: string): FactorId[] =>
  customModel(raw.split(",").filter((s): s is FactorId => (FACTOR_IDS as readonly string[]).includes(s)));

/// State of the alpha-hunt tab: the fund and the factors the reader has put into the model.
export function useAlphaTab(data: FfData, window: Window) {
  const [url, setUrl] = useUrlState(ALPHA_URL_SCHEMA);
  const factors = useMemo(() => parseFactors(url.am), [url.am]);
  const series = useMemo(() => fundSeries(fundChoice(url.afund, data), data, ALPHA_SEED), [url.afund, data]);
  const fit = useMemo(() => alphaFit(series, data, factors, window), [series, data, factors, window]);
  const ladder = useMemo(() => alphaLadder(series, data, window), [series, data, window]);
  const steps = useMemo(() => returnAttribution(fit, data, window), [fit, data, window]);

  const setFactors = useCallback((next: FactorId[]) => setUrl({ am: customModel(next).join(",") }), [setUrl]);
  const toggle = useCallback((id: FactorId) => {
    if (id === "mkt") return;
    setFactors(factors.includes(id) ? factors.filter((f) => f !== id) : [...factors, id]);
  }, [factors, setFactors]);

  return {
    fundId: url.afund,
    setFund: (afund: string) => setUrl({ afund }),
    factors, toggle, preset: (m: ModelId) => setFactors(MODEL_FACTORS[m]),
    activePreset: matchingModel(factors), fit, ladder, steps,
    custom: { model: "custom" as const, factors, fit },
  };
}

export type AlphaTabModel = ReturnType<typeof useAlphaTab>;
