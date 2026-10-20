import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
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

const src = new URL("../src/", import.meta.url);
const { prerequisiteLevels, lessonLinks, trackColor, lessonCode } = await import(await load(new URL("features/guide/guide.ui.ts", src)));

// A ← B ← C ← D by citation (each quotes the one before); E → F by sequence; G cites both C and D;
// a cycle X ↔ Y; H practises a lab.
const c = (source, target) => ({ source, target, kind: "citation" });
const s = (source, target) => ({ source, target, kind: "sequence" });
const EDGES = [
  c("B", "A"), c("C", "B"), c("D", "C"),
  s("E", "F"), c("F", "D"),
  c("G", "C"), c("G", "A"),
  c("X", "Y"), c("Y", "X"),
  { source: "H", target: "lab:x", kind: "practice" },
];
const ORDER = new Map(["A", "B", "C", "D", "E", "F", "G", "X", "Y", "H"].map((id, i) => [id, i]));

test("a citation chain gives one level per step back", () => {
  assert.deepEqual(prerequisiteLevels(EDGES, "D", ORDER), [
    { depth: 1, ids: ["C"] },
    { depth: 2, ids: ["B"] },
    { depth: 3, ids: ["A"] },
  ]);
});

test("a node reachable by two routes takes the shorter depth", () => {
  // G quotes A directly and also via C → B → A.
  assert.deepEqual(prerequisiteLevels(EDGES, "G", ORDER), [{ depth: 1, ids: ["A", "C"] }, { depth: 2, ids: ["B"] }]);
});

test("sequence edges count as prerequisites, cycles terminate, and deep levels merge", () => {
  const f = prerequisiteLevels(EDGES, "F", ORDER, 2);
  assert.deepEqual(f, [{ depth: 1, ids: ["D", "E"] }, { depth: 2, ids: ["A", "B", "C"] }]);
  assert.deepEqual(prerequisiteLevels(EDGES, "X", ORDER), [{ depth: 1, ids: ["Y"] }]);
  assert.deepEqual(prerequisiteLevels(EDGES, "H", ORDER), []);
});

test("lessonLinks reads each edge kind in the right direction", () => {
  assert.deepEqual(lessonLinks(EDGES, "C"), { buildsOn: ["B"], leadsTo: ["D", "G"] });
  assert.deepEqual(lessonLinks(EDGES, "F"), { buildsOn: ["E", "D"], leadsTo: [] });
  assert.deepEqual(lessonLinks(EDGES, "E"), { buildsOn: [], leadsTo: ["F"] });
  assert.deepEqual(lessonLinks(EDGES, "H"), { buildsOn: [], leadsTo: [] });
  assert.equal(trackColor("portfolio"), "var(--track-portfolio)");
});

test("on the real guide graph every level holds lesson ids only", async () => {
  const graph = await import(await load(new URL("features/guide/guide.graph.ts", src)));
  const { guideLessons } = await import(await load(new URL("features/guide/guide.meta.ts", src)));
  const { guideContent } = await import(await load(new URL("Language/guides/index.ts", src)));
  const tables = { hu: {}, en: {} };
  for (const f of (await readdir(new URL("Language/", src))).filter((f) => /^Guide.*\.ts$/.test(f))) {
    const mod = await import(await load(new URL(`Language/${f}`, src)));
    for (const [name, value] of Object.entries(mod)) {
      if (/Hu$/.test(name)) Object.assign(tables.hu, value);
      if (/En$/.test(name)) Object.assign(tables.en, value);
    }
  }
  const g = graph.buildGuideGraph({
    lessons: guideLessons,
    content: guideContent,
    titleOf: (lesson, lang) => tables[lang][lesson.titleKey],
    moduleIdForPath: (path) => path.replace(/^\//, "").split(/[?#/]/)[0] || undefined,
  });
  const order = new Map(guideLessons.map((l, i) => [graph.lessonNodeId(l.id), i]));
  let withPrereqs = 0;
  for (const l of guideLessons) {
    const levels = prerequisiteLevels(g.edges, graph.lessonNodeId(l.id), order);
    if (levels.length) withPrereqs++;
    for (const { ids } of levels) assert.ok(ids.every((id) => id.startsWith("lesson:")), `${l.id}: ${ids}`);
  }
  assert.ok(withPrereqs > guideLessons.length / 2, "most lessons build on something");
});

test("lessonCode numbers a lesson by track and position", async () => {
  const { guideTracks, trackLessons } = await import(await load(new URL("features/guide/guide.meta.ts", src)));
  const second = trackLessons(guideTracks[1]);
  assert.equal(lessonCode(trackLessons(guideTracks[0])[0].id), "01.01");
  assert.equal(lessonCode(second[2].id), "02.03");
  assert.equal(lessonCode("no-such-lesson"), undefined);
});
