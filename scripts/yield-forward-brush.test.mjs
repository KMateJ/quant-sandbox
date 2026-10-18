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

const dir = new URL("../src/features/yield-curve/", import.meta.url);
const math = await import(await load(new URL("yieldCurve.math.ts", dir)));
const { presetNodes } = await import(await load(new URL("presets.ts", dir)));

const close = (a, b, eps = 1e-12) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);

test("a brushed range snaps to two distinct, ordered maturities", () => {
  assert.deepEqual(math.snapInterval(2.4, 5.6, 10), [2, 6]);
  assert.deepEqual(math.snapInterval(5.6, 2.4, 10), [2, 6]);
  assert.deepEqual(math.snapInterval(-3, 20, 10), [0, 9]);
  assert.deepEqual(math.snapInterval(4.2, 4.3, 10), [4, 5]);
  assert.deepEqual(math.snapInterval(9, 9, 10), [8, 9]);
  assert.deepEqual(math.snapInterval(0, 0, 10), [0, 1]);
});

test("the forward makes rolling over equal to investing directly", () => {
  for (const preset of ["normal", "inverted", "humped"]) {
    const term = math.buildTermStructure(presetNodes(preset));
    for (const [i, j] of [[0, 1], [2, 5], [3, 9]]) {
      const f = math.forwardBetween(term[i], term[j]);
      close(f.rolled, f.direct, 1e-10);
      close(f.direct, Math.pow(1 + term[j].zero, term[j].t), 1e-10);
      close(f.toStart, Math.pow(1 + term[i].zero, term[i].t), 1e-10);
      close(f.fwd, math.forwardRate(term[i].df, term[j].df, term[j].t - term[i].t));
      close(f.dt, term[j].t - term[i].t);
    }
    // Adjacent nodes reproduce the curve's own node-to-node forward.
    close(math.forwardBetween(term[4], term[5]).fwd, term[5].fwd);
  }
});

test("on a flat zero curve every forward equals the zero rate", () => {
  const z = 0.04;
  const pt = (t) => ({ t, label: `${t}Y`, par: z, zero: z, df: math.dfFromZero(z, t), fwd: z, fwdFrom: 0 });
  close(math.forwardBetween(pt(2), pt(7)).fwd, z, 1e-12);
});
