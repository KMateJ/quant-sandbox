import { useMemo, useState } from "react";
import { prefersReducedMotion, useTicker } from "../../components/playback";
import { useUrlState } from "../../components/useUrlState";
import { DEFAULT_AS_PARAMS, type AsParams, type Policy } from "./avellanedaStoikov.types";
import { AVS_URL } from "./avellanedaStoikov.url";
import { asMeanHalfSpread, drawnPolicy, flatCurve, gapToAs, MIN_DIFF, type SketchPoint } from "./policy.math";
import { useAvsChallenge } from "./useAvsChallenge";
import { useAvsPredict } from "./useAvsPredict";
import { useTournament } from "./useTournament";

const Q_LIMIT = 10;
const CLOCK_STEP = 0.01;

/// Lab state: URL setup, the skew explorer (inventory puck, day clock), your drawn policy, the tournament,
/// predict rounds and the challenge.
export function useAvellanedaStoikovLab() {
  const [url, setUrl] = useUrlState(AVS_URL);
  const { gamma, sigma, k } = url;
  const params: AsParams = useMemo(() => ({ ...DEFAULT_AS_PARAMS, gamma, sigma, k }), [gamma, sigma, k]);

  const [q, setQRaw] = useState(6);
  const [t, setT] = useState(0.5);
  const [playing, setPlaying] = useState(false);
  const [reduced] = useState(prefersReducedMotion);
  useTicker(playing, 60, () => {
    setT((x) => Math.min(params.T, x + CLOCK_STEP));
    return t + CLOCK_STEP < params.T;
  }, () => setPlaying(false));

  const [points, setPoints] = useState<SketchPoint[]>(flatCurve);
  const [halfSpread, setHalfSpread] = useState(() => asMeanHalfSpread(DEFAULT_AS_PARAMS.gamma, DEFAULT_AS_PARAMS));
  const policies: Policy[] = useMemo(
    () => [drawnPolicy(points, halfSpread), { kind: "as", gamma }, { kind: "symmetric", gamma }],
    [points, halfSpread, gamma],
  );

  const challenge = useAvsChallenge();
  const scored = url.mode === "challenge";
  const tooClose = gapToAs(points, gamma, params) < MIN_DIFF;
  const tour = useTournament(policies, params, url.seed, (r) => scored && challenge.score(r));
  const predict = useAvsPredict(params, url.seed);

  return {
    url,
    setUrl,
    params,
    q,
    setQ: (v: number) => setQRaw(Math.max(-Q_LIMIT, Math.min(Q_LIMIT, Math.round(v)))),
    t,
    setT: (v: number) => setT(Math.max(0, Math.min(params.T, v))),
    playing,
    reduced,
    togglePlay: () => {
      if (reduced) setT((x) => Math.min(params.T, x + 0.05));
      else {
        if (t >= params.T) setT(0);
        setPlaying((p) => !p);
      }
    },
    points,
    setPoints,
    halfSpread,
    setHalfSpread,
    tour,
    tourPolicies: policies,
    challenge,
    tooClose,
    canRun: !(scored && tooClose),
    predict,
  };
}

export type AvsLab = ReturnType<typeof useAvellanedaStoikovLab>;
