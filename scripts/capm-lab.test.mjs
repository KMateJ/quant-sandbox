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

const dir = new URL("../src/features/capm/", import.meta.url);
const math = await import(await load(new URL("capm.math.ts", dir)));
const url = await import(await load(new URL("capm.url.ts", dir)));
const { parseUrlState, writeUrlState } = await import(await load(new URL("../src/lib/urlState.ts", import.meta.url)));

const close = (a, b, tol = 1e-12) => Math.abs(a - b) <= tol;

test("tilting the SML (raising E[rm]) moves every preset alpha down and can flip its sign", () => {
  const low = math.assetRows(math.PRESET_ASSETS, 0.03, 0.06);
  const high = math.assetRows(math.PRESET_ASSETS, 0.03, 0.12);
  low.forEach((r, i) => {
    assert.ok(close(r.expectedReturn, high[i].expectedReturn), "actual return is fixed");
    assert.ok(high[i].alpha < r.alpha || r.beta === 0);
  });
  const index = low.find((r) => r.name === "Broad index");
  assert.ok(index.alpha > 0 && high.find((r) => r.name === "Broad index").alpha < 0);
});

test("dragging an asset changes only that asset, clamped to the return range", () => {
  const next = math.withAssetReturn(math.PRESET_ASSETS, 1, 0.5);
  assert.equal(next[1].expectedReturn, math.RETURN_RANGE[1]);
  assert.deepEqual(next[0], math.PRESET_ASSETS[0]);
  assert.equal(next.length, math.PRESET_ASSETS.length);
});

test("the OLS slope tracks beta, and a new seed draws a different sample", () => {
  const a = math.betaObservations(1.3, 0.09, 0.03, 0.005, 1);
  const b = math.betaObservations(1.3, 0.09, 0.03, 0.005, 2);
  assert.ok(Math.abs(math.regressBeta(a).slope - 1.3) < 0.05);
  assert.notDeepEqual(a, b);
  assert.deepEqual(a, math.betaObservations(1.3, 0.09, 0.03, 0.005, 1));
});

test("fittedLine spans the x range on the regression line", () => {
  const [p, q] = math.fittedLine({ slope: 2, intercept: 0.01 }, -0.1, 0.2);
  assert.ok(close(p.y, -0.19) && close(q.y, 0.41) && p.x === -0.1 && q.x === 0.2);
});

test("URL state round-trips and clamps", () => {
  const state = { rf: 0.02, rm: 0.11, beta: 1.4, ret: 0.12, tab: "beta", disp: 0.05, seed: 7 };
  const params = writeUrlState(url.CAPM_URL_SCHEMA, state, new URLSearchParams());
  assert.deepEqual(parseUrlState(url.CAPM_URL_SCHEMA, params), state);
  const bad = parseUrlState(url.CAPM_URL_SCHEMA, new URLSearchParams("rm=9&tab=nope&beta=-1"));
  assert.equal(bad.rm, math.RETURN_RANGE[1]);
  assert.equal(bad.tab, "sml");
  assert.equal(bad.beta, 0);
});
