import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { expectedWait, fillProbability, fillCurve, simulateMinute, lambdaFromVolume, MEAN_SELL_SIZE } = await importSrc(
  "features/guide/guide.micro.queuePosition.math.ts",
);

const flow = { lambda: lambdaFromVolume(300), meanSize: MEAN_SELL_SIZE, cancelRate: 100 };
const args = (ahead, horizon = 1) => ({ ahead, horizon, ...flow });

test("expected wait is shares ahead over the combined removal rate", () => {
  assert.equal(expectedWait(1260, 300, 100), 3.15);
  assert.equal(expectedWait(900, 250, 50), 3);
  assert.equal(expectedWait(100, 0, 0), Infinity);
});

test("fill probability is within [0, 1] and decreasing in shares ahead", () => {
  let prev = 1;
  for (let a = 0; a <= 2000; a += 50) {
    const p = fillProbability(args(a));
    assert.ok(p >= 0 && p <= 1);
    assert.ok(p <= prev + 1e-12);
    prev = p;
  }
});

test("fill probability rises with the horizon and with the cancel rate", () => {
  assert.ok(fillProbability(args(800, 2)) > fillProbability(args(800, 1)));
  assert.ok(fillProbability({ ...args(800), cancelRate: 200 }) > fillProbability({ ...args(800), cancelRate: 0 }));
});

test("worked example: 460 ahead, 3 sells of mean 100 per minute, 100 cancelled", () => {
  const p = fillProbability({ ahead: 460, lambda: 3, meanSize: 100, horizon: 1, cancelRate: 100, secondMoment: 20000 });
  assert.ok(Math.abs(p - 0.4017) < 5e-4);
});

test("fill curve covers the grid and matches fillProbability", () => {
  const curve = fillCurve(flow, 1, 2000, 5);
  assert.equal(curve.length, 5);
  assert.equal(curve[4].ahead, 2000);
  assert.equal(curve[2].p, fillProbability(args(1000)));
});

test("simulateMinute is reproducible and never increases the queue", () => {
  const s = { ahead: 1260, filled: 0 };
  assert.deepEqual(simulateMinute(s, flow, 7), simulateMinute(s, flow, 7));
  for (let seed = 1; seed < 50; seed++) assert.ok(simulateMinute(s, flow, seed).ahead <= 1260);
});

test("Monte Carlo of simulateMinute agrees with fillProbability within 0.05", () => {
  for (const [volume, ahead] of [[300, 1260], [300, 700], [1000, 800], [1000, 1500]]) {
    const f = { ...flow, lambda: lambdaFromVolume(volume) };
    const n = 20000;
    let hits = 0;
    for (let seed = 1; seed <= n; seed++) if (simulateMinute({ ahead, filled: 0 }, f, seed * 7919).filled > 0) hits++;
    assert.ok(Math.abs(hits / n - fillProbability({ ahead, horizon: 1, ...f })) < 0.05, `${volume}/min, ${ahead} ahead`);
  }
});

test("a filled order never exceeds its size", () => {
  const s = simulateMinute({ ahead: 0, filled: 380 }, { lambda: 20, meanSize: 100, cancelRate: 0 }, 3);
  assert.ok(s.filled <= 400);
});
