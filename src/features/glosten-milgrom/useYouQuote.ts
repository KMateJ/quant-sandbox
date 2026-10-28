import { useMemo, useState } from "react";
import { subSeed } from "../../lib/game/seed";
import { recordChallenge } from "../../lib/game/challengeScores";
import { drawTrades, gmPath, meanQuoteError, QUOTE_ERROR_LIMIT, quotePnl, resolveQuote } from "./glostenMilgrom.math";
import type { GmParams, QuoteOutcome, YourQuote } from "./glostenMilgrom.types";

const CHALLENGE = "glm-quote";
export const QUOTE_ROUND = 20;

/// You-quote round: before each trade you set bid/ask; a Bayes rival quotes too and the better price trades.
/// With `scored`, the finished round is saved as one `glm-quote` play.
export function useYouQuote(params: GmParams, seed: number, scored: boolean) {
  const key = `${seed}|${params.pi}|${params.prior}|${params.trueV}|${scored}`;
  const { pi, prior, trueV } = params;
  const path = useMemo(() => gmPath(drawTrades({ pi, prior, trueV, n: QUOTE_ROUND }, subSeed(seed, 7)), pi, prior), [pi, prior, trueV, seed]);
  const [round, setRound] = useState<{ key: string; outcomes: QuoteOutcome[] }>({ key, outcomes: [] });
  const outcomes = round.key === key ? round.outcomes : [];
  const i = outcomes.length;
  const done = i >= QUOTE_ROUND;
  const mu = done ? path[QUOTE_ROUND - 1].next : path[i].mu;
  const [quote, setQuote] = useState<YourQuote>({ bid: 0.4, ask: 0.6 });
  const error = meanQuoteError(outcomes);

  const commit = () => {
    if (done || quote.bid >= quote.ask) return;
    const next = [...outcomes, resolveQuote(quote, path[i])];
    setRound({ key, outcomes: next });
    if (scored && next.length === QUOTE_ROUND) recordChallenge(CHALLENGE, meanQuoteError(next) <= QUOTE_ERROR_LIMIT, Date.now());
  };

  return {
    challengeId: CHALLENGE,
    path,
    outcomes,
    index: i,
    done,
    mu,
    quote,
    setQuote,
    commit,
    error,
    hit: done && error <= QUOTE_ERROR_LIMIT,
    pnl: done ? quotePnl(outcomes, params.trueV) : null,
    won: outcomes.filter((o) => o.won).length,
    restart: () => setRound({ key, outcomes: [] }),
  };
}

export type YouQuote = ReturnType<typeof useYouQuote>;
