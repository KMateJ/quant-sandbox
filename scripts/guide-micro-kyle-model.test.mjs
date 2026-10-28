import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { makeRng, nextNormal } = await importSrc("lib/math/random.ts");
const { lambdaStar } = await importSrc("features/kyle/kyle.math.ts");
const { kyleOneShot, kyleSchedule, KYLE_FIG, KYLE_FIG_ORDERS } = await importSrc("features/guide/guide.micro.kyleModel.math.ts");

const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("worked example: σv = 4, σu = 1,000, p0 = 100, V = 104", () => {
  const { beta, lambda, expectedProfit } = kyleOneShot({ sigmaV: 4, sigmaU: 1000 });
  near(beta, 250, 1e-12);
  near(lambda, 0.002, 1e-12);
  const x = beta * (104 - 100);
  near(x, 1000, 1e-9);
  const p = 100 + lambda * x;
  near(p, 102, 1e-12);
  near((104 - p) * x, 2000, 1e-9);
  near(expectedProfit, 2000, 1e-9);
});

test("check: σv = 2, σu = 500 gives λ = 0.002", () => {
  near(kyleOneShot({ sigmaV: 2, sigmaU: 500 }).lambda, 0.002, 1e-12);
});

test("doubling noise doubles the expected insider profit", () => {
  near(kyleOneShot({ sigmaV: 4, sigmaU: 2000 }).expectedProfit, 2 * kyleOneShot({ sigmaV: 4, sigmaU: 1000 }).expectedProfit, 1e-9);
});

test("one-shot N = 1 matches the lab's constant λ", () => {
  near(lambdaStar({ p0: 100, sigmaV: 4, s: 1000, n: 1 }), 0.002, 1e-12);
});

test("Monte Carlo: maker breaks even, insider earns σuσv/2 (3 s.e.)", () => {
  const sv = 4, su = 1000, p0 = 100;
  const { beta, lambda, expectedProfit } = kyleOneShot({ sigmaV: sv, sigmaU: su });
  const rng = makeRng(808);
  const n = 400_000;
  let si = 0, si2 = 0, sm = 0, sm2 = 0;
  for (let k = 0; k < n; k++) {
    const v = p0 + sv * nextNormal(rng);
    const u = su * nextNormal(rng);
    const x = beta * (v - p0);
    const y = x + u;
    const p = p0 + lambda * y;
    const ins = (v - p) * x;
    const maker = (p - v) * y;
    si += ins; si2 += ins * ins; sm += maker; sm2 += maker * maker;
  }
  const se = (s, s2) => Math.sqrt((s2 / n - (s / n) ** 2) / n);
  assert.ok(Math.abs(si / n - expectedProfit) < 3 * se(si, si2));
  assert.ok(Math.abs(sm / n) < 3 * se(sm, sm2));
});

test("figure defaults quoted in the lesson", () => {
  assert.equal(KYLE_FIG.gap, 4);
  const r = kyleSchedule(KYLE_FIG_ORDERS);
  near(r.lambda, 0.00106, 5e-6);
  near(r.yours, 4186, 0.5);
  near(r.optimal, 6403, 0.5);
  near(r.gapClosed, 0.473, 0.0005);
  near(r.path.at(-1).opt, 103.61, 0.005);
  near(r.ghosts[0], 343, 0.5);
  assert.equal(r.path.length, 11);
});

test("without noise, following the ghosts closes N/(N+1) of the gap and beats trading at once", () => {
  const quiet = { v: 104, u: Array(10).fill(0) };
  let orders = KYLE_FIG_ORDERS.map(() => 0);
  for (let i = 0; i < 10; i++) orders = orders.map((o, j) => (j === i ? kyleSchedule(orders, quiet).ghosts[i] : o));
  const r = kyleSchedule(orders, quiet);
  near(r.gapClosed, 10 / 11, 1e-9);
  near(r.yours, r.optimal, 1e-6);
  assert.ok(r.yours > kyleSchedule(KYLE_FIG_ORDERS, quiet).yours);
});
