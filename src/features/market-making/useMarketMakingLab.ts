import { useMemo, useState } from "react";
import { usePredictReveal } from "../../components/ui";
import { useUrlState } from "../../components/useUrlState";
import { nextSeed } from "../../lib/game/seed";
import { DEFAULT_MM_PARAMS, type MmParams, type RoundResult, type RoundSchedule, type RoundState, type RoundSummary } from "./marketMaking.types";
import { MKM_URL } from "./marketMaking.url";
import { roundSummary, runBotRounds } from "./rounds.math";
import { theoryBest } from "./theory.math";
import { CHALLENGE_FLOW, useMkmChallenge } from "./useMkmChallenge";
import { useQuoteRound } from "./useQuoteRound";

/// Rounds needed before "Show theory" unlocks in Simulate.
export const THEORY_UNLOCK = 3;

/// Lab state: URL setup and mode, the live round, the session's rounds, theory overlay, bot runs, predict and challenge.
export function useMarketMakingLab() {
  const [url, setUrl] = useUrlState(MKM_URL);
  const challenge = url.mode === "challenge";
  const { lambda, k, sigma } = url;
  const informed = challenge ? CHALLENGE_FLOW.informed : url.informed;
  const imbalance = challenge ? CHALLENGE_FLOW.imbalance : url.imbalance;
  const params: MmParams = useMemo(
    () => ({ ...DEFAULT_MM_PARAMS, lambda, k, sigma, informed, imbalance }),
    [lambda, k, sigma, informed, imbalance],
  );

  const [rounds, setRounds] = useState<RoundResult[]>([]);
  const [last, setLast] = useState<RoundSummary | null>(null);
  const [theoryOn, setTheoryOn] = useState(false);
  const [bots, setBots] = useState<{ delta: number; runs: RoundSummary[] } | null>(null);
  const [botDelta, setBotDelta] = useState(2);
  const scoring = useMkmChallenge(params);

  const onFinish = (r: RoundState, schedule: RoundSchedule) => {
    const s = roundSummary(r, schedule, params);
    setLast(s);
    setRounds((rs) => [...rs, { ...s, informed: params.informed, seed: url.seed, bot: false }]);
    if (challenge) scoring.score(s);
  };
  const live = useQuoteRound(params, url.seed, onFinish);

  const best = theoryBest(params);
  const predict = usePredictReveal({ truth: best, tolerance: 0.4, resetKey: params, challengeId: "mkm-best-spread" });
  const theoryAllowed = url.mode === "predict" ? predict.revealed : url.mode === "simulate" && rounds.length >= THEORY_UNLOCK;

  return {
    url,
    setUrl,
    params,
    live,
    rounds,
    last,
    best,
    theoryAllowed,
    theoryOn: theoryOn && theoryAllowed,
    setTheoryOn,
    bots,
    botDelta,
    setBotDelta,
    runBots: () => setBots({ delta: botDelta, runs: runBotRounds(params, botDelta, url.seed) }),
    clearBots: () => setBots(null),
    predict,
    scoring,
    nextRound: () => {
      setLast(null);
      scoring.clear();
      setUrl({ seed: nextSeed(url.seed) });
    },
  };
}

export type MarketMakingLab = ReturnType<typeof useMarketMakingLab>;
