import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/hedging-desk/";
const demo = await importSrc(D + "demo/demo.math.ts");
const config = await importSrc(D + "demo/demo.config.ts");
const book = await importSrc(D + "engine/book.math.ts");
const risk = await importSrc(D + "engine/risk.math.ts");
const { evaluateObjectives } = await importSrc(D + "engine/objectives.math.ts");
const { buildMarket } = await importSrc(D + "engine/market.math.ts");
const { missionById } = await importSrc(D + "engine/missions.data.ts");

const M1 = missionById(config.DEMO_MISSION);
const market = demo.demoMarket(M1);
const { steps, states } = demo.runDemo(M1, market);
const at = (id) => states[demo.stepIndexById(steps, id)];
const delta = (s) => risk.netDelta(s.positions, market, s.day);
const q = Math.round(-book.startBook(M1, config.DEMO_SEED, market).openDelta);

test("restore returns the given state", () => {
  const s = at("drift");
  assert.equal(book.reduceDesk(states[0], { type: "restore", state: s }, market, M1), s);
});

test("steps are well formed", () => {
  const ids = steps.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const s of steps) {
    assert.ok(config.DEMO_ANCHORS.includes(s.anchor), `${s.id}: ${s.anchor}`);
    assert.ok(["desk", "missions", "debrief"].includes(s.screen));
    assert.ok(s.holdMs > 0);
  }
});

test("one state per step, days never go back, first state is the opening book", () => {
  assert.equal(states.length, steps.length);
  for (let k = 1; k < states.length; k++) assert.ok(states[k].day >= states[k - 1].day);
  assert.deepEqual(states[0], book.startBook(M1, config.DEMO_SEED, market));
});

test("first fill buys q shares and brings delta inside the band", () => {
  const s = at("firstFill");
  assert.ok(q >= 300 && q <= 700);
  assert.equal(s.positions.STOCK, q);
  assert.equal(s.fills.filter((f) => f.tag === "manual").length, 1);
  assert.ok(Math.abs(delta(s)) < 100);
});

test("one quiet day, then exactly one breach while drifting", () => {
  assert.equal(at("dayStep").breaches, 0);
  const d = at("drift");
  assert.equal(d.breaches, 1);
  assert.equal(d.events.filter((e) => e.kind === "breach").length, 1);
});

test("auto-hedge flattens delta with one auto fill that day", () => {
  const s = at("autoHedge");
  assert.ok(Math.abs(delta(s)) <= 0.5);
  assert.equal(s.fills.filter((f) => f.tag === "auto" && f.day === s.day).length, 1);
});

test("the run settles with every M1 objective passed", () => {
  const fin = states.at(-1);
  assert.equal(fin.settled, true);
  for (const o of evaluateObjectives(M1, fin, market)) assert.equal(o.status, "pass", o.def.kind);
  assert.ok(Math.abs(risk.markToMarket(fin, market)) <= 250);
  assert.equal(fin.events.filter((e) => e.kind === "expiry").length, 1);
});

test("deterministic, and the seed matters", () => {
  assert.deepEqual(demo.runDemo(M1, market), { steps, states });
  const other = buildMarket(M1.market, config.DEMO_SEED + 1);
  const run = demo.runDemo(M1, other, config.DEMO_SEED + 1);
  assert.notEqual(run.states.at(-1).cash, states.at(-1).cash);
});

test("step lookup by id", () => {
  assert.equal(steps.length, 16);
  assert.equal(demo.stepIndexById(steps, "toExpiry"), 12);
  assert.equal(demo.stepIndexById(steps, "nope"), -1);
});
