import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { bestDelta, breakEvenDelta, incomeRate, informedLoss } = await importSrc("lib/market/informed.ts");
const { expectedSpreadIncome } = await importSrc("lib/market/quotes.ts");
const { makeRng, nextNormal } = await importSrc("lib/math/random.ts");
const { incomeCurve, incomeSplit, toxicFlow, toxicSummary, TOXIC_BASE } = await importSrc("features/guide/guide.micro.adverseSelection.math.ts");

const flow = toxicFlow(0.2, 1);

test("without informed customers the income is the plain spread income", () => {
  const p = { ...flow, informed: 0 };
  for (const d of [0.5, 1, 2, 3.7]) assert.ok(Math.abs(incomeRate(d, p) - expectedSpreadIncome(d, p.lambda / 2, p.k)) < 1e-12);
});

test("best half-spread is 1/k with no informed share and grows with it", () => {
  assert.ok(Math.abs(bestDelta({ ...flow, informed: 0 }) - 1 / flow.k) < 1e-4);
  const bests = [0, 0.1, 0.2, 0.3, 0.4].map((informed) => bestDelta({ ...flow, informed }));
  bests.slice(1).forEach((b, i) => assert.ok(b > bests[i]));
});

test("informedLoss matches a Monte Carlo estimate within 2%", () => {
  const rng = makeRng(2024);
  const s = Math.sqrt(3);
  const n = 2_000_000;
  const delta = 2;
  let sum = 0;
  for (let i = 0; i < n; i++) sum += Math.max(s * nextNormal(rng) - delta, 0);
  const exact = informedLoss(delta, s);
  assert.ok(Math.abs(sum / n / exact - 1) < 0.02);
});

test("loss at zero half-spread is s/√(2π)", () => {
  assert.ok(Math.abs(informedLoss(0, 2.5) - 2.5 / Math.sqrt(2 * Math.PI)) < 1e-9);
});

test("break-even half-spread earns nothing, and a tighter one loses", () => {
  const { breakEven } = toxicSummary(flow);
  assert.ok(breakEven > 0);
  assert.ok(Math.abs(incomeRate(breakEven, flow)) < 1e-6);
  assert.ok(incomeRate(breakEven / 2, flow) < 0);
  assert.equal(breakEvenDelta({ ...flow, informed: 0 }), 0);
});

test("income split adds up to the per-minute income rate", () => {
  for (const d of [0, 1, 2, 5]) {
    const s = incomeSplit(d, flow);
    assert.ok(Math.abs(s.noise - s.informed - s.net) < 1e-9);
    assert.ok(Math.abs(s.net - incomeRate(d, flow) * 60) < 1e-9);
  }
});

test("the curve spans 0 to 8 cents and the informed curve never exceeds the clean one", () => {
  const rows = incomeCurve(flow);
  assert.equal(rows[0].delta, 0);
  assert.ok(Math.abs(rows.at(-1).delta - 8) < 1e-12);
  assert.ok(rows.every((r) => r.income <= r.noInformed + 1e-12));
});

test("defaults quoted in the lesson: worked example and figure readouts at 2 cents", () => {
  assert.deepEqual({ ...TOXIC_BASE }, { lambda: 4, k: 0.5, horizon: 3 });
  const s = Math.sqrt(3);
  assert.ok(Math.abs(2 * Math.exp(-1) - 0.7358) < 5e-5);
  assert.ok(Math.abs(informedLoss(2, s) - 0.1066) < 5e-5);
  assert.ok(Math.abs(incomeRate(2, flow) - 2.1839) < 5e-5);
  assert.ok(Math.abs(incomeRate(2.3, flow) - 2.2116) < 5e-5);
  const split = incomeSplit(2, flow);
  assert.ok(Math.abs(split.noise - 141.26) < 0.01 && Math.abs(split.informed - 10.23) < 0.01 && Math.abs(split.net - 131.04) < 0.01);
  const sum = toxicSummary(flow);
  assert.ok(Math.abs(sum.best - 2.29) < 0.005 && Math.abs(sum.breakEven - 0.32) < 0.005 && Math.abs(sum.bestIncome - 132.70) < 0.01);
});
