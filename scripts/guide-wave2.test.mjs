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

const m = await import(await load(new URL("../src/features/guide/guide.wave2.math.ts", import.meta.url)));

const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) < tol, `${msg}: ${a} vs ${b}`);

test("implied volatility inverts Black–Scholes and respects the no-arbitrage bounds", () => {
  for (const sigma of [0.05, 0.2, 0.6]) {
    const price = m.bsPrice("call", 100, 110, 1, 0.05, sigma);
    close(m.impliedVol("call", price, 100, 110, 1, 0.05), sigma, 1e-7, `sigma ${sigma}`);
  }
  assert.ok(Number.isNaN(m.impliedVol("call", 101, 100, 100, 1, 0.05)));
  assert.ok(Number.isNaN(m.impliedVol("call", 4, 100, 100, 1, 0.05)));
});

test("Greeks satisfy the Black–Scholes PDE", () => {
  for (const S of [70, 100, 130]) assert.ok(Math.abs(m.greeksAt(S, 100, 0.5, 0.05, 0.25).pde) < 1e-9);
});

test("a narrow butterfly prices the discounted risk-neutral density, which integrates to one", () => {
  const r = m.blReadout(100, 0.05, 0.25, 1, -0.15, 100, 0.5);
  close(r.butterfly, r.exact, 1e-4, "butterfly");
  close(r.mass, 1, 2e-3, "mass");
});

test("normal VaR and ES match the textbook 99% numbers; fat tails raise ES more than VaR", () => {
  const n = m.normalVarEs(1, 0, 1, 0.99);
  close(n.var, 2.3263, 1e-3, "VaR");
  close(n.es, 2.6652, 1e-3, "ES");
  const big = m.tTail(0.99, 1000);
  close(big.z, 2.3263, 0.01, "t with large nu ~ normal");
  const fat = m.tTail(0.99, 4);
  assert.ok(fat.esFactor / n.es > fat.z / n.var);
});

test("Ornstein–Uhlenbeck paths match the exact moments, and Vasicek reduces to discounting as sigma -> 0", () => {
  const rows = m.ouRows(0.08, 0.5, 0.04, 0.01, 5, 4000, 50, 7);
  const end = rows.at(-1);
  const xs = Array.from({ length: 4000 }, (_, p) => end[`p${p}`]);
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / (xs.length - 1));
  const exact = m.ouMoments(0.08, 0.5, 0.04, 0.01, 5);
  close(mean, exact.mean, 0.001, "mean");
  close(sd, exact.sd, 0.0005, "sd");
  close(m.ouHalfLife(0.5), Math.log(2) / 0.5, 1e-12, "half-life");
  const flat = m.vasicekBondPrice(0.04, 0.5, 0.04, 1e-9, 5);
  close(flat, Math.exp(-0.2), 1e-9, "Vasicek flat");
});
