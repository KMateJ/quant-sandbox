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


const m = await import(await load(new URL("../src/features/guide/guide.interactive.callablePriceYield.math.ts", import.meta.url)));
const close = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

if (process.env.PROBE) {
  for (const k of [1, 3, 5]) for (let y = 0.02; y <= 0.1001; y += 0.005) {
    const q = m.callableQuote(y, k);
    console.log(k, y.toFixed(3), Object.entries(q).map(([a, b]) => `${a} ${a.startsWith("yt") ? (b * 100).toFixed(2) : b.toFixed(2)}`).join("  "));
  }
}

test("the lesson's worked example at y = 5% with 3 years of protection", () => {
  const q = m.callableQuote(0.05, 3);
  close(q.straight, 107.72, 0.005);
  close(q.call, 7.13, 0.005);
  close(q.callable, 100.59, 0.005);
  close(q.ytm, 0.0592, 5e-5);
  close(q.ytc, 0.0578, 5e-5);
  close(q.ytw, q.ytc, 1e-12);
  assert.ok(q.convexity < -60, `convexity ${q.convexity}`);
});

test("callable ≤ straight, the call is worth almost nothing at high yields, and price to call bounds the callable at low yields", () => {
  for (const k of m.PROTECTION_YEARS) {
    for (const c of m.priceCurves(k)) assert.ok(c.callable <= c.straight + 1e-9);
    assert.ok(m.callValue(0.1, k) < 0.6);
    assert.ok(m.callablePrice(0.02, k) < m.priceToCall(0.02, k) + 1e-9);
  }
});

test("negative convexity near and below the coupon, positive convexity at high yields", () => {
  for (const k of m.PROTECTION_YEARS) {
    assert.ok(m.callableQuote(0.045, k).convexity < 0, `k ${k}`);
    assert.ok(m.callableQuote(0.1, k).convexity > 30, `k ${k}`);
  }
});

test("price curve is smooth: second differences have no numerical noise", () => {
  const xs = m.priceCurves(3, 161).map((c) => m.callableQuote(c.y, 3).convexity);
  for (let i = 1; i < xs.length - 1; i++) assert.ok(Math.abs(xs[i + 1] - 2 * xs[i] + xs[i - 1]) < 5, `at ${i}`);
});
