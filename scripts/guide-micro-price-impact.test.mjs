import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { squareRootImpact, acTrajectory, acCostVariance, acFrontier, firstQuarterShare } = await importSrc("features/guide/guide.micro.priceImpact.math.ts");

const base = { X: 1, N: 20, T: 1, sigma: 0.02, eta: 0.002, gamma: 0.001, lambdaRisk: 10 };
const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("square-root rule: 2% volatility, 5% of volume gives 0.447%", () => {
  near(squareRootImpact(0.02, 0.05), 0.004472, 1e-6);
  near(squareRootImpact(0.015, 0.04), 0.003, 1e-12);
});

test("lambda = 0 is a straight line (TWAP) with hand-computed cost and variance", () => {
  const p = { ...base, lambdaRisk: 0 };
  const x = acTrajectory(p);
  x.forEach((v, j) => near(v, 1 - j / 20));
  const { cost, variance } = acCostVariance(p, x);
  const etaT = 0.002 - (0.001 * 0.05) / 2;
  near(cost, 0.5 * 0.001 + etaT * 20 * (1 / 20) ** 2 / 0.05);
  near(variance, 0.0004 * 0.05 * Array.from({ length: 20 }, (_, i) => ((19 - i) / 20) ** 2).reduce((a, b) => a + b, 0));
});

test("trajectory runs from X to 0 and is monotone; more risk aversion sells earlier", () => {
  const lo = acTrajectory({ ...base, lambdaRisk: 1 });
  const hi = acTrajectory({ ...base, lambdaRisk: 100 });
  for (const x of [lo, hi]) {
    near(x[0], 1);
    near(x[20], 0, 1e-12);
    for (let j = 1; j < x.length; j++) assert.ok(x[j] <= x[j - 1]);
  }
  assert.ok(firstQuarterShare(base, hi) > firstQuarterShare(base, lo));
});

test("the schedule minimises cost + lambda variance among perturbations", () => {
  const x = acTrajectory(base);
  const u = (y) => { const r = acCostVariance(base, y); return r.cost + base.lambdaRisk * r.variance; };
  for (const j of [3, 10, 17]) for (const d of [-0.01, 0.01]) {
    const y = x.slice(); y[j] += d;
    assert.ok(u(y) > u(x));
  }
});

test("frontier: cost rises as the standard deviation falls", () => {
  const f = acFrontier(base, [0, 0.1, 1, 10, 100, 1000]);
  for (let i = 1; i < f.length; i++) {
    assert.ok(f[i].sd < f[i - 1].sd);
    assert.ok(f[i].cost > f[i - 1].cost);
  }
});

test("worked toy: X = 2, two intervals, sigma = eta = 1, no permanent impact", () => {
  const p = { X: 2, N: 2, T: 2, sigma: 1, eta: 1, gamma: 0, lambdaRisk: 0 };
  const even = acCostVariance(p, [2, 1, 0]);
  const fast = acCostVariance(p, [2, 0, 0]);
  assert.deepEqual([even.cost, even.variance, fast.cost, fast.variance], [2, 1, 4, 0]);
});
