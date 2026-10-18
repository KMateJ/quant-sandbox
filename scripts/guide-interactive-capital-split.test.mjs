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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.capitalSplit.math.ts", import.meta.url)));
const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test("defaults match the wacc-leverage figure: D/V 40%, t 25% gives r_E 12.5% and WACC 9%", () => {
  const s = m.capitalSplit(0.4, 0.25);
  close(s.rE, 0.125);
  close(s.wacc, 0.09);
  close(s.rDAfterTax, 0.0375);
});

test("value identities: V_L = V_U + tD, D/V_L = dv, E = V_L − D", () => {
  for (const tax of [0, 0.25]) {
    for (const dv of [0, 0.1, 0.4, 0.8]) {
      const s = m.capitalSplit(dv, tax);
      close(s.leveredValue, 100 + tax * s.debt);
      close(s.debt / s.leveredValue, dv);
      close(s.equity, s.leveredValue - s.debt);
      close(s.shield, tax * s.debt);
    }
  }
});

test("without taxes the firm value never changes and WACC stays at r_U (MM I)", () => {
  for (const dv of [0, 0.3, 0.8]) {
    const s = m.capitalSplit(dv, 0);
    close(s.leveredValue, 100);
    close(s.wacc, 0.1);
  }
});

test("debtForRatio and ratioForDebt are inverse; the bar scale fits the largest firm", () => {
  for (const dv of [0.05, 0.4, 0.8]) close(m.ratioForDebt(m.debtForRatio(dv, 0.25), 0.25), dv);
  assert.ok(m.capitalSplit(0.8, 0.25).leveredValue <= m.CAPITAL_SPLIT_SCALE_MAX);
  assert.equal(m.clampDebtRatio(0.9), 0.8);
  assert.equal(m.clampDebtRatio(-0.1), 0);
  assert.equal(m.clampDebtRatio(0.4049), 0.4);
});
