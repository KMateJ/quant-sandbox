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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.annuitySchedule.math.ts", import.meta.url)));
const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("payment and first rows match the lesson's worked example", () => {
  const rows = m.amortizationSchedule(200000, 0.06, 10);
  close(rows[0].payment, 27173.59);
  close(rows[0].interest, 12000);
  close(rows[0].principal, 15173.59);
  close(rows[0].closing, 184826.41);
  close(rows[1].interest, 11089.58);
  close(rows[1].principal, 16084.01);
  close(rows[1].closing, 168742.4);
});

test("the schedule repays the loan exactly and principal adds up to it", () => {
  for (const n of m.LOAN_TERMS)
    for (const r of m.LOAN_RATES) {
      const rows = m.amortizationSchedule(200000, r, n);
      assert.equal(rows.length, n);
      assert.equal(rows.at(-1).closing, 0);
      close(rows.reduce((s, row) => s + row.principal, 0), 200000, 1e-6);
      // Interest falls and principal rises every year.
      for (let i = 1; i < n; i++) assert.ok(rows[i].interest < rows[i - 1].interest && rows[i].principal > rows[i - 1].principal);
    }
});

test("summary: total interest and interest share of the first payment", () => {
  const s = m.scheduleSummary(m.amortizationSchedule(200000, 0.06, 10));
  close(s.totalInterest, 71735.92);
  close(s.firstInterestShare, 0.4416, 1e-4);
  close(m.annuityFactor(0.06, 10), 7.3601, 1e-4);
  close(m.annuityFactor(0, 5), 5, 1e-12);
});
