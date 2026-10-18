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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.cashflowBuilder.math.ts", import.meta.url)));
const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("present values discount each flow by (1 + r)^t", () => {
  const pv = m.presentValues([-100, 110, 121], 0.1);
  close(pv[0], -100);
  close(pv[1], 100);
  close(pv[2], 100);
});

test("default flows: NPV at 10% ≈ −5.23 and a unique IRR ≈ 7.93%", () => {
  const s = m.summarizeCashflows(m.CASHFLOW_DEFAULTS, 0.1);
  close(s.npv, -5.2303, 1e-3);
  assert.equal(s.severalIrrs, false);
  close(s.irr, 0.0793, 1e-4);
  assert.equal(s.sum, 25);
});

test("−100, +230, −132 has two IRRs, 10% and 20%", () => {
  const flows = [-100, 230, -132];
  assert.equal(m.signChanges(flows), 2);
  const s = m.summarizeCashflows(flows, 0.15);
  assert.equal(s.severalIrrs, true);
  assert.ok(Number.isNaN(s.irr));
  assert.equal(s.roots.length, 2);
  close(s.roots[0], 0.1, 1e-6);
  close(s.roots[1], 0.2, 1e-6);
});

test("dragged values are clamped and snapped to integers", () => {
  assert.equal(m.snapCashflow(12.6), 13);
  assert.equal(m.snapCashflow(-400), m.CASHFLOW_MIN);
  assert.equal(m.snapCashflow(999), m.CASHFLOW_MAX);
});
