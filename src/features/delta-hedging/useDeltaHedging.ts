import { useMemo } from "react";
import { useUrlState } from "../../components/useUrlState";
import { useMediaQuery } from "../../components/useMediaQuery";
import { binValues } from "../../lib/stats/histogram";
import { DELTA_HEDGING_URL, type DeltaHedgingUrlState } from "./deltaHedging.url";
import { HEDGE_FREQUENCIES, errorDomain, hedgeFrequencyStudy, heldDeltaStepRows, simulateDeltaHedgeSeeded } from "./deltaHedging.math";
import type { HedgeParams } from "./deltaHedging.types";

/// Paths behind the "rebalance more often?" study; cheap enough to recompute on every slider move.
const STUDY_PATHS = 200;
const HISTOGRAM_BINS = 31;

/// URL-backed state of the delta-hedging lab plus everything the panels draw.
export function useDeltaHedging() {
  const isMobile = useMediaQuery("(max-width: 640px)");
  const [url, setUrl] = useUrlState(DELTA_HEDGING_URL);
  const set = (patch: Partial<DeltaHedgingUrlState>) => setUrl(patch);
  const freq = Number(url.freq);

  const params = useMemo<HedgeParams>(
    () => ({ s0: url.s0, strike: url.k, maturity: url.T, rate: url.r, vol: url.sigma, freq }),
    [url.s0, url.k, url.T, url.r, url.sigma, freq],
  );

  const result = useMemo(() => simulateDeltaHedgeSeeded(params, url.seed), [params, url.seed]);
  const heldSteps = useMemo(() => heldDeltaStepRows(result.rows), [result]);

  const study = useMemo(() => hedgeFrequencyStudy(params, HEDGE_FREQUENCIES, STUDY_PATHS, url.seed), [params, url.seed]);
  const current = study.find((row) => row.freq === freq) ?? study[0];
  const histogram = useMemo(() => {
    const domain = errorDomain(current.errors);
    return { bins: binValues(current.errors, domain, HISTOGRAM_BINS).bins, domain };
  }, [current]);

  return { isMobile, url, set, freq, params, result, heldSteps, study, current, histogram, studyPaths: STUDY_PATHS };
}

export type DeltaHedgingModel = ReturnType<typeof useDeltaHedging>;
