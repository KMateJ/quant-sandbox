import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const IDS = ["order-book", "market-making", "avellaneda-stoikov", "glosten-milgrom", "kyle", "spread-estimation"];
const pascal = (id) => id.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());

// registry.ts imports React and .tsx views, so it is read as text.
const registry = await readFile(new URL("../src/modules/registry.ts", import.meta.url), "utf8");
const entryOf = (id) => registry.match(new RegExp(`\\{\\s*id: "${id}",[\\s\\S]*?\\n  \\},`))?.[0];

const tables = async (name) => {
  const [en, hu] = await Promise.all([importSrc(`Language/${name}.ts`), importSrc(`Language/${name}.hu.ts`)]);
  return { en: Object.values(en)[0], hu: Object.values(hu)[0] };
};
const home = await tables("Home");
const seo = await tables("Seo");
const about = await tables("ModuleAbout");
const { MODULE_VIZ } = await importSrc("features/home/home.viz.ts");

test("CATEGORY_ORDER has microstructure once, right after stochastic", () => {
  const order = [...registry.match(/CATEGORY_ORDER: ModuleCategory\[\] = \[([\s\S]*?)\];/)[1].matchAll(/"([\w-]+)"/g)].map((m) => m[1]);
  assert.equal(order.filter((c) => c === "microstructure").length, 1);
  assert.equal(order[order.indexOf("stochastic") + 1], "microstructure");
});

test("each module is registered in the microstructure category", () => {
  for (const id of IDS) {
    const entry = entryOf(id);
    assert.ok(entry, `${id} missing from registry`);
    assert.match(entry, /category: "microstructure"/, id);
    assert.match(entry, new RegExp(`moduleAbout\\("${pascal(id)}", 4\\)`), id);
  }
});

test("nav, SEO and About copy exist in EN and HU and differ", () => {
  for (const id of IDS) {
    const P = pascal(id);
    const pairs = [
      [home, `nav${P}`],
      [seo, `seoTitle${P}`],
      [seo, `seoDesc${P}`],
      [about, `about${P}Intro`],
      ...[1, 2, 3, 4].flatMap((n) => [[about, `about${P}Q${n}`], [about, `about${P}A${n}`]]),
    ];
    for (const [t, key] of pairs) {
      assert.ok(t.en[key], `EN ${key}`);
      assert.ok(t.hu[key], `HU ${key}`);
      assert.notEqual(t.hu[key], t.en[key], `HU ${key} equals EN`);
    }
  }
  assert.ok(home.en.catMicrostructure && home.hu.catMicrostructure);
});

test("every module has a home tile", () => {
  for (const id of IDS) assert.ok(MODULE_VIZ[id], `MODULE_VIZ.${id}`);
});

test("the area has its twelve challenges, each named in EN and HU", async () => {
  const { CHALLENGES } = await importSrc("lib/game/challenges.data.ts");
  const sbx = await tables("Sandbox");
  const ours = CHALLENGES.filter((c) => c.area === "microstructure");
  assert.equal(ours.length, 12);
  for (const c of ours) {
    assert.ok(IDS.includes(c.moduleId), c.id);
    assert.ok(sbx.en[`sbxCh_${c.id}`] && sbx.hu[`sbxCh_${c.id}`], c.id);
    assert.notEqual(sbx.hu[`sbxCh_${c.id}`], sbx.en[`sbxCh_${c.id}`], c.id);
  }
});
