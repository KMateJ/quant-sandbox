import { useCallback, useMemo, useReducer, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { nextSeed } from "../../lib/game/seed";
import { factorPath, zeroGrid } from "./engine/curve.math";
import { reduceRates, startRates, hedgedPnl } from "./engine/book.math";
import { ratesMissionById } from "./engine/missions.data";
import { evaluateRates } from "./engine/objectives.math";
import { futureQuote } from "./engine/pricing.math";
import { curveScenarios, isExpired, ratesRisk } from "./engine/risk.math";
import { tenYearContract } from "./engine/policy.math";
import type { RatesAction, RatesState } from "./engine/rates.types";
import { RATES_DESK_URL, type RatesScreen } from "./ratesDesk.url";
import { RATES_DEMO_MISSION, RATES_DEMO_SEED, buildRatesDemo } from "./demo/demo.script";


/// URL-level state: mission, seed, screen, demo flag and run counter; the factor path is derived once here.
export function useRatesUrl() {
  const [url, setUrl] = useUrlState(RATES_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const mission = useMemo(() => ratesMissionById(demo ? RATES_DEMO_MISSION : url.m), [demo, url.m]);
  const seed = demo ? RATES_DEMO_SEED : url.seed;
  const path = useMemo(() => factorPath(mission, seed), [mission, seed]);
  const demoSteps = useMemo(() => buildRatesDemo(ratesMissionById(RATES_DEMO_MISSION), RATES_DEMO_SEED), []);

  const setScreen = useCallback((screen: RatesScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => setUrl({ m: id, screen: "desk" }), [setUrl]);
  const newPath = useCallback(() => setUrl((prev) => ({ seed: nextSeed(prev.seed), screen: "desk" })), [setUrl]);
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);
  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: RATES_DEMO_MISSION, seed: RATES_DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const takeOver = useCallback(() => setUrl({ demo: false, m: RATES_DEMO_MISSION, seed: RATES_DEMO_SEED }), [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);

  return { url, run, demo, seed, mission, path, demoSteps, setScreen, selectMission, newPath, restart, startDemo, takeOver, exitDemo };
}

export type RatesUrlModel = ReturnType<typeof useRatesUrl>;
export type Side = "buy" | "sell";
type Ticket = { future: number; side: Side; qty: string };

/// One run of a mission on one path: reducer, futures ticket and the numbers every panel reads.
/// Mount under a key of mission, seed and run so a new path or restart resets the book.
export function useRatesSession(desk: RatesUrlModel) {
  const { mission, path, seed } = desk;
  const [state, dispatch] = useReducer(
    (s: RatesState, a: RatesAction) => reduceRates(s, a, mission, path),
    undefined,
    () => startRates(mission, seed, path),
  );
  const tenYear = Math.max(0, mission.futures.findIndex((f) => f.id.startsWith("10Y")));
  const [picked, setTicket] = useState<Ticket>({ future: tenYear, side: "sell", qty: "10" });

  const { day } = state;
  const zeros = useMemo(() => zeroGrid(path[day]), [path, day]);
  const zeros0 = useMemo(() => zeroGrid(path[0]), [path]);
  const risk = useMemo(() => ratesRisk(state, mission, zeros), [state, mission, zeros]);
  const objectives = useMemo(() => evaluateRates(mission, state), [mission, state]);
  const scenarios = useMemo(() => curveScenarios(state, mission, zeros), [state, mission, zeros]);
  const quotes = useMemo(() => mission.futures.map((f) => futureQuote(f, zeros)), [mission, zeros]);
  const quotes0 = useMemo(() => mission.futures.map((f) => futureQuote(f, zeros0)), [mission, zeros0]);
  const expired = mission.futures.map((f) => isExpired(f, day));
  const ticket = expired[picked.future] ? { ...picked, future: Math.max(0, tenYearContract(mission, day)) } : picked;
  const pnl = hedgedPnl(state);

  const setFuture = useCallback((future: number) => setTicket((p) => ({ ...p, future })), []);
  const setSide = useCallback((side: Side) => setTicket((p) => ({ ...p, side })), []);
  const setQty = useCallback((qty: string) => setTicket((p) => ({ ...p, qty })), []);
  const qty = Number(ticket.qty);
  const qtyValid = Number.isInteger(qty) && qty > 0;
  const signedQty = qtyValid ? (ticket.side === "buy" ? qty : -qty) : 0;
  const submit = useCallback(() => {
    if (signedQty !== 0) dispatch({ type: "trade", future: ticket.future, qty: signedQty, tag: "manual" });
  }, [signedQty, ticket.future]);
  const hedgeDv01 = useCallback(() => dispatch({ type: "dv01Hedge", future: ticket.future }), [ticket.future]);
  const hedgeKrd = useCallback(() => dispatch({ type: "krdHedge" }), []);
  const step = useCallback((days: number) => dispatch({ type: "step", days }), []);
  const send: (action: RatesAction) => void = dispatch;

  return {
    ...desk, state, day, zeros, zeros0, risk, objectives, scenarios, quotes, quotes0, expired, pnl,
    ticket, setFuture, setSide, setQty, qtyValid, signedQty, submit, hedgeDv01, hedgeKrd, step, dispatch: send,
  };
}

export type RatesDeskModel = ReturnType<typeof useRatesSession>;
