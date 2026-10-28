import { addLimit, cancel, cancelOwner, marketOrder, midTicks, ordersOf } from "../../../lib/market/book";
import { applyTick } from "../../../lib/market/flow";
import { applyFill, emptyLedger, pnlTotal } from "../../../lib/market/maker";
import type { Book, Side } from "../../../lib/market/market.types";
import { missionFlow } from "./market.math";
import type { MmAction, MmEvent, MmMarket, MmMission, MmQuote, MmState, MmTrade } from "./mm.types";

const SIDES: readonly Side[] = ["buy", "sell"];
/// Auto re-quote only when the target moved more than this many ticks (keeps queue priority).
const REQUOTE_TICKS = 1;
/// A side stops quoting when its next full fill would push |inventory| past this multiple of the limit.
const HARD_STOP = 1.5;
/// Trades kept on the public tape.
const TAPE = 30;

const sgn = (side: Side) => (side === "buy" ? 1 : -1);
const flip = (side: Side): Side => (side === "buy" ? "sell" : "buy");

/// Mid of the crowd's book in ticks (your own orders excluded so quotes do not chase themselves).
export function crowdMid(book: Book, fallback: number): number {
  return midTicks(cancelOwner(book, "you")) ?? midTicks(book) ?? fallback;
}

/// Bid and ask prices in ticks that `quote` targets around `mid` (ticks).
export function quotePrices(mid: number, quote: Pick<MmQuote, "bidOffset" | "askOffset">) {
  return { bid: Math.floor(mid - quote.bidOffset), ask: Math.ceil(mid + quote.askOffset) };
}

/// Your target price in ticks for `side` given the quote offsets.
function target(book: Book, quote: MmQuote, side: Side, fallback: number): number {
  const p = quotePrices(crowdMid(book, fallback), quote);
  return side === "buy" ? p.bid : p.ask;
}

const allowed = (side: Side, inv: number, mission: MmMission, size: number) =>
  Math.abs(inv + sgn(side) * size) <= HARD_STOP * mission.limit;

const mine = (book: Book, side: Side) => ordersOf(book, "you").find((o) => o.side === side);

function placeSide(book: Book, side: Side, s: MmState, mission: MmMission, fair: number): Book {
  const old = mine(book, side);
  const cleared = old ? cancel(book, old.id) : book;
  if (!s.quote.live || !allowed(side, s.ledger.inventory, mission, s.quote.size)) return cleared;
  const price = target(cleared, s.quote, side, fair);
  return addLimit(cleared, { side, price, size: s.quote.size, owner: "you", t: s.t }).book;
}

/// Keep resting quotes in line after a tick; returns the new book and whether anything was re-placed.
function maintain(book: Book, s: MmState, mission: MmMission, fair: number): { book: Book; requoted: boolean } {
  let out = book;
  let requoted = false;
  for (const side of SIDES) {
    const o = mine(out, side);
    const ok = s.quote.live && allowed(side, s.ledger.inventory, mission, s.quote.size);
    if (!ok) {
      if (o) out = cancel(out, o.id);
      continue;
    }
    if (!s.quote.auto) continue;
    if (!o || Math.abs(o.price - target(out, s.quote, side, fair)) > REQUOTE_TICKS) {
      out = placeSide(out, side, { ...s, book: out }, mission, fair);
      requoted = true;
    }
  }
  return { book: out, requoted };
}

function snapshot(s: MmState, mission: MmMission, fair: number) {
  const tick = mission.flow.tick;
  const mid = crowdMid(s.book, fair) * tick;
  const pnl = pnlTotal(s.ledger, mid);
  const price = (side: Side) => {
    const o = mine(s.book, side);
    return o ? o.price * tick : null;
  };
  return { t: s.t, mid, inv: s.ledger.inventory, pnl, bid: price("buy"), ask: price("sell") };
}

/// Opening state: flat, no quotes, the market's opening book.
export function startMm(mission: MmMission, seed: number, market: MmMarket): MmState {
  const s: MmState = {
    missionId: mission.id,
    seed,
    t: 0,
    book: market.book0,
    ledger: emptyLedger(),
    quote: { bidOffset: 0.5, askOffset: 0.5, size: mission.quoteSize, live: false, auto: true },
    peak: 0,
    mdd: 0,
    breaches: 0,
    informedFills: 0,
    hist: [],
    tape: [],
    events: [{ t: 0, kind: "start" }],
    settled: false,
  };
  return { ...s, hist: [snapshot(s, mission, market.fair[0])] };
}

function stepOne(s: MmState, mission: MmMission, market: MmMarket): MmState {
  const { t } = s;
  const tick = mission.flow.tick;
  const preMid = s.hist[s.hist.length - 1].mid;
  const r = applyTick(s.book, market.schedule[t], market.fair, t, missionFlow(mission));
  const events: MmEvent[] = [];
  let ledger = s.ledger;
  let informedFills = s.informedFills;
  let breaches = s.breaches;
  const trades: MmTrade[] = r.fills.map((f) => ({ t, side: f.side, price: f.price * tick, size: f.size, you: f.makerOwner === "you" }));
  for (const f of r.fills) {
    if (f.makerOwner !== "you") continue;
    const side = flip(f.side);
    const was = Math.abs(ledger.inventory) > mission.limit;
    ledger = applyFill(ledger, { t, side, price: f.price * tick, size: f.size, mid: preMid, fee: mission.rebate * f.size });
    events.push({ t, kind: "fill", side, price: f.price * tick, size: f.size });
    if (f.taker === "informed") informedFills += 1;
    if (!was && Math.abs(ledger.inventory) > mission.limit) {
      breaches += 1;
      events.push({ t, kind: "limitBreach", inventory: ledger.inventory });
    }
  }
  if (mission.news && t === mission.news.t) events.push({ t, kind: "news", jump: market.jump });
  const next: MmState = { ...s, t: t + 1, book: r.book, ledger, informedFills, breaches };
  const fair = market.fair[t + 1];
  const m = maintain(next.book, next, mission, fair);
  if (m.requoted) events.push({ t, kind: "requote" });
  let out: MmState = { ...next, book: m.book };
  const settled = out.t >= mission.seconds;
  if (settled) out = { ...out, book: cancelOwner(out.book, "you"), quote: { ...out.quote, live: false } };
  const h = snapshot(out, mission, fair);
  const peak = Math.max(s.peak, h.pnl);
  if (settled) events.push({ t: out.t, kind: "end", pnl: h.pnl });
  return {
    ...out,
    peak,
    mdd: Math.max(s.mdd, peak - h.pnl),
    hist: [...s.hist, h],
    tape: [...s.tape, ...trades].slice(-TAPE),
    events: [...s.events, ...events],
    settled,
  };
}

function hedge(s: MmState, size: number, mission: MmMission, market: MmMarket): MmState {
  const inv = s.ledger.inventory;
  const qty = Math.min(Math.max(0, Math.round(size)), Math.abs(inv));
  if (qty === 0) return s;
  const side: Side = inv > 0 ? "sell" : "buy";
  const own = mine(s.book, flip(side));
  const book = own ? cancel(s.book, own.id) : s.book;
  const r = marketOrder(book, side, qty, s.t, "you");
  if (r.filled === 0 || r.avgPrice === null) return s;
  const tick = mission.flow.tick;
  const avg = r.avgPrice * tick;
  const mid = s.hist[s.hist.length - 1].mid;
  const ledger = applyFill(s.ledger, { t: s.t, side, price: avg, size: r.filled, mid, fee: -mission.takerFee * r.filled });
  const trades: MmTrade[] = r.fills.map((f) => ({ t: s.t, side, price: f.price * tick, size: f.size, you: true }));
  const next = { ...s, book: r.book, ledger, tape: [...s.tape, ...trades].slice(-TAPE) };
  const hist = [...s.hist.slice(0, -1), snapshot(next, mission, market.fair[s.t])];
  return { ...next, hist, events: [...s.events, { t: s.t, kind: "hedge", side, size: r.filled, avg }] };
}

/// The desk reducer; pure, deterministic per (mission, seed, actions). Settled states only accept `restore`.
export function reduceMm(s: MmState, a: MmAction, mission: MmMission, market: MmMarket): MmState {
  if (a.type === "restore") return a.state;
  if (s.settled) return s;
  const fair = market.fair[s.t];
  switch (a.type) {
    case "setQuote": {
      const quote = { ...s.quote, ...a.quote };
      quote.bidOffset = Math.max(0.5, quote.bidOffset);
      quote.askOffset = Math.max(0.5, quote.askOffset);
      let next: MmState = { ...s, quote };
      for (const side of SIDES) next = { ...next, book: placeSide(next.book, side, next, mission, fair) };
      return { ...next, hist: [...s.hist.slice(0, -1), snapshot(next, mission, fair)] };
    }
    case "pull": {
      const next = { ...s, book: cancelOwner(s.book, "you"), quote: { ...s.quote, live: false } };
      const hist = [...s.hist.slice(0, -1), snapshot(next, mission, fair)];
      return { ...next, hist, events: [...s.events, { t: s.t, kind: "pulled" }] };
    }
    case "hedge":
      return hedge(s, a.size, mission, market);
    case "step": {
      let out = s;
      for (let i = 0; i < a.ticks && !out.settled; i++) out = stepOne(out, mission, market);
      return out;
    }
    default: {
      const never: never = a;
      return never;
    }
  }
}
