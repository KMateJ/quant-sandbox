import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/hedging-desk/engine/";
const book = await importSrc(`${E}book.math.ts`);
const { buildMarket } = await importSrc(`${E}market.math.ts`);
const { quoteInstrument, tauAt } = await importSrc(`${E}pricing.math.ts`);
const risk = await importSrc(`${E}risk.math.ts`);
const { MISSIONS, missionById } = await importSrc(`${E}missions.data.ts`);
const { evaluateObjectives } = await importSrc(`${E}objectives.math.ts`);
const { replayPolicy } = await importSrc(`${E}policy.math.ts`);
const { DEFAULT_COSTS } = await importSrc(`${E}desk.config.ts`);
const bs = await importSrc("features/black-scholes/blackScholes.math.ts");

const M1 = missionById("M1");
const market = buildMarket(M1.market, 7);
const step = (s, n = 1) => book.reduceDesk(s, { type: "step", days: n }, market, M1);
const hedge = (s) => book.reduceDesk(s, { type: "autoHedge" }, market, M1);
const runDaily = () => {
  let s = book.startBook(M1, 7, market);
  for (let i = 0; i < 63; i++) s = step(hedge(s));
  return s;
};
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o)) deepFreeze(v);
  }
  return o;
};

test("1. market is deterministic per seed", () => {
  assert.deepEqual(buildMarket(M1.market, 7), market);
  assert.notDeepEqual(buildMarket(M1.market, 8).spot, market.spot);
  assert.equal(market.spot.length, 64);
  assert.equal(market.gapDay, null);
});

test("2. quotes match Black–Scholes with a symmetric spread", () => {
  const q = quoteInstrument("C100", 103, 0.2, 0.22, 0.03, DEFAULT_COSTS);
  assert.equal(q.mid, bs.blackScholesCall(103, 100, 0.2, 0.03, 0.22));
  assert.ok(Math.abs(q.ask - q.bid - 2 * q.half) < 1e-12);
  const exp = quoteInstrument("C100", 103, 0, 0.22, 0.03, DEFAULT_COSTS);
  assert.equal(exp.mid, 3);
  assert.equal(exp.half, 0);
  const p = quoteInstrument("P97.5", 101, 0.2, 0.22, 0.03, DEFAULT_COSTS);
  const c = quoteInstrument("C97.5", 101, 0.2, 0.22, 0.03, DEFAULT_COSTS);
  assert.ok(Math.abs(c.mid - p.mid - (101 - 97.5 * Math.exp(-0.03 * 0.2))) < 1e-9);
});

test("3. opening trade fills at the bid", () => {
  const s = book.startBook(M1, 7, market);
  const q = quoteInstrument("C100", 100, tauAt(0, 63), 0.22, 0.03, DEFAULT_COSTS);
  assert.ok(Math.abs(s.cash - 1000 * q.bid) < 1e-9);
  assert.ok(s.cash > 0);
  assert.ok(Math.abs(s.costsPaid - 50) < 1e-9);
  assert.equal(s.positions.C100, -10);
  assert.ok(Math.abs(s.openDelta + 1000 * q.delta) < 1e-9);
  assert.equal(s.events[0].kind, "start");
});

test("4. accounting identity after settlement", () => {
  let s = book.startBook(M1, 7, market);
  const orders = [["STOCK", "buy", 300], ["P95", "buy", 3], ["C105", "sell", 2], ["STOCK", "sell", 40]];
  for (let d = 0; d < 63; d++) {
    const [id, side, qty] = orders[d % orders.length];
    if (d % 5 === 0) s = book.applyOrder(s, market, M1, { id, side, qty, tag: "manual" });
    s = step(s);
  }
  assert.ok(s.settled);
  assert.ok(Math.abs(risk.markToMarket(s, market) - (s.cash + s.positions.STOCK * market.spot[63])) < 1e-6);
  assert.equal(s.events.filter((e) => e.kind === "expiry").length, 1);
});

test("5. daily auto-hedge keeps delta inside the band", () => {
  const s = runDaily();
  assert.equal(s.breaches, 0);
  assert.ok(Number.isFinite(risk.markToMarket(s, market)));
});

test("6. no hedge breaches the band", () => {
  assert.ok(step(book.startBook(M1, 7, market), 63).breaches > 0);
});

test("7. invalid orders are no-ops", () => {
  const s0 = book.startBook(M1, 7, market);
  for (const qty of [0, -1, 1.5]) assert.equal(book.applyOrder(s0, market, M1, { id: "STOCK", side: "buy", qty, tag: "manual" }), s0);
  const done = step(s0, 100);
  assert.equal(done.day, 63);
  assert.equal(book.applyOrder(done, market, M1, { id: "STOCK", side: "buy", qty: 1, tag: "manual" }), done);
  assert.equal(step(done), done);
});

test("8. scenario centre is zero and profile middle is the mark", () => {
  const s = step(book.startBook(M1, 7, market), 10);
  const grid = risk.scenarioGrid(s, market, [-0.05, 0, 0.05], [-0.05, 0, 0.05]);
  assert.ok(Math.abs(grid[1][1]) < 1e-9);
  assert.ok(Math.abs(risk.riskProfile(s, market)[20].now - risk.markToMarket(s, market)) < 1e-6);
  assert.equal(risk.realizedVol(market.spot, 1), null);
  assert.ok(risk.realizedVol(market.spot, 30) > 0);
});

test("9. M1 objectives", () => {
  const s0 = book.startBook(M1, 7, market);
  assert.deepEqual(evaluateObjectives(M1, s0, market).map((r) => r.status), ["onTrack", "onTrack", "onTrack"]);
  assert.equal(evaluateObjectives(M1, { ...s0, breaches: 4 }, market)[0].status, "fail");
  const end = runDaily();
  const pnl = evaluateObjectives(M1, end, market)[1];
  assert.equal(pnl.status, Math.abs(pnl.value) <= 400 ? "pass" : "fail");
});

test("10. engine never mutates its input", () => {
  const s = deepFreeze(book.startBook(M1, 7, market));
  deepFreeze(market);
  book.applyOrder(s, market, M1, { id: "STOCK", side: "buy", qty: 10, tag: "manual" });
  book.advanceDays(s, market, M1, 63);
});

test("11. replayPolicy matches the hand-rolled daily policy", () => {
  const s = runDaily();
  const r = replayPolicy(M1, market, 7, 1);
  assert.ok(Math.abs(r.pnl - risk.markToMarket(s, market)) < 1e-9);
  assert.equal(r.breaches, s.breaches);
  assert.equal(r.trades, book.tradeCount(s));
  assert.equal(r.series.length, 63);
});

test("12. every objective kind evaluates", () => {
  const s0 = book.startBook(M1, 7, market);
  const end = runDaily();
  const ev = (def, s, m = market) => evaluateObjectives({ ...M1, objectives: [def] }, s, m)[0];
  assert.equal(ev({ kind: "maxBreaches", limit: 0 }, end).status, "pass");
  assert.equal(ev({ kind: "maxBreaches", limit: 2 }, { ...s0, breaches: 2 }).status, "atRisk");
  assert.equal(ev({ kind: "costsBelow", limit: 55 }, s0).status, "atRisk");
  assert.equal(ev({ kind: "costsBelow", limit: 10 }, s0).status, "fail");
  assert.equal(ev({ kind: "maxTrades", limit: 5 }, end).status, "fail");
  assert.equal(ev({ kind: "maxTrades", limit: 5 }, s0).status, "onTrack");
  assert.equal(ev({ kind: "pnlAbove", limit: -1e9 }, end).status, "pass");
  assert.equal(ev({ kind: "pnlAbove", limit: 1e9 }, s0).status, "atRisk");
  assert.equal(ev({ kind: "gammaLimitFrom", limit: 0, fromDay: 0 }, end).status, "fail");
  assert.equal(ev({ kind: "gammaLimitFrom", limit: 1e9, fromDay: 0 }, end).status, "pass");
  assert.equal(ev({ kind: "gapLoss", limit: 100 }, end).value, 0);
  const gapped = { ...market, gapDay: 20 };
  const g = ev({ kind: "gapLoss", limit: 1e9 }, end, gapped);
  assert.ok(Math.abs(g.value - (end.history[20].pnl - end.history[19].pnl)) < 1e-9);
  assert.equal(ev({ kind: "vegaLimitBy", limit: 1e9, byDay: 10 }, s0).status, "onTrack");
  assert.equal(ev({ kind: "vegaLimitBy", limit: 0, byDay: 10 }, end).status, "fail");
  assert.equal(ev({ kind: "beatPolicy", every: 1 }, s0).status, "onTrack");
  assert.equal(ev({ kind: "beatPolicy", every: 1 }, end).status, "pass");
  assert.equal(ev({ kind: "flatStock" }, s0).status, "onTrack");
  assert.equal(ev({ kind: "flatStock" }, end).status, end.positions.STOCK === 0 ? "pass" : "fail");
  assert.equal(MISSIONS[0], M1);
});
