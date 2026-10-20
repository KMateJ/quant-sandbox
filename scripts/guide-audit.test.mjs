import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { guideLessons } = await importSrc("features/guide/guide.meta.ts");
const { guideContent } = await importSrc("Language/guides/index.ts");
const { guideSeoTitles } = await importSrc("features/guide/guide.seo.ts");
const { blockTexts, lessonCitations } = await importSrc("features/guide/guide.graph.ts");
const { guideTitleTablesHu } = await importSrc("Language/guideTitles.hu.ts");

const langDir = new URL("../src/Language/", import.meta.url);
const en = {};
for (const file of readdirSync(langDir).filter((f) => /^Guide.*\.ts$/.test(f) && !f.includes(".hu."))) {
  const mod = await importSrc(`Language/${file}`);
  for (const [name, table] of Object.entries(mod)) if (name.endsWith("En")) Object.assign(en, table);
}

const text = (path) => readFileSync(new URL(path, import.meta.url), "utf8").replace(/\r/g, "");
const registry = text("../src/modules/registry.ts") + text("../src/features/stochastic-models/stochasticModels.curriculum.ts");
const figuresIndex = text("../src/features/guide/components/figures/index.ts");
const contentTypes = text("../src/features/guide/guide.content.types.ts");
const guidesPlan = text("../docs/GUIDES_PLAN.md");

// Known failures, each emptied by the named plan in docs/plans/guides-audit; plan 13 requires them empty.
// Plans 03–05.
const NO_CHECKS = [];
const NO_WORKED = [];
// Plan 02.
const NO_SEO_TITLE = [];
const NOT_IN_GUIDES_PLAN = [];
const LAB_WITHOUT_LESSON = [];
// Permanent.
const NO_FIGURE = ["wacc"];
// Registered by plan 07 with placeholder text; plans 08–12 empty this list, one lesson each, when the real lesson lands.
const PLACEHOLDER = [];
const ROOT_LESSONS = ["interest-discounting"]; // may cite nothing and be short
const EN_WORDS = { min: 600, max: 2300 };

const ids = guideLessons.map((l) => l.id);
const kinds = (blocks) => blocks.map((b) => b.kind);
const count = (blocks, kind) => blocks.filter((b) => b.kind === kind).length;
const words = (blocks) => blockTexts(blocks).join(" ").split(/\s+/).filter(Boolean).length;
const figureIds = (lang, id) => guideContent[id][lang].filter((b) => b.kind === "figure").map((b) => b.id);

/// Lessons failing `fails`, minus `allow`; fails the test naming every one.
function expectNone(label, fails, allow = []) {
  const bad = ids.filter((id) => fails(id) && !allow.includes(id));
  assert.deepEqual(bad, [], `${label}: ${bad.join(", ")}`);
}
/// Allowlist entries that no longer fail, so stale entries cannot hide a regression.
function expectNoStale(label, fails, allow) {
  const stale = allow.filter((id) => !fails(id));
  assert.deepEqual(stale, [], `${label} allowlist is stale, remove: ${stale.join(", ")}`);
}

const unionIds = [...contentTypes.slice(contentTypes.indexOf("GuideFigureId")).matchAll(/\| "([a-z0-9-]+)"/g)].map((m) => m[1]);
const registeredFigures = [...figuresIndex.matchAll(/^\s+"?([a-z0-9-]+)"?: \w+Figure,/gm)].map((m) => m[1]);
/// A module's path: a string literal, or a constant such as STUDIO_PATH declared as `const NAME = "…"` (the registry imports STUDIO_PATH, so its source is appended above).
const modulePath = (chunk) => {
  const literal = chunk.match(/^\s{4}path: "([^"]+)"/m)?.[1];
  const name = chunk.match(/^\s{4}path: ([A-Z_]+),/m)?.[1];
  return literal ?? (name && registry.match(new RegExp(`const ${name} = "([^"]+)"`))?.[1]);
};
const modules = [...registry.slice(registry.indexOf("export const modules")).split("\n  {")]
  .map((chunk) => ({ id: chunk.match(/^\s{4}id: "([^"]+)"/m)?.[1], path: modulePath(chunk), related: chunk.match(/relatedGuides: \[([^\]]*)\]/)?.[1] }))
  .filter((m) => m.id && m.path);

test("EN and HU have the same block kinds in the same order", () => {
  expectNone("block kinds differ", (id) => kinds(guideContent[id].en).join() !== kinds(guideContent[id].hu).join());
});

test("every lesson has a figure, figure ids are registered, used, and not shared", () => {
  expectNone("no figure", (id) => figureIds("en", id).length === 0, NO_FIGURE);
  const used = ids.flatMap((id) => figureIds("en", id));
  const unknown = used.filter((f) => !unionIds.includes(f) || !registeredFigures.includes(f));
  assert.deepEqual(unknown, [], `figure ids missing from the union or figures/index.ts: ${unknown.join(", ")}`);
  const unused = unionIds.filter((f) => !used.includes(f));
  assert.deepEqual(unused, [], `figure ids no lesson uses: ${unused.join(", ")}`);
  const shared = [...new Set(used.filter((f, i) => used.indexOf(f) !== i))];
  assert.deepEqual(shared, [], `figure ids used by two lessons: ${shared.join(", ")}`);
});

test("every lesson has at least two checks", () => {
  const fails = (id) => count(guideContent[id].en, "check") < 2;
  expectNone("fewer than 2 checks", fails, [...NO_CHECKS, ...PLACEHOLDER]);
  expectNoStale("NO_CHECKS", fails, NO_CHECKS);
});

test("every lesson has a worked example", () => {
  const fails = (id) => count(guideContent[id].en, "worked") < 1;
  expectNone("no worked example", fails, [...NO_WORKED, ...PLACEHOLDER]);
  expectNoStale("NO_WORKED", fails, NO_WORKED);
});

test("every lesson ends with a Summary, a list and a lab link", () => {
  const SUMMARY = { en: "Summary", hu: "Összefoglalás" };
  const endsWell = (blocks, lang) => {
    const last = blocks.at(-1);
    const heading = blocks.findLast((b) => b.kind === "h");
    const afterHeading = blocks.slice(blocks.indexOf(heading) + 1);
    return last?.kind === "lab" && heading?.text === SUMMARY[lang] && afterHeading.some((b) => b.kind === "list");
  };
  expectNone("bad ending", (id) => !endsWell(guideContent[id].en, "en") || !endsWell(guideContent[id].hu, "hu"));
});

test("at most two notes per lesson and language", () => {
  expectNone("more than 2 notes", (id) => count(guideContent[id].en, "note") > 2 || count(guideContent[id].hu, "note") > 2);
});

test("EN word count stays inside the range", () => {
  expectNone("word count out of range", (id) => {
    const n = words(guideContent[id].en);
    return n > EN_WORDS.max || n < EN_WORDS.min;
  }, [...ROOT_LESSONS, ...PLACEHOLDER]);
});

test("lab links point at registered modules and every lab has a lesson", () => {
  const moduleIds = modules.map((m) => m.id);
  const paths = modules.map((m) => m.path);
  expectNone("unknown module in labs", (id) => guideLessons.find((l) => l.id === id).labs.some((m) => !moduleIds.includes(m)));
  const badPath = (id) =>
    ["en", "hu"].some((lang) =>
      guideContent[id][lang].some((b) => b.kind === "lab" && !paths.includes(b.to.split("?")[0]) && !b.to.startsWith("/stochastic-models/")),
    );
  expectNone("lab link to an unknown path", badPath);
  const practised = new Set(guideLessons.flatMap((l) => l.labs));
  const orphan = moduleIds.filter((m) => m !== "home" && !m.startsWith("guide-") && !practised.has(m) && !LAB_WITHOUT_LESSON.includes(m));
  assert.deepEqual(orphan, [], `labs no lesson practises: ${orphan.join(", ")}`);
  const staleLabs = LAB_WITHOUT_LESSON.filter((m) => practised.has(m));
  assert.deepEqual(staleLabs, [], `LAB_WITHOUT_LESSON allowlist is stale, remove: ${staleLabs.join(", ")}`);
  const related = modules.flatMap((m) => [...(m.related ?? "").matchAll(/"([^"]+)"/g)].map((r) => r[1]));
  const unknownRelated = related.filter((r) => !ids.includes(r));
  assert.deepEqual(unknownRelated, [], `relatedGuides that are not lessons: ${unknownRelated.join(", ")}`);
});

test("titles and descriptions exist in both languages as plain noun phrases", () => {
  expectNone("missing or malformed title/description", (id) => {
    const l = guideLessons.find((x) => x.id === id);
    const title = en[l.titleKey] ?? "";
    return !title || /\.$/.test(title) || /^(Why|How|What)\b/.test(title) || !en[l.descKey] || !guideTitleTablesHu[l.titleKey] || !guideTitleTablesHu[l.descKey];
  });
});

test("every lesson has a search title", () => {
  const fails = (id) => !guideSeoTitles[id];
  expectNone("no SEO title", fails, NO_SEO_TITLE);
  expectNoStale("NO_SEO_TITLE", fails, NO_SEO_TITLE);
});

test("lessons cite earlier lessons by exact title in both languages", () => {
  const titleOf = (lesson, lang) => (lang === "en" ? en : guideTitleTablesHu)[lesson.titleKey];
  const cites = lessonCitations({ lessons: guideLessons, content: guideContent, titleOf, moduleIdForPath: () => undefined });
  const real = cites.filter((c) => !c.preview);
  const has = (id, lang) => real.some((c) => c.source === id && c.lang === lang);
  expectNone("no citation in EN or HU", (id) => !has(id, "en") || !has(id, "hu"), [...ROOT_LESSONS, ...PLACEHOLDER]);
  const pair = (lang) => new Set(real.filter((c) => c.lang === lang).map((c) => `${c.source}>${c.target}`));
  const [a, b] = [pair("en"), pair("hu")];
  const lopsided = [...a].filter((p) => !b.has(p)).map((p) => `${p} (EN only)`).concat([...b].filter((p) => !a.has(p)).map((p) => `${p} (HU only)`));
  assert.deepEqual(lopsided, [], `citations in one language only: ${lopsided.join(", ")}`);
});

test("the opening paragraph quotes a registered title", () => {
  expectNone("opening does not cite a lesson", (id) => {
    const first = guideContent[id].en[0];
    if (first?.kind !== "p") return true;
    return !guideLessons.some((l) => l.id !== id && blockTexts([first]).join(" ").includes(`"${en[l.titleKey]}"`));
  }, [...ROOT_LESSONS, ...PLACEHOLDER]);
});

test("docs/GUIDES_PLAN.md lists every lesson with its real title and figure", () => {
  const rows = new Map([...guidesPlan.matchAll(/^\| \d+b? \| ([a-z0-9-]+) \| ([^|]+) \| [^|]+ \| ([^|]+) \| ([^|]+) \|$/gm)].map((m) => [m[1], { title: m[2].trim(), figure: m[4].trim() }]));
  const fails = (id) => !rows.has(id);
  expectNone("missing from GUIDES_PLAN", fails, NOT_IN_GUIDES_PLAN);
  expectNoStale("NOT_IN_GUIDES_PLAN", fails, NOT_IN_GUIDES_PLAN);
  expectNone("GUIDES_PLAN title or figure differs", (id) => {
    const row = rows.get(id);
    if (!row) return false;
    const l = guideLessons.find((x) => x.id === id);
    const figs = figureIds("en", id);
    return row.title !== en[l.titleKey] || (row.figure === "(none)" ? figs.length > 0 : !figs.includes(row.figure));
  }, NOT_IN_GUIDES_PLAN);
});

test("Stochastic Studio chapters link only to real lessons and cover the whole stochastic track", () => {
  const curriculum = text("../src/features/stochastic-models/stochasticModels.curriculum.ts");
  const linked = [...curriculum.matchAll(/guides: \[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]));
  const unknown = linked.filter((id) => !ids.includes(id));
  assert.deepEqual(unknown, [], `Studio guides that are not lessons: ${unknown.join(", ")}`);
  const stochastic = guideLessons.filter((l) => l.track === "stochastic").map((l) => l.id);
  const unlinked = stochastic.filter((id) => !linked.includes(id));
  assert.deepEqual(unlinked, [], `stochastic lessons no Studio chapter links to: ${unlinked.join(", ")}`);
});
