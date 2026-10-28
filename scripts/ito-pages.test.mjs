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
const imp = async (p) => import(await load(new URL(`../src/features/ito-process/${p}`, import.meta.url)));

const integral = await imp("itoIntegral.math.ts");
const mart = await imp("martingales.math.ts");
const gir = await imp("girsanov.math.ts");

test("left-point sum converges to (W_T^2 - T)/2, right-point to W_T^2/2 + T/2", () => {
  const T = 2;
  for (const seed of [1, 2, 3]) {
    const last = integral.riemannSums(T, seed).at(-1);
    assert.ok(Math.abs(last.left - last.ito) < 0.25, `left ${last.left} vs ${last.ito}`);
    assert.ok(Math.abs(last.right - (last.strat + T / 2)) < 0.25);
  }
});

test("midpoint minus left averages T/2, right minus left averages T", () => {
  const T = 1.5;
  const { midGap, rightGap } = integral.gapAverages(T, 5, 400);
  assert.ok(Math.abs(midGap - T / 2) < 0.1, `mid gap ${midGap}`);
  assert.ok(Math.abs(rightGap - T) < 0.1, `right gap ${rightGap}`);
});

test("every martingale strategy keeps the mean wealth at the start, with a ruin tail for doubling", () => {
  for (const s of ["constant", "doubling", "stop"]) {
    const r = mart.simulateMartingale(s, 3, 4000, 100);
    assert.ok(Math.abs(r.mean - 100) < 4 * r.se + 0.5, `${s}: mean ${r.mean} se ${r.se}`);
    assert.equal(r.meanByRound.length, 101);
    assert.equal(r.meanByRound[0], 100);
  }
  const stop = mart.simulateMartingale("stop", 3, 4000, 100);
  assert.ok(stop.ahead > 0.8);
  assert.ok(Math.min(...stop.finals) < 100);
});

test("Girsanov weights average 1, reweighted mean returns to 0, ESS shrinks as theta grows", () => {
  const T = 1;
  const s = gir.girsanovSample(0.5, T, 40000, 11);
  assert.ok(Math.abs(s.meanWeight - 1) < 0.03, `mean weight ${s.meanWeight}`);
  let wm = 0;
  let sw = 0;
  for (let i = 0; i < s.x.length; i++) { wm += s.w[i] * s.x[i]; sw += s.w[i]; }
  assert.ok(Math.abs(wm / sw) < 0.05, `weighted mean ${wm / sw}`);
  const essSmall = gir.girsanovSample(0.3, T, 5000, 11).essShare;
  const essBig = gir.girsanovSample(2, T, 5000, 11).essShare;
  assert.ok(essBig < essSmall);
  assert.ok(gir.girsanovSample(0, T, 100, 1).essShare > 0.999);
});

test("weighted bin masses sum to the share inside the domain", () => {
  const s = gir.girsanovSample(1, 1, 2000, 2);
  const c = gir.weightedCounts(s.x, s.w, [-10, 10], 20);
  assert.ok(Math.abs(c.reduce((a, b) => a + b, 0) - 1) < 1e-9);
});
