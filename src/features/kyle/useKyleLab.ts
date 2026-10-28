import { useState } from "react";
import { prefersReducedMotion, useTicker } from "../../components/playback";
import { useUrlState } from "../../components/useUrlState";
import { recordChallenge } from "../../lib/game/challengeScores";
import { drawRound, insiderHit, lambdaStar, noiseProfit, optimalOrder, planGhosts, runAuctions, totalProfit } from "./kyle.math";
import { DEFAULT_KYLE_PARAMS, type KyleParams } from "./kyle.types";
import { KYLE_URL } from "./kyle.url";

const CHALLENGE = "kyl-insider";
const LOT = 50;
const record = (hit: boolean) => recordChallenge(CHALLENGE, hit, Date.now());

type Round = { key: string; orders: number[]; shown: number; recorded: boolean };

/// Insider game state: seeded value and noise, your orders (planned or live), the optimal insider on the same draws.
export function useKyleLab() {
  const [url, setUrl] = useUrlState(KYLE_URL);
  const params: KyleParams = { ...DEFAULT_KYLE_PARAMS, n: url.n, s: url.s };
  const lambda = lambdaStar(params);
  const live = url.mode === "challenge" || url.play === "live";
  const key = `${url.seed}|${url.n}|${url.s}|${url.mode}|${live}`;
  const draw = drawRound(params, url.seed, url.mode === "challenge" ? params.sigmaV : 0);
  const blank = (): Round => ({ key, orders: live ? [] : Array.from({ length: params.n }, () => 0), shown: 0, recorded: false });
  const [stored, setRound] = useState<Round>(blank);
  const round = stored.key === key ? stored : blank();
  const [pending, setPending] = useState(0);
  const [running, setRunning] = useState(false);

  const padded = [...round.orders, ...Array.from({ length: params.n - round.orders.length }, () => 0)];
  const rows = runAuctions(padded, draw, params, lambda);
  const optimal = runAuctions("optimal", draw, params, lambda);
  const shown = rows.slice(0, round.shown);
  const done = round.shown >= params.n;
  const price = shown.length ? shown[shown.length - 1].pAfter : params.p0;
  const yours = totalProfit(shown);
  const best = totalProfit(optimal.slice(0, round.shown));
  const ghosts = live ? [] : planGhosts(padded, draw.v, params, lambda);
  const liveGhost = optimalOrder(draw.v, price, lambda, params.n - round.shown);

  const update = (patch: Partial<Round>) => setRound({ ...round, ...patch });
  useTicker(running, 600, () => {
    if (round.shown >= params.n) return false;
    update({ shown: round.shown + 1 });
  }, () => setRunning(false));

  const trade = () => {
    if (done) return;
    const orders = [...round.orders, pending];
    const next = runAuctions([...orders, ...Array.from({ length: params.n - orders.length }, () => 0)], draw, params, lambda);
    const finished = orders.length >= params.n;
    const recorded = round.recorded || (finished && url.mode === "challenge");
    if (finished && url.mode === "challenge" && !round.recorded)
      record(insiderHit(totalProfit(next), totalProfit(optimal)));
    setRound({ ...round, orders, shown: orders.length, recorded });
  };

  return {
    url,
    setUrl,
    params,
    lambda,
    draw,
    live,
    rows,
    shown,
    optimal,
    done,
    price,
    yours,
    best,
    noiseLoss: noiseProfit(shown, draw.v),
    ghosts,
    liveGhost: Math.round(liveGhost / LOT) * LOT,
    orders: padded,
    pending,
    setPending: (v: number) => setPending(Math.round(v / LOT) * LOT),
    setOrder: (i: number, v: number) => {
      const orders = padded.slice();
      orders[i] = Math.round(v / LOT) * LOT;
      update({ orders, shown: 0 });
    },
    fillOptimal: () => {
      const orders: number[] = [];
      for (let i = 0; i < params.n; i++) {
        const prefix = [...orders, ...Array.from({ length: params.n - orders.length }, () => 0)];
        orders.push(Math.round(planGhosts(prefix, draw.v, params, lambda)[i] / LOT) * LOT);
      }
      update({ orders, shown: 0 });
    },
    run: () => (prefersReducedMotion() ? update({ shown: params.n }) : (update({ shown: 0 }), setRunning(true))),
    trade,
    reset: () => setRound(blank()),
    orderRange: Math.max(1000, Math.ceil((1.2 * Math.abs(draw.v - params.p0)) / lambda / 500) * 500),
    hit: done && insiderHit(yours, totalProfit(optimal)),
    challengeId: CHALLENGE,
    lot: LOT,
  };
}

export type KyleLab = ReturnType<typeof useKyleLab>;
