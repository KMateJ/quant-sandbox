import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/alm-desk/";
const book = await importSrc(`${D}engine/book.math.ts`);
const { ALM_MISSIONS, almMissionById } = await importSrc(`${D}engine/missions.data.ts`);
const { evaluateAlm } = await importSrc(`${D}engine/objectives.math.ts`);
const { almAdvice } = await importSrc(`${D}help/advice.math.ts`);
const { almWhatIf, WHAT_IF_IDS } = await importSrc(`${D}help/whatIf.math.ts`);
const { allGuideKeys } = await importSrc(`${D}help/guide.data.ts`);
const demo = await importSrc(`${D}demo/demo.script.ts`);
const { TONE_ORDER } = await importSrc("lib/game/advice.ts");
const { almDeskHelpEn } = await importSrc("Language/AlmDeskHelp.ts");
const { almDeskHelpHu } = await importSrc("Language/AlmDeskHelp.hu.ts");
const { almDeskMissionsEn } = await importSrc("Language/AlmDeskMissions.ts");
const { almDeskMissionsHu } = await importSrc("Language/AlmDeskMissions.hu.ts");

const A1 = almMissionById("A1");
const ids = (xs) => xs.map((x) => x.id);
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    Object.values(o).forEach(deepFreeze);
  }
  return o;
};

test("A1 start: gapOutside comes first; after a match it is gone", () => {
  const s = book.startAlm(A1, 1);
  assert.equal(almAdvice(A1, s)[0].id, "gapOutside");
  const m = book.reduceAlm(s, { type: "match" }, A1);
  assert.ok(!ids(almAdvice(A1, m)).includes("gapOutside"));
  assert.ok(ids(almAdvice(A1, m)).includes("matched"));
});

test("A4 warns of the second liability one round before it arrives", () => {
  const m = almMissionById("A4");
  let s = book.startAlm(m, 1);
  s = book.reduceAlm(book.reduceAlm(s, { type: "step" }, m), { type: "step" }, m);
  assert.ok(ids(almAdvice(m, s)).includes("liabilitySoon"));
});

test("at the end only `ended` remains; lists are short and ordered by tone", () => {
  for (const m of ALM_MISSIONS) {
    let s = book.startAlm(m, 2);
    while (!s.settled) {
      const a = almAdvice(m, s);
      assert.ok(a.length <= 6);
      a.slice(1).forEach((x, i) => assert.ok(TONE_ORDER[a[i].tone] <= TONE_ORDER[x.tone]));
      s = book.reduceAlm(s, { type: "step" }, m);
    }
    assert.deepEqual(ids(almAdvice(m, s)), ["ended"]);
  }
});

test("what-if: five cards, input untouched, barbell matches, blocks when ended or out of trades", () => {
  const s = deepFreeze(book.startAlm(A1, 3));
  const cards = almWhatIf(A1, s);
  assert.deepEqual(ids(cards), [...WHAT_IF_IDS]);
  assert.ok(Math.abs(cards.find((c) => c.id === "barbell").gapAfter) <= 0.05);
  assert.ok(cards.find((c) => c.id === "allCash").verdicts.includes("gapStays"));
  const a3 = almMissionById("A3");
  let t = book.startAlm(a3, 3);
  for (let i = 0; i < 3; i++) t = book.reduceAlm(t, { type: "rebalance", weights: i % 2 ? [0, 1, 0, 0] : [0, 0, 1, 0], tag: "manual" }, a3);
  const blocked = almWhatIf(a3, t);
  assert.equal(blocked.find((c) => c.id === "barbell").block, "tradeLimit");
  assert.equal(blocked.find((c) => c.id === "doNothing").block, undefined);
});

test("demo: seven steps that fold to a book which passes A1 when matched to the end", () => {
  const steps = demo.buildAlmDemo(A1, demo.ALM_DEMO_SEED);
  assert.equal(steps.length, 7);
  const states = demo.demoStates(A1, demo.ALM_DEMO_SEED, steps);
  assert.equal(states.length, 7);
  let s = states.at(-1);
  assert.equal(s.game.round, 2);
  while (!s.settled) s = book.reduceAlm(book.reduceAlm(s, { type: "match" }, A1), { type: "step" }, A1);
  assert.ok(evaluateAlm(A1, s).every((r) => r.status === "pass"));
});

test("every advice, what-if, guide and demo key has EN and HU copy; HU differs", () => {
  const keys = [
    ...["ended", "gapOutside", "surplusNegative", "maturedThisYear", "liabilitySoon", "costsHigh", "tradesLow", "convexityGap", "convexityNote", "matched"].flatMap((id) => [`almdAdv_${id}_title`, `almdAdv_${id}_body`]),
    ...WHAT_IF_IDS.flatMap((id) => [`almdWi_${id}_title`, `almdWi_${id}_body`]),
    ...allGuideKeys(ALM_MISSIONS.map((m) => m.id)),
    ...demo.buildAlmDemo(A1, 1).flatMap((s) => [`almdDemo_${s.id}_title`, `almdDemo_${s.id}_body`]),
  ];
  for (const k of keys) {
    assert.ok(k in almDeskHelpEn, `EN missing ${k}`);
    assert.ok(k in almDeskHelpHu, `HU missing ${k}`);
  }
  for (const [en, hu] of [[almDeskHelpEn, almDeskHelpHu], [almDeskMissionsEn, almDeskMissionsHu]]) {
    assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
    for (const k of Object.keys(en)) assert.notEqual(hu[k], en[k], `HU equals EN for ${k}`);
  }
});
