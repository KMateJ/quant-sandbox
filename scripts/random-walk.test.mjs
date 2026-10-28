import assert from "node:assert/strict";
import { test } from "node:test";
import { rolldown } from "rolldown";

async function loadModule(path) {
  const bundle = await rolldown({ input: new URL(`../src/${path}`, import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });
  const { output } = await bundle.generate({ format: "esm" });
  return import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString("base64")}`);
}

const rw = await loadModule("features/random-walk/randomWalk.math.ts");
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) < tol, `${msg ?? ""} ${a} vs ${b}`);

test("binomial pmf sums to one and matches the formulas for mean and variance", () => {
  for (const [n, p] of [[1, 0.5], [10, 0.3], [100, 0.5], [250, 0.8]]) {
    const pmf = rw.binomialPmf(n, p);
    near(pmf.reduce((a, b) => a + b, 0), 1, 1e-9, `sum n=${n}`);
    const mean = pmf.reduce((a, q, k) => a + q * k, 0);
    const variance = pmf.reduce((a, q, k) => a + q * (k - mean) ** 2, 0);
    near(mean, n * p, 1e-7, "binomial mean");
    near(variance, n * p * (1 - p), 1e-6, "binomial variance");
  }
  assert.deepEqual(rw.binomialPmf(3, 0), [1, 0, 0, 0]);
  assert.deepEqual(rw.binomialPmf(3, 1), [0, 0, 0, 1]);
});

test("walkLaw gives E = n·h·(2p−1) and Var = 4np(1−p)h²", () => {
  const law = rw.walkLaw(100, 0.6, 2);
  near(law.mean, 100 * 2 * 0.2, 1e-12);
  near(law.variance, 4 * 100 * 0.6 * 0.4 * 4, 1e-9);
  const pmf = rw.pmfDensity(40, 0.35, 1.5);
  const mean = pmf.reduce((a, d) => a + d.y * 2 * 1.5 * d.x, 0);
  near(mean, rw.walkLaw(40, 0.35, 1.5).mean, 1e-8, "lattice mean");
});

test("simulated walkers match the theory and are reproducible", () => {
  const n = 80, count = 20000, p = 0.62;
  const u = rw.walkerUniforms(5, n, count);
  const ups = rw.simulateUps(u, n, count, p);
  const counts = rw.siteCounts(ups, count, n);
  assert.equal(counts.reduce((a, b) => a + b, 0), count);
  const pos = counts.map((c, k) => [rw.sitePosition(k, n, 1), c / count]);
  const mean = pos.reduce((a, [x, q]) => a + x * q, 0);
  const variance = pos.reduce((a, [x, q]) => a + q * (x - mean) ** 2, 0);
  const law = rw.walkLaw(n, p);
  near(mean, law.mean, 0.2, "sample mean");
  near(variance / law.variance, 1, 0.04, "sample variance ratio");
  const again = rw.simulateUps(rw.walkerUniforms(5, n, count), n, count, p);
  assert.deepEqual(again, ups);
  assert.equal(ups[0], 0);
});

test("normal approximation integrates to one and tracks the pmf for large n", () => {
  const curve = rw.normalDensity(100, 0.5, 1, -60, 60, 600);
  const area = curve.reduce((a, d, i) => (i ? a + ((d.y + curve[i - 1].y) / 2) * (d.x - curve[i - 1].x) : a), 0);
  near(area, 1, 1e-3, "area");
  const pmf = rw.pmfDensity(100, 0.5, 1);
  const peak = pmf.find((d) => d.x === 0);
  near(peak.y, curve[300].y, 2e-3, "peak");
});

test("walkRange covers the drifted distribution", () => {
  const [lo, hi] = rw.walkRange(100, 0.9, 1);
  assert.ok(lo <= 0 && hi === 100);
});
