import { useCallback, useMemo, useReducer, useState } from "react";
import { useUrlState } from "../../components/useUrlState";
import { DESK_SCREENS, HEDGING_DESK_URL, type DeskScreen } from "./hedgingDesk.url";
import type { BookState, DeskAction, InstrumentId, Side } from "./engine/desk.types";
import { STOCK_ID } from "./engine/desk.config";
import { MISSIONS, missionById } from "./engine/missions.data";
import { buildMarket } from "./engine/market.math";
import { reduceDesk, startBook, tradeCount } from "./engine/book.math";
import { bookGreeks, markToMarket, realizedVol } from "./engine/risk.math";
import { evaluateObjectives } from "./engine/objectives.math";
import { quoteInstrument, tauAt } from "./engine/pricing.math";
import { isStock } from "./engine/instruments.math";
import { DEMO_MISSION, DEMO_SEED } from "./demo/demo.config";

export { DESK_SCREENS };

const STOCK_QTY = "500";
const OPTION_QTY = "5";
const MAX_SEED = 9999;

/// URL-level state of the desk: mission, seed, screen, demo flag and the run counter. The market path is
/// derived here so that every screen of one session shares it; in demo mode mission and seed are fixed.
export function useDeskUrl() {
  const [url, setUrl] = useUrlState(HEDGING_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const mission = useMemo(() => missionById(demo ? DEMO_MISSION : url.m) ?? MISSIONS[0], [demo, url.m]);
  const seed = demo ? DEMO_SEED : url.seed;
  const market = useMemo(() => buildMarket(mission.market, seed), [mission, seed]);

  const setScreen = useCallback((screen: DeskScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => setUrl({ m: id, screen: "desk" }), [setUrl]);
  const newPath = useCallback(
    () => setUrl((prev) => ({ seed: prev.seed >= MAX_SEED ? 1 : prev.seed + 1, screen: "desk" })),
    [setUrl],
  );
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);

  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: DEMO_MISSION, seed: DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const takeOver = useCallback(() => setUrl({ demo: false, m: DEMO_MISSION, seed: DEMO_SEED }), [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);

  return { url, run, demo, seed, mission, market, setScreen, selectMission, newPath, restart, startDemo, takeOver, exitDemo };
}

export type DeskUrlModel = ReturnType<typeof useDeskUrl>;

type Ticket = { id: InstrumentId; side: Side; qty: string };

const defaultQty = (id: InstrumentId) => (isStock(id) ? STOCK_QTY : OPTION_QTY);

/// One run of a mission on one path: the book reducer, the order ticket and the derived numbers every
/// panel reads. Mount it under a key of the effective mission, seed and `run` so a new path or restart
/// resets the book (and taking over a demo does not).
export function useDeskSession(desk: DeskUrlModel) {
  const { mission, market, seed } = desk;
  const [state, dispatch] = useReducer(
    (s: BookState, a: DeskAction) => reduceDesk(s, a, market, mission),
    undefined,
    () => startBook(mission, seed, market),
  );
  const [ticket, setTicket] = useState<Ticket>({ id: STOCK_ID, side: "buy", qty: STOCK_QTY });

  const day = state.day;
  const S = market.spot[day];
  const iv = market.iv[day];
  const tau = tauAt(day, market.days);
  const greeks = useMemo(() => bookGreeks(state, market), [state, market]);
  const pnl = useMemo(() => markToMarket(state, market), [state, market]);
  const objectives = useMemo(() => evaluateObjectives(mission, state, market), [mission, state, market]);
  const rv = useMemo(() => realizedVol(market.spot, day), [market, day]);
  const trades = useMemo(() => tradeCount(state), [state]);
  const lastRebalanceDay = useMemo(() => {
    const fill = state.fills.filter((f) => f.tag !== "client").at(-1);
    return fill ? fill.day : null;
  }, [state.fills]);
  const quote = useCallback(
    (id: InstrumentId) => quoteInstrument(id, S, tau, iv, market.rate, mission.costs),
    [S, tau, iv, market.rate, mission.costs],
  );

  const setTicketId = useCallback(
    (id: InstrumentId) =>
      setTicket((prev) => (isStock(id) === isStock(prev.id) ? { ...prev, id } : { ...prev, id, qty: defaultQty(id) })),
    [],
  );
  const setSide = useCallback((side: Side) => setTicket((prev) => ({ ...prev, side })), []);
  const setQty = useCallback((qty: string) => setTicket((prev) => ({ ...prev, qty })), []);

  const submit = useCallback(() => {
    const qty = Number(ticket.qty);
    if (!Number.isInteger(qty) || qty <= 0) return;
    dispatch({ type: "order", order: { id: ticket.id, side: ticket.side, qty, tag: "manual" } });
  }, [ticket]);
  const autoHedge = useCallback(() => dispatch({ type: "autoHedge" }), []);
  const step = useCallback((days: number) => dispatch({ type: "step", days }), []);
  /// Raw engine dispatch for the demo controller; panels use `submit`/`autoHedge`/`step`.
  const send: (action: DeskAction) => void = dispatch;

  return {
    ...desk,
    state,
    day,
    S,
    iv,
    tau,
    greeks,
    pnl,
    objectives,
    realizedVol: rv,
    trades,
    lastRebalanceDay,
    quote,
    ticket,
    setTicketId,
    setSide,
    setQty,
    submit,
    autoHedge,
    step,
    dispatch: send,
  };
}

export type HedgingDeskModel = ReturnType<typeof useDeskSession>;
