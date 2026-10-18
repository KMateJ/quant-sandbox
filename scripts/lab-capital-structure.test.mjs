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

const m = await import(await load(new URL("../src/features/capital-structure/capitalStructure.math.ts", import.meta.url)));

test("MM with taxes: worldWacc matches the existing MM II WACC, r_U(1 − tL)", () => {
  for (const de of [0, 0.5, 1, 2, 3]) {
    const L = m.debtRatioFromDebtEquity(de);
    assert.ok(Math.abs(m.worldWacc("tax", L, 0.1, 0.21) - m.waccFromDebtEquity(0.1, 0.05, 0.21, de)) < 1e-12);
    assert.ok(Math.abs(m.worldCostOfEquity("tax", L, 0.1, 0.05, 0.21) - m.leveredCostOfEquity(0.1, 0.05, 0.21, de)) < 1e-12);
  }
});

test("MM without taxes: value and WACC don't depend on leverage, r_E follows MM II", () => {
  const v = m.worldValue("noTax", 0.5, 0.21);
  assert.equal(v.leveredValue, 100);
  assert.ok(Math.abs(m.worldWacc("noTax", 0.5, 0.1, 0.21) - 0.1) < 1e-12);
  assert.ok(Math.abs(m.worldCostOfEquity("noTax", 0.5, 0.1, 0.05, 0.21) - (0.1 + (0.1 - 0.05) * 1)) < 1e-12);
});

test("value identities: V_L = V_U + tD − C and D + E = V_L in every world", () => {
  for (const w of ["noTax", "tax", "tradeoff"]) {
    const v = m.worldValue(w, 0.4, 0.21);
    const t = w === "noTax" ? 0 : 0.21;
    assert.ok(Math.abs(v.leveredValue - (100 + t * v.debt - v.distress)) < 1e-9);
    assert.ok(Math.abs(v.debt + v.equity - v.leveredValue) < 1e-9);
  }
});

test("trade-off: interior optimum at the closed-form L*, and the WACC is U-shaped", () => {
  const L = m.optimalTradeoffRatio(0.21);
  assert.ok(L > 0.25 && L < 0.3);
  const f = (x) => m.worldValue("tradeoff", x, 0.21).leveredValue;
  assert.ok(f(L) > f(L - 0.02) && f(L) > f(L + 0.02));
  assert.ok(m.worldWacc("tradeoff", L, 0.1, 0.21) < m.worldWacc("tradeoff", 0, 0.1, 0.21));
  assert.ok(m.worldWacc("tradeoff", L, 0.1, 0.21) < m.worldWacc("tradeoff", 0.75, 0.1, 0.21));
});

test("debtRatioForDebt inverts the world's debt", () => {
  const L = 0.37;
  const D = m.worldValue("tradeoff", L, 0.21).debt;
  assert.ok(Math.abs(m.debtRatioForDebt("tradeoff", D, 0.21, 0.75) - L) < 1e-9);
});
