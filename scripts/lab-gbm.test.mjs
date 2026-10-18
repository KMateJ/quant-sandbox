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

const g = await import(await load(new URL("../src/features/gbm/gbm.math.ts", import.meta.url)));
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("centres at the defaults: mean > median > mode, share below the mean = Φ(½σ√T)", () => {
  const c = g.gbmCentres(100, 0.08, 0.25, 1);
  close(c.mean, 108.3287, 1e-3, "mean");
  close(c.median, 104.9958, 1e-3, "median");
  close(c.mode, 98.6344, 1e-3, "mode");
  close(c.shareBelowMean, 0.5497, 1e-3, "share below mean");
  assert.ok(c.mean > c.median && c.median > c.mode);
});

test("volatility drag: the mean ignores σ, the median and mode fall as σ grows", () => {
  const lo = g.gbmCentres(100, 0.08, 0.1, 1);
  const hi = g.gbmCentres(100, 0.08, 0.6, 1);
  close(lo.mean, hi.mean, 1e-9, "mean independent of σ");
  assert.ok(hi.median < lo.median && hi.mode < lo.mode && hi.gap > lo.gap);
});

test("sample centres of a simulated cloud match the theory", () => {
  const steps = 50, n = 20000;
  const cloud = g.simulateGbmCloud(100, 0.08, 0.25, 1, steps, n, 11);
  const terminal = cloud.subarray(steps * n);
  const c = g.gbmCentres(100, 0.08, 0.25, 1);
  const s = g.sampleCentres(terminal, c.mean);
  close(s.mean, c.mean, 0.6, "sample mean");
  close(s.median, c.median, 0.6, "sample median");
  close(s.shareBelow, c.shareBelowMean, 0.015, "share below mean");
  assert.equal(g.sampleCentres([3, 1, 2, 10], 2.5).median, 2.5);
});
