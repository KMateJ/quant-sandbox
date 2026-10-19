import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { languagePrefix, languageFromPath, stripLanguage, localizedPath } = await importSrc("languageRoutes.ts");

test("the default language has no prefix", () => {
  assert.equal(languagePrefix("en"), "");
  assert.equal(languagePrefix("hu"), "/hu");
});

test("the language is read from the first path segment only", () => {
  assert.equal(languageFromPath("/hu/wacc"), "hu");
  assert.equal(languageFromPath("/hu"), "hu");
  assert.equal(languageFromPath("/wacc"), "en");
  assert.equal(languageFromPath("/"), "en");
  assert.equal(languageFromPath("/humble"), "en");
  assert.equal(languageFromPath("/guide/hu"), "en");
});

test("stripping the prefix leaves the registry path", () => {
  assert.equal(stripLanguage("/hu/guide/corporate/wacc"), "/guide/corporate/wacc");
  assert.equal(stripLanguage("/hu"), "/");
  assert.equal(stripLanguage("/wacc"), "/wacc");
  assert.equal(stripLanguage("/"), "/");
});

test("localizing then stripping is the identity", () => {
  for (const path of ["/", "/wacc", "/guide/corporate/wacc"]) {
    for (const lang of ["en", "hu"]) assert.equal(stripLanguage(localizedPath(path, lang)), path);
  }
  assert.equal(localizedPath("/", "hu"), "/hu");
  assert.equal(localizedPath("/", "en"), "/");
  assert.equal(localizedPath("/wacc", "hu"), "/hu/wacc");
});
