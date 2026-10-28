import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/market-making-desk/engine/";
const { MM_MISSIONS, mmMissionById } = await importSrc(`${E}missions.data.ts`);
const { mmMarket } = await importSrc(`${E}market.math.ts`);
const { startMm, reduceMm } = await importSrc(`${E}book.math.ts`);
const { evaluateMm, mmPnlParts, mmPnl } = await importSrc(`${E}objectives.math.ts`);
const { replayMm } = await importSrc(`${E}policy.math.ts`);
const { queueAhead, ordersOf, bestBid } = await importSrc("lib/market/book.ts");
const { flowSchedule } = await importSrc("lib/market/flow.ts");

const MM1 = mmMissionById("MM1");
const market = mmMarket(MM1, 7);
const run = (s, actions, mission = MM1, mk = market) => actions.reduce((x, a) => reduceMm(x, a, mission, mk), s);
const quote = (q = {}) => ({ type: "setQuote", quote: { live: true, auto: true, ...q } });
const step = (ticks) => ({ type: "step", ticks });

test("five missions with objectives", () => {
  assert.deepEqual(MM_MISSIONS.map((m) => m.id), ["MM1", "MM2", "MM3", "MM4", "MM5"]);
  for (const m of MM_MISSIONS) assert.ok(m.objectives.length > 0);
});

test("determinism and action-independent crowd", () => {
  const acts = [quote(), step(50), { type: "hedge", size: 100 }, quote({ bidOffset: 2 }), step(50)];
  assert.deepEqual(run(startMm(MM1, 7, market), acts), run(startMm(MM1, 7, mmMarket(MM1, 7)), acts));
  assert.deepEqual(market.schedule, flowSchedule(MM1.flow, MM1.seconds, 7));
  run(startMm(MM1, 7, market), acts);
  assert.deepEqual(market.schedule, mmMarket(MM1, 7).schedule);
});

test("immutability", () => {
  const s = run(startMm(MM1, 7, market), [quote(), step(20)]);
  const before = structuredClone(s);
  run(s, [step(30), { type: "hedge", size: 500 }, { type: "pull" }]);
  assert.deepEqual(s, before);
});

test("re-quoting puts you at the back of the queue", () => {
  let s = run(startMm(MM1, 7, market), [quote({ auto: false })]);
  const bidId = () => ordersOf(s.book, "you").find((o) => o.side === "buy").id;
  s = run(s, [step(3)]);
  const ahead = queueAhead(s.book, bidId());
  s = run(s, [quote({ auto: false })]);
  const after = queueAhead(s.book, bidId());
  assert.ok(after >= ahead);
  assert.equal(ordersOf(s.book, "you").find((o) => o.side === "buy").price <= bestBid(s.book), true);
});

test("maker fills: side, rebate, ledger", () => {
  const s = run(startMm(MM1, 7, market), [quote(), step(200)]);
  const fills = s.events.filter((e) => e.kind === "fill");
  assert.ok(fills.length > 5);
  const net = fills.reduce((a, f) => a + (f.side === "buy" ? f.size : -f.size), 0);
  assert.equal(s.ledger.inventory, net);
  const vol = fills.reduce((a, f) => a + f.size, 0);
  assert.ok(Math.abs(s.ledger.fees - vol * MM1.rebate) < 1e-9);
});

test("hedge pays the taker fee and moves toward flat", () => {
  let s = run(startMm(MM1, 7, market), [quote(), step(200)]);
  for (let i = 0; s.ledger.inventory === 0 && i < 50; i++) s = run(s, [step(5)]);
  const inv = s.ledger.inventory;
  assert.notEqual(inv, 0);
  const h = run(s, [{ type: "hedge", size: Math.abs(inv) }]);
  const ev = h.events.at(-1);
  assert.equal(ev.kind, "hedge");
  assert.ok(Math.abs(h.ledger.inventory) < Math.abs(inv));
  assert.ok(Math.abs(h.ledger.fees - (s.ledger.fees - MM1.takerFee * ev.size)) < 1e-9);
});

test("breaches once per crossing and hard stop beyond 1.5 × limit", () => {
  const m = { ...MM1, limit: 300, flow: { ...MM1.flow, buyShare: 0.9 } };
  const mk = mmMarket(m, 3);
  const s = run(startMm(m, 3, mk), [quote(), step(600)], m, mk);
  let crossings = 0;
  let prev = 0;
  for (const h of s.hist) {
    if (Math.abs(h.inv) > m.limit && Math.abs(prev) <= m.limit) crossings++;
    prev = h.inv;
    assert.ok(Math.abs(h.inv) <= 1.5 * m.limit + m.quoteSize);
  }
  assert.ok(s.breaches >= 1);
  assert.equal(s.breaches, s.events.filter((e) => e.kind === "limitBreach").length);
  assert.ok(s.breaches >= crossings);
});

test("news jump at t = 300", () => {
  const m = mmMissionById("MM4");
  const mk = mmMarket(m, 5);
  assert.equal(Math.abs(mk.jump), 8);
  const s = run(startMm(m, 5, mk), [step(301)], m, mk);
  const news = s.events.find((e) => e.kind === "news");
  assert.equal(news.t, 300);
  assert.equal(news.jump, mk.jump);
});

test("finished replay: decompose identity, settled, end event", () => {
  const { state, pnl } = replayMm(MM1, 7, "join", market);
  assert.ok(state.settled);
  assert.equal(state.hist.length, MM1.seconds + 1);
  assert.equal(state.events.at(-1).kind, "end");
  const p = mmPnlParts(MM1, state);
  assert.ok(Math.abs(p.spread + p.adverse + p.inventory + p.fees - p.total) < 1e-6);
  assert.ok(Math.abs(p.total - pnl) < 1e-6);
  assert.deepEqual(reduceMm(state, step(5), MM1, market), state);
  assert.equal(ordersOf(state.book, "you").length, 0);
});

test("objectives per kind", () => {
  const live = startMm(MM1, 7, market);
  assert.deepEqual(evaluateMm(MM1, live).map((r) => r.status), ["atRisk", "atRisk"]);
  const flat = run(live, [step(600)]);
  assert.deepEqual(evaluateMm(MM1, flat).map((r) => r.status), ["fail", "pass"]);
  const mk = (kind, extra) => ({ ...MM1, objectives: [{ kind, ...extra }] });
  const { state } = replayMm(MM1, 7, "join", market);
  const pnl = mmPnl(state);
  assert.equal(evaluateMm(mk("beatPolicy", { policy: "as" }), state, pnl - 1)[0].status, "pass");
  assert.equal(evaluateMm(mk("beatPolicy", { policy: "as" }), state, pnl + 1)[0].status, "fail");
  assert.equal(evaluateMm(mk("maxDrawdown", { limit: state.mdd + 1 }), state)[0].status, "pass");
  assert.equal(evaluateMm(mk("maxDrawdown", { limit: state.mdd - 1 }), state)[0].status, "fail");
  const adverse = -mmPnlParts(MM1, state).adverse;
  assert.equal(evaluateMm(mk("adverseCap", { limit: adverse + 1 }), state)[0].status, "pass");
  assert.equal(evaluateMm(mk("adverseCap", { limit: adverse - 1 }), state)[0].status, "fail");
});

test("replay of 600 ticks under 300 ms", () => {
  const t0 = performance.now();
  replayMm(MM1, 11, "as");
  assert.ok(performance.now() - t0 < 300);
});
