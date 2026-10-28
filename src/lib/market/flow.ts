import { makeRng, nextExponential, nextNormal, nextPoisson, type Rng } from "../math/random";
import { subSeed } from "../game/seed";
import { addLimit, bestAsk, bestBid, cancel, emptyBook, marketOrder } from "./book";
import type { Book, Fill, FlowEvent, FlowSpec, Side, TickDraws } from "./market.types";

/// Shared crowd defaults; labs spread this and override a few fields.
export const DEFAULT_FLOW: FlowSpec = {
  tick: 0.01,
  levels: 10,
  depthPerLevel: 450,
  limitRate: 6,
  cancelRate: 0.02,
  marketRate: 1.2,
  informedShare: 0,
  buyShare: 0.5,
  meanMarketSize: 300,
  sigmaTicks: 0.35,
  horizon: 5,
};

/// Default starting fair value in ticks (100.00 at a 0.01 tick).
export const FAIR0 = 10000;
const MIN_LEVELS = 3;
const LIMIT_DIST_P = 1 / 3;

/// Fair-value random walk in ticks, length `seconds + horizon + 1`, with an optional jump.
export function fairPath(spec: FlowSpec, seconds: number, seed: number, fair0 = FAIR0): number[] {
  const rng = makeRng(subSeed(seed, 1));
  const n = seconds + spec.horizon + 1;
  const path = [fair0];
  for (let t = 1; t < n; t++) path.push(path[t - 1] + spec.sigmaTicks * nextNormal(rng));
  if (spec.jump && spec.jump.t < n) {
    const sign = makeRng(subSeed(seed, 3))() < 0.5 ? -1 : 1;
    for (let t = spec.jump.t; t < n; t++) path[t] += sign * spec.jump.sizeTicks;
  }
  return path;
}

const limitSize = (rng: Rng, depthPerLevel: number) =>
  Math.max(1, Math.round((depthPerLevel / 3) * (0.5 + rng())));

/// Pre-drawn crowd randomness for `seconds` ticks; never depends on the book or the player.
export function flowSchedule(spec: FlowSpec, seconds: number, seed: number): TickDraws[] {
  const rng = makeRng(subSeed(seed, 2));
  const out: TickDraws[] = [];
  for (let t = 0; t < seconds; t++) {
    const limits = Array.from({ length: nextPoisson(rng, spec.limitRate) }, () => ({
      buy: rng() < 0.5,
      dist: Math.floor(Math.log(1 - rng()) / Math.log(1 - LIMIT_DIST_P)),
      size: limitSize(rng, spec.depthPerLevel),
    }));
    const cancels = Array.from({ length: nextPoisson(rng, spec.cancelRate * spec.levels * 6) }, () => rng());
    const markets = Array.from({ length: nextPoisson(rng, spec.marketRate) }, () => ({
      informedU: rng(),
      buy: rng() < spec.buyShare,
      size: Math.max(10, Math.round(nextExponential(rng, 1 / spec.meanMarketSize) / 10) * 10),
    }));
    out.push({ limits, cancels, markets });
  }
  return out;
}

/// Initial book: `levels` levels a side of 2–4 crowd orders (≈ `depthPerLevel` each), 1-tick spread.
export function seedBook(spec: FlowSpec, fair0: number, seed: number): Book {
  const rng = makeRng(subSeed(seed, 4));
  const top = Math.floor(fair0);
  let book = emptyBook();
  for (let i = 0; i < spec.levels; i++) {
    for (const [side, price] of [["buy", top - i], ["sell", top + 1 + i]] as [Side, number][]) {
      const count = 2 + Math.floor(rng() * 3);
      const weights = Array.from({ length: count }, () => 0.5 + rng());
      const sum = weights.reduce((a, w) => a + w, 0);
      for (const w of weights) {
        const size = Math.max(1, Math.round((spec.depthPerLevel * w) / sum));
        book = addLimit(book, { side, price, size, owner: "crowd", t: 0 }).book;
      }
    }
  }
  return book;
}

function nthCrowd(b: Book, u: number) {
  const crowd = [...b.bids, ...b.asks].flatMap((l) => l.orders.filter((o) => o.owner === "crowd"));
  return crowd.length > 0 ? crowd[Math.floor(u * crowd.length)] : null;
}

function refill(b: Book, spec: FlowSpec, fair: number, t: number): Book {
  let book = b;
  for (const side of ["buy", "sell"] as Side[]) {
    const levels = side === "buy" ? book.bids : book.asks;
    for (let n = levels.length; n < MIN_LEVELS; n++) {
      const cur = side === "buy" ? book.bids : book.asks;
      const worst = cur[cur.length - 1]?.price;
      const price =
        side === "buy"
          ? worst !== undefined ? worst - 1 : Math.min(Math.floor(fair), (bestAsk(book) ?? Infinity) - 1)
          : worst !== undefined ? worst + 1 : Math.max(Math.ceil(fair), (bestBid(book) ?? -Infinity) + 1);
      book = addLimit(book, { side, price, size: spec.depthPerLevel, owner: "crowd", t }).book;
    }
  }
  return book;
}

/// Apply one second of pre-drawn crowd flow to `b`: cancels, then limits, then market orders, then refill.
export function applyTick(
  b: Book,
  draws: TickDraws,
  fair: number[],
  t: number,
  spec: FlowSpec,
): { book: Book; fills: Fill[]; events: FlowEvent[] } {
  let book = b;
  const fills: Fill[] = [];
  const events: FlowEvent[] = [];
  for (const u of draws.cancels) {
    const o = nthCrowd(book, u);
    if (!o) continue;
    book = cancel(book, o.id);
    events.push({ t, kind: "cancel", side: o.side, price: o.price, size: o.size });
  }
  for (const l of draws.limits) {
    const side: Side = l.buy ? "buy" : "sell";
    const ask = bestAsk(book);
    const bid = bestBid(book);
    const price = l.buy
      ? Math.min(Math.floor(fair[t]) - l.dist, ask === null ? Infinity : ask - 1)
      : Math.max(Math.ceil(fair[t]) + l.dist, bid === null ? -Infinity : bid + 1);
    book = addLimit(book, { side, price, size: l.size, owner: "crowd", t }).book;
    events.push({ t, kind: "limit", side, price, size: l.size });
  }
  for (const m of draws.markets) {
    let side: Side | null = m.buy ? "buy" : "sell";
    const informed = m.informedU < spec.informedShare;
    if (informed) {
      const future = fair[Math.min(t + spec.horizon, fair.length - 1)];
      const ask = bestAsk(book);
      const bid = bestBid(book);
      side = ask !== null && future > ask + 0.5 ? "buy" : bid !== null && future < bid - 0.5 ? "sell" : null;
    }
    if (!side) {
      events.push({ t, kind: "skip", taker: "informed" });
      continue;
    }
    const taker = informed ? "informed" : "noise";
    const r = marketOrder(book, side, m.size, t, taker);
    book = r.book;
    fills.push(...r.fills);
    events.push({ t, kind: "market", side, size: r.filled, taker });
  }
  return { book: refill(book, spec, fair[t], t), fills, events };
}
