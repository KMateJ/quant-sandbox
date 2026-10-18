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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.utilityIndifference.math.ts", import.meta.url)));
const close = (a, b, eps = 1e-12) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test("worked example: A = 4 gives y* = 0.5, μ = 7%, σ = 10%, U = 5%", () => {
  const y = m.optimalWeight(4);
  close(y, 0.5);
  const p = m.completePortfolio(y);
  close(p.mu, 0.07);
  close(p.sigma, 0.1);
  close(m.utility(p.mu, p.sigma, 4), 0.05);
});

test("y* maximises utility along the CAL, and U* = r_f + SR²/(2A)", () => {
  for (const A of m.RISK_AVERSIONS) {
    const yStar = m.optimalWeight(A);
    const u = (y) => { const p = m.completePortfolio(y); return m.utility(p.mu, p.sigma, A); };
    for (const dy of [-0.05, 0.05]) assert.ok(u(yStar) > u(yStar + dy));
    close(u(yStar), 0.03 + m.sharpeRatio() ** 2 / (2 * A));
  }
});

test("at A = 4 the risk-free asset and P itself give the same utility (3%)", () => {
  const p = m.completePortfolio(1);
  close(m.utility(p.mu, p.sigma, 4), 0.03);
  close(m.utility(0.03, 0, 4), 0.03);
});

test("indifference curve passes through its point; snapping and clamping", () => {
  const curve = m.indifferenceCurve(0.05, 4, 0.2, 20);
  close(curve[10].mu, 0.05 + 0.5 * 4 * 0.01); // σ = 10%
  assert.equal(m.snapWeight(0.52, 0.5), 0.5);
  assert.equal(m.snapWeight(0.6, 0.5), 0.6);
  assert.equal(m.snapWeight(-1, 0.5), 0);
  assert.equal(m.snapWeight(5, 0.5), m.MAX_WEIGHT);
});
