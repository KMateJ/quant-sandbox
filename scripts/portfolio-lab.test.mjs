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

const dir = new URL("../src/features/portfolio-lab/", import.meta.url);
const w = await import(await load(new URL("portfolioLab.weights.ts", dir)));
const math = await import(await load(new URL("portfolioLab.math.ts", dir)));
const url = await import(await load(new URL("portfolioLab.url.ts", dir)));
const urlState = await import(await load(new URL("../../lib/urlState.ts", dir)));

const sum = (a) => a.reduce((s, x) => s + x, 0);
const close = (a, b, eps = 1e-12) => Math.abs(a - b) < eps;

test("setting one share rescales the others proportionally and keeps the total at 1", () => {
  const alloc = [0.4, 0.3, 0.2, 0.1, 0];
  const next = w.setShareProportional(alloc, 0, 0.7);
  assert.ok(close(sum(next), 1));
  assert.equal(next[0], 0.7);
  // The others keep their 3:2:1 ratio and cash stays 0.
  assert.ok(close(next[1] / next[2], 1.5));
  assert.ok(close(next[2] / next[3], 2));
  assert.equal(next[4], 0);
});

test("shares are clamped and a lone 100% share hands back to the others equally", () => {
  const all = w.setShareProportional([0.2, 0.3, 0.5], 1, 1.4);
  assert.deepEqual(all, [0, 1, 0]);
  const back = w.setShareProportional(all, 1, 0.4);
  assert.ok(close(back[0], 0.3) && close(back[2], 0.3) && close(sum(back), 1));
  assert.ok(close(sum(w.setShareProportional([0.5, 0.5], 0, -2)), 1));
});

test("keyboard-style steps of 1% stay normalised over many presses", () => {
  let alloc = w.equalAllocation(5);
  for (let k = 0; k < 120; k++) alloc = w.setShareProportional(alloc, k % 6, alloc[k % 6] + (k % 3 === 0 ? -0.01 : 0.05));
  assert.ok(close(sum(alloc), 1, 1e-9));
  assert.ok(alloc.every((x) => x >= 0 && x <= 1));
});

test("presets and adopted cloud weights become allocations", () => {
  const a = w.allocationFrom([0.5, -0.2, 0.5], 0.2);
  assert.deepEqual(a.map((x) => Number(x.toFixed(10))), [0.4, 0, 0.4, 0.2]);
  const b = w.allocationFrom([0.1, 0.6, 0.3], 0);
  assert.equal(b[3], 0);
  assert.ok(close(b[1], 0.6));
});

test("allocations follow the asset list as it grows and shrinks", () => {
  const grown = w.resizeAllocation([0.5, 0.3, 0.2], 3);
  assert.equal(grown.length, 4);
  assert.ok(close(grown[2], 1 / 3) && close(sum(grown), 1));
  const removed = w.removeShare([0.25, 0.25, 0.25, 0.25], 1);
  assert.deepEqual(removed.map((x) => Number(x.toFixed(10))), [1 / 3, 1 / 3, 1 / 3].map((x) => Number(x.toFixed(10))));
  const same = [0.5, 0.5];
  assert.equal(w.resizeAllocation(same, 1), same);
});

test("the allocation survives the URL round trip, and equal weights stay out of the URL", () => {
  assert.equal(w.encodeAllocation(w.equalAllocation(5)), "");
  const alloc = [0.123, 0.377, 0.2, 0.1, 0.05, 0.15];
  const raw = w.encodeAllocation(alloc);
  assert.equal(raw, "12.3_37.7_20_10_5_15");
  const back = w.decodeAllocation(raw, 5);
  back.forEach((x, i) => assert.ok(close(x, alloc[i], 1e-9)));
  assert.equal(w.decodeAllocation(raw, 4), null);
  assert.equal(w.decodeAllocation("1_x_3", 2), null);
  assert.equal(w.decodeAllocation("", 5), null);
});

test("the URL schema reads tab, rf and weights with safe fallbacks", () => {
  const params = new URLSearchParams("tab=correlations&rf=0.5&w=50_50_0");
  const state = urlState.parseUrlState(url.PORTFOLIO_URL_SCHEMA, params);
  assert.equal(state.tab, "correlations");
  assert.equal(state.rf, 0.1);
  assert.equal(state.w, "50_50_0");
  const defaults = urlState.writeUrlState(url.PORTFOLIO_URL_SCHEMA, { tab: "riskReturn", rf: 0.03, w: "" }, new URLSearchParams());
  assert.equal(defaults.toString(), "");
});

test("the ρ scrubber range keeps the matrix PSD and contains the current value", () => {
  const corr = math.uniformCorr(3, 0.8);
  const [lo, hi] = math.feasibleCorrRange(corr, 1, 0);
  // With ρ13 = ρ23 = 0.8, ρ12 must lie in [0.28, 1]; the eigenvalue margin keeps it just inside.
  assert.ok(lo > 0.28 && lo < 0.29, `lo=${lo}`);
  assert.ok(hi > 0.99);
  assert.ok(math.minEigenvalue(math.setCorrEntry(corr, 1, 0, lo)) > 0);
  assert.ok(!math.isValidCorrelation(math.setCorrEntry(corr, 1, 0, lo - 0.02)));
  const identity = math.feasibleCorrRange(math.identityCorr(4), 2, 0);
  assert.ok(identity[0] < -0.99 && identity[1] > 0.99);
});

test("cloud picking finds the nearest dot within the pixel radius only", () => {
  const pts = [{ vol: 0.1, ret: 0.05 }, { vol: 0.2, ret: 0.1 }, { vol: 0.3, ret: 0.12 }];
  const toPx = (p) => [p.vol * 1000, 400 - p.ret * 1000];
  assert.equal(math.nearestPointIndex(pts, toPx, 203, 302, 5), 1);
  assert.equal(math.nearestPointIndex(pts, toPx, 250, 250, 5), -1);
});

test("quiz mix: whole percents summing to 100, at least two assets, reproducible", () => {
  for (let seed = 1; seed <= 50; seed++) {
    const mix = math.quizMix(5, seed);
    assert.equal(Math.round(sum(mix) * 100), 100);
    assert.ok(mix.every((x) => x >= 0 && Number.isInteger(Math.round(x * 100))));
    assert.ok(mix.filter((x) => x > 0).length >= 2);
    assert.deepEqual(mix, math.quizMix(5, seed));
  }
});
