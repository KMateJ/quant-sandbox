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

const v = await import(await load(new URL("../src/features/valuation/valuation.math.ts", import.meta.url)));
const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), `${a} vs ${b}`);

test("bridge: per-year PVs plus PV of the TV add up to the enterprise value", () => {
  const parts = v.valueBridge(100, 0.08, 5, 0.1, 0.02);
  assert.equal(parts.length, 7);
  assert.deepEqual(parts.map((p) => p.kind), ["years", "years", "years", "years", "years", "terminal", "total"]);
  close(parts[0].pv, 100 / 1.1);
  const ev = v.enterpriseValue(100, 0.08, 5, 0.1, 0.02);
  close(parts[6].pv, ev);
  close(parts.slice(0, 6).reduce((s, p) => s + p.pv, 0), ev);
  const tv = parts[5];
  close(tv.tv, (100 * 1.08 ** 4 * 1.02) / 0.08);
  close(tv.pv, tv.tv / 1.1 ** 5);
});

test("bridge groups years into blocks when there are more than six", () => {
  const parts = v.valueBridge(100, 0.05, 15, 0.09, 0.02);
  const blocks = parts.filter((p) => p.kind === "years");
  assert.deepEqual(blocks.map((b) => [b.from, b.to]), [[1, 3], [4, 6], [7, 9], [10, 12], [13, 15]]);
  close(parts[parts.length - 1].pv, v.enterpriseValue(100, 0.05, 15, 0.09, 0.02));
});

test("terminal share and the value map", () => {
  const share = v.terminalShare(100, 0.08, 5, 0.1, 0.02);
  assert.ok(share > 0.7 && share < 0.8, String(share));
  assert.equal(v.VALUE_MAP_WACC.length, 16);
  close(v.VALUE_MAP_WACC[15], 0.2);
  close(v.VALUE_MAP_GROWTH[8], 0.04);
  assert.ok(Number.isNaN(v.mapValue(100, 0.08, 5, 0.04, 0.04)));
  close(v.mapValue(100, 0.08, 5, 0.1, 0.02), v.enterpriseValue(100, 0.08, 5, 0.1, 0.02));
});

test("reverse DCF: implied g∞ and implied WACC invert the value, and unreachable targets give null", () => {
  const ev = v.enterpriseValue(100, 0.08, 5, 0.1, 0.02);
  close(v.impliedInput("growth", ev, 100, 0.08, 5, 0.1, 0.02), 0.02, 1e-7);
  close(v.impliedInput("wacc", ev, 100, 0.08, 5, 0.1, 0.02), 0.1, 1e-7);
  const up = v.impliedInput("growth", ev * 1.25, 100, 0.08, 5, 0.1, 0.02);
  assert.ok(up > 0.02 && up < 0.09, String(up));
  close(v.enterpriseValue(100, 0.08, 5, 0.1, up), ev * 1.25, 1e-6);
  const w = v.impliedInput("wacc", ev * 1.25, 100, 0.08, 5, 0.1, 0.02);
  assert.ok(w < 0.1 && w > 0.03, String(w));
  assert.equal(v.impliedInput("growth", 1e9, 100, 0.08, 5, 0.1, 0.02), null);
  assert.equal(v.impliedInput("wacc", 1, 100, 0.08, 5, 0.1, 0.02), null);
  const curve = v.reverseCurve("growth", 100, 0.08, 5, 0.1, 0.02);
  assert.ok(curve.every((p, i) => i === 0 || p.value > curve[i - 1].value));
});

test("year domain is never zero-width", () => {
  assert.deepEqual(v.yearDomain(1), [0.5, 1.5]);
  assert.deepEqual(v.yearDomain(5), [1, 5]);
});
