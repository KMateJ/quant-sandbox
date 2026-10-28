import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { guideLessons, guideTracks } = await importSrc("features/guide/guide.meta.ts");
const { guideContent } = await importSrc("Language/guides/index.ts");

const text = (path) => readFileSync(new URL(`../src/${path}`, import.meta.url), "utf8").replace(/\r/g, "");
const registry = text("modules/registry.ts");
const figuresIndex = text("features/guide/components/figures/index.ts");

// Reading order fixed by docs/plans/market-making-guides/README.md §2.
const LESSONS = [
  "market-makers",
  "limit-order-book",
  "queue-position",
  "adverse-selection",
  "glosten-milgrom",
  "spread-measurement",
  "kyle-model",
  "price-impact",
  "inventory-risk",
  "avellaneda-stoikov",
  "market-making-pnl",
];
const lessons = guideLessons.filter((l) => l.track === "microstructure");

test("the microstructure track holds exactly its 11 lessons in reading order", () => {
  assert.deepEqual(lessons.map((l) => l.id), LESSONS);
  assert.deepEqual(guideTracks.find((t) => t.id === "microstructure")?.lessons, LESSONS);
});

test("every lab a microstructure lesson practises is a registered module", () => {
  const missing = lessons.flatMap((l) => l.labs).filter((lab) => !registry.includes(`    id: "${lab}",`));
  assert.deepEqual(missing, []);
});

test("every microstructure lesson's figure id is registered", () => {
  const missing = lessons
    .flatMap((l) => guideContent[l.id].en.filter((b) => b.kind === "figure").map((b) => b.id))
    .filter((id) => !new RegExp(`^\\s+"?${id}"?: \\w+Figure,`, "m").test(figuresIndex));
  assert.deepEqual(missing, []);
});

test("each lesson has exactly one string region in both string files", () => {
  for (const file of ["Language/GuideMicrostructure.ts", "Language/GuideMicrostructure.hu.ts"]) {
    const src = text(file);
    const bad = LESSONS.filter((id) => src.split("\n").filter((line) => line.trim() === `// #region ${id}`).length !== 1);
    assert.deepEqual(bad, [], `${file}: regions missing or repeated`);
  }
});

// test:seo rejects Markdown twins containing these words, even in prose.
test("no lesson text contains words the Markdown-twin audit treats as leaks", () => {
  const bad = LESSONS.filter((id) => /undefined|\[object Object\]/.test(JSON.stringify(guideContent[id])));
  assert.deepEqual(bad, []);
});

// Owner rule: plain noun-phrase headings, no "From X to Y".
test("no microstructure heading uses the From X to Y pattern", () => {
  const bad = LESSONS.flatMap((id) => [...guideContent[id].en, ...guideContent[id].hu])
    .filter((b) => b.kind === "h" && /^(From .+ to |A .+tól a |Az .+tól a )/.test(b.text ?? ""));
  assert.deepEqual(bad, []);
});
