import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const cache = new Map();

/// Transpiles a TS module and its relative imports into data: URLs (type-only imports vanish).
async function load(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const source = await readFile(url, "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [, spec] of outputText.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
    const dep = await load(new URL(`${spec}.ts`, url));
    outputText = outputText.replaceAll(`"${spec}"`, `"${dep}"`);
  }
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}

const ens = await import(await load(new URL("../src/lib/stats/ensemble.ts", import.meta.url)));
const bm = await import(await load(new URL("../src/features/brownian-motion/brownianMotion.math.ts", import.meta.url)));
const gbm = await import(await load(new URL("../src/features/gbm/gbm.math.ts", import.meta.url)));
const ito = await import(await load(new URL("../src/features/ito-process/itoProcess.math.ts", import.meta.url)));

test("ensemble helpers: quantile, terminal values, share below, paths in a range", () => {
  assert.equal(ens.sortedQuantile([1, 2, 3, 4, 5], 0.5), 3);
  assert.equal(ens.sortedQuantile([0, 10], 0.25), 2.5);
  // 2 paths × 3 steps, step-major.
  const v = Float64Array.from([0, 0, 1, -1, 2, -3]);
  assert.deepEqual([...ens.terminalValues(v, 2, 3)], [2, -3]);
  assert.equal(ens.shareBelow([1, 2, 3, 4], 3), 0.5);
  assert.deepEqual(ens.pathsEndingIn([5, 1, 7, 3], 2, 6), [0, 3]);
  const fan = ens.pathQuantiles(v, 2, 3, [0.5], 4);
  assert.deepEqual(fan[0].map((p) => p.step), [0, 2]);
  assert.deepEqual(ens.pathPoints(v, 2, 3, 1, 0.5), [{ x: 0, y: 0 }, { x: 0.5, y: -1 }, { x: 1, y: -3 }]);
});

test("Brownian cloud: terminal mean and sd match the exact normal law; empirical CDF matches", () => {
  const n = 4000;
  const values = bm.simulateBrownianCloud(0.05, 0.3, 1, 100, n, 7);
  const term = ens.terminalValues(values, n, 101);
  const law = bm.brownianTerminalLaw(0.05, 0.3, 1);
  const mean = term.reduce((a, b) => a + b, 0) / n;
  const sd = Math.sqrt(term.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1));
  assert.ok(Math.abs(mean - law.mean) < 4 * law.sd / Math.sqrt(n));
  assert.ok(Math.abs(sd / law.sd - 1) < 0.05);
  assert.ok(Math.abs(ens.shareBelow(term, 0.3) - law.cdf(0.3)) < 0.03);
  // Same seed, same ensemble.
  assert.deepEqual(bm.simulateBrownianCloud(0.05, 0.3, 1, 10, 5, 3), bm.simulateBrownianCloud(0.05, 0.3, 1, 10, 5, 3));
});

test("GBM cloud: mean S0·e^{μT}, median from the log-normal law, density integrates to 1", () => {
  const n = 4000;
  const values = gbm.simulateGbmCloud(100, 0.08, 0.25, 1, 100, n, 11);
  const term = ens.terminalValues(values, n, 101);
  const law = gbm.gbmTerminalLaw(100, 0.08, 0.25, 1);
  const mean = term.reduce((a, b) => a + b, 0) / n;
  assert.ok(Math.abs(mean / law.mean - 1) < 0.02);
  assert.ok(Math.abs(ens.shareBelow(term, law.median) - 0.5) < 0.03);
  let area = 0;
  for (let x = 1; x < 400; x += 0.5) area += law.pdf(x) * 0.5;
  assert.ok(Math.abs(area - 1) < 1e-3);
  assert.ok(Math.abs(law.median - 100 * Math.exp(0.08 - 0.5 * 0.0625)) < 1e-9);
});

test("Itô step path: Σ(ΔW)² ≈ T on average, ln S stays on the corrected-drift scale", () => {
  let sqSum = 0;
  for (let seed = 1; seed <= 200; seed++) sqSum += ito.itoStepPath(100, 0.1, 0.3, 1, 50, seed).at(-1).sq;
  assert.ok(Math.abs(sqSum / 200 - 1) < 0.03);
  const rows = ito.itoStepPath(100, 0.1, 0.3, 2, 50, 5);
  const last = rows.at(-1);
  assert.equal(rows.length, 51);
  assert.ok(Math.abs(last.naive - last.correct - 0.5 * 0.09 * 2) < 1e-12);
  // ln S = ln S0 + (μ − ½σ²)T + σ W_T exactly, by construction.
  assert.ok(Math.abs(last.ln - (Math.log(100) + (0.1 - 0.045) * 2 + 0.3 * last.w)) < 1e-9);
});

test("playback: values at time index k follow the law at t = k·Δt (spread grows like √t)", () => {
  const n = 4000;
  const steps = 100;
  const values = bm.simulateBrownianCloud(0.05, 0.3, 1, steps, n, 11);
  for (const k of [25, 50, 100]) {
    const t = k / steps;
    const at = ens.valuesAtStep(values, n, steps + 1, k);
    const m = at.reduce((s, v) => s + v, 0) / n;
    const sd = Math.sqrt(at.reduce((s, v) => s + (v - m) ** 2, 0) / (n - 1));
    assert.ok(Math.abs(m - 0.05 * t) < 4 * (0.3 * Math.sqrt(t)) / Math.sqrt(n), `mean at t=${t}`);
    assert.ok(Math.abs(sd / (0.3 * Math.sqrt(t)) - 1) < 0.05, `sd at t=${t}`);
  }
  assert.deepEqual(ens.valuesAtStep(values, n, steps + 1, steps), ens.terminalValues(values, n, steps + 1));
  assert.ok(ens.valuesAtStep(values, n, steps + 1, 0).every((v) => v === 0), "all paths start at 0");
});

test("densityCurve: renormalised to the domain, empty for a degenerate law", () => {
  const law = bm.brownianTerminalLaw(0, 1, 1);
  const curve = ens.densityCurve(law, [-1, 1], 401);
  const dx = 2 / 400;
  const area = curve.reduce((s, p, i) => s + (i === 0 || i === curve.length - 1 ? 0.5 : 1) * p.y * dx, 0);
  assert.ok(Math.abs(area - 1) < 1e-4);
  assert.deepEqual(ens.densityCurve(bm.brownianTerminalLaw(0, 1, 0), [-1, 1]), []);
  const atHalf = gbm.gbmTerminalLaw(100, 0.08, 0.25, 0.5);
  assert.ok(ens.densityCurve(atHalf, [50, 200]).every((p) => Number.isFinite(p.y) && p.y >= 0));
});

test("pathPoints upTo cuts a path at the cursor", () => {
  const values = bm.simulateBrownianCloud(0.05, 0.3, 1, 10, 3, 5);
  const full = ens.pathPoints(values, 3, 11, 1, 0.1);
  const cut = ens.pathPoints(values, 3, 11, 1, 0.1, 4);
  assert.equal(full.length, 11);
  assert.equal(cut.length, 5);
  assert.deepEqual(cut, full.slice(0, 5));
});

test("first passage: reflection-principle probability, Lévy law and simulated share", () => {
  // 2(1 − Φ(0.5 / 0.3)) at b = 0.5, σ = 0.3, T = 1.
  const p = bm.hitProbability(0.5, 0.3, 1);
  assert.ok(Math.abs(p - 0.0956) < 5e-4, `p = ${p}`);
  assert.equal(bm.hitProbability(-0.5, 0.3, 1), p);
  const law = bm.firstPassageLaw(0.5, 0.3);
  assert.ok(Math.abs(law.cdf(1) - p) < 1e-12);
  // The density integrates to the cdf (midpoint rule on (0, 1]).
  let area = 0;
  for (let i = 0; i < 20000; i++) { const t = (i + 0.5) / 20000; area += law.pdf(t) / 20000; }
  assert.ok(Math.abs(area - p) < 1e-3, `area = ${area}`);
  // Simulated driftless paths: the share that touches b is a little below theory (discrete grid), within noise.
  const values = bm.simulateBrownianCloud(0, 0.3, 1, 200, 4000, 11);
  const times = bm.firstPassageTimes(values, 4000, 201, 1 / 200, 0.5);
  const { share, median } = bm.hitSummary(times);
  assert.ok(share < p + 0.02 && share > p - 0.03, `share = ${share}`);
  assert.ok(median > 0 && median <= 1);
  // A barrier below zero is a down-crossing.
  const down = bm.hitSummary(bm.firstPassageTimes(values, 4000, 201, 1 / 200, -0.5)).share;
  assert.ok(Math.abs(down - share) < 0.03, `down = ${down}`);
});
