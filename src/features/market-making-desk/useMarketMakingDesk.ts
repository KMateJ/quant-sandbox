import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { useTicker } from "../../components/playback/useTicker";
import { useUrlState } from "../../components/useUrlState";
import { allPassed } from "../../lib/game/objectives";
import { nextSeed } from "../../lib/game/seed";
import { ordersOf, queueAhead, spreadTicks } from "../../lib/market/book";
import { ladderRows } from "../../lib/market/ladder";
import type { Side } from "../../lib/market/market.types";
import { MM_DEMO_MISSION, MM_DEMO_SEED } from "./demo/demo.script";
import { ladderCentre, MIN_OFFSET, shiftOffsets, skewToBuy, skewToSell, tighten, widen } from "./deskModel.math";
import { crowdMid, quotePrices, reduceMm, startMm } from "./engine/book.math";
import { mmMarket } from "./engine/market.math";
import { mmMissionById, MM_MISSIONS } from "./engine/missions.data";
import type { MmAction, MmQuote, MmState } from "./engine/mm.types";
import { evaluateMm, mmPnl, mmPnlParts } from "./engine/objectives.math";
import { replayMm } from "./engine/policy.math";
import { MM_DESK_URL, type MmScreen } from "./marketMakingDesk.url";
import { MM_PROGRESS } from "./mmProgress";

export const MM_SPEEDS = [1, 2, 5] as const;
export type MmSpeed = (typeof MM_SPEEDS)[number];
const LADDER_DEPTH = 10;
const TICK_MS = 100;

/// URL-level state: mission, seed, screen, demo flag, run counter and the memoised market.
/// In demo mode mission and seed are pinned to the playthrough's.
export function useMmUrl() {
  const [url, setUrl] = useUrlState(MM_DESK_URL);
  const [run, setRun] = useState(0);
  const demo = url.demo;
  const missionId = demo ? MM_DEMO_MISSION : url.m;
  const mission = useMemo(() => mmMissionById(missionId) ?? MM_MISSIONS[0], [missionId]);
  const seed = demo ? MM_DEMO_SEED : url.seed;
  const market = useMemo(() => mmMarket(mission, seed), [mission, seed]);

  const setScreen = useCallback((screen: MmScreen) => setUrl({ screen }), [setUrl]);
  const selectMission = useCallback((id: string) => {
    setRun((r) => r + 1);
    setUrl({ m: id, demo: false, screen: "desk" });
  }, [setUrl]);
  const newSeed = useCallback(() => setUrl((prev) => ({ seed: nextSeed(prev.seed), screen: "desk" })), [setUrl]);
  const restart = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ screen: "desk" });
  }, [setUrl]);
  const startDemo = useCallback(() => {
    setRun((r) => r + 1);
    setUrl({ demo: true, m: MM_DEMO_MISSION, seed: MM_DEMO_SEED, screen: "desk" });
  }, [setUrl]);
  const exitDemo = useCallback(() => setUrl({ demo: false, screen: "desk" }), [setUrl]);
  // Same mission, seed and run, so the session (and the book the demo built) survives.
  const takeOver = useCallback(() => setUrl({ demo: false, m: MM_DEMO_MISSION, seed: MM_DEMO_SEED }), [setUrl]);

  return { url, run, demo, seed, mission, market, setScreen, selectMission, newSeed, restart, startDemo, exitDemo, takeOver };
}

export type MmUrlModel = ReturnType<typeof useMmUrl>;

type Draft = Pick<MmQuote, "bidOffset" | "askOffset" | "size" | "auto">;

/// One run of a mission: reducer, real-time clock, quote ticket and every derived number the panels read.
/// Mount under a key of mission, seed and run so a restart starts a fresh book.
export function useMmSession(u: MmUrlModel) {
  const { mission, market, seed } = u;
  const tick = mission.flow.tick;
  const [state, dispatch] = useReducer(
    (s: MmState, a: MmAction) => reduceMm(s, a, mission, market),
    undefined,
    () => startMm(mission, seed, market),
  );
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState<MmSpeed>(1);
  const [edited, setEdited] = useState<Draft | null>(null);

  useTicker(running && !state.settled, TICK_MS, () => {
    if (state.settled) return false;
    dispatch({ type: "step", ticks: speed });
  }, () => setRunning(false));

  const act = useCallback((a: MmAction) => {
    setEdited(null);
    dispatch(a);
  }, []);

  const { quote, book, ledger } = state;
  const draft: Draft = edited ?? { bidOffset: quote.bidOffset, askOffset: quote.askOffset, size: quote.size, auto: quote.auto };
  const mid = crowdMid(book, market.fair[state.t]);
  const target = quotePrices(mid, draft);
  const parts = useMemo(() => mmPnlParts(mission, state), [mission, state]);
  const beat = mission.objectives.find((o) => o.kind === "beatPolicy");
  const policyPnl = useMemo(() => (beat?.kind === "beatPolicy" ? replayMm(mission, seed, beat.policy, market).pnl : undefined), [beat, mission, seed, market]);
  const objectives = useMemo(() => evaluateMm(mission, state, policyPnl), [mission, state, policyPnl]);
  const rows = useMemo(() => ladderRows(book, LADDER_DEPTH, ladderCentre(state.hist, tick)), [book, state.hist, tick]);
  const resting = (side: Side) => {
    const o = ordersOf(book, "you").find((x) => x.side === side);
    return o ? { price: o.price * tick, ahead: queueAhead(book, o.id) ?? 0 } : null;
  };

  const recorded = useRef(false);
  useEffect(() => {
    if (!state.settled || recorded.current || u.demo) return;
    recorded.current = true;
    MM_PROGRESS.record(mission.id, allPassed(objectives), mmPnl(state));
  }, [state, objectives, mission.id, u.demo]);

  const live = !state.settled && !u.demo;
  const setQuote = (q: Partial<MmQuote>) => act({ type: "setQuote", quote: q });
  const offsets = { bidOffset: quote.bidOffset, askOffset: quote.askOffset };
  const editDraft = (patch: Partial<Draft>) => setEdited({ ...draft, ...patch });

  return {
    ...u,
    state,
    dispatch: act,
    live,
    running,
    speed,
    setSpeed,
    play: () => setRunning(true),
    pause: () => setRunning(false),
    togglePlay: () => setRunning((r) => !r),
    step10: () => act({ type: "step", ticks: 10 }),
    mid: mid * tick,
    spread: spreadTicks(book),
    inventory: ledger.inventory,
    pnl: mmPnl(state),
    parts,
    objectives,
    rows,
    bid: resting("buy"),
    ask: resting("sell"),
    draft,
    target: { bid: target.bid * tick, ask: target.ask * tick },
    nudgeDraft: (side: Side, by: number) =>
      editDraft(shiftOffsets(draft, side === "buy" ? by : 0, side === "sell" ? by : 0)),
    setDraftSize: (size: number) => editDraft({ size: Math.max(10, Math.round(size / 10) * 10) }),
    toggleDraftAuto: () => editDraft({ auto: !draft.auto }),
    place: () => setQuote({ ...draft, live: true }),
    join: () => setQuote({ bidOffset: MIN_OFFSET, askOffset: MIN_OFFSET, live: true }),
    widen: () => setQuote(widen(offsets)),
    tighten: () => setQuote(tighten(offsets)),
    skewToSell: () => setQuote(skewToSell(offsets)),
    skewToBuy: () => setQuote(skewToBuy(offsets)),
    toggleAuto: () => setQuote({ auto: !quote.auto }),
    pull: () => act({ type: "pull" }),
    restore: () => setQuote({ live: true }),
    hedgeFlat: () => act({ type: "hedge", size: Math.abs(ledger.inventory) }),
  };
}

export type MmDeskModel = ReturnType<typeof useMmSession>;
