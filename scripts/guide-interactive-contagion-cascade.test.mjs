import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const m = await importSrc("features/guide/guide.systemic.math.ts");
const base = { n: 8, degree: 2, shocked: 0, shock: 0.5, equityRatio: 0.06, recovery: 0 };
const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("default state: two-neighbour network fails completely in 5 rounds", () => {
  const r = m.contagionCascade(base);
  assert.equal(r.defaulted, 8);
  assert.equal(r.rounds, 5);
  close(r.lossShare, 1);
  close(r.exposure, 10);
  assert.deepEqual(r.defaultRound, [1, 5, 4, 4, 3, 3, 2, 2]);
});

test("half recovery stops the cascade after the shocked bank", () => {
  const r = m.contagionCascade({ ...base, recovery: 0.5 });
  assert.equal(r.defaulted, 1);
  close(r.lossShare, (6 + 2 * 5) / 48);
});

test("complete network absorbs a single default", () => {
  const r = m.contagionCascade({ ...base, degree: 7 });
  assert.equal(r.defaulted, 1);
  close(r.lossShare, 26 / 48);
});

test("ring network fails in n rounds; small shock causes no default", () => {
  assert.equal(m.contagionCascade({ ...base, degree: 1 }).rounds, 8);
  const r = m.contagionCascade({ ...base, shock: 0.05 });
  assert.equal(r.defaulted, 0);
  assert.equal(r.rounds, 0);
});
