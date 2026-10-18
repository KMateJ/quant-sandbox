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

const h = await import(await load(new URL("../src/lib/stats/histogram.ts", import.meta.url)));

test("binValues: equal-width bins, edges and out-of-range counts", () => {
  const { bins, below, above } = h.binValues([-1, 0, 0.5, 1.99, 2, 3.999, 4, 5], [0, 4], 4);
  assert.deepEqual(bins.map((b) => b.count), [2, 1, 1, 2]);
  assert.equal(below, 1);
  assert.equal(above, 1);
  assert.equal(bins[3].x1, 4);
});

test("addToBins: incremental counting returns the bin index", () => {
  const bins = h.makeBins([40, 220], 45);
  assert.equal(h.addToBins(bins, 100), 15);
  assert.equal(h.addToBins(bins, 220), 44);
  assert.equal(h.addToBins(bins, 39.9), -1);
  assert.equal(bins.reduce((s, b) => s + b.count, 0), 2);
});

test("binDensity integrates to the share of values inside the bins", () => {
  const values = Array.from({ length: 1000 }, (_, i) => (i % 100) / 10);
  const { bins } = h.binValues(values, [0, 10], 20);
  const area = h.binDensity(bins).reduce((s, d, i) => s + d * (bins[i].x1 - bins[i].x0), 0);
  assert.ok(Math.abs(area - 1) < 1e-12);
  const half = h.binDensity(bins, 2000).reduce((s, d, i) => s + d * (bins[i].x1 - bins[i].x0), 0);
  assert.ok(Math.abs(half - 0.5) < 1e-12);
});

const hm = await import(await load(new URL("../src/components/charts/heatmap.logic.ts", import.meta.url)));

test("heatmap: nearest grid value, diverging and sequential paint, arrow steps clamp", () => {
  assert.equal(hm.nearestIndex([0.05, 0.08, 0.11], 0.094), 1);
  assert.equal(hm.cellPaint(5, "diverging", 0, -10, 20).fill, "var(--positive)");
  assert.equal(hm.cellPaint(-10, "diverging", 0, -10, 20).fill, "var(--negative)");
  assert.ok(Math.abs(hm.cellPaint(20, "diverging", 0, -10, 20).opacity - 0.85) < 1e-12);
  assert.ok(hm.cellPaint(1, "sequential", 0, 0, 1).opacity > hm.cellPaint(0, "sequential", 0, 0, 1).opacity);
  assert.deepEqual(hm.stepCell("ArrowUp", 2, 4, 5, 5), [2, 4]);
  assert.deepEqual(hm.stepCell("ArrowLeft", 0, 1, 5, 5), [0, 1]);
  assert.deepEqual(hm.stepCell("ArrowDown", 3, 3, 5, 5), [3, 2]);
  assert.equal(hm.stepCell("Tab", 0, 0, 5, 5), null);
});
