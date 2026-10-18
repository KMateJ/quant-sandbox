import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const math = await importSrc("features/risk-return/riskReturn.math.ts");
const url = await importSrc("features/risk-return/riskReturn.url.ts");
const { parseUrlState, writeUrlState } = await importSrc("lib/urlState.ts");

const close = (a, b, eps = 1e-12) => assert.ok(Math.abs(a - b) < eps, `${a} ≉ ${b}`);

test("y* = (μ − rf) / (Aσ²)", () => {
  close(math.optimalRiskyWeight(0.09, 0.18, 0.03, 3), 0.06 / (3 * 0.0324));
  close(math.optimalRiskyWeight(0.02, 0.2, 0.03, 2), -0.01 / 0.08);
});

test("y* maximises utility along the CAL", () => {
  const [mu, sigma, rf, A] = [0.11, 0.25, 0.02, 2.5];
  const u = (w) => math.meanVarianceUtility(math.allocationReturn(mu, rf, w), math.allocationVolatility(sigma, w), A);
  const y = math.optimalRiskyWeight(mu, sigma, rf, A);
  for (const d of [-0.1, -0.01, 0.01, 0.1]) assert.ok(u(y) > u(y + d));
});

test("constrained optimum is y* clamped to [0, max]", () => {
  close(math.constrainedOptimalWeight(0.09, 0.18, 0.03, 3, 2.5), math.optimalRiskyWeight(0.09, 0.18, 0.03, 3));
  assert.equal(math.constrainedOptimalWeight(0.3, 0.05, 0.03, 1, 2.5), 2.5);
  assert.equal(math.constrainedOptimalWeight(0.01, 0.2, 0.03, 3, 2.5), 0);
});

test("the indifference curve through y* touches the CAL there and lies above it elsewhere", () => {
  const [mu, sigma, rf, A] = [0.09, 0.18, 0.03, 3];
  const y = math.optimalRiskyWeight(mu, sigma, rf, A);
  const vol = math.allocationVolatility(sigma, y);
  const ret = math.allocationReturn(mu, rf, y);
  const U = math.meanVarianceUtility(ret, vol, A);
  const curve = math.indifferenceCurve(U, A, 0.5, 100);
  close(curve[0].ret, U);
  close(U + 0.5 * A * vol * vol, ret);
  for (const p of curve) assert.ok(p.ret >= math.allocationReturn(mu, rf, p.vol / sigma) - 1e-12);
});

test("URL schema round-trips a configuration and clamps out-of-range values", () => {
  const state = { mu: 0.12, sigma: 0.25, rf: 0.04, w: 0.62, cmp: true, muB: 0.15, sigmaB: 0.35, A: 5.5 };
  const params = writeUrlState(url.RR_URL_SCHEMA, state, new URLSearchParams());
  assert.deepEqual(parseUrlState(url.RR_URL_SCHEMA, params), state);
  const wild = parseUrlState(url.RR_URL_SCHEMA, new URLSearchParams("mu=9&sigma=0&A=50&w=x"));
  assert.equal(wild.mu, url.RR_RANGES.mu[1]);
  assert.equal(wild.sigma, url.RR_RANGES.sigma[0]);
  assert.equal(wild.A, url.RR_RANGES.riskAversion[1]);
  assert.equal(wild.w, 1);
  assert.equal(writeUrlState(url.RR_URL_SCHEMA, parseUrlState(url.RR_URL_SCHEMA, new URLSearchParams()), new URLSearchParams()).toString(), "");
});
