import assert from "node:assert/strict";
import { test } from "node:test";
import { rolldown } from "rolldown";

async function loadModule(path) {
  const bundle = await rolldown({ input: new URL(`../src/${path}`, import.meta.url).pathname.replace(/^\/(\w:)/, "$1") });
  const { output } = await bundle.generate({ format: "esm" });
  return import(`data:text/javascript;base64,${Buffer.from(output[0].code).toString("base64")}`);
}

const clt = await loadModule("features/random-walk/clt.math.ts");
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) < tol, `${msg ?? ""} ${a} vs ${b}`);

test("every step law is standardised (mean 0, variance 1)", () => {
  for (const dist of ["coin", "uniform", "exponential"]) {
    const [z1] = clt.cltLevelSamples(3, dist, [1], 200_000);
    const m = clt.sampleMoments(z1);
    near(m.mean, 0, 0.01, `${dist} mean`);
    near(m.variance, 1, 0.02, `${dist} variance`);
  }
});

test("empirical third moments match the closed forms", () => {
  const [z1] = clt.cltLevelSamples(5, "exponential", [1], 400_000);
  near(clt.sampleMoments(z1).skewness, clt.STEP_MOMENTS.exponential.skewness, 0.08, "exp skewness");
  let abs3 = 0;
  for (const v of z1) abs3 += Math.abs(v) ** 3;
  near(abs3 / z1.length, clt.STEP_MOMENTS.exponential.thirdAbsolute, 0.06, "exp E|X|^3");
});

test("skewness of Zn decays like gamma / sqrt(n)", () => {
  const levels = [1, 4, 16];
  const samples = clt.cltLevelSamples(11, "exponential", levels, 200_000);
  levels.forEach((n, i) => near(clt.sampleMoments(samples[i]).skewness, clt.sumSkewness("exponential", n), 0.06, `n=${n}`));
});

test("KS distance shrinks with n and stays under Berry–Esseen", () => {
  for (const dist of ["coin", "uniform", "exponential"]) {
    const levels = [1, 5, 30, 100];
    const curve = clt.ksCurve(clt.cltLevelSamples(7, dist, levels, 20_000), levels, dist);
    assert.ok(curve[3].ks < curve[0].ks, `${dist} KS should fall`);
    for (const p of curve) assert.ok(p.ks <= p.bound + clt.ksNoiseFloor(20_000) * 2, `${dist} n=${p.n}`);
  }
});

test("KS distance handles lattice ties: a ±1 coin at n = 1 is Φ(1) − ½ ≈ 0.341 away", () => {
  const [z1] = clt.cltLevelSamples(1, "coin", [1], 100_000);
  // sup |F − Φ| for a fair ±1 variable is attained just below x = 1: Φ(1) − 0.5.
  near(clt.ksDistance(z1), 0.3413, 0.01);
});

test("samples for small n are a prefix of the same experiment", () => {
  const [a] = clt.cltLevelSamples(9, "uniform", [10], 50);
  const [, b] = clt.cltLevelSamples(9, "uniform", [3, 10], 50);
  assert.deepEqual(Array.from(a), Array.from(b));
});
