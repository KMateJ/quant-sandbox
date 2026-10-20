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

const dir = new URL("../src/features/home/", import.meta.url);
const { MODULE_VIZ, GUIDE_FILLER_VIZ, areaPath } = await import(await load(new URL("home.viz.ts", dir)));
const { buildFan, HERO_FAN } = await import(await load(new URL("home.fan.math.ts", dir)));
const { orderTiles, needsGuideFiller, categoryNumber, trackProgress, labDescKey } = await import(await load(new URL("home.model.ts", dir)));

const LAB_CATEGORIES = ["derivatives", "portfolio", "fixed-income", "corporate", "stochastic"];

/// registry.ts imports React, so read module id / category / homeFeatured from its text.
async function registryEntries() {
  const text = await readFile(new URL("../src/modules/registry.ts", import.meta.url), "utf8");
  const body = text.slice(text.indexOf("export const modules"));
  return body
    .split("\n  {")
    .map((chunk) => ({
      id: chunk.match(/^\s{4}id: "([^"]+)"/m)?.[1],
      category: chunk.match(/^\s{4}category: "([^"]+)"/m)?.[1],
      featured: /^\s{4}homeFeatured: true/m.test(chunk),
    }))
    .filter((m) => m.id && LAB_CATEGORIES.includes(m.category));
}

test("every lab has a mini visual, no stale ones exist, one featured lab per area", async () => {
  const labs = await registryEntries();
  assert.equal(labs.length, 24);
  assert.deepEqual(labs.map((l) => l.id).sort(), Object.keys(MODULE_VIZ).sort());
  for (const category of LAB_CATEGORIES) {
    const featured = labs.filter((l) => l.category === category && l.featured);
    assert.equal(featured.length, 1, `${category} featured count`);
  }
});

test("mini visual geometry stays inside the 120x64 box", () => {
  for (const viz of [...Object.values(MODULE_VIZ), GUIDE_FILLER_VIZ]) {
    for (const line of viz.lines) {
      assert.ok(line.w > 0 && line.o > 0 && line.o <= 1);
      const nums = line.d.match(/-?\d+(\.\d+)?/g).map(Number);
      assert.ok(nums.every((n) => n >= 0 && n <= 120), line.d);
    }
    for (const dot of viz.dots ?? []) assert.ok(dot.x >= 0 && dot.x <= 120 && dot.y >= 0 && dot.y <= 64);
  }
  assert.ok(areaPath("M6 8 L10 9").endsWith("L114 64 L6 64 Z"));
});

test("the hero fan is deterministic (hydration) and stays inside its frame", () => {
  const a = buildFan(HERO_FAN);
  assert.deepEqual(a, buildFan(HERO_FAN));
  assert.equal(a.paths.length, 70);
  assert.ok(a.paths.every((p, i) => i === 0 || a.paths[i - 1].end <= p.end));
  for (const { d } of a.paths) {
    const ys = [...d.matchAll(/ (-?\d+\.\d) ?/g)].map((m) => Number(m[1]));
    assert.ok(ys.every((y) => y >= HERO_FAN.yTop && y <= HERO_FAN.yBottom), d);
  }
  assert.equal(a.bins.length, HERO_FAN.bins);
  assert.equal(Math.max(...a.bins.map((b) => b.w)), 88);
  assert.ok(a.bins.every((b) => b.w >= 0 && b.h > 0));
  assert.equal(a.keyIndex, Math.round(0.75 * 69));
  assert.ok(a.mean.startsWith("M") && a.y0 > HERO_FAN.yTop && a.y0 < HERO_FAN.yBottom);
  assert.notDeepEqual(a, buildFan({ ...HERO_FAN, seed: 8 }));
});

test("tiles put the featured lab first and number the area", () => {
  const tiles = orderTiles(0, [{ id: "a", featured: false }, { id: "b", featured: true }]);
  assert.deepEqual(tiles.map((t) => [t.id, t.code]), [["b", "01.1"], ["a", "01.2"]]);
  assert.equal(orderTiles(2, [{ id: "x", featured: false }])[0].code, "03.1");
  assert.equal(categoryNumber(4), "05");
});

test("guide filler and track progress helpers", () => {
  assert.equal(needsGuideFiller(4), true);
  assert.equal(needsGuideFiller(5), false);
  assert.deepEqual(trackProgress(4, 16), { label: "4 / 16", pct: 0.25 });
  assert.deepEqual(trackProgress(0, 0), { label: "0 / 0", pct: 0 });
});

test("every lab has a description string in English and Hungarian", async () => {
  const [en, hu] = await Promise.all(
    ["Home.ts", "Home.hu.ts"].map((f) => readFile(new URL(`../src/Language/${f}`, import.meta.url), "utf8")),
  );
  for (const { id } of await registryEntries()) {
    const key = labDescKey(id);
    assert.ok(en.includes(`${key}:`), `${key} missing in EN`);
    assert.ok(hu.includes(`${key}:`), `${key} missing in HU`);
  }
});
