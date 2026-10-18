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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.ivSurface.math.ts", import.meta.url)));

test("1-year slice matches the vol-smile figure at the defaults (ρ = −0.7, ξ = 0.5)", () => {
  const s = m.ivSurface(-0.7, 0.5);
  assert.ok(Math.abs(m.ivAt(s, 80, 1) - 0.2303) < 5e-5);
  assert.ok(Math.abs(m.ivAt(s, 100, 1) - 0.1805) < 5e-5);
  assert.ok(Math.abs(m.ivAt(s, 120, 1) - 0.1454) < 5e-5);
});

test("negative correlation gives a skew that flattens with maturity", () => {
  const sk = m.skewByMaturity(m.ivSurface(-0.7, 0.5));
  assert.ok(sk[0].skew > sk[sk.length - 1].skew);
  for (const { skew } of sk) assert.ok(skew > 0);
});

test("zero correlation gives a nearly symmetric smile; grid is 13 × 8 and finite", () => {
  const s = m.ivSurface(0, 0.5);
  assert.equal(s.values.length, 8);
  assert.equal(s.values[0].length, 13);
  assert.ok(s.values.flat().every(Number.isFinite));
  assert.ok(Math.abs(m.ivAt(s, 80, 1) - m.ivAt(s, 120, 1)) < 0.01);
});
