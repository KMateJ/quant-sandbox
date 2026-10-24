import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/retirement-desk/";
const { eventText } = await importSrc(`${D}eventText.ts`);
const { objectiveView } = await importSrc(`${D}objectiveViews.ts`);
const { parseAmount, presetAmount, decisionPreview, firstDecadeReturn, fixedRulePath, PRESETS } = await importSrc(`${D}ticket.math.ts`);
const { oddsWord, compact } = await importSrc(`${D}retirementFormat.ts`);
const { RETIREMENT_MISSIONS, retirementMissionById } = await importSrc(`${D}engine/missions.data.ts`);
const { startRetirement, reduceRetirement } = await importSrc(`${D}engine/book.math.ts`);
const { yearShocks } = await importSrc(`${D}engine/market.math.ts`);
const { evaluateRetirement } = await importSrc(`${D}engine/objectives.math.ts`);
const { retirementDeskEn } = await importSrc("Language/RetirementDesk.ts");
const { retirementDeskHu } = await importSrc("Language/RetirementDesk.hu.ts");

/// Fake translate that fails on unknown keys and echoes the key.
const t = (key) => {
  assert.ok(key in retirementDeskEn, `missing copy key ${key}`);
  return key;
};

const T1 = retirementMissionById("T1");

test("eventText covers every event kind with known copy", () => {
  const events = [
    { t: 0, kind: "start" },
    { t: 1, kind: "take", amount: 40000, equity: 0.6, tag: "manual" },
    { t: 1, kind: "take", amount: 40000, equity: 0.6, tag: "auto" },
    { t: 2, kind: "cut", amount: 30000, pct: -0.25 },
    { t: 3, kind: "bigYear", r: -0.2 },
    { t: 4, kind: "broke" },
    { t: 30, kind: "end", wealth: 500000 },
  ];
  for (const e of events) {
    const row = eventText(e, t);
    assert.ok(row.text && row.kind && row.t);
  }
  assert.equal(eventText(events[3], t).tone, "down");
  assert.equal(eventText(events[4], t).tone, "down");
});

test("objectiveView labels every objective kind of every mission", () => {
  for (const m of RETIREMENT_MISSIONS) {
    const s = startRetirement(m, 1);
    for (const r of evaluateRetirement(m, s, 0.9)) assert.ok(objectiveView(r, t, m.years).label);
  }
});

test("amount parsing rejects empty, negative and junk input", () => {
  assert.equal(parseAmount(""), null);
  assert.equal(parseAmount("  "), null);
  assert.equal(parseAmount("-5"), null);
  assert.equal(parseAmount("abc"), null);
  assert.equal(parseAmount("40,000"), 40000);
  assert.equal(parseAmount("0"), 0);
});

test("presets, preview and cut detection", () => {
  const s0 = startRetirement(T1, 1);
  assert.equal(presetAmount("initial", T1, s0), 40000);
  assert.equal(presetAmount("now", T1, s0), 40000);
  assert.equal(presetAmount("low", T1, s0), 35000);
  for (const id of PRESETS) assert.ok(presetAmount(id, T1, s0) > 0);
  const s1 = reduceRetirement(s0, { type: "take", amount: 40000, equity: 0.6, tag: "manual" }, T1, yearShocks(T1, 1));
  assert.equal(decisionPreview(30000, s1).isCut, true);
  assert.equal(decisionPreview(38000, s1).isCut, false);
  assert.equal(decisionPreview(0, s1).cover, Infinity);
});

test("fixed-rule path and first-decade return follow the rows", () => {
  let s = startRetirement(T1, 2);
  assert.equal(firstDecadeReturn(s), null);
  s = reduceRetirement(s, { type: "auto", years: 12, rule: "guardrails" }, T1, yearShocks(T1, 2));
  const path = fixedRulePath(T1, s);
  assert.equal(path.length, s.rows.length + 1);
  assert.equal(path[0], T1.start);
  const g = s.rows.slice(0, 10).reduce((a, r) => a * (1 + r.r), 1) ** 0.1 - 1;
  assert.ok(Math.abs(firstDecadeReturn(s) - g) < 1e-12);
});

test("odds words and compact amounts", () => {
  assert.equal(oddsWord(0.9), "comfortable");
  assert.equal(oddsWord(0.75), "stretched");
  assert.equal(oddsWord(0.5), "danger");
  assert.equal(compact(1_250_000), "1.25m");
  assert.equal(compact(640_000), "640k");
});

test("copy: EN/HU parity and every HU value differs", () => {
  assert.deepEqual(Object.keys(retirementDeskHu).sort(), Object.keys(retirementDeskEn).sort());
  for (const k of Object.keys(retirementDeskEn)) assert.notEqual(retirementDeskHu[k], retirementDeskEn[k], k);
});
