import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const M = await importSrc("features/guide/guide.micro.spreadMeasurement.math.ts");
const near = (a, b, rel) => assert.ok(Math.abs(a / b - 1) < rel, `${a} ≈ ${b}`);

test("worked example and check values", () => {
  assert.ok(Math.abs(M.rollFromCov(-0.0004) - 0.04) < 1e-12);
  assert.ok(Math.abs(M.rollFromCov(-0.0009) - 0.06) < 1e-12);
  assert.ok(Math.abs(M.rollLimit(10, 0.35) - 8.0623) < 1e-4);
  assert.ok(Number.isNaN(M.rollFromCov(0.0001)));
});

test("on 50,000 trades Roll ≈ S√(1 − α) while the effective spread equals S", () => {
  const r = M.rollBounce({ S: 10, alpha: 0.35, sigma: 2.5, n: 50000 });
  near(r.roll, 10 * Math.sqrt(0.65), 0.03);
  near(r.effective, 10, 1e-12);
  near(r.hsAlpha, 0.35, 0.03);
});

test("figure output is deterministic and thinned for drawing", () => {
  const a = M.rollBounce({ S: 10, alpha: 0.35, sigma: 2.5, n: 10000 });
  assert.deepEqual(a, M.rollBounce({ S: 10, alpha: 0.35, sigma: 2.5, n: 10000 }));
  assert.equal(a.shown.length, M.TAPE_SHOWN);
  assert.ok(a.scatter.length <= M.SCATTER_SHOWN);
  assert.ok(a.slope < 0);
});
