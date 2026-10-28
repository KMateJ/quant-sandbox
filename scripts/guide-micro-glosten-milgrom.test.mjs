import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { askAt, bidAt, pBuy } = await importSrc("features/glosten-milgrom/glostenMilgrom.math.ts");
const { gmLearning, flippedTrades, GM_FIGURE_SEED, GM_FIGURE_TRADES } = await importSrc("features/guide/guide.micro.glostenMilgrom.math.ts");

const near = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);
const base = { pi: 0.2, trueV: 1, seed: GM_FIGURE_SEED, flips: [] };

test("worked example: π = 0.2, μ = 0.5 gives quotes 0.4 / 0.6 and, after a buy, 0.5 / 0.6923", () => {
  near(pBuy(1, 0.2), 0.6);
  near(pBuy(0, 0.2), 0.4);
  near(askAt(0.5, 0.2), 0.6);
  near(bidAt(0.5, 0.2), 0.4);
  near(askAt(0.6, 0.2), 0.36 / 0.52);
  near(bidAt(0.6, 0.2), 0.5);
});

test("worked example: the belief is a martingale, P(buy)·ask + P(sell)·bid = μ", () => {
  const mu = 0.6;
  const pb = mu * pBuy(1, 0.2) + (1 - mu) * pBuy(0, 0.2);
  near(pb, 0.52);
  near(pb * askAt(mu, 0.2) + (1 - pb) * bidAt(mu, 0.2), mu);
});

test("at μ = ½ the spread equals π, and it is zero with no informed traders", () => {
  for (const pi of [0, 0.1, 0.2, 0.5, 0.6]) near(askAt(0.5, pi) - bidAt(0.5, pi), pi);
  near(askAt(0.5, 0.5), 0.75);
});

test("the martingale property holds at every belief and informed share", () => {
  for (const pi of [0.05, 0.3, 0.6]) {
    for (const mu of [0.1, 0.5, 0.9]) {
      const pb = mu * pBuy(1, pi) + (1 - mu) * pBuy(0, pi);
      near(pb * askAt(mu, pi) + (1 - pb) * bidAt(mu, pi), mu);
    }
  }
});

test("the figure has one row per trade plus the prior, and row 0 is the prior's quotes", () => {
  const g = gmLearning(base);
  assert.equal(g.trades.length, GM_FIGURE_TRADES);
  assert.equal(g.rows.length, GM_FIGURE_TRADES + 1);
  near(g.rows[0].ask, 0.6);
  near(g.rows[0].bid, 0.4);
  near(g.rows[0].mu, 0.5);
  g.rows.forEach((r) => assert.ok(r.bid <= r.mu + 1e-12 && r.mu <= r.ask + 1e-12));
});

test("default state: belief 0.692, spread 0.171 and 90% confidence after 30 trades", () => {
  const g = gmLearning(base);
  assert.equal(g.trades.join(""), "BSBBSBSBSSSBBSBSSSBBBBBSSBBBBBSSSBSSSSBB");
  near(g.belief, 0.6923, 1e-4);
  near(g.spread, 0.1714, 1e-4);
  assert.equal(g.confident, 30);
});

test("flipping tile k changes only trades and rows from k on", () => {
  const a = gmLearning(base);
  const k = 12;
  const b = gmLearning({ ...base, flips: [k] });
  assert.notEqual(a.trades[k], b.trades[k]);
  assert.deepEqual(a.trades.slice(0, k), b.trades.slice(0, k));
  assert.deepEqual(a.trades.slice(k + 1), b.trades.slice(k + 1));
  assert.deepEqual(a.rows.slice(0, k + 1), b.rows.slice(0, k + 1));
  assert.notEqual(a.rows[k + 1].mu, b.rows[k + 1].mu);
});

test("flipping a tile twice restores the sequence", () => {
  assert.deepEqual(flippedTrades(0.2, 1, GM_FIGURE_SEED, [5, 5]), flippedTrades(0.2, 1, GM_FIGURE_SEED, []));
});

test("with no informed traders the belief never moves from the prior's quotes' mid", () => {
  const g = gmLearning({ ...base, pi: 0 });
  g.rows.forEach((r) => {
    near(r.ask, r.mu);
    near(r.bid, r.mu);
    near(r.mu, 0.5);
  });
  assert.equal(g.confident, null);
});

test("higher π learns faster on average across seeds", () => {
  const mean = (pi) => {
    const runs = Array.from({ length: 60 }, (_, s) => gmLearning({ ...base, pi, seed: s + 1 }).confident ?? GM_FIGURE_TRADES + 1);
    return runs.reduce((a, b) => a + b, 0) / runs.length;
  };
  assert.ok(mean(0.5) < mean(0.2));
});
