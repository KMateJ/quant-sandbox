import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

// registry.ts imports React and .tsx views, so it is read as text.
const registry = await readFile(new URL("../src/modules/registry.ts", import.meta.url), "utf8");
const entry = registry.match(/\{\s*id: "systemic-risk",[\s\S]*?\n  \},/)?.[0];

const tables = async (name) => {
  const [en, hu] = await Promise.all([importSrc(`Language/${name}.ts`), importSrc(`Language/${name}.hu.ts`)]);
  return { en: Object.values(en)[0], hu: Object.values(hu)[0] };
};
const home = await tables("Home");
const seo = await tables("Seo");
const about = await tables("ModuleAbout");
const { MODULE_VIZ } = await importSrc("features/home/home.viz.ts");

test("systemic-risk is registered in Portfolio & Risk, right after efficient-frontier, with three sub-pages", () => {
  assert.ok(entry, "registry entry");
  assert.match(entry, /category: "portfolio"/);
  assert.match(entry, /moduleAbout\("SystemicRisk", 4\)/);
  const ids = [...registry.matchAll(/^\s{4}id: "([^"]+)"/gm)].map((m) => m[1]);
  assert.equal(ids[ids.indexOf("efficient-frontier") + 1], "systemic-risk");
  const subs = [...entry.matchAll(/to: "(\/systemic-risk[^"]*)"/g)].map((m) => m[1]);
  assert.deepEqual(subs, ["/systemic-risk", "/systemic-risk/shocks", "/systemic-risk/episodes"]);
});

test("nav, SEO and About copy exist in EN and HU and differ", () => {
  const pairs = [
    [home, "navSystemicRisk"], [home, "navSystemicNetwork"], [home, "navSystemicShocks"], [home, "navSystemicEpisodes"],
    [seo, "seoTitleSystemicRisk"], [seo, "seoDescSystemicRisk"], [seo, "seoDescSystemicShocks"], [seo, "seoDescSystemicEpisodes"],
    [about, "aboutSystemicRiskIntro"],
    ...[1, 2, 3, 4].flatMap((n) => [[about, `aboutSystemicRiskQ${n}`], [about, `aboutSystemicRiskA${n}`]]),
  ];
  for (const [t, key] of pairs) {
    assert.ok(t.en[key], `EN ${key}`);
    assert.ok(t.hu[key], `HU ${key}`);
    assert.notEqual(t.hu[key], t.en[key], `HU ${key} equals EN`);
  }
});

test("meta descriptions are 120–160 characters in English", () => {
  for (const key of ["seoDescSystemicRisk", "seoDescSystemicShocks", "seoDescSystemicEpisodes"]) {
    const n = seo.en[key].length;
    assert.ok(n >= 120 && n <= 160, `${key} has ${n} characters`);
  }
});

test("the About copy is long enough for the SEO word floor and names the archetype caveat", () => {
  const words = (s) => s.split(/\s+/).length;
  assert.ok(words(about.en.aboutSystemicRiskIntro) >= 80);
  for (const n of [1, 2, 3, 4]) assert.ok(words(about.en[`aboutSystemicRiskA${n}`]) >= 55, `A${n}`);
  assert.match(about.en.aboutSystemicRiskA4, /stylised archetype/);
});

test("page and chart copy tables have the same keys in EN and HU, and HU differs", async () => {
  for (const name of ["NetworkChart", "SystemicRisk", "SystemicRiskShocks", "SystemicRiskEpisodes"]) {
    const { en, hu } = await tables(name);
    assert.deepEqual(Object.keys(en).sort(), Object.keys(hu).sort(), name);
    for (const key of Object.keys(en)) assert.notEqual(hu[key], en[key], `${name}.${key} equals EN`);
  }
});

test("the module has a home tile", () => {
  assert.ok(MODULE_VIZ["systemic-risk"]);
});
