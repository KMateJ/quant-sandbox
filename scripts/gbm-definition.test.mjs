import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const m = await importSrc("features/gbm/gbm.definition.math.ts");

test("ABM and GBM share shocks: equal start, GBM stays positive, ABM can go negative", () => {
  const paths = 2000, steps = 100;
  const { abm, gbm } = m.simulateAbmGbmPair(100, 0, 0.6, 5, steps, paths, 3);
  assert.equal(abm[0], 100);
  assert.equal(gbm[0], 100);
  const end = (v) => Array.from({ length: paths }, (_, p) => v[steps * paths + p]);
  assert.ok(end(gbm).every((x) => x > 0));
  assert.ok(end(abm).some((x) => x < 0));
});

test("simulated means match the exact laws", () => {
  const paths = 4000, steps = 50;
  const { abm, gbm } = m.simulateAbmGbmPair(100, 0.1, 0.3, 2, steps, paths, 11);
  const mean = (v) => Array.from({ length: paths }, (_, p) => v[steps * paths + p]).reduce((a, b) => a + b, 0) / paths;
  const la = m.abmLaw(100, 0.1, 0.3, 2), lg = m.gbmLaw(100, 0.1, 0.3, 2);
  assert.ok(Math.abs(mean(abm) - la.mean) < 3 * la.sd / Math.sqrt(paths));
  assert.ok(Math.abs(mean(gbm) - lg.mean) < 3 * lg.sd / Math.sqrt(paths));
});

test("GBM step size grows with the level, ABM's does not", () => {
  const { abm, gbm } = m.simulateAbmGbmPair(100, 0, 0.4, 5, 200, 300, 5);
  const ratio = (v) => {
    const pts = m.stepsByLevel(v, 300, 200, 300);
    const sd = (arr) => Math.sqrt(arr.reduce((a, p) => a + p.y * p.y, 0) / arr.length);
    return sd(pts.filter((p) => p.x > 150)) / sd(pts.filter((p) => p.x < 80 && p.x > 0));
  };
  assert.ok(ratio(gbm) > 1.6);
  assert.ok(Math.abs(ratio(abm) - 1) < 0.15);
});
