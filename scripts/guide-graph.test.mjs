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

const src = new URL("../src/", import.meta.url);
const graph = await import(await load(new URL("features/guide/guide.graph.ts", src)));
const { guideLessons } = await import(await load(new URL("features/guide/guide.meta.ts", src)));
const { guideContent } = await import(await load(new URL("Language/guides/index.ts", src)));

// Lesson titles straight from the string tables (every *Hu / *En export of the Guide*.ts files).
const { readdir } = await import("node:fs/promises");
const tables = { hu: {}, en: {} };
for (const f of (await readdir(new URL("Language/", src))).filter((f) => /^Guide.*\.ts$/.test(f))) {
  const mod = await import(await load(new URL(`Language/${f}`, src)));
  for (const [name, value] of Object.entries(mod)) {
    if (/Hu$/.test(name)) Object.assign(tables.hu, value);
    if (/En$/.test(name)) Object.assign(tables.en, value);
  }
}
const sources = {
  lessons: guideLessons,
  content: guideContent,
  titleOf: (lesson, lang) => tables[lang][lesson.titleKey],
  moduleIdForPath: (path) => path.replace(/^\//, "").split(/[?#/]/)[0] || undefined,
};

test("the matcher finds exact quoted titles only, in both quote styles, and never the lesson itself", () => {
  const titles = new Map([["Delta and hedging", "delta-hedging"], ["Put–call parity", "put-call-parity"]]);
  const text = 'See "Delta and hedging" and “Put–call parity”, but not "Delta and hedging basics" or "Delta".';
  const found = graph.findLessonCitations(text, "en", titles);
  assert.deepEqual(found.map((c) => c.id), ["delta-hedging", "put-call-parity"]);
  assert.equal(text.slice(found[0].titleStart, found[0].titleEnd), "Delta and hedging");
  assert.equal(text.slice(found[0].start, found[0].end), '"Delta and hedging"');
  assert.equal(graph.findLessonCitations(text, "en", titles, "delta-hedging").length, 1);
  const hu = graph.findLessonCitations("Lásd a „Fedezés” leckét.", "hu", new Map([["Fedezés", "delta-hedging"]]));
  assert.deepEqual(hu.map((c) => c.id), ["delta-hedging"]);
});

test("every lesson has a title in both languages, and the graph connects all of them", () => {
  for (const l of guideLessons) for (const lang of ["en", "hu"]) assert.ok(sources.titleOf(l, lang), `${l.id} ${lang}`);
  const g = graph.buildGuideGraph(sources);
  const lessonNodes = g.nodes.filter((n) => n.kind === "lesson");
  assert.equal(lessonNodes.length, guideLessons.length);
  assert.ok(lessonNodes.every((n) => n.degree > 0), "isolated lesson");
  assert.ok(g.edges.filter((e) => e.kind === "citation").length > guideLessons.length / 2, "too few citations");
  // Citation edges point backwards in reading order within a track.
  const order = new Map(guideLessons.map((l, i) => [`lesson:${l.id}`, { i, track: l.track }]));
  for (const e of g.edges.filter((e) => e.kind === "citation")) {
    const a = order.get(e.source), b = order.get(e.target);
    if (a.track === b.track) assert.ok(b.i < a.i, `${e.source} -> ${e.target}`);
  }
});

// Reviewed forward references that are explicit previews ("… is the subject of X", "… return in X"), not dependencies.
const PREVIEWS = new Set([
  "ito-lemma>monte-carlo-pricing",
  "instruments>no-arbitrage",
  "instruments>multi-step-trees",
  "strategies>put-call-parity",
  "put-call-parity>toward-black-scholes",
  "probability-spaces>martingales",
  "reflection-principle>change-of-measure",
]);

test("reading order: no lesson depends on a later lesson of its own track (beyond the next one)", () => {
  const issues = graph.readingOrderIssues(sources).filter((c) => !PREVIEWS.has(`${c.source}>${c.target}`));
  if (issues.length) console.log("reading-order issues:", JSON.stringify(issues, null, 1));
  assert.equal(issues.length, 0);
});

const layout = await import(await load(new URL("features/guide/guide.graph.layout.ts", src)));

test("layout is deterministic, stays inside the canvas and is fast enough", () => {
  const g = graph.buildGuideGraph(sources);
  const nodes = g.nodes.map((n) => ({ id: n.id, group: n.kind === "lesson" ? n.track : "labs", radius: 6 }));
  const edges = g.edges.map((e) => ({ source: e.source, target: e.target, length: 70, strength: 0.06 }));
  const t0 = performance.now();
  const a = layout.forceLayout(nodes, edges, { width: 960, height: 640, seed: 7 });
  const ms = performance.now() - t0;
  const b = layout.forceLayout(nodes, edges, { width: 960, height: 640, seed: 7 });
  assert.deepEqual([...a.entries()], [...b.entries()]);
  for (const [, p] of a) assert.ok(p.x >= 0 && p.x <= 960 && p.y >= 0 && p.y <= 640, JSON.stringify(p));
  console.log(`layout of ${nodes.length} nodes / ${edges.length} edges: ${ms.toFixed(1)} ms`);
  assert.ok(ms < 150, `layout took ${ms} ms`);
});

test("learning path: prerequisites come first, in a valid order, ending at the selected lesson", () => {
  const g = graph.buildGuideGraph(sources);
  const order = new Map(guideLessons.map((l, i) => [`lesson:${l.id}`, i]));
  const path = graph.learningPath(g, "lesson:toward-black-scholes", order);
  assert.equal(path.steps.at(-1), "lesson:toward-black-scholes");
  assert.ok(path.steps.includes("lesson:gbm") && path.steps.includes("lesson:instruments"));
  const pos = new Map(path.steps.map((id, i) => [id, i]));
  for (const e of g.edges) {
    if (!pos.has(e.source) || !pos.has(e.target)) continue;
    if (e.kind === "citation") assert.ok(pos.get(e.target) < pos.get(e.source), `${e.target} before ${e.source}`);
    if (e.kind === "sequence") assert.ok(pos.get(e.source) < pos.get(e.target), `${e.source} before ${e.target}`);
  }
  const first = graph.learningPath(g, `lesson:${guideLessons[0].id}`, order);
  assert.deepEqual(first.steps, [`lesson:${guideLessons[0].id}`]);
});

test("PageRank: a proper distribution, deterministic, and foundational lessons rank highest", () => {
  const g = graph.buildGuideGraph(sources);
  const total = g.nodes.reduce((s, n) => s + n.rank, 0);
  assert.ok(Math.abs(total - g.nodes.length) < 1e-6, `sum ${total}`);
  assert.ok(g.nodes.every((n) => n.rank > 0));
  assert.deepEqual(graph.buildGuideGraph(sources).nodes.map((n) => n.rank), g.nodes.map((n) => n.rank));
  const lessons = g.nodes.filter((n) => n.kind === "lesson").sort((a, b) => b.rank - a.rank);
  console.log("top lessons by PageRank:", lessons.slice(0, 6).map((n) => `${n.lessonId} ${n.rank.toFixed(2)}`).join(", "));
  console.log("bottom:", lessons.slice(-3).map((n) => `${n.lessonId} ${n.rank.toFixed(2)}`).join(", "));
  const top = lessons.slice(0, 6).map((n) => n.lessonId);
  assert.ok(top.includes("interest-discounting"), top.join(","));
  // A lesson nobody builds on should not outrank its own prerequisites.
  const rankOf = (id) => g.nodes.find((n) => n.id === `lesson:${id}`).rank;
  assert.ok(rankOf("instruments") > rankOf("exotic-options"));
});
