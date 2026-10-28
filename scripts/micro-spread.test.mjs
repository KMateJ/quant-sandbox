import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const S = await importSrc("features/spread-estimation/spreadEstimation.math.ts");
const long = (over) => ({ ...S.DEFAULT_SPE, n: 50000, ...over });
const near = (a, b, rel) => assert.ok(Math.abs(a / b - 1) < rel, `${a} ≈ ${b}`);

test("prints sit at the quote before the update", () => {
  const tape = S.simulateTape(S.DEFAULT_SPE, 4);
  assert.equal(tape.length, 120);
  assert.equal(tape[0].m, S.M0);
  for (const x of tape) assert.equal(x.p, x.m + (S.DEFAULT_SPE.S / 2) * x.q);
});

test("Roll recovers S without informed trading and S·√(1−α) with it", () => {
  near(S.rollEstimate(S.simulateTape(long({ alpha: 0 }), 1)).s, 10, 0.03);
  const tape = S.simulateTape(long({ alpha: 0.35 }), 2);
  near(S.rollEstimate(tape).s, 10 * Math.sqrt(0.65), 0.03);
  near(S.effectiveSpread(tape), 10, 1e-12);
  const r = S.rollEstimate(tape);
  near(S.rollFromSlope(r.cov / S.diffVariance(tape), S.diffVariance(tape)), r.s, 1e-9);
});

test("Huang–Stoll recovers the half-spread and α", () => {
  const hs = S.huangStoll(S.simulateTape(long({ alpha: 0.35 }), 3));
  near(hs.halfSpread, 5, 0.03);
  near(hs.adverseShare, 0.35, 0.03);
});

test("tick test gets worse as noise rises", () => {
  const acc = (sigma) => {
    const tape = S.simulateTape(long({ sigma, n: 20000 }), 5);
    return S.classifyAccuracy(S.tickTest(tape), tape);
  };
  const [a, b, c] = [0.5, 2.5, 10].map(acc);
  assert.ok(a > b && b > c, `${a} > ${b} > ${c}`);
});

test("Roll flags positive covariance; output is deterministic", () => {
  const up = Array.from({ length: 10 }, (_, t) => ({ t, p: 100 + t * t, q: 1, m: 100 }));
  const r = S.rollEstimate(up);
  assert.equal(r.defined, false);
  assert.ok(Number.isNaN(r.s));
  assert.ok(Number.isNaN(S.rollFromSlope(0.2, 4)));
  assert.deepEqual(S.simulateTape(S.DEFAULT_SPE, 9), S.simulateTape(S.DEFAULT_SPE, 9));
  const c = S.convergence(S.DEFAULT_SPE, 9);
  assert.deepEqual(c.map((p) => p.n), [20, 40, 80, 160, 320, 640]);
  assert.deepEqual(c, S.convergence(S.DEFAULT_SPE, 9));
});
