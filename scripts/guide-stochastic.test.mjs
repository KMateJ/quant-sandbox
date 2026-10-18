import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const m = await importSrc("features/guide/guide.stochastic.math.ts");

test("conditioning on less information lowers the variance; full information keeps it", () => {
  const full = m.conditionOnDie("full", "square");
  const parity = m.conditionOnDie("parity", "square");
  const none = m.conditionOnDie("none", "square");
  assert.ok(Math.abs(full.varCond - full.varX) < 1e-12);
  assert.ok(parity.varCond < parity.varX && parity.varCond > 0);
  assert.equal(none.varCond, 0);
  assert.equal(parity.events, 4);
  assert.ok(Math.abs(none.ex - 91 / 6) < 1e-12);
});

test("first heads is a stopping time; last heads is not", () => {
  for (const k of [0, 1, 2, 3]) assert.equal(m.stoppingCheck("firstH", k).measurable, true);
  assert.equal(m.stoppingCheck("lastH", 1).measurable, false);
  assert.equal(m.atomsAt(2).length, 4);
});

test("transformations keep Var X_1 ≈ 1 and Cov(X_0.5, X_1) ≈ 0.5", () => {
  for (const [kind, p] of [["scaling", 3], ["inversion", 0], ["symmetry", 0], ["shift", 1]]) {
    const r = m.transformedRows(kind, p, 2, 5, 4000);
    assert.ok(Math.abs(r.var1 - 1) < 0.08, `${kind} var ${r.var1}`);
    assert.ok(Math.abs(r.cov - 0.5) < 0.06, `${kind} cov ${r.cov}`);
  }
});

test("reflection: P(max ≥ a) ≈ 2 P(W_1 ≥ a), slightly low on a grid", () => {
  const s = m.reflectionStats(m.maxSample(20000, 500, 3), 1);
  assert.ok(Math.abs(s.theory - 0.3173) < 1e-3);
  assert.ok(s.hit < s.theory && s.hit > s.theory - 0.03, `hit ${s.hit}`);
  assert.ok(Math.abs(s.above - s.theory / 2) < 0.015);
});

test("bridge at t = 0.5 has mean b/2 and variance 1/4", () => {
  const r = m.bridgeRows(1, 2, 9, 200, 6000);
  assert.ok(Math.abs(r.midMean - 0.5) < 0.03);
  assert.ok(Math.abs(r.midVar - 0.25) < 0.02);
  assert.ok(Math.abs(r.rows.at(-1).p0 - 1) < 1e-12);
});

test("left sums → (W²−1)/2 and midpoint sums → W²/2 as n grows", () => {
  const r = m.itoSums(10000, 4);
  assert.ok(Math.abs(r.left - r.ito) < 0.03, `${r.left} vs ${r.ito}`);
  assert.ok(Math.abs(r.mid - r.strat) < 0.03);
});

test("heat solution: E[(x + W_τ)²] = x² + τ, and MC agrees", () => {
  assert.ok(Math.abs(m.heatSolution("square", 1, 1, 0.5) - 1.5) < 1e-6);
  const r = m.feynmanKacRows("call", 1, 0.5, 4000, 2);
  assert.ok(Math.abs(r.mcAtOne - r.exactAtOne) < 4 * r.seAtOne);
});
