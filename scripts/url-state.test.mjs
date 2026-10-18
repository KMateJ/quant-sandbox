import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { urlNumber, urlEnum, urlBool, urlString, parseUrlState, writeUrlState } = await importSrc("lib/urlState.ts");

const schema = {
  k: urlNumber(100, 20, 200),
  r: urlNumber(0.05, 0, 0.3, 3),
  type: urlEnum(["call", "put"], "call"),
  american: urlBool(false),
  name: urlString(""),
};

test("missing or invalid values fall back to the defaults", () => {
  const s = parseUrlState(schema, new URLSearchParams("k=abc&type=straddle&american=maybe"));
  assert.deepEqual(s, { k: 100, r: 0.05, type: "call", american: false, name: "" });
});

test("numbers are clamped and rounded", () => {
  const s = parseUrlState(schema, new URLSearchParams("k=999&r=0.123456"));
  assert.equal(s.k, 200);
  assert.equal(s.r, 0.123);
});

test("defaults are left out and foreign keys are kept", () => {
  const params = writeUrlState(schema, { k: 100, r: 0.04, type: "put", american: true, name: "" }, new URLSearchParams("lab=replicate&k=150"));
  assert.equal(params.get("lab"), "replicate");
  assert.equal(params.has("k"), false);
  assert.equal(params.get("r"), "0.04");
  assert.equal(params.get("type"), "put");
  assert.equal(params.get("american"), "1");
  assert.equal(params.has("name"), false);
});

test("write then parse is the identity", () => {
  const state = { k: 120, r: 0.071, type: "put", american: true, name: "demo" };
  assert.deepEqual(parseUrlState(schema, writeUrlState(schema, state, new URLSearchParams())), state);
});
