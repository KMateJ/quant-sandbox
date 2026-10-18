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


const m = await import(await load(new URL("../src/features/guide/guide.interactive.immunizationShock.math.ts", import.meta.url)));
const close = (a, b, eps) => assert.ok(Math.abs(a - b) < eps, `${a} vs ${b}`);

test("the lesson's worked example: PV 710,681, durations 1.952 / 9.306, 31.36% in the short bond", () => {
  close(m.liabilityValue(0.05), 710681.33, 0.01);
  close(m.bondDuration(m.IMMUNIZATION.short, 0.05), 1.9524, 1e-4);
  close(m.bondDuration(m.IMMUNIZATION.long, 0.05), 9.3064, 1e-4);
  close(m.matchedShortWeight(), 0.3136, 1e-4);
});

test("matched portfolio: equal PV and duration at the start, surplus ≥ 0 for every parallel shock", () => {
  const s0 = m.afterShock("matched", 0);
  close(s0.surplus, 0, 1e-6);
  close(s0.assetDuration, 7, 1e-9);
  for (const c of m.surplusCurve("matched")) assert.ok(c.surplus > -1e-6, `surplus ${c.surplus} at ${c.shock}`);
  close(m.afterShock("matched", -0.01).surplus, 747, 1);
  close(m.afterShock("matched", 0.01).surplus, 642, 1);
});

test("unmatched portfolios lose on one side: short loses when yields fall, long when they rise", () => {
  assert.ok(m.afterShock("short", -0.01).surplus < -30000);
  assert.ok(m.afterShock("long", 0.01).surplus < -10000);
});

test("asset duration drifts away from 7 when yields move, so the hedge needs rebalancing", () => {
  close(m.afterShock("matched", 0.01).assetDuration, 6.796, 1e-3);
  close(m.afterShock("matched", -0.01).assetDuration, 7.205, 1e-3);
});
