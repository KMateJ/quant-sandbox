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

const dir = new URL("../src/features/efficient-frontier/", import.meta.url);
const brush = await import(await load(new URL("frontierBrush.math.ts", dir)));
const opt = await import(await load(new URL("portfolioOptimization.math.ts", dir)));
const url = await import(await load(new URL("frontier.url.ts", dir)));
const { parseUrlState, writeUrlState } = await import(await load(new URL("../../lib/urlState.ts", dir)));

// Uneven return spacing, like a real frontier sweep.
const branch = [0.04, 0.05, 0.07, 0.1, 0.14, 0.16].map((ret) => ({ ret }));

test("composition hover maps the plot's left, middle and right to the matching frontier point", () => {
  assert.equal(brush.indexAtFraction(branch, 0), 0);
  assert.equal(brush.indexAtFraction(branch, 1), branch.length - 1);
  // Middle of the axis is return 0.10.
  assert.equal(brush.indexAtFraction(branch, 0.5), 3);
  // A quarter in is 0.07.
  assert.equal(brush.indexAtFraction(branch, 0.25), 2);
  // Outside the plot clamps to the ends.
  assert.equal(brush.indexAtFraction(branch, -0.3), 0);
  assert.equal(brush.indexAtFraction(branch, 1.4), branch.length - 1);
});

test("nearest point in 2D and nearest return", () => {
  const pts = [{ x: 0, y: 0 }, { x: 10, y: 5 }, { x: 20, y: 20 }];
  assert.equal(brush.nearestIndex2D(pts, 11, 4), 1);
  assert.equal(brush.nearestIndex2D(pts, 30, 30), 2);
  assert.equal(brush.nearestReturnIndex(branch, 0.135), 4);
});

test("keyboard steps along the frontier and clamps at the ends", () => {
  assert.equal(brush.brushKeyStep(2, 6, "ArrowRight"), 3);
  assert.equal(brush.brushKeyStep(2, 6, "ArrowDown"), 1);
  assert.equal(brush.brushKeyStep(2, 6, "ArrowRight", true), 5);
  assert.equal(brush.brushKeyStep(0, 6, "ArrowLeft"), 0);
  assert.equal(brush.brushKeyStep(3, 6, "Home"), 0);
  assert.equal(brush.brushKeyStep(3, 6, "End"), 5);
  assert.equal(brush.brushKeyStep(3, 6, "a"), null);
});

test("reconcileConstraints keeps long-only, shorting and leverage coherent", () => {
  const base = { longOnly: true, allowShort: false, minWeight: 0, maxWeight: 1, useRiskFree: true, riskFree: 0.03, allowLeverage: false, maxGross: 2 };
  const short = opt.reconcileConstraints({ ...base, allowShort: true }, "allowShort");
  assert.equal(short.longOnly, false);
  assert.equal(short.minWeight, -0.3);
  assert.equal(short.maxGross, 1);
  const back = opt.reconcileConstraints({ ...short, allowShort: false }, "allowShort");
  assert.equal(back.longOnly, true);
  assert.equal(back.minWeight, 0);
});

test("URL state round-trips and leaves defaults out", () => {
  const S = url.FRONTIER_URL_SCHEMA;
  const defaults = parseUrlState(S, new URLSearchParams());
  assert.equal(defaults.objective, "minVariance");
  assert.equal(defaults.riskFree, null);
  assert.equal(writeUrlState(S, defaults, new URLSearchParams()).toString(), "");

  const state = { ...defaults, objective: "targetReturn", targetReturn: 0.1234, allowShort: true, longOnly: false, minWeight: -0.3, useRiskFree: true, riskFree: 0.045 };
  const qs = writeUrlState(S, state, new URLSearchParams("other=keep"));
  assert.equal(qs.get("other"), "keep");
  assert.deepEqual(parseUrlState(S, qs), state);
  // Garbage falls back / clamps.
  const bad = parseUrlState(S, new URLSearchParams("objective=nope&riskFree=abc&maxGross=9"));
  assert.equal(bad.objective, "minVariance");
  assert.equal(bad.riskFree, null);
  assert.equal(bad.maxGross, 3);
});

test("an unset risk-free rate inherits the universe and stays unset on other edits", () => {
  const S = url.FRONTIER_URL_SCHEMA;
  const prev = parseUrlState(S, new URLSearchParams());
  assert.equal(url.constraintsFromUrl(prev, 0.025).riskFree, 0.025);
  const patch = url.constraintPatch(prev, "useRiskFree", true, 0.025);
  assert.equal(patch.useRiskFree, true);
  assert.equal(patch.riskFree, null);
  assert.equal(url.constraintPatch(prev, "riskFree", 0.05, 0.025).riskFree, 0.05);
});
