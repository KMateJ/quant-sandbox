import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { allPassed } from "../../lib/game/objectives";
import { nextSeed } from "../../lib/game/seed";
import { reduceRetirement, startRetirement } from "./engine/book.math";
import { yearShocks } from "./engine/market.math";
import { retirementMissionById } from "./engine/missions.data";
import { evaluateRetirement } from "./engine/objectives.math";
import { successOdds } from "./engine/odds.math";
import type { RetirementAction, RetirementState } from "./engine/retirement.types";
import { RETIREMENT_DESK_URL, type RetirementScreen } from "./retirementDesk.url";
import { RETIREMENT_PROGRESS } from "./retirementProgress";
import { decisionPreview, parseAmount, presetAmount, type PresetId } from "./ticket.math";
import { RETIREMENT_DEMO_MISSION, RETIREMENT_DEMO_SEED, buildRetirementDemo } from "./demo/demo.script";

const GUARD_YEARS = 5;
const EQUITY_STEP = 0.05;

/// URL-level state: mission, seed, screen, demo flag, run counter and the mission's yearly shocks (memoised).
export function useRetirementUrl() {
  const [url, setUrl] = useUrlState(RETIREMENT_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const mission = useMemo(() => retirementMissionById(demo ? RETIREMENT_DEMO_MISSION : url.m), [demo, url.m]);
  const seed = demo ? RETIREMENT_DEMO_SEED : url.seed;
  const demoSteps = useMemo(() => buildRetirementDemo(), []);
  const shocks = useMemo(() => yearShocks(mission, seed), [mission, seed]);

  const setScreen = useCallback((screen: RetirementScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => setUrl({ m: id, screen: "desk" }), [setUrl]);
  const newPath = useCallback(() => setUrl((prev) => ({ seed: nextSeed(prev.seed), screen: "desk" })), [setUrl]);
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);
  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: RETIREMENT_DEMO_MISSION, seed: RETIREMENT_DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const takeOver = useCallback(() => setUrl({ demo: false, m: RETIREMENT_DEMO_MISSION, seed: RETIREMENT_DEMO_SEED }), [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);

  return { url, run, demo, seed, mission, shocks, demoSteps, setScreen, selectMission, newPath, restart, startDemo, takeOver, exitDemo };
}

export type RetirementUrlModel = ReturnType<typeof useRetirementUrl>;

/// One run of a mission on one path: reducer, decision ticket and the derived numbers every panel reads.
/// Mount under a key of mission, seed and run so a new path or restart starts a fresh plan.
export function useRetirementSession(u: RetirementUrlModel) {
  const { mission, shocks, seed } = u;
  const [state, dispatch] = useReducer(
    (s: RetirementState, a: RetirementAction) => reduceRetirement(s, a, mission, shocks),
    undefined,
    () => startRetirement(mission, seed),
  );
  const [typed, setTyped] = useState<string | null>(null);
  const [equityPick, setEquityPick] = useState<number | null>(null);

  const guardAmount = presetAmount("guard", mission, state);
  const amountText = typed ?? String(Math.round(guardAmount));
  const parsed = parseAmount(amountText);
  const equity = mission.equityLocked ? state.equity : (equityPick ?? state.equity);
  const live = !state.settled;
  const { year, wealth } = state;
  const oddsNow = useMemo(
    () => (!live ? (state.broke ? 0 : 1) : successOdds(mission, seed, year + 1, wealth, parsed ?? 0, equity)),
    [live, state.broke, mission, seed, year, wealth, parsed, equity],
  );
  const preview = decisionPreview(parsed ?? 0, state);
  const objectives = useMemo(() => evaluateRetirement(mission, state, oddsNow), [mission, state, oddsNow]);

  const act = useCallback((a: RetirementAction) => {
    setTyped(null);
    dispatch(a);
  }, []);

  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || u.demo) return;
    recorded.current = true;
    RETIREMENT_PROGRESS.record(mission.id, allPassed(objectives), state.rows.reduce((a, r) => a + r.take, 0));
  }, [state.settled, state.rows, objectives, mission.id, u.demo]);

  return {
    ...u,
    state,
    dispatch: act,
    amountText,
    amount: parsed,
    equity,
    oddsNow,
    preview,
    guardAmount,
    objectives,
    valid: live && parsed !== null,
    setAmount: setTyped,
    setEquity: (e: number) => setEquityPick(Math.round(e / EQUITY_STEP) * EQUITY_STEP),
    fillPreset: (id: PresetId) => setTyped(String(Math.round(presetAmount(id, mission, state)))),
    take: () => parsed !== null && live && act({ type: "take", amount: parsed, equity, tag: "manual" }),
    takeGuard: (years = GUARD_YEARS) => act({ type: "auto", years, rule: "guardrails" }),
    useGuard: () => setTyped(String(Math.round(guardAmount))),
  };
}

export type RetirementDeskModel = ReturnType<typeof useRetirementSession>;
