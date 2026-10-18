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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.performanceRanking.math.ts", import.meta.url)));
const close = (a, b, eps = 5e-4) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);
const funds = m.PERF_FUNDS.map((f) => m.fundStats(f));
const byId = Object.fromEntries(funds.map((f) => [f.id, f]));
const order = (key) => m.rankBy(funds, key).order.map((f) => f.id).join("");

test("lesson numbers: Sharpe, Treynor, alpha, residual risk and information ratio", () => {
  close(byId.B.sharpe, 0.5);
  close(byId.D.sharpe, 0.4444);
  close(byId.C.treynor, 0.1048);
  close(byId.C.alpha, 0.0365);
  close(byId.B.alpha, 0.018);
  close(byId.C.residual, 0.233);
  close(byId.B.info, 0.344);
  close(byId.B.m2, 0.02);
  close(m.marketStats().sharpe, 0.3889);
});

test("the measures rank the funds differently", () => {
  assert.equal(order("sharpe"), "BDAC");
  assert.equal(order("treynor"), "CBDA");
  assert.equal(order("alpha"), "CBDA");
  assert.equal(order("info"), "BDCA");
  assert.equal(m.rankDisagreement(funds, "sharpe", "treynor"), 4);
  assert.equal(m.rankDisagreement(funds, "treynor", "alpha"), 0);
});

test("M² ranks exactly like Sharpe, and the market has zero alpha", () => {
  assert.equal(order("sharpe"), [...funds].sort((a, b) => b.m2 - a.m2).map((f) => f.id).join(""));
  close(m.marketStats().alpha, 0);
});
