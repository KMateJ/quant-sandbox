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


const m = await import(await load(new URL("../src/features/guide/guide.interactive.multiplesPeers.math.ts", import.meta.url)));
const close = (a, b, tol = 0.01) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);

test("defaults: all six peers, target at 7% growth", () => {
  const v = m.impliedValue(m.PEERS, m.TARGET.growth);
  close(v.median, 10.35);
  close(v.multiple, 11.38);
  close(v.ev, 569.2, 0.1);
  close(v.equity, 449.2, 0.1);
});

test("dropping the outlier F lowers the implied value", () => {
  const v = m.impliedValue(m.PEERS.filter((p) => p.id !== "F"), m.TARGET.growth);
  close(v.median, 9.9);
  close(v.multiple, 10.3);
  close(v.equity, 394.8, 0.1);
});

test("median, line fit and snapping", () => {
  assert.equal(m.median([3, 1, 2]), 2);
  assert.equal(m.median([4, 1, 3, 2]), 2.5);
  assert.ok(Number.isNaN(m.median([])));
  const line = m.fitLine([{ id: "x", growth: 0, multiple: 5 }, { id: "y", growth: 0.1, multiple: 10 }]);
  close(line.a, 5, 1e-9);
  close(line.b, 50, 1e-9);
  assert.equal(m.fitLine([{ id: "x", growth: 0.05, multiple: 5 }]), null);
  close(m.snapGrowth(0.0712), 0.07, 1e-12);
  assert.equal(m.snapGrowth(0.5), m.GROWTH_MAX);
});
