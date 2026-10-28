import { useEffect, useMemo, useState } from "react";
import { usePredictReveal } from "../../components/ui";
import { prefersReducedMotion } from "../../components/playback/useTicker";
import { useUrlState } from "../../components/useUrlState";
import { bestAsk, bestBid, ordersOf, previewMarket, queueAhead } from "../../lib/market/book";
import { ladderRows } from "../../lib/market/ladder";
import type { Side } from "../../lib/market/market.types";
import { AVG_TOLERANCE, LADDER_DEPTH, predictRound, sideAt, sizeToRow } from "./orderBook.math";
import type { Preview } from "./orderBook.types";
import { OBK_URL_SCHEMA } from "./orderBook.url";
import { useOrderBookSim } from "./useOrderBookSim";

/// Order book lab state: URL setup, the live sim, one shared preview (ticket, ladder row or depth handle), the walk and predict.
export function useOrderBookLab() {
  const [url, setUrl] = useUrlState(OBK_URL_SCHEMA);
  const predicting = url.mode === "predict";
  const sim = useOrderBookSim(url.seed, url.liquidity, predicting);
  const [rowPrice, setRowPrice] = useState<number | null>(null);

  const preview: Preview = useMemo(() => {
    if (rowPrice === null) return { side: url.side, size: url.size, toPrice: null };
    const side = sideAt(sim.book, rowPrice);
    return { side, size: sizeToRow(sim.book, side, rowPrice), toPrice: rowPrice };
  }, [rowPrice, url.side, url.size, sim.book]);
  const previewFill = useMemo(() => previewMarket(sim.book, preview.side, preview.size), [sim.book, preview]);

  const [round, setRound] = useState(0);
  const question = useMemo(() => predictRound(url.seed + round * 101, sim.book), [url.seed, round, sim.book]);
  const truth = previewMarket(sim.book, question.side, question.size).avgPrice ?? NaN;
  const pr = usePredictReveal({ truth, tolerance: AVG_TOLERANCE, resetKey: `${url.seed}|${url.liquidity}|${round}`, challengeId: "obk-avg-price" });

  const rows = useMemo(() => {
    const shown = predicting ? (pr.revealed ? question : undefined) : url.ticket === "limit" ? undefined : preview;
    return ladderRows(sim.book, LADDER_DEPTH, sim.centre, shown);
  }, [sim.book, sim.centre, predicting, pr.revealed, question, preview, url.ticket]);

  const last = sim.sent.at(-1) ?? null;
  const [walk, setWalk] = useState(0);
  const [walkKey, setWalkKey] = useState(last);
  if (walkKey !== last) {
    setWalkKey(last);
    setWalk(prefersReducedMotion() ? (last?.fills.length ?? 0) : 0);
  }
  useEffect(() => {
    if (!last || walk >= last.fills.length) return;
    const id = window.setTimeout(() => setWalk((w) => w + 1), 120);
    return () => window.clearTimeout(id);
  }, [last, walk]);

  const send = (side: Side = preview.side, size: number = preview.size) => {
    if (size <= 0) return;
    sim.send(side, size);
    setRowPrice(null);
  };
  const limitMode = url.ticket === "limit";
  /// A limit at `price` executes at once if it crosses the touch.
  const marketable = (price: number) => {
    const touch = url.side === "buy" ? bestAsk(sim.book) : bestBid(sim.book);
    return touch !== null && (url.side === "buy" ? price >= touch : price <= touch);
  };
  const placeAt = (price: number) => sim.placeLimit(url.side, price, url.size);
  const myOrders = useMemo(
    () => ordersOf(sim.book, "you").map((o) => ({ ...o, ahead: queueAhead(sim.book, o.id) ?? 0 })),
    [sim.book],
  );

  return { url, setUrl, sim, limitMode, marketable, placeAt, myOrders, preview, previewFill, rowPrice, setRowPrice, rows, send, last, walk, question, pr, nextRound: () => setRound((r) => r + 1) };
}

export type OrderBookLab = ReturnType<typeof useOrderBookLab>;
