import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const market = await importSrc("features/hedging-desk/engine/market.math.ts");
const book = await importSrc("features/hedging-desk/engine/book.math.ts");
const risk = await importSrc("features/hedging-desk/engine/risk.math.ts");
const policy = await importSrc("features/hedging-desk/engine/policy.math.ts");
const objectives = await importSrc("features/hedging-desk/engine/objectives.math.ts");
const { missionById } = await importSrc("features/hedging-desk/engine/missions.data.ts");

const M = (id) => missionById(id);
const step = (s, mk, m, n = 1) => book.reduceDesk(s, { type: "step", days: n }, mk, m);
const order = (s, mk, m, id, side, qty) =>
  book.reduceDesk(s, { type: "order", order: { id, side, qty, tag: "manual" } }, mk, m);
const kinds = (s, kind) => s.events.filter((e) => e.kind === kind);

test("M1 path and daily policy are unchanged by event mechanics", () => {
  const m1 = M("M1");
  const mk = market.buildMarket(m1.market, 7);
  assert.equal(mk.gapDay, null);
  assert.ok(mk.iv.every((v) => v === 0.22));
  const r = policy.replayPolicy(m1, mk, 7, 1);
  assert.equal(r.pnl.toFixed(2), "-893.41");
  assert.equal(r.costs.toFixed(2), "71.54");
  assert.equal(r.breaches, 0);
  assert.equal(r.trades, 49);
});

test("M3 gap lands in its window, jumps, is deterministic and emitted once", () => {
  const m3 = M("M3");
  for (const seed of [1, 7, 42, 99]) {
    const mk = market.buildMarket(m3.market, seed);
    assert.deepEqual(mk, market.buildMarket(m3.market, seed));
    assert.ok(mk.gapDay >= 25 && mk.gapDay <= 35);
    assert.ok(Math.abs(mk.spot[mk.gapDay] / mk.spot[mk.gapDay - 1] - 1) >= 0.07);
    let s = book.startBook(m3, seed, mk);
    s = step(s, mk, m3, m3.market.days);
    const gaps = kinds(s, "gap");
    assert.equal(gaps.length, 1);
    assert.equal(gaps[0].day, mk.gapDay);
    assert.equal(Math.abs(gaps[0].move), 8);
  }
});

test("M4 IV shifts at D20 and vega is judged at D19's close", () => {
  const m4 = M("M4");
  const mk = market.buildMarket(m4.market, 7);
  assert.equal(mk.iv[19], 0.22);
  assert.equal(mk.iv[20], 0.3);
  let s = book.startBook(m4, 7, mk);
  s = step(s, mk, m4, 19);
  const vega = (st) => objectives.evaluateObjectives(m4, st, mk).find((o) => o.def.kind === "vegaLimitBy");
  assert.equal(vega(s).status, "onTrack");
  s = step(s, mk, m4, 1);
  assert.equal(vega(s).status, Math.abs(s.history[19].vega) <= 1500 ? "pass" : "fail");
  assert.equal(kinds(s, "ivShift").length, 1);
  assert.equal(kinds(s, "ivShift")[0].day, 20);
});

test("M2 charges $15 per ticket, rejects the 11th trade and options, and judges beatPolicy at expiry", () => {
  const m2 = M("M2");
  const mk = market.buildMarket(m2.market, 7);
  let s = book.startBook(m2, 7, mk);
  assert.equal(s.costsPaid, 50);
  const before = s.costsPaid;
  s = order(s, mk, m2, "STOCK", "buy", 100);
  assert.ok(Math.abs(s.costsPaid - before - (100 * 0.01 + 15)) < 1e-9);
  assert.equal(order(s, mk, m2, "C100", "buy", 1), s);
  for (let i = 0; i < 9; i++) s = order(s, mk, m2, "STOCK", i % 2 ? "buy" : "sell", 10);
  assert.equal(book.tradeCount(s), 10);
  const after = order(s, mk, m2, "STOCK", "buy", 10);
  assert.equal(book.tradeCount(after), 10);
  assert.equal(after.cash, s.cash);
  assert.equal(kinds(after, "rejected").length, 1);
  const beat = (st) => objectives.evaluateObjectives(m2, st, mk).find((o) => o.def.kind === "beatPolicy");
  assert.equal(beat(s).status, "onTrack");
  s = step(s, mk, m2, m2.market.days);
  assert.ok(["pass", "fail"].includes(beat(s).status));
});

test("M5 physical settlement delivers shares and keeps the P&L identity", () => {
  const m5 = M("M5");
  const seed = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].find((sd) => {
    const mk = market.buildMarket(m5.market, sd);
    return mk.spot[m5.market.days] > 100;
  });
  const mk = market.buildMarket(m5.market, seed);
  const flat = (pre) => {
    let s = book.startBook(m5, seed, mk);
    if (pre) s = order(s, mk, m5, "STOCK", "buy", 1000);
    const cashBefore = s.cash;
    s = step(s, mk, m5, m5.market.days);
    return { s, cashBefore };
  };
  const { s: naked } = flat(false);
  assert.equal(naked.positions.STOCK, -1000);
  assert.equal(naked.positions.C100, 0);
  assert.equal(kinds(naked, "assignment").length, 1);
  assert.equal(kinds(naked, "assignment")[0].shares, -1000);
  const ST = mk.spot[m5.market.days];
  assert.ok(Math.abs(risk.markToMarket(naked, mk) - (naked.cash + naked.positions.STOCK * ST)) < 1e-9);
  const status = (st) => objectives.evaluateObjectives(m5, st, mk).find((o) => o.def.kind === "flatStock").status;
  assert.equal(status(naked), "fail");
  const { s: hedged } = flat(true);
  assert.equal(hedged.positions.STOCK, 0);
  assert.equal(status(hedged), "pass");
  // Physical and cash settlement give the same P&L for the same trades.
  const cashM5 = { ...m5, settlement: "cash" };
  const viaCash = step(order(book.startBook(cashM5, seed, mk), mk, cashM5, "STOCK", "buy", 1000), mk, cashM5, 10);
  assert.ok(Math.abs(risk.markToMarket(viaCash, mk) - risk.markToMarket(hedged, mk)) < 1e-6);
});

test("M5 at-the-money expiry is not assigned", () => {
  const m5 = M("M5");
  const mk = market.buildMarket(m5.market, 7);
  const pinned = { ...mk, spot: mk.spot.map((v, i) => (i === m5.market.days ? 100 : v)) };
  const s = step(book.startBook(m5, 7, pinned), pinned, m5, m5.market.days);
  assert.equal(kinds(s, "assignment").length, 0);
  assert.equal(s.positions.STOCK, 0);
});
