import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { riskParityWeights, scaleToVol } from "../../lib/finance/portfolio";
import { allPassed } from "../../lib/game/objectives";
import { nextSeed } from "../../lib/game/seed";
import { reducePortfolio, startPortfolio } from "./engine/book.math";
import { ewmaCov, monthlyReturns } from "./engine/market.math";
import { portfolioMissionById } from "./engine/missions.data";
import { evaluatePortfolio } from "./engine/objectives.math";
import type { PortfolioAction, PortfolioState } from "./engine/portfolio.types";
import { BENCH_WEIGHTS, exAnteSharpe, exAnteVol, realizedVol, riskShares, trackingError } from "./engine/risk.math";
import { PORTFOLIO_DEMO_MISSION, PORTFOLIO_DEMO_SEED } from "./demo/demo.script";
import { PORTFOLIO_DESK_URL, type PortfolioScreen } from "./portfolioDesk.url";
import { PORTFOLIO_PROGRESS } from "./portfolioProgress";
import { parseTargets, ticketPreview, toTargets } from "./ticket.math";

/// URL-level state: mission, seed, screen, demo flag, run counter and the mission's return path (memoised).
/// In demo mode mission and seed are pinned to the playthrough's.
export function usePortfolioUrl() {
  const [url, setUrl] = useUrlState(PORTFOLIO_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const mission = useMemo(() => portfolioMissionById(demo ? PORTFOLIO_DEMO_MISSION : url.m), [demo, url.m]);
  const seed = demo ? PORTFOLIO_DEMO_SEED : url.seed;
  const path = useMemo(() => monthlyReturns(mission, seed), [mission, seed]);

  const setScreen = useCallback((screen: PortfolioScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => setUrl({ m: id, screen: "desk" }), [setUrl]);
  const newPath = useCallback(() => setUrl((prev) => ({ seed: nextSeed(prev.seed), screen: "desk" })), [setUrl]);
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);
  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: PORTFOLIO_DEMO_MISSION, seed: PORTFOLIO_DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);
  // Same mission, seed and run, so the session (and the book the demo built) survives.
  const takeOver = useCallback(() => setUrl({ demo: false, m: PORTFOLIO_DEMO_MISSION, seed: PORTFOLIO_DEMO_SEED }), [setUrl]);

  return { url, run, demo, seed, mission, path, setScreen, selectMission, newPath, restart, startDemo, exitDemo, takeOver };
}

export type PortfolioUrlModel = ReturnType<typeof usePortfolioUrl>;

/// One run of a mission on one path: reducer, rebalance ticket and the derived risk numbers every panel reads.
/// Mount under a key of mission, seed and run so a new path or restart starts a fresh book.
export function usePortfolioSession(u: PortfolioUrlModel) {
  const { mission, path, seed } = u;
  const [state, dispatch] = useReducer(
    (s: PortfolioState, a: PortfolioAction) => reducePortfolio(s, a, mission, path.R),
    undefined,
    () => startPortfolio(mission, seed),
  );
  const [edited, setEdited] = useState<string[] | null>(null);

  const S = useMemo(() => ewmaCov(mission, path.R, state.month), [mission, path, state.month]);
  const exAnte = exAnteVol(state.w, S);
  const shares = useMemo(() => riskShares(state.w, S), [state.w, S]);
  const sharpe = exAnteSharpe(state.w, S, mission);
  const te = trackingError(state.w, BENCH_WEIGHTS, S);
  const realized = useMemo(() => realizedVol(state.hist), [state.hist]);
  const objectives = useMemo(() => evaluatePortfolio(mission, state), [mission, state]);

  const targets = edited ?? toTargets(state.w);
  const preview = useMemo(() => ticketPreview(state.w, parseTargets(targets), S, mission, state.nav), [state.w, state.nav, targets, S, mission]);
  const setTarget = (i: number, value: string) => setEdited(targets.map((x, j) => (j === i ? value : x)));
  const fill = (w: number[]) => setEdited(toTargets(w));

  const act = useCallback((a: PortfolioAction) => {
    setEdited(null);
    dispatch(a);
  }, []);

  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || u.demo) return;
    recorded.current = true;
    PORTFOLIO_PROGRESS.record(mission.id, allPassed(objectives), state.nav - state.bench);
  }, [state.settled, state.nav, state.bench, objectives, mission.id, u.demo]);

  return {
    ...u,
    state,
    dispatch: act,
    S,
    exAnte,
    shares,
    sharpe,
    te,
    realized,
    objectives,
    targets,
    preview,
    setTarget,
    fillTargets: fill,
    fillScale: () => fill(scaleToVol(state.w, S, mission.target)),
    fillParity: () => fill(scaleToVol(riskParityWeights(S), S, mission.target)),
    fillBench: () => fill(BENCH_WEIGHTS),
    submit: () => preview.valid && act({ type: "rebalance", targets: parseTargets(targets), tag: "manual" }),
    scaleNow: () => act({ type: "scaleToTarget" }),
    parityNow: () => act({ type: "riskParity" }),
    step: (months: number) => act({ type: "step", months }),
  };
}

export type PortfolioDeskModel = ReturnType<typeof usePortfolioSession>;
