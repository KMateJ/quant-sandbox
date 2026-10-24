import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/alm-desk/engine/";
const book = await importSrc(`${E}book.math.ts`);
const { ALM_MISSIONS, almMissionById } = await importSrc(`${E}missions.data.ts`);
const { evaluateAlm } = await importSrc(`${E}objectives.math.ts`);
const { replayAlm } = await importSrc(`${E}policy.math.ts`);
const { almRisk, surplusGrid, curvePoints } = await importSrc(`${E}risk.math.ts`);
const { surplusSeries, attributionTotals, benchmarkSeries } = await importSrc(`${E}series.math.ts`);
const imm = await importSrc("features/immunization/immunization.math.ts");

const A1 = almMissionById("A1");
const run = (m, seed, each) => {
  let s = book.startAlm(m, seed);
  while (!s.settled) {
    if (each) s = each(s);
    s = book.reduceAlm(s, { type: "step" }, m);
  }
  return s;
};
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    Object.values(o).forEach(deepFreeze);
  }
  return o;
};
const sd = (xs) => {
  const d = xs.slice(1).map((x, i) => x - xs[i]);
  const m = d.reduce((a, b) => a + b, 0) / d.length;
  return Math.sqrt(d.reduce((a, b) => a + (b - m) ** 2, 0) / d.length);
};

test("same mission and seed give the same game", () => {
  for (const m of ALM_MISSIONS) assert.deepEqual(run(m, 7, (s) => book.reduceAlm(s, { type: "match" }, m)), run(m, 7, (s) => book.reduceAlm(s, { type: "match" }, m)));
  assert.notDeepEqual(run(A1, 1).game.history, run(A1, 2).game.history);
});

test("startAlm opens in the start weights at no cost, fully funded", () => {
  const s = book.startAlm(A1, 3);
  const w = imm.weightsOf(s.game);
  A1.startWeights.forEach((x, i) => assert.ok(Math.abs(w[i] - x) < 1e-9));
  assert.equal(s.costs, 0);
  assert.equal(s.trades, 0);
  assert.ok(Math.abs(almRisk(s, A1).surplus) < 1e-6);
  assert.deepEqual(s.events, [{ t: 0, kind: "start" }]);
});

test("match closes the duration gap and costs what Immunization charges", () => {
  const s0 = book.startAlm(A1, 3);
  const s = book.reduceAlm(s0, { type: "match" }, A1);
  assert.ok(Math.abs(almRisk(s, A1).gap) <= 0.05);
  const target = imm.immunisedWeights(s0.game, book.almConfig(A1));
  const moved = (imm.assetsValue(s0.game) * target.reduce((a, w, i) => a + Math.abs(w - imm.weightsOf(s0.game)[i]), 0)) / 2;
  assert.ok(Math.abs(s.costs - (moved * 5) / 1e4) < 1e-6);
  assert.equal(s.trades, 1);
  assert.equal(s.events.at(-1).tag, "auto");
});

test("stepping to the end settles once with one end event", () => {
  const s = run(A1, 4);
  assert.equal(s.game.round, 8);
  assert.equal(s.events.filter((e) => e.kind === "end").length, 1);
  assert.equal(book.reduceAlm(s, { type: "step" }, A1), s);
  assert.equal(s.events.filter((e) => e.kind === "shock").length, 8);
  assert.ok(s.events.some((e) => e.kind === "matured" && e.tenor === 5));
});

test("A3 rejects the fourth trade", () => {
  const m = almMissionById("A3");
  let s = book.startAlm(m, 1);
  for (const w of [[1, 0, 0, 0], [0, 0, 1, 0], [0.5, 0, 0.5, 0], [0, 1, 0, 0]]) s = book.reduceAlm(s, { type: "rebalance", weights: w, tag: "manual" }, m);
  assert.equal(s.trades, 3);
  assert.deepEqual(s.events.at(-1), { t: 0, kind: "rejected", reason: "tradeLimit" });
});

test("A4 announces the second liability at year 3 with the surplus unchanged, then pays it", () => {
  const m = almMissionById("A4");
  const cfg = book.almConfig(m);
  let s = book.startAlm(m, 5);
  for (let i = 0; i < 2; i++) s = book.reduceAlm(s, { type: "step" }, m);
  const before = imm.surplusOf(imm.advance(s.game, imm.drawShock(5, 3, cfg), { ...cfg, extraLiabilities: [] }), { ...cfg, extraLiabilities: [] });
  s = book.reduceAlm(s, { type: "step" }, m);
  const added = s.events.find((e) => e.kind === "liabilityAdded");
  assert.equal(added.t, 3);
  assert.ok(added.contribution > 400_000);
  assert.ok(Math.abs(imm.surplusOf(s.game, cfg) - before) < 1);
  assert.ok(Math.abs(s.game.history.at(-1).surplus - imm.surplusOf(s.game, cfg)) < 1e-6);
  s = run(m, 5);
  assert.ok(s.events.some((e) => e.kind === "liabilityPaid" && e.t === 5));
});

test("negative cash keeps weights finite and summing to one", () => {
  const m = almMissionById("A4");
  let s = book.startAlm({ ...m, contributionOnAdd: false }, 2);
  s = book.reduceAlm(s, { type: "rebalance", weights: [0, 0, 1, 0], tag: "manual" }, m);
  for (let i = 0; i < 5; i++) s = book.reduceAlm(s, { type: "step" }, { ...m, contributionOnAdd: false });
  assert.ok(s.game.cash < 0);
  const w = almRisk(s, m).weights;
  assert.ok(w.every(Number.isFinite));
  assert.ok(Math.abs(w.reduce((a, b) => a + b, 0) - 1) < 1e-9);
});

test("matching every year steadies the surplus versus never trading", () => {
  let better = 0;
  for (let seed = 1; seed <= 20; seed++) if (sd(replayAlm(A1, seed, "matchYearly").surplus) < sd(replayAlm(A1, seed, "none").surplus)) better++;
  assert.ok(better >= 16, `matchYearly steadier on ${better}/20`);
  const r = replayAlm(A1, 3, "matchOnce");
  assert.equal(r.trades, 1);
  assert.equal(r.surplus.length, 9);
});

test("every objective kind evaluates; statuses settle to pass or fail", () => {
  const kinds = new Set();
  for (const m of ALM_MISSIONS) {
    const s = run(m, 1, (x) => book.reduceAlm(x, { type: "match" }, m));
    for (const r of evaluateAlm(m, s)) {
      kinds.add(r.def.kind);
      assert.ok(r.status === "pass" || r.status === "fail");
    }
    for (const r of evaluateAlm(m, book.startAlm(m, 1))) assert.ok(r.status === "onTrack" || r.status === "atRisk");
  }
  assert.deepEqual([...kinds].sort(), ["convexityMisses", "costsBelow", "gapMisses", "maxTrades", "surplusAtEnd", "surplusFloor"]);
});

test("A5 punishes the over-convex barbell but not the duration match", () => {
  const m = almMissionById("A5");
  const s = run(m, 1, (x) => book.reduceAlm(x, { type: "rebalance", weights: [0.45, 0, 0.55, 0], tag: "manual" }, m));
  assert.ok(s.convMisses > 1);
  assert.equal(run(m, 1, (x) => book.reduceAlm(x, { type: "match" }, m)).convMisses, 0);
});

test("reducer never mutates its input", () => {
  const m = almMissionById("A4");
  let s = deepFreeze(book.startAlm(m, 9));
  for (const a of [{ type: "match" }, { type: "step" }, { type: "rebalance", weights: [0.2, 0.3, 0.5, 0], tag: "manual" }, { type: "step" }, { type: "step" }, { type: "step" }]) s = deepFreeze(book.reduceAlm(s, a, m));
  assert.equal(book.reduceAlm(s, { type: "restore", state: book.startAlm(m, 9) }, m).game.round, 0);
});

test("risk, grid, curve and series helpers", () => {
  const s = run(A1, 2, (x) => book.reduceAlm(x, { type: "match" }, A1));
  const r = almRisk(book.startAlm(A1, 2), A1);
  assert.ok(Math.abs(r.netDv01 - (r.dv01A - r.dv01L)) < 1e-9);
  const grid = surplusGrid(book.startAlm(A1, 2), A1, [-100, 0, 100], [-50, 0, 50]);
  assert.equal(grid[1][1], 0);
  assert.ok(grid[0][1] < 0 && grid[2][1] > 0, "5y book is shorter than the liability: rates up helps");
  assert.equal(curvePoints({ level: 0.05, slope: 0 }).length, 60);
  assert.equal(surplusSeries(s).length, 9);
  const a = attributionTotals(s);
  assert.ok(Math.abs(a.carry + a.rate + a.convexity + a.cost - surplusSeries(s).at(-1)) < 1e-6);
  assert.equal(benchmarkSeries(A1, 2, 3).none.length, 4);
});
