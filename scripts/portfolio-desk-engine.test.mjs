import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/portfolio-desk/engine/";
const { PORTFOLIO_MISSIONS, portfolioMissionById } = await importSrc(`${E}missions.data.ts`);
const { monthlyReturns, ewmaCov, inStress, monthlyCov } = await importSrc(`${E}market.math.ts`);
const { exAnteVol, riskShares, realizedVol } = await importSrc(`${E}risk.math.ts`);
const { startPortfolio, reducePortfolio, turnoverOf } = await importSrc(`${E}book.math.ts`);
const { evaluatePortfolio } = await importSrc(`${E}objectives.math.ts`);
const { replayPortfolio, PORTFOLIO_POLICIES } = await importSrc(`${E}policy.math.ts`);

const P1 = portfolioMissionById("P1");
const P3 = portfolioMissionById("P3");

const corrOf = (xs, ys) => {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0, syy = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) ** 2;
    syy += (ys[i] - my) ** 2;
  }
  return sxy / Math.sqrt(sxx * syy);
};

test("five missions with unique ids", () => {
  assert.deepEqual(PORTFOLIO_MISSIONS.map((m) => m.id), ["P1", "P2", "P3", "P4", "P5"]);
});

test("Cholesky returns reproduce the calm correlation over 20,000 draws", () => {
  const calmOnly = { ...P1, months: 20000, stressStart: 1e9 };
  const { R } = monthlyReturns(calmOnly, 7);
  const col = (i) => R.map((r) => Math.log(1 + r[i]));
  for (const [i, j] of [[0, 1], [0, 2], [2, 3]]) {
    assert.ok(Math.abs(corrOf(col(i), col(j)) - P1.calm.corr[i][j]) < 0.03, `ρ${i}${j}`);
  }
});

test("returns are deterministic per seed", () => {
  assert.deepEqual(monthlyReturns(P1, 3), monthlyReturns(P1, 3));
  assert.notDeepEqual(monthlyReturns(P1, 3).R, monthlyReturns(P1, 4).R);
});

test("random stress window lies in [10, 25]; fixed one is honoured", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const { stressStart } = monthlyReturns(P1, seed);
    assert.ok(stressStart >= 10 && stressStart <= 25);
  }
  assert.equal(monthlyReturns(P3, 1).stressStart, 12);
  assert.ok(inStress(P3, 12, 12) && inStress(P3, 12, 17) && !inStress(P3, 12, 18) && !inStress(P3, 12, 11));
});

test("stress window placement does not shift calm returns before it", () => {
  const a = monthlyReturns({ ...P3, stressStart: 12 }, 5).R;
  const b = monthlyReturns({ ...P3, stressStart: 20 }, 5).R;
  assert.deepEqual(a.slice(0, 11), b.slice(0, 11));
});

test("EWMA uses only months already realised", () => {
  const { R } = monthlyReturns(P1, 2);
  assert.deepEqual(ewmaCov(P1, R, 0), monthlyCov(P1.calm));
  const changed = R.map((r, k) => (k === 5 ? r.map(() => 0.5) : r));
  assert.deepEqual(ewmaCov(P1, R, 5), ewmaCov(P1, changed, 5));
  assert.notDeepEqual(ewmaCov(P1, R, 6), ewmaCov(P1, changed, 6));
});

test("rebalance cost = costBp × NAV × turnover, cash counted", () => {
  const { R } = monthlyReturns(P1, 1);
  const s0 = startPortfolio(P1, 1);
  const targets = [0.3, 0.1, 0.2, 0.1, 0.05];
  const s1 = reducePortfolio(s0, { type: "rebalance", targets, tag: "manual" }, P1, R);
  const turnover = turnoverOf(s0.w, targets);
  assert.ok(Math.abs(turnover - 0.35) < 1e-12);
  assert.ok(Math.abs(s1.costs - 0.001 * turnover) < 1e-15);
  assert.ok(Math.abs(s1.nav - (1 - 0.001 * turnover)) < 1e-15);
});

test("scaleToTarget hits 10% ex-ante; riskParity equalises shares", () => {
  const { R } = monthlyReturns(P1, 1);
  const S = ewmaCov(P1, R, 0);
  const scaled = reducePortfolio(startPortfolio(P1, 1), { type: "scaleToTarget" }, P1, R);
  assert.ok(Math.abs(exAnteVol(scaled.w, S) - 0.1) < 1e-9);
  const parity = reducePortfolio(startPortfolio(P1, 1), { type: "riskParity" }, P1, R);
  for (const share of riskShares(parity.w, S)) assert.ok(Math.abs(share - 0.2) < 0.01);
});

test("drawdown, history and settlement track the path", () => {
  const { R } = monthlyReturns(P1, 9);
  const s = reducePortfolio(startPortfolio(P1, 9), { type: "step", months: 99 }, P1, R);
  assert.equal(s.month, 36);
  assert.equal(s.hist.length, 37);
  assert.ok(s.settled);
  const worst = Math.max(...s.hist.map((h) => -h.dd));
  assert.ok(Math.abs(s.mdd - worst) < 1e-15);
  assert.equal(s.events.at(-1).kind, "end");
  assert.equal(reducePortfolio(s, { type: "step", months: 1 }, P1, R), s);
});

test("reducer never mutates its input", () => {
  const { R } = monthlyReturns(P1, 1);
  const s0 = startPortfolio(P1, 1);
  const snap = JSON.stringify(s0);
  reducePortfolio(s0, { type: "riskParity" }, P1, R);
  reducePortfolio(s0, { type: "step", months: 3 }, P1, R);
  assert.equal(JSON.stringify(s0), snap);
});

test("objectives: live, settled pass and fail per kind", () => {
  const s0 = startPortfolio(P1, 1);
  for (const m of PORTFOLIO_MISSIONS) assert.ok(evaluatePortfolio(m, s0).every((r) => r.status === "onTrack"));
  const settled = { ...s0, settled: true, mdd: 0.2, costs: 0.002, shareMisses: 3 };
  const byKind = (m) => Object.fromEntries(evaluatePortfolio(m, settled).map((r) => [r.def.kind, r.status]));
  assert.equal(byKind(P1).maxDrawdown, "fail");
  assert.equal(byKind(P1).costsBelow, "pass");
  assert.equal(byKind(portfolioMissionById("P4")).costsBelow, "fail");
  assert.equal(byKind(portfolioMissionById("P2")).riskShareMisses, "fail");
  assert.equal(byKind(portfolioMissionById("P5")).beatBenchmarkSharpe, "fail");
  assert.equal(realizedVol(s0.hist), 0);
});

test("policy replay is deterministic and every mission is winnable", () => {
  for (const p of PORTFOLIO_POLICIES) assert.deepEqual(replayPortfolio(P1, 4, p), replayPortfolio(P1, 4, p));
  for (const m of PORTFOLIO_MISSIONS) {
    const wins = PORTFOLIO_POLICIES.some((p) =>
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].some((seed) => evaluatePortfolio(m, replayPortfolio(m, seed, p)).every((r) => r.status === "pass"))
    );
    assert.ok(wins, m.id);
  }
});
