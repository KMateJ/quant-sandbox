import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

/// Transpiles one dependency-free TS module into a data: URL.
async function load(url) {
  const source = await readFile(url, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

const { normalise, searchItems } = await import(await load(new URL("../src/components/layout/search.logic.ts", import.meta.url)));

const item = (id, kind, title, context = "", extra = "") => ({ id, kind, title, context, extra, href: `/${id}` });
const ids = (list) => list.map((i) => i.id);

test("normalise lower-cases and strips diacritics", () => {
  assert.equal(normalise("Itô Process"), "ito process");
  assert.equal(normalise("Kötvény árazás"), "kotveny arazas");
});

test("accent-insensitive matching works in Hungarian", () => {
  const items = [item("bond", "lab", "Kötvényárazás"), item("capm", "lab", "CAPM")];
  assert.deepEqual(ids(searchItems(items, "kotveny")), ["bond"]);
});

test("title prefix beats title word beats context match", () => {
  const items = [
    item("c", "lab", "Alpha", "Yield area"),
    item("b", "lab", "Spot yield"),
    item("a", "lab", "Yield Curve"),
  ];
  assert.deepEqual(ids(searchItems(items, "yield")), ["a", "b", "c"]);
});

test("every query word must match; empty query returns nothing", () => {
  const items = [item("a", "lab", "Yield Curve"), item("b", "lab", "Yield Spread")];
  assert.deepEqual(ids(searchItems(items, "yield curve")), ["a"]);
  assert.deepEqual(searchItems(items, "  "), []);
});

test("labs rank before lessons on equal score", () => {
  const items = [item("l", "lesson", "Yield curve basics"), item("m", "lab", "Yield Curve")];
  assert.deepEqual(ids(searchItems(items, "yield")), ["m", "l"]);
});

test("lesson descriptions are searchable but rank lowest", () => {
  const items = [item("l", "lesson", "Annuities", "Corporate", "present value of yield streams"), item("m", "lab", "Yield Curve")];
  assert.deepEqual(ids(searchItems(items, "yield")), ["m", "l"]);
});

test("the limit applies per kind", () => {
  const labs = Array.from({ length: 5 }, (_, i) => item(`lab${i}`, "lab", `Rate ${i}`));
  const lessons = Array.from({ length: 5 }, (_, i) => item(`les${i}`, "lesson", `Rate lesson ${i}`));
  const out = searchItems([...labs, ...lessons], "rate", 3);
  assert.equal(out.filter((i) => i.kind === "lab").length, 3);
  assert.equal(out.filter((i) => i.kind === "lesson").length, 3);
});
