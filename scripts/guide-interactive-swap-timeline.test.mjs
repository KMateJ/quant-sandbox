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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.swapTimeline.math.ts", import.meta.url)));

test("swap-timeline: today's curve matches the lesson's worked example", () => {
  const today = m.swapTimeline(0);
  assert.deepEqual(today.payments.map((p) => p.df.toFixed(4)), ["0.9589", "0.9160", "0.8730"]);
  assert.deepEqual(today.payments.map((p) => (p.forward * 100).toFixed(2)), ["4.28", "4.69", "4.92"]);
  assert.equal((today.rate * 100).toFixed(2), "4.62");
  assert.ok(Math.abs(today.value) < 1e-6, `a new swap is worth 0, got ${today.value}`);
});

test("swap-timeline: +50 bp moves only the floating leg and gives the lesson's value", () => {
  const today = m.swapTimeline(0);
  const shifted = m.swapTimeline(0.005);
  assert.deepEqual(shifted.payments.map((p) => p.df.toFixed(4)), ["0.9543", "0.9073", "0.8606"]);
  shifted.payments.forEach((p, i) => {
    assert.equal(p.fixed, today.payments[i].fixed);
    assert.ok(p.floating > today.payments[i].floating);
  });
  assert.ok(Math.abs(shifted.value - 135_850) < 100, `value ${shifted.value}`);
  assert.equal(Math.round(shifted.dv01), 2722);
});

test("swap-timeline: floating leg PV telescopes to N(1 − P(0,3))", () => {
  for (const shift of [0, 0.005]) {
    const s = m.swapTimeline(shift);
    assert.ok(Math.abs(s.pvFloating - 10_000_000 * (1 - s.payments[2].df)) < 1e-6);
  }
});
