import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/hedging-desk/";
const { deskAdvice } = await importSrc(D + "help/advice.math.ts");
const { ADVICE_IDS } = await importSrc(D + "help/advice.types.ts");
const { adviceTitleKey, adviceBodyKey } = await importSrc(D + "help/adviceCopy.ts");
const { formatAdviceVars } = await importSrc(D + "help/adviceVars.ts");
const { reduceDesk, startBook } = await importSrc(D + "engine/book.math.ts");
const { buildMarket } = await importSrc(D + "engine/market.math.ts");
const { missionById } = await importSrc(D + "engine/missions.data.ts");
const en = { ...(await importSrc("Language/index.en.ts")).en, ...(await importSrc("Language/desks.en.ts")).desksEn };
const hu = { ...(await importSrc("Language/index.hu.ts")).hu, ...(await importSrc("Language/desks.hu.ts")).desksHu };

const SEED = 7;
const setup = (id) => {
  const mission = missionById(id);
  const market = buildMarket(mission.market, SEED);
  return { mission, market, state: startBook(mission, SEED, market) };
};
const run = (ctx, ...actions) => {
  let s = ctx.state;
  for (const a of actions) s = reduceDesk(s, a, ctx.market, ctx.mission);
  return { ...ctx, state: s };
};
const advice = (ctx) => deskAdvice(ctx.mission, ctx.state, ctx.market);
const find = (list, id) => list.find((a) => a.id === id);
const step = (days) => ({ type: "step", days });
const hedge = { type: "autoHedge" };

test("M1 day 0: outsideBand first, buy 549 shares, firstHedge present", () => {
  const list = advice(setup("M1"));
  assert.equal(list[0].id, "outsideBand");
  assert.equal(list[0].tone, "urgent");
  assert.equal(list[0].vars.qty, 549);
  assert.deepEqual(list[0].action, { kind: "ticket", id: "STOCK", side: "buy", qty: 549 });
  assert.ok(find(list, "firstHedge"));
  assert.equal(find(list, "firstHedge").vars.perDollar, 549);
});

test("after autoHedge: no outsideBand, inBand present", () => {
  const list = advice(run(setup("M1"), hedge));
  assert.equal(find(list, "outsideBand"), undefined);
  assert.ok(find(list, "inBand"));
});

test("a manual sell of 300 shares triggers wrongWay", () => {
  const list = advice(run(setup("M1"), { type: "order", order: { id: "STOCK", side: "sell", qty: 300, tag: "manual" } }));
  const w = find(list, "wrongWay");
  assert.ok(w);
  assert.equal(w.tone, "urgent");
  assert.equal(w.vars.before, -549);
  assert.equal(w.vars.after, -849);
  assert.equal(find(list, "outsideBand").action.qty, 849);
});

test("M2: optionsLocked and ticketFee; noTradesLeft after ten hedges", () => {
  const ctx = setup("M2");
  const first = advice(ctx);
  assert.ok(find(first, "optionsLocked"));
  assert.ok(find(first, "ticketFee"));
  let c = ctx;
  for (let i = 0; i < 10; i++) c = run(c, hedge, step(1));
  const list = advice(c);
  const n = find(list, "noTradesLeft");
  assert.ok(n);
  assert.equal(n.tone, "urgent");
  const o = find(list, "outsideBand");
  if (o) assert.equal(o.action, undefined);
});

test("M3 day 20 with stock hedges only: gammaDeadline urgent with call contracts; gapWindow from day 22", () => {
  let c = setup("M3");
  c = run(c, hedge, step(20));
  c = run(c, hedge);
  const list = advice(c);
  const g = find(list, "gammaDeadline");
  assert.ok(g);
  assert.equal(g.tone, "urgent");
  assert.ok(g.vars.contracts > 0);
  assert.equal(g.action.kind, "ticket");
  assert.equal(g.action.side, "buy");
  assert.match(g.action.id, /^C\d/);
  assert.equal(find(list, "gapWindow"), undefined);
  const later = advice(run(c, step(2)));
  assert.ok(find(later, "gapWindow"));
  assert.ok(find(later, "gapWindow").vars.loss > 0);
});

test("M4 day 0: ivShiftAhead points at day 20", () => {
  const a = find(advice(setup("M4")), "ivShiftAhead");
  assert.ok(a);
  assert.equal(a.vars.day, 20);
  assert.equal(a.vars.iv, 30);
});

test("M5 at day 8: pinRisk", () => {
  const c = run(setup("M5"), step(8));
  const p = find(advice(c), "pinRisk");
  assert.ok(p);
  assert.equal(p.tone, "urgent");
  assert.equal(p.vars.net, p.vars.held - p.vars.shares);
});

test("a settled book returns expired first", () => {
  const c = run(setup("M1"), hedge, step(63));
  assert.equal(c.state.settled, true);
  const list = advice(c);
  assert.equal(list[0].id, "expired");
  assert.equal(list[0].action.kind, "screen");
});

test("advice never reads the future path", () => {
  for (const id of ["M1", "M2", "M3", "M4", "M5"]) {
    for (const day of [0, 3, 22, 30]) {
      const base = setup(id);
      if (day >= base.market.days) continue;
      const c = run(base, hedge, step(day));
      const d = c.state.day;
      const other = {
        ...c.market,
        spot: c.market.spot.map((x, i) => (i <= d ? x : x * 1.37 + 5)),
        iv: c.market.iv.map((x, i) => (i <= d ? x : x * 0.5)),
        gapDay: c.market.gapDay === null ? 1 : (c.market.gapDay + 7) % 40,
      };
      assert.deepEqual(deskAdvice(c.mission, c.state, other), advice(c), `${id} day ${d}`);
    }
  }
});

test("at most six items, tones non-decreasing", () => {
  const order = { urgent: 0, suggest: 1, info: 2, done: 3 };
  for (const id of ["M1", "M2", "M3", "M4", "M5"]) {
    for (const days of [0, 1, 8]) {
      const list = advice(run(setup(id), step(days)));
      assert.ok(list.length <= 6);
      for (let i = 1; i < list.length; i++) assert.ok(order[list[i - 1].tone] <= order[list[i].tone]);
    }
  }
});

test("every advice id has EN and HU title and body", () => {
  for (const id of ADVICE_IDS) {
    for (const key of [adviceTitleKey(id), adviceBodyKey(id)]) {
      assert.ok(en[key], `en ${key}`);
      assert.ok(hu[key], `hu ${key}`);
    }
  }
});

test("copy placeholders are all supplied by the advice vars", () => {
  const seen = new Map();
  for (const id of ["M1", "M2", "M3", "M4", "M5"]) {
    for (const days of [0, 1, 8, 20, 22]) {
      for (const a of advice(run(setup(id), step(days)))) {
        const vars = formatAdviceVars(a);
        seen.set(a.id, vars);
        for (const table of [en, hu]) {
          for (const key of [adviceTitleKey(a.id), adviceBodyKey(a.id)]) {
            for (const [, name] of table[key].matchAll(/\{\{(\w+)\}\}/g)) assert.ok(name in vars, `${a.id}: ${name}`);
          }
        }
      }
    }
  }
  assert.ok(seen.size >= 10);
});
