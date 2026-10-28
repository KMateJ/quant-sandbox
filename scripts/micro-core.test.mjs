import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const book = await importSrc("lib/market/book.ts");
const flow = await importSrc("lib/market/flow.ts");
const maker = await importSrc("lib/market/maker.ts");
const quotes = await importSrc("lib/market/quotes.ts");
const { makeRng, nextPoisson, nextExponential } = await importSrc("lib/math/random.ts");

const TICK = 0.01;
const sell = (b, price, size, t = 0) => book.addLimit(b, { side: "sell", price, size, owner: "crowd", t }).book;
const buy = (b, price, size, owner = "crowd", t = 0) => book.addLimit(b, { side: "buy", price, size, owner, t });

function askLadder() {
  let b = book.emptyBook();
  [318, 311, 518, 453, 400].forEach((s, i) => (b = sell(b, 10001 + i, s)));
  return buy(b, 9999, 500).book;
}

test("poisson and exponential draws", () => {
  const rng = makeRng(7);
  const n = 20000;
  let p = 0;
  let pBig = 0;
  let e = 0;
  for (let i = 0; i < n; i++) {
    p += nextPoisson(rng, 3);
    pBig += nextPoisson(rng, 50);
    e += nextExponential(rng, 2);
  }
  assert.ok(Math.abs(p / n - 3) < 0.05);
  assert.ok(Math.abs(pBig / n - 50) < 0.3);
  assert.ok(Math.abs(e / n - 0.5) < 0.02);
  assert.equal(nextPoisson(rng, 0), 0);
});

test("market buy walks the book with exact average", () => {
  const b = askLadder();
  const before = structuredClone(b);
  const r = book.marketOrder(b, "buy", 1600, 1, "noise");
  assert.deepEqual(b, before);
  assert.deepEqual(r.fills.map((f) => f.size), [318, 311, 518, 453]);
  const avg = r.avgPrice * TICK;
  const expected = (100.01 * 318 + 100.02 * 311 + 100.03 * 518 + 100.04 * 453) / 1600;
  assert.ok(Math.abs(avg - expected) < 1e-9);
  assert.equal(r.unfilled, 0);
  assert.equal(book.bestAsk(r.book), 10005);
  const p = book.previewMarket(b, "buy", 1600);
  assert.equal(p.avgPrice, r.avgPrice);
  assert.deepEqual(p.rows.map((x) => x.cum), [318, 629, 1147, 1600]);
  const thin = book.marketOrder(b, "buy", 5000, 1, "noise");
  assert.equal(thin.unfilled, 5000 - 2000);
  assert.equal(book.bestAsk(thin.book), null);
});

test("marketable limit stops at its price and rests the rest", () => {
  const r = buy(askLadder(), 10002, 1000, "you");
  assert.equal(r.fills.reduce((s, f) => s + f.size, 0), 629);
  assert.equal(book.bestBid(r.book), 10002);
  assert.equal(book.bestAsk(r.book), 10003);
  assert.equal(book.ordersOf(r.book, "you")[0].size, 371);
});

test("price-time priority, back of level, queueAhead, cancel", () => {
  let b = book.emptyBook();
  const a = buy(b, 9999, 100);
  const y = buy(a.book, 9999, 50, "you");
  b = buy(y.book, 9999, 70).book;
  assert.equal(book.queueAhead(b, y.id), 100);
  assert.equal(book.queueAhead(b, 999), null);
  const r = book.marketOrder(b, "sell", 120, 1, "noise");
  assert.equal(r.fills[0].makerId, a.id);
  assert.equal(r.fills[1].makerId, y.id);
  assert.equal(r.fills[1].size, 20);
  assert.equal(book.queueAhead(r.book, y.id), 0);
  assert.deepEqual(book.depth(r.book, "buy", 1), [{ price: 9999, size: 100, cum: 100 }]);
  assert.equal(book.ordersOf(book.cancelOwner(b, "you"), "you").length, 0);
  assert.equal(book.queueAhead(book.cancel(b, y.id), y.id), null);
  assert.equal(book.midTicks(askLadder()), 10000);
  assert.equal(book.spreadTicks(askLadder()), 2);
});

const spec = flow.DEFAULT_FLOW;

test("flow is seed-deterministic and action-independent", () => {
  assert.deepEqual(flow.flowSchedule(spec, 60, 42), flow.flowSchedule(spec, 60, 42));
  assert.deepEqual(flow.fairPath(spec, 60, 42), flow.fairPath(spec, 60, 42));
  assert.equal(flow.fairPath(spec, 60, 42).length, 60 + spec.horizon + 1);
  const jumped = flow.fairPath({ ...spec, jump: { t: 30, sizeTicks: 8 } }, 60, 42);
  assert.equal(Math.abs(jumped[30] - flow.fairPath(spec, 60, 42)[30]), 8);
});

function run(s, seconds, seed, withYou) {
  const fair = flow.fairPath(s, seconds, seed);
  const draws = flow.flowSchedule(s, seconds, seed);
  let b = flow.seedBook(s, fair[0], seed);
  let youId = null;
  if (withYou) {
    const r = buy(b, book.bestBid(b) - 6, 100, "you");
    b = r.book;
    youId = r.id;
  }
  const all = [];
  for (let t = 0; t < seconds; t++) {
    const r = flow.applyTick(b, draws[t], fair, t, s);
    b = r.book;
    all.push(r);
    assert.ok(b.bids.length >= 3 && b.asks.length >= 3, `levels at t=${t}`);
    assert.ok(book.bestBid(b) < book.bestAsk(b), `crossed at t=${t}`);
  }
  return { b, all, fair, youId };
}

test("seeded book, crowd never cancels you, book stays alive", () => {
  const b0 = flow.seedBook(spec, 10000, 5);
  assert.equal(b0.bids.length, spec.levels);
  assert.equal(book.spreadTicks(b0), 1);
  const { b, youId } = run({ ...spec, marketRate: 0 }, 300, 5, true);
  assert.ok(book.queueAhead(b, youId) !== null);
});

test("informed takers trade toward future fair value", () => {
  const s = { ...spec, informedShare: 1, horizon: 5 };
  const b0 = flow.seedBook(s, 10000, 1);
  const draws = { limits: [], cancels: [], markets: [{ informedU: 0.5, buy: false, size: 100 }] };
  const at = (future) => flow.applyTick(b0, draws, [10000, 0, 0, 0, 0, future], 0, s).events[0];
  assert.deepEqual([at(10003).side, at(10003).taker], ["buy", "informed"]);
  assert.equal(at(9997).side, "sell");
  assert.equal(at(10000).kind, "skip");
});

test("900 ticks under 500 ms", () => {
  const t0 = performance.now();
  run(spec, 900, 3, false);
  const ms = performance.now() - t0;
  console.log(`  900 ticks: ${ms.toFixed(0)} ms`);
  assert.ok(ms < 500);
});

test("ledger worked example and identity", () => {
  let l = maker.applyFill(maker.emptyLedger(), { t: 0, side: "buy", price: 99.99, size: 100, mid: 100, fee: 0 });
  const parts = maker.decompose(l, (t) => (t === 0 ? 100 : 99.95), 10, 2);
  assert.ok(Math.abs(parts.spread - 1) < 1e-9);
  assert.ok(Math.abs(parts.adverse + 5) < 1e-9);
  assert.ok(Math.abs(parts.inventory) < 1e-9);
  assert.ok(Math.abs(parts.total + 4) < 1e-9);

  const rng = makeRng(9);
  const mids = Array.from({ length: 101 }, (_, t) => 100 + Math.sin(t / 7) + rng() * 0.1);
  l = maker.emptyLedger();
  for (let i = 0; i < 200; i++) {
    const t = Math.floor(rng() * 100);
    l = maker.applyFill(l, {
      t, side: rng() < 0.5 ? "buy" : "sell", price: mids[t] + (rng() - 0.5) * 0.1,
      size: 1 + Math.floor(rng() * 100), mid: mids[t], fee: (rng() - 0.5) * 0.2,
    });
  }
  const p = maker.decompose(l, (t) => mids[t], 100, 5);
  assert.ok(Math.abs(p.spread + p.adverse + p.inventory + p.fees - p.total) < 1e-6);
  assert.ok(Math.abs(p.total - maker.pnlTotal(l, mids[100])) < 1e-9);
});

test("quoting formulas", () => {
  assert.ok(Math.abs(quotes.asTotalSpread(0.1, 2, 1.5, 1) - 1.6908) < 1e-4);
  const q0 = quotes.asQuotes({ s: 100, q: 0, gamma: 0.1, sigma: 2, k: 1.5, tLeft: 1 });
  const q5 = quotes.asQuotes({ s: 100, q: 5, gamma: 0.1, sigma: 2, k: 1.5, tLeft: 1 });
  assert.equal(q0.reservation, 100);
  assert.ok(q5.reservation < q0.reservation && q5.ask < q0.ask);
  assert.ok(Math.abs(q0.ask - q0.bid - 1.6908) < 1e-4);
  const k = 1.5;
  let best = 0;
  for (let d = 0.01; d < 3; d += 0.01) {
    if (quotes.expectedSpreadIncome(d, 1, k) > quotes.expectedSpreadIncome(best, 1, k)) best = d;
  }
  assert.ok(Math.abs(best - quotes.incomeMaximisingDelta(k)) < 0.011);
});
