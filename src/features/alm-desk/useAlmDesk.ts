import { useCallback, useMemo, useReducer, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { nextSeed } from "../../lib/game/seed";
import { immunisedWeights, weightsOf } from "../immunization/immunization.math";
import { ALM_DESK_URL, type AlmScreen } from "./almDesk.url";
import { ALM_DEMO_MISSION, ALM_DEMO_SEED, buildAlmDemo } from "./demo/demo.script";
import { almConfig, reduceAlm, startAlm } from "./engine/book.math";
import { almMissionById } from "./engine/missions.data";
import { evaluateAlm } from "./engine/objectives.math";
import { almRisk, surplusGrid } from "./engine/risk.math";
import type { AlmAction, AlmState } from "./engine/alm.types";
import { parseTargets, previewTrade, targetsFromWeights, tradesLeft } from "./ticket.math";

export const GRID_PARALLELS = [-100, -50, -25, 0, 25, 50, 100];
export const GRID_TWISTS = [50, 0, -50];

/// URL-level state of the ALM desk: mission, seed, screen, demo flag and the run counter.
/// In demo mode mission and seed are fixed to the playthrough's.
export function useAlmUrl() {
  const [url, setUrl] = useUrlState(ALM_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const mission = useMemo(() => almMissionById(demo ? ALM_DEMO_MISSION : url.m), [demo, url.m]);
  const seed = demo ? ALM_DEMO_SEED : url.seed;
  const demoSteps = useMemo(() => buildAlmDemo(almMissionById(ALM_DEMO_MISSION), ALM_DEMO_SEED), []);

  const setScreen = useCallback((screen: AlmScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => setUrl({ m: id, screen: "desk" }), [setUrl]);
  const newPath = useCallback(() => setUrl((prev) => ({ seed: nextSeed(prev.seed), screen: "desk" })), [setUrl]);
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);
  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: ALM_DEMO_MISSION, seed: ALM_DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const takeOver = useCallback(() => setUrl({ demo: false, m: ALM_DEMO_MISSION, seed: ALM_DEMO_SEED }), [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);

  return { url, run, demo, seed, mission, demoSteps, setScreen, selectMission, newPath, restart, startDemo, takeOver, exitDemo };
}

export type AlmUrlModel = ReturnType<typeof useAlmUrl>;

/// One run of a mission on one path: the reducer, the rebalance ticket and the numbers every panel reads.
/// Mount it under a key of mission, seed and run so a new path or a restart resets the book.
export function useAlmSession(desk: AlmUrlModel) {
  const { mission, seed } = desk;
  const [state, dispatch] = useReducer((s: AlmState, a: AlmAction) => reduceAlm(s, a, mission), undefined, () => startAlm(mission, seed));
  const [targets, setTargets] = useState(() => targetsFromWeights(weightsOf(state.game)));

  const cfg = useMemo(() => almConfig(mission), [mission]);
  const risk = useMemo(() => almRisk(state, mission), [state, mission]);
  const objectives = useMemo(() => evaluateAlm(mission, state), [mission, state]);
  const grid = useMemo(() => surplusGrid(state, mission, GRID_PARALLELS, GRID_TWISTS), [state, mission]);
  const parsed = useMemo(() => parseTargets(targets), [targets]);
  const preview = useMemo(() => (parsed.weights ? previewTrade(state, mission, parsed.weights) : null), [parsed, state, mission]);
  const left = tradesLeft(state, mission);

  const setTarget = useCallback((i: number, v: string) => setTargets((ts) => ts.map((x, j) => (j === i ? v : x))), []);
  const fillMatch = useCallback(() => setTargets(targetsFromWeights(immunisedWeights(state.game, cfg))), [state.game, cfg]);
  const submit = useCallback(() => {
    if (parsed.weights) dispatch({ type: "rebalance", weights: parsed.weights, tag: "manual" });
  }, [parsed]);
  const matchNow = useCallback(() => {
    dispatch({ type: "match" });
    setTargets(targetsFromWeights(immunisedWeights(state.game, cfg)));
  }, [state.game, cfg]);
  const step = useCallback(() => dispatch({ type: "step" }), []);

  return { ...desk, state, dispatch, cfg, risk, objectives, grid, targets, parsed, preview, tradesLeft: left, setTarget, fillMatch, submit, matchNow, step };
}

export type AlmDeskModel = ReturnType<typeof useAlmSession>;
