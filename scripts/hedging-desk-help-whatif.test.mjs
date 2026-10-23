import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const wi = await importSrc("features/hedging-desk/help/whatIf.math.ts");
const market = await importSrc("features/hedging-desk/engine/market.math.ts");
const book = await importSrc("features/hedging-desk/engine/book.math.ts");
const { missionById } = await importSrc("features/hedging-desk/engine/missions.data.ts");

const setup = (id, seed = 7) => {
  const mission = missionById(id);
  const mk = market.buildMarket(mission.market, seed);
  return { mission, mk, state: book.startBook(mission, seed, mk) };
};
const scenarios = (id, ticket) => {
  const { mission, mk, state } = setup(id);
  const list = wi.whatIfScenarios(mission, state, mk, ticket);
  return Object.fromEntries(list.map((r) => [r.id, r]));
};

test("breachChance: zero gamma is all or nothing", () => {
  assert.equal(wi.breachChance(150, 0, 100, 0.0139, 100), 1);
  assert.equal(wi.breachChance(-50, 0, 100, 0.0139, 100), 0);
});

test("breachChance: symmetric short gamma needs a 2 sigma day", () => {
  const p = wi.breachChance(0, -36, 100, 0.0139, 100);
  assert.ok(p > 0.04 && p < 0.05, String(p));
});

test("M1 day 0: stock hedge buys 549 shares and lands in the band", () => {
  const r = scenarios("M1").stockHedge;
  assert.deepEqual(r.orders.map((o) => [o.id, o.side, o.qty]), [["STOCK", "buy", 549]]);
  assert.ok(r.inBand && r.verdicts.includes("fixesDelta"));
  assert.ok(Math.abs(r.cost - 5.49) < 0.01, String(r.cost));
  assert.ok(r.after.gamma < -30);
});

test("M1 day 0: buying the calls back closes the book", () => {
  const r = scenarios("M1").optionDelta;
  assert.deepEqual(r.orders.map((o) => [o.id, o.side, o.qty]), [["C100", "buy", 10]]);
  assert.ok(Math.abs(r.after.delta) < 1 && Math.abs(r.after.gamma) < 1e-6 && Math.abs(r.after.vega) < 1e-6);
  assert.ok(r.verdicts.includes("closesBook"));
  assert.ok(r.premium > 0);
});

test("M1 day 0: out-of-the-money calls need more contracts and cut gamma and vega", () => {
  const r = scenarios("M1").otmOptionDelta;
  assert.equal(r.orders[0].id, "C102.5");
  assert.ok(r.orders[0].qty > 10);
  assert.ok(r.after.gamma > r.before.gamma && r.verdicts.includes("cutsGamma"));
  assert.ok(Math.abs(r.after.vega) < Math.abs(r.before.vega));
});

test("M1 day 0: selling puts fixes delta but adds short gamma and short vega", () => {
  const r = scenarios("M1").shortOptionDelta;
  assert.equal(r.orders[0].id, "P100");
  assert.equal(r.orders[0].side, "sell");
  assert.ok(r.inBand && r.verdicts.includes("addsShortGamma"));
  assert.ok(r.after.vega < r.before.vega);
});

test("M1 day 0: gamma-neutral zeroes gamma, flattens delta and gives up theta", () => {
  const r = scenarios("M1").gammaNeutral;
  assert.ok(Math.abs(r.after.gamma) < 3);
  assert.ok(r.inBand && r.verdicts.includes("losesTheta"));
  assert.ok(r.orders.length >= 1 && r.orders[0].id === "C100");
});

test("M2: option scenarios are locked, the stock hedge pays the ticket fee", () => {
  const r = scenarios("M2");
  for (const id of ["optionDelta", "otmOptionDelta", "gammaNeutral", "shortOptionDelta", "closeOut"]) {
    assert.equal(r[id].block, "stockOnly", id);
  }
  assert.ok(r.stockHedge.cost >= 15 && !r.stockHedge.block);
});

test("settled book: every scenario is expired", () => {
  const { mission, mk, state } = setup("M1");
  const done = book.advanceDays(state, mk, mission, mk.days);
  assert.ok(done.settled);
  const list = wi.whatIfScenarios(mission, done, mk, { id: "STOCK", side: "buy", qty: 5 });
  assert.ok(list.every((r) => r.block === "expired"));
});

test("do nothing at day 0 is a certain breach; empty ticket is blocked", () => {
  const r = scenarios("M1");
  assert.ok(r.doNothing.breachChance > 0.999 && !r.doNothing.block);
  assert.equal(r.ticket.block, "emptyTicket");
});

test("ticket scenario applies the order", () => {
  const r = scenarios("M1", { id: "STOCK", side: "buy", qty: 549 }).ticket;
  assert.equal(r.block, undefined);
  assert.ok(r.inBand);
});

test("whatIfScenarios does not mutate the state", () => {
  const { mission, mk, state } = setup("M1");
  const copy = structuredClone(state);
  wi.whatIfScenarios(mission, state, mk, { id: "C100", side: "buy", qty: 3 });
  assert.deepEqual(state, copy);
});

test("no future reads: only today's market matters", () => {
  const { mission, mk, state } = setup("M3");
  const d = state.day;
  const alt = {
    ...mk,
    spot: mk.spot.map((x, i) => (i > d ? x * 1.3 : x)),
    iv: mk.iv.map((x, i) => (i > d ? x * 2 : x)),
    gapDay: 3,
  };
  const t = { id: "STOCK", side: "buy", qty: 100 };
  assert.deepEqual(wi.whatIfScenarios(mission, state, mk, t), wi.whatIfScenarios(mission, state, alt, t));
});

test("vega-neutral exists only for the vega mission", () => {
  for (const id of ["M1", "M2", "M3", "M5"]) assert.equal(scenarios(id).vegaNeutral, undefined, id);
  const v = scenarios("M4").vegaNeutral;
  assert.ok(v && Math.abs(v.after.vega) < Math.abs(v.before.vega));
});
