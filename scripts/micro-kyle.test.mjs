import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const ky = await importSrc("features/kyle/kyle.math.ts");
const { linearRegression } = await importSrc("lib/stats/regression.ts");
const P = { p0: 100, sigmaV: 4, s: 1000, n: 10 };
const close = (a, b, eps = 1e-12) => Math.abs(a - b) < eps;
const meanSe = (xs) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
  return { m, se: Math.sqrt(v / xs.length) };
};

test("cCoef and one-shot λ", () => {
  assert.ok(close(ky.cCoef(1), 1 / 4) && close(ky.cCoef(2), 1 / 3) && close(ky.cCoef(3), 3 / 8));
  assert.ok(close(ky.lambdaStar({ ...P, n: 1 }), P.sigmaV / (2 * P.s)));
});

test("optimal first order beats ±10% perturbations (common random numbers)", () => {
  const lambda = ky.lambdaStar(P);
  const gains = { lo: [], hi: [] };
  for (let seed = 1; seed <= 20000; seed++) {
    const d = ky.drawRound(P, seed);
    const x1 = ky.optimalOrder(d.v, P.p0, lambda, P.n);
    const base = ky.totalProfit(ky.runAuctions("optimal", d, P, lambda));
    gains.lo.push(base - ky.totalProfit(ky.runAuctions([0.9 * x1], d, P, lambda)));
    gains.hi.push(base - ky.totalProfit(ky.runAuctions([1.1 * x1], d, P, lambda)));
  }
  for (const g of Object.values(gains)) assert.ok(meanSe(g).m > 0);
});

test("Monte Carlo optimal profit matches the closed form; maker breaks even at λ*", () => {
  const lambda = ky.lambdaStar(P);
  const dev = [], maker = [];
  for (let seed = 1; seed <= 20000; seed++) {
    const d = ky.drawRound(P, seed);
    const rows = ky.runAuctions("optimal", d, P, lambda);
    const ins = ky.totalProfit(rows);
    dev.push(ins - ky.expectedOptimalProfit(d.v - P.p0, P, lambda));
    maker.push(-(ins + ky.noiseProfit(rows, d.v)));
  }
  for (const xs of [dev, maker]) { const { m, se } = meanSe(xs); assert.ok(Math.abs(m) < 3 * se, `${m} ± ${se}`); }
});

test("OLS slope of the λ sample is within 10% of λ*", () => {
  const pts = ky.lambdaSample(P, 5);
  assert.equal(pts.length, 200);
  const { slope } = linearRegression(pts.map((q) => q.flow), pts.map((q) => q.dp));
  assert.ok(Math.abs(slope / ky.lambdaStar(P) - 1) < 0.1);
});

test("deterministic per seed; minGap respected", () => {
  assert.deepEqual(ky.drawRound(P, 9), ky.drawRound(P, 9));
  assert.deepEqual(ky.drawRound(P, 9).u, ky.drawRound(P, 9, P.sigmaV).u);
  for (let s = 1; s < 50; s++) assert.ok(Math.abs(ky.drawRound(P, s, P.sigmaV).v - P.p0) >= P.sigmaV);
});

test("challenge calibration: rounded optimal hits ≥ 90%, all-at-once misses", () => {
  const lambda = ky.lambdaStar(P);
  let rounded = 0, allIn = 0;
  const N = 500;
  for (let seed = 1; seed <= N; seed++) {
    const d = ky.drawRound(P, seed, P.sigmaV);
    const opt = ky.totalProfit(ky.runAuctions("optimal", d, P, lambda));
    // live play: each order rounded to 100 shares from the realised price
    let price = P.p0, mine = 0;
    for (let i = 0; i < P.n; i++) {
      const x = Math.round(ky.optimalOrder(d.v, price, lambda, P.n - i) / 100) * 100;
      price += lambda * (x + d.u[i]);
      mine += (d.v - price) * x;
    }
    if (ky.insiderHit(mine, opt)) rounded++;
    const dump = [(d.v - P.p0) / lambda];
    if (ky.insiderHit(ky.totalProfit(ky.runAuctions(dump.concat(Array(P.n - 1).fill(0)), d, P, lambda)), opt)) allIn++;
  }
  console.log(`calibration: rounded optimal ${rounded / N}, all-at-once ${allIn / N}`);
  assert.ok(rounded / N >= 0.9 && allIn / N <= 0.1);
});

test("planGhosts: first ghost is the optimal first order", () => {
  const lambda = ky.lambdaStar(P);
  const g = ky.planGhosts(Array(P.n).fill(0), 104, P, lambda);
  assert.ok(Math.abs(g[0] - ky.optimalOrder(104, P.p0, lambda, P.n)) < 1e-9);
});
