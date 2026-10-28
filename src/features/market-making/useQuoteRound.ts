import { useEffect, useMemo, useRef, useState } from "react";
import { prefersReducedMotion, useTicker } from "../../components/playback";
import { ROUND_STEPS, type MmParams, type Quotes, type RoundSchedule, type RoundState } from "./marketMaking.types";
import { emptyRound, roundSchedule, stepRound } from "./round.math";

const START_QUOTES: Quotes = { bid: 2, ask: 2, live: true };
const MAX_HALF = 12;
const snap = (v: number) => Math.min(MAX_HALF, Math.max(0, Math.round(v * 2) / 2));

/// One live 60 s quoting round on a seeded schedule: play/pause/step, quote edits, and a callback when it ends.
export function useQuoteRound(params: MmParams, seed: number, onFinish: (round: RoundState, schedule: RoundSchedule) => void) {
  const schedule = useMemo(() => roundSchedule(params, seed), [params, seed]);
  const [round, setRound] = useState<RoundState>(emptyRound);
  const [quotes, setQuotesRaw] = useState<Quotes>(START_QUOTES);
  const [running, setRunning] = useState(false);
  const [lastSchedule, setLastSchedule] = useState(schedule);
  if (lastSchedule !== schedule) {
    setLastSchedule(schedule);
    setRound(emptyRound());
    setRunning(false);
  }
  const [reduced] = useState(prefersReducedMotion);
  const done = round.step >= ROUND_STEPS;
  const reported = useRef<RoundState | null>(null);
  const finishRef = useRef(onFinish);
  useEffect(() => {
    finishRef.current = onFinish;
  });
  useEffect(() => {
    if (done && reported.current !== round) {
      reported.current = round;
      finishRef.current(round, schedule);
    }
  }, [done, round, schedule]);

  const advance = (steps: number) =>
    setRound((r) => {
      let next = r;
      for (let i = 0; i < steps && next.step < ROUND_STEPS; i++) next = stepRound(next, quotes, schedule, params);
      return next;
    });
  useTicker(running, 100, () => {
    advance(1);
    return round.step + 1 < ROUND_STEPS;
  }, () => setRunning(false));

  const setQuotes = (q: Partial<Quotes>) => setQuotesRaw((cur) => ({ ...cur, ...q, bid: snap(q.bid ?? cur.bid), ask: snap(q.ask ?? cur.ask) }));

  return {
    schedule,
    round,
    quotes,
    running,
    done,
    reduced,
    setQuotes,
    /// Moves both quotes up (+) or down (−) by `d` ¢: a skew.
    skew: (d: number) => setQuotes({ bid: quotes.bid - d, ask: quotes.ask + d }),
    /// Widens (+) or narrows (−) both sides by `d` ¢.
    widen: (d: number) => setQuotes({ bid: quotes.bid + d, ask: quotes.ask + d }),
    togglePull: () => setQuotes({ live: !quotes.live }),
    toggle: () => {
      if (done) return;
      if (reduced) advance(10);
      else setRunning((r) => !r);
    },
    stepSecond: () => advance(10),
    newRound: () => {
      setRound(emptyRound());
      setRunning(false);
    },
  };
}

export type QuoteRound = ReturnType<typeof useQuoteRound>;
