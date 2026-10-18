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
const m = await import(await load(new URL("../src/features/guide/guide.interactive.eulerConvergence.math.ts", import.meta.url)));
const close = (a, b, tol) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("coarse grids reuse the fine Brownian path", () => {
  const dW = m.fineIncrements(1);
  assert.equal(dW.length, 256);
  // With one coarse step the whole increment is W_T; Euler then gives S0 (1 + μT + σW_T).
  const wT = dW.reduce((a, b) => a + b, 0);
  close(m.eulerPath(dW, 1)[1], 100 * (1 + 0.08 + 0.4 * wT), 1e-9);
  close(m.exactPath(dW)[256], 100 * Math.exp((0.08 - 0.08) + 0.4 * wT), 1e-9);
  for (const n of m.EULER_SETUP.steps) assert.equal(m.eulerPath(dW, n).length, n + 1);
});

test("one Euler step against the exact value (Δt = 0.25, Z = 1)", () => {
  const s = m.oneStep(0.25, 1);
  close(s.euler, 122, 1e-9);
  close(s.exact, 122.14, 0.005);
});

test("strong error halves when the steps quadruple: order ≈ ½", () => {
  const e = m.strongErrors();
  for (let i = 1; i < e.length; i++) assert.ok(e[i].error < e[i - 1].error);
  const order = m.observedOrder(e);
  assert.ok(order > 0.4 && order < 0.6, String(order));
  close(e[0].error, 4.82, 0.05);
  close(e[3].error, 0.63, 0.05);
});

test("weak error of the mean is order 1: S0 (e^{μT} − (1 + μT/n)^n)", () => {
  const weak = (n) => 100 * (Math.exp(0.08) - (1 + 0.08 / n) ** n);
  close(weak(4), 0.0855, 1e-4);
  close(weak(4) / weak(16), 4, 0.05);
});
