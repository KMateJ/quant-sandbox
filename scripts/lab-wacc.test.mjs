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

const m = await import(await load(new URL("../src/features/wacc/wacc.math.ts", import.meta.url)));

test("realistic WACC equals r_U(1 − tL) + L(1 − t)s(L)", () => {
  for (const L of [0, 0.2, 0.4, 0.6, 0.8]) {
    const closed = 0.11 * (1 - 0.21 * L) + L * (1 - 0.21) * m.creditSpread(L);
    assert.ok(Math.abs(m.realisticWaccAt(0.11, 0.05, 0.21, L) - closed) < 1e-12);
  }
});

test("realistic WACC is U-shaped with an interior minimum near 35% at the lab defaults", () => {
  const L = m.minimumWaccRatio(0.11, 0.05, 0.21, 0.8);
  // Closed form for s = aL²: L* = sqrt(t·r_U / (3a(1 − t))).
  assert.ok(Math.abs(L - Math.sqrt((0.21 * 0.11) / (3 * m.SPREAD_COEFF * 0.79))) < 1e-6);
  assert.ok(L > 0.3 && L < 0.4);
  assert.ok(m.realisticWaccAt(0.11, 0.05, 0.21, 0) > m.realisticWaccAt(0.11, 0.05, 0.21, L));
  assert.ok(m.realisticWaccAt(0.11, 0.05, 0.21, 0.8) > m.realisticWaccAt(0.11, 0.05, 0.21, L));
});

test("no tax: the minimum sits at zero debt", () => {
  assert.ok(m.minimumWaccRatio(0.11, 0.05, 0, 0.8) < 1e-6);
});

test("constant mode is unchanged: linear WACC from fixed ke and kd", () => {
  assert.ok(Math.abs(m.waccAt(0.11, 0.05, 0.21, 0.4) - (0.6 * 0.11 + 0.4 * 0.05 * 0.79)) < 1e-12);
});
