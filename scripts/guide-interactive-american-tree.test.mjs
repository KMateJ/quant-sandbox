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

const m = await import(await load(new URL("../src/features/guide/guide.interactive.americanTree.math.ts", import.meta.url)));
const base = { s0: 100, k: 100, sigma: 0.2, r: 0.05, t: 1 };
const near = (a, b, tol = 0.006) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("two-step put reproduces the lesson's worked example", () => {
  const tree = m.buildAmericanTree({ ...base, steps: 2, option: "put", style: "american" });
  near(tree.u, 1.1519, 1e-4);
  near(tree.d, 0.8681, 1e-4);
  near(tree.q, 0.5539, 1e-4);
  const lower = tree.nodes[1][0];
  assert.equal(lower.decision, "exercise");
  near(lower.continuation, 10.72);
  near(lower.intrinsic, 13.19);
  assert.equal(tree.nodes[1][1].decision, "continue");
  assert.equal(tree.nodes[0][0].decision, "continue");
  const { american, european, premium } = m.earlyExercisePremium({ ...base, steps: 2, option: "put" });
  near(american, 5.74);
  near(european, 4.66);
  near(premium, 1.07, 0.01);
});

test("a call on a non-dividend stock is never exercised early", () => {
  for (const steps of [2, 3, 4, 5, 25]) {
    for (const k of [70, 100, 130]) {
      const tree = m.buildAmericanTree({ ...base, k, steps, option: "call", style: "american" });
      assert.ok(tree.nodes.flat().every((n) => n.decision !== "exercise"), `steps ${steps}, K ${k}`);
      const { premium } = m.earlyExercisePremium({ ...base, k, steps, option: "call" });
      near(premium, 0, 1e-9);
    }
  }
});

test("European rule never exercises and American value is never below it", () => {
  for (const steps of [2, 3, 4, 5]) {
    const eu = m.buildAmericanTree({ ...base, steps, option: "put", style: "european" });
    assert.ok(eu.nodes.flat().every((n) => n.decision !== "exercise"));
    const am = m.buildAmericanTree({ ...base, steps, option: "put", style: "american" });
    am.nodes.flat().forEach((n, idx) => assert.ok(n.value >= eu.nodes.flat()[idx].value - 1e-12));
    am.nodes.flat().forEach((n) => assert.ok(n.value >= n.intrinsic - 1e-12));
  }
});
