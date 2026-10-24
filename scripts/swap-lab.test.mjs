import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const S = await importSrc("lib/finance/swap.ts");
const M = await importSrc("features/interest-rate-swap/swap.math.ts");
const { presetNodes, PRESET_IDS } = await importSrc("features/yield-curve/presets.ts");
const { logLinearDf } = await importSrc("lib/finance/yieldcurve.ts");

const nodes = presetNodes("normal");
const curve = M.curveFromNodes(nodes);
const base = { notional: 10_000_000, tenor: 5, freq: 2, payer: true };

test("log-linear curve reproduces the node DFs and is monotone", () => {
  const df = logLinearDf([1, 2, 5], [0.97, 0.94, 0.85]);
  assert.ok(Math.abs(df(2) - 0.94) < 1e-12);
  assert.ok(df(1.5) < 0.97 && df(1.5) > 0.94);
  assert.ok(df(6) < 0.85);
  assert.equal(df(0), 1);
});

test("a par swap is worth zero for every preset, tenor and frequency", () => {
  for (const id of PRESET_IDS) {
    const c = M.curveFromNodes(presetNodes(id));
    for (const tenor of [1, 3, 7, 10]) for (const freq of [1, 2, 4]) {
      const spec = { ...base, tenor, freq };
      const rate = S.parSwapRate(spec, c);
      assert.ok(Math.abs(S.swapMtm({ ...spec, fixedRate: rate }, c)) < 1e-9 * spec.notional, `${id} ${tenor} ${freq}`);
    }
  }
});

test("payer gains when rates rise; receiver mirrors it", () => {
  const rate = S.parSwapRate(base, curve);
  const spec = { ...base, fixedRate: rate };
  const up = M.curveFromNodes(M.shiftNodes(nodes, 50));
  assert.ok(S.swapMtm(spec, up) > 0);
  assert.ok(Math.abs(S.swapMtm({ ...spec, payer: false }, up) + S.swapMtm(spec, up)) < 1e-9);
});

test("key-rate DV01s add up to the parallel DV01 within 2%", () => {
  for (const tenor of [2, 5, 10]) {
    const spec = { ...base, tenor, fixedRate: S.parSwapRate({ ...base, tenor }, curve) };
    const krd = S.keyRateDv01(spec, nodes, M.curveFromNodes);
    const sum = krd.reduce((a, k) => a + k.dv01, 0);
    const par = S.parallelDv01(spec, nodes, M.curveFromNodes);
    assert.ok(par > 0);
    assert.ok(Math.abs(sum - par) / par < 0.02, `${tenor}: ${sum} vs ${par}`);
  }
});

test("MTM attribution adds up exactly to the total change", () => {
  const spec = { ...base, fixedRate: S.parSwapRate(base, curve) };
  const to = presetNodes("inverted");
  const parts = S.mtmAttribution(spec, nodes, to, M.curveFromNodes);
  const total = S.swapMtm(spec, M.curveFromNodes(to)) - S.swapMtm(spec, curve);
  assert.ok(Math.abs(parts.reduce((a, p) => a + p.change, 0) - total) < 1e-6);
});

test("ladder rows: signs follow the holder, yearly aggregation keeps the totals", () => {
  const spec = { ...base, tenor: 10, freq: 4, fixedRate: 0.04 };
  const { payments } = S.swapLegs(spec, curve);
  const rows = M.ladderRows(payments, true, false);
  assert.equal(rows.length, 40);
  assert.ok(rows.every((r) => r.fixed < 0 && r.floating > 0));
  const years = M.ladderRows(payments, true, true);
  assert.equal(years.length, 10);
  const sum = (rs, k) => rs.reduce((a, r) => a + r[k], 0);
  assert.ok(Math.abs(sum(years, "pvFloating") - sum(rows, "pvFloating")) < 1e-6);
  assert.ok(M.ladderRows(payments, false, false).every((r) => r.fixed > 0));
});

test("shock outcome: DV01 × 50 is close to full revaluation", () => {
  const spec = { ...base, fixedRate: S.parSwapRate(base, curve) };
  const { actual, estimate } = M.shockOutcome(spec, nodes, 50);
  assert.ok(actual > 0 && estimate > 0);
  assert.ok(Math.abs(actual - estimate) / actual < 0.05);
});
