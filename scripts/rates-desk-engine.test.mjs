import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/rates-desk/engine/";
const curve = await importSrc(`${E}curve.math.ts`);
const pricing = await importSrc(`${E}pricing.math.ts`);
const risk = await importSrc(`${E}risk.math.ts`);
const book = await importSrc(`${E}book.math.ts`);
const { evaluateRates } = await importSrc(`${E}objectives.math.ts`);
const { replayRates } = await importSrc(`${E}policy.math.ts`);
const { RATES_MISSIONS, ratesMissionById } = await importSrc(`${E}missions.data.ts`);

const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o)) deepFreeze(v);
  }
  return o;
};
const setup = (id, seed) => {
  const mission = ratesMissionById(id);
  const path = curve.factorPath(mission, seed);
  const act = (s, a) => book.reduceRates(s, a, mission, path);
  return { mission, path, act, s0: book.startRates(mission, seed, path) };
};

test("five missions with unique ids", () => {
  assert.deepEqual(RATES_MISSIONS.map((m) => m.id), ["R1", "R2", "R3", "R4", "R5"]);
});

test("accounting: hedged = naked + futures P&L − costs every day", () => {
  const { act, s0 } = setup("R1", 2);
  let s = act(s0, { type: "dv01Hedge", future: 2 });
  for (let d = 0; d < 20; d++) s = act(act(s, { type: "step", days: 1 }), { type: "trade", future: 0, qty: d % 3 - 1, tag: "manual" });
  const last = s.hist[s.hist.length - 1];
  assert.ok(Math.abs(last.hedged - (last.naked + s.futPnl - s.costs)) < 1e-6);
  assert.equal(s.settled, true);
  assert.equal(s.events.at(-1).kind === "end" || s.events.some((e) => e.kind === "end"), true);
});

test("dv01Hedge leaves less than one contract of DV01", () => {
  const { mission, path, act, s0 } = setup("R1", 1);
  const z = curve.zeroGrid(path[0]);
  const s = act(s0, { type: "dv01Hedge", future: 2 });
  assert.ok(s.contracts[2] < 0);
  assert.ok(Math.abs(risk.ratesRisk(s, mission, z).net) < pricing.futureDv01(mission.futures[2], z));
  assert.equal(s.costs, Math.abs(s.contracts[2]) * mission.costPerContract);
});

test("R5 closes the front contract at day 10 and blocks trading it", () => {
  const { act, s0 } = setup("R5", 1);
  let s = act(s0, { type: "step", days: 10 });
  const ev = s.events.find((e) => e.kind === "expired");
  assert.equal(ev?.t, 10);
  assert.equal(ev.qty, -481);
  assert.equal(s.contracts[2], 0);
  assert.equal(act(s, { type: "trade", future: 2, qty: -5, tag: "manual" }), s);
});

test("R3 logs a CTD switch on the calibrated seed", () => {
  const { act, s0 } = setup("R3", 5);
  const s = act(s0, { type: "step", days: 20 });
  const sw = s.events.find((e) => e.kind === "ctdSwitch" && e.future === "10Y");
  assert.ok(sw && sw.t >= 8 && sw.t <= 12, `switch at ${sw?.t}`);
});

test("objectives: live and settled statuses per kind", () => {
  const { mission, act, s0 } = setup("R1", 4);
  const live = evaluateRates(mission, s0);
  assert.deepEqual(live.map((r) => r.status), ["onTrack", "onTrack", "onTrack"]);
  const naked = act(s0, { type: "step", days: 20 });
  const end = evaluateRates(mission, naked);
  assert.equal(end[0].status, "fail");
  assert.equal(end[2].status, "pass");
  const r4 = setup("R4", 1);
  const flat = r4.act(r4.s0, { type: "step", days: 20 });
  assert.equal(evaluateRates(r4.mission, flat)[1].status, "fail");
  const r2 = setup("R2", 1);
  assert.equal(evaluateRates(r2.mission, r2.act(r2.s0, { type: "step", days: 20 }))[0].status, "fail");
});

test("policy replays are deterministic and a hedge beats doing nothing", () => {
  const a = replayRates(ratesMissionById("R1"), 7, "dv01Daily10Y");
  assert.deepEqual(a, replayRates(ratesMissionById("R1"), 7, "dv01Daily10Y"));
  const none = replayRates(ratesMissionById("R1"), 7, "none");
  assert.equal(none.traded, 0);
  assert.ok(a.misses < none.misses);
});

test("reducer never mutates its input", () => {
  const { act, s0 } = setup("R5", 3);
  deepFreeze(s0);
  let s = act(s0, { type: "krdHedge" });
  s = act(s, { type: "dv01Hedge", future: 3 });
  s = act(s, { type: "step", days: 12 });
  assert.equal(act(s, { type: "restore", state: s0 }), s0);
});
