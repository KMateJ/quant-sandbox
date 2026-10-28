import { useCallback, useMemo, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { recordChallenge } from "../../lib/game/challengeScores";
import { nextSeed } from "../../lib/game/seed";
import { cumulative, factorFit, MODEL_FACTORS, slice } from "./famaFrench.math";
import type { FfData, ModelId, Window } from "./famaFrench.types";
import { challengeModel, fundChoice, fundSeries, loadingsHit, meanResidualPerYear, R2_SHARE, replicaR2, replicaReturns, startLoadings, trackingError, truthLoadings } from "./fund.math";
import { FUND_URL_SCHEMA } from "./fund.url";

const CHALLENGE = "ffm-loadings";

/// State of the mystery-fund tab: fund, loadings the reader drags, reveal and challenge submit.
export function useFundTab(data: FfData, window: Window) {
  const [url, setUrl] = useUrlState(FUND_URL_SCHEMA);
  const choice = useMemo(() => fundChoice(url.fund, data), [url.fund, data]);
  const isChallenge = choice.kind === "challenge";
  const model: ModelId = isChallenge ? challengeModel(url.fseed) : url.fm;
  const factors = MODEL_FACTORS[model];
  const loadKey = `${choice.id}|${model}|${url.fseed}`;
  const revealKey = `${loadKey}|${window.from}|${window.to}`;
  const [drag, setDrag] = useState({ key: loadKey, loadings: startLoadings(factors) });
  const [shown, setShown] = useState<string | null>(null);
  const [result, setResult] = useState<{ key: string; hit: boolean } | null>(null);

  const loadings = drag.key === loadKey ? drag.loadings : startLoadings(factors);
  const revealed = !isChallenge || shown === revealKey;
  const full = useMemo(() => fundSeries(choice, data, url.fseed), [choice, data, url.fseed]);
  const fund = useMemo(() => slice(full, window), [full, window]);
  const fit = useMemo(() => factorFit(full, data, model, window), [full, data, model, window]);
  const olsLoadings = useMemo(() => fit.betas.map((b) => b.b), [fit]);
  const replica = useMemo(() => replicaReturns(loadings, factors, data, window), [loadings, factors, data, window]);
  const olsReplica = useMemo(() => replicaReturns(olsLoadings, factors, data, window), [olsLoadings, factors, data, window]);
  const truth = truthLoadings(choice, model, url.fseed);

  const setLoading = useCallback((i: number, v: number) => {
    const next = loadings.slice();
    next[i] = v;
    setDrag({ key: loadKey, loadings: next });
  }, [loadings, loadKey]);

  const reveal = () => setShown(revealKey);
  const reset = () => { setDrag({ key: loadKey, loadings: startLoadings(factors) }); setShown(null); setResult(null); };
  const submit = () => {
    const hit = truth !== null && loadingsHit(loadings, truth) && replicaR2(fund, replica) >= R2_SHARE * fit.r2;
    recordChallenge(CHALLENGE, hit, Date.now());
    setResult({ key: revealKey, hit });
    reveal();
  };

  return {
    url, choice, isChallenge, model, factors, loadings, setLoading, revealed, reveal, reset, submit,
    result: result?.key === revealKey ? result.hit : null,
    setFund: (fund: string) => setUrl({ fund }),
    setModel: (fm: ModelId) => setUrl({ fm }),
    newSeed: () => setUrl({ fseed: nextSeed(url.fseed) }),
    fit, truth,
    growth: { fund: cumulative(fund), you: cumulative(replica), ols: cumulative(olsReplica) },
    stats: { r2: replicaR2(fund, replica), te: trackingError(fund, replica), resid: meanResidualPerYear(fund, replica) },
    residuals: fund.map((r, t) => r - replica[t]),
  };
}

export type FundTabModel = ReturnType<typeof useFundTab>;
