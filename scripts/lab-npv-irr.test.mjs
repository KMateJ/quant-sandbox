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

const m = await import(await load(new URL("../src/features/npv-irr/npvIrr.math.ts", import.meta.url)));
const p = await import(await load(new URL("../src/features/npv-irr/npvIrr.presets.ts", import.meta.url)));

test("editableFlows: −outlay at year 0, then one pattern inflow per year", () => {
  const model = { ...p.DEFAULT_MODEL };
  const flows = m.editableFlows(model);
  assert.equal(flows.length, model.years + 1);
  assert.equal(flows[0], -model.outlay);
  for (let y = 1; y <= model.years; y++) assert.equal(flows[y], m.patternInflow(model, y));
});

test("dragScale: round span ≈ 1.5× the largest flow, readable steps", () => {
  assert.deepEqual(m.dragScale([-100, 25, 25]), { span: 150, step: 1 });
  assert.deepEqual(m.dragScale([-1000, 264, 264]), { span: 1500, step: 5 });
  assert.deepEqual(m.dragScale([-20000, 5000]), { span: 30000, step: 10 });
  assert.ok(m.dragScale([0, 0]).span > 0);
});

const url = await import(await load(new URL("../src/features/npv-irr/npvIrr.url.ts", import.meta.url)));

test("npv-irr URL: defaults write nothing; a custom model round-trips; garbage falls back", () => {
  const defaults = url.modelFromParams(new URLSearchParams());
  assert.equal(url.modelKey(defaults), "");
  const custom = { ...defaults, pattern: "custom", years: 4, rate: 0.12, customFlows: [300, -50, 700, 400] };
  const params = url.paramsWithModel(custom, new URLSearchParams("tab=cashflow"));
  assert.equal(params.get("cf"), "300,-50,700,400");
  assert.equal(params.get("tab"), "cashflow");
  const back = url.modelFromParams(params);
  assert.deepEqual(back.customFlows, [300, -50, 700, 400]);
  assert.equal(back.rate, 0.12);
  assert.equal(url.modelKey(back), url.modelKey(custom));
  const bad = url.modelFromParams(new URLSearchParams("pattern=custom&cf=1,x,3&rate=9"));
  assert.equal(bad.rate, 0.4);
  assert.equal(bad.customFlows.length, bad.years);
});
