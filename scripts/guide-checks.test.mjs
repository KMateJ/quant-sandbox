import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const logic = await importSrc("features/guide/guide.check.logic.ts");
const { blockTexts } = await importSrc("features/guide/guide.graph.ts");
const { guideLessons } = await importSrc("features/guide/guide.meta.ts");
const { guideContent } = await importSrc("Language/guides/index.ts");

const DAY = logic.DAY_MS;
const close = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b}`);

test("typed numbers: grouping, decimal commas, units", () => {
  const { parseAnswer } = logic;
  assert.equal(parseAnswer("16,449", false), 16449);
  assert.equal(parseAnswer("1,234,567.5", false), 1234567.5);
  assert.equal(parseAnswer("0,35", false), 0.35);
  assert.equal(parseAnswer(" 2.5 % ", false), 2.5);
  assert.equal(parseAnswer("16 449", true), 16449);
  assert.equal(parseAnswer("0,3466", true), 0.3466);
  assert.equal(parseAnswer("1.234,5", true), 1234.5);
  assert.equal(parseAnswer("0.35", true), 0.35);
  assert.equal(parseAnswer("0,347 év", true), 0.347);
  assert.equal(parseAnswer("−0.5", false), -0.5);
  assert.equal(parseAnswer("abc", false), null);
  assert.equal(parseAnswer("", false), null);
  assert.equal(parseAnswer("1.2.3", false), null);
});

test("checks judge within tolerance and say which side a miss is on", () => {
  const num = { type: "number", value: 2.5, tolerance: 0.02 };
  assert.equal(logic.judgeCheck(num, "2.51", false), "correct");
  assert.equal(logic.judgeCheck(num, "2,52", true), "correct");
  assert.equal(logic.judgeCheck(num, "3", false), "high");
  assert.equal(logic.judgeCheck(num, "2", false), "low");
  assert.equal(logic.judgeCheck(num, "x", false), "invalid");
  const choice = { type: "choice", options: ["a", "b"], correct: 1 };
  assert.equal(logic.judgeCheck(choice, 1, false), "correct");
  assert.equal(logic.judgeCheck(choice, 0, false), "wrong");
  assert.equal(logic.judgeCheck(choice, null, false), "invalid");
});

test("fading blanks one more result per level, from the end backwards", () => {
  const steps = [
    { text: "intro" },
    { text: "a", result: { value: 1, tolerance: 0.1 } },
    { text: "b", tex: "x", result: { value: 2, tolerance: 0.1 } },
    { text: "note" },
    { text: "c", result: { value: 3, tolerance: 0.1 } },
  ];
  assert.equal(logic.maxFadeLevel(steps), 3);
  assert.deepEqual(logic.blankSteps(steps, 0), []);
  assert.deepEqual(logic.blankSteps(steps, 1), [4]);
  assert.deepEqual(logic.blankSteps(steps, 2), [2, 4]);
  assert.deepEqual(logic.blankSteps(steps, 3), [1, 2, 4]);
  assert.deepEqual(logic.blankSteps(steps, 9), [1, 2, 4]);
  assert.deepEqual(logic.checkBlanks(steps, 2, { 2: "2.05", 4: "3.5" }, false), { 2: true, 4: false });
  assert.deepEqual(logic.checkBlanks(steps, 1, {}, false), { 4: false });
});

test("review queue: read a day ago, not answered correctly in three days, oldest answer first", () => {
  const check = (lessonId, id) => ({ lessonId, block: { kind: "check", id, prompt: "", explain: "", answer: { type: "choice", options: ["a"], correct: 0 } } });
  const checks = [check("a", "a/1"), check("a", "a/2"), check("b", "b/1"), check("c", "c/1"), check("d", "d/1")];
  const now = 100 * DAY;
  const base = { checks, readIds: ["a", "b", "c"], readAt: { a: now - 2 * DAY, b: now - DAY / 2 }, now };
  // c has no read time (read before times were kept): due. b was read only hours ago, d never.
  const ids = (q) => q.map((c) => c.block.id);
  assert.deepEqual(ids(logic.selectReviewQueue({ ...base, answers: {} })), ["a/1", "a/2", "c/1"]);
  const answers = {
    "a/1": { lastAt: now - DAY, lastCorrectAt: now - DAY },
    "a/2": { lastAt: now - 5 * DAY, lastCorrectAt: now - 10 * DAY },
  };
  assert.deepEqual(ids(logic.selectReviewQueue({ ...base, answers })), ["c/1", "a/2"]);
  assert.deepEqual(ids(logic.selectReviewQueue({ ...base, answers, limit: 1 })), ["c/1"]);
  assert.deepEqual(logic.selectReviewQueue({ ...base, readIds: [], answers: {} }), []);
  const r = logic.recordAnswer(answers["a/2"], false, now);
  assert.deepEqual(r, { lastAt: now, lastCorrectAt: now - 10 * DAY });
  assert.deepEqual(logic.recordAnswer(r, true, now + 1), { lastAt: now + 1, lastCorrectAt: now + 1 });
});

const practice = (lang) =>
  guideLessons.flatMap((l) => (guideContent[l.id]?.[lang] ?? []).filter((b) => b.kind === "check" || b.kind === "worked").map((b) => ({ lesson: l.id, b })));

test("lesson checks and worked examples are well formed and match across languages", () => {
  const en = practice("en");
  const hu = practice("hu");
  assert.ok(en.filter((x) => x.b.kind === "check").length >= 10);
  assert.ok(en.filter((x) => x.b.kind === "worked").length >= 2);
  assert.equal(en.length, hu.length, "same number of practice blocks");
  const ids = new Set();
  en.forEach(({ lesson, b }, i) => {
    const h = hu[i];
    assert.equal(h.lesson, lesson);
    assert.equal(h.b.kind, b.kind, `${lesson} block ${i}`);
    if (b.kind === "check") {
      assert.ok(b.id.startsWith(`${lesson}/`), `id ${b.id} scoped to ${lesson}`);
      assert.ok(!ids.has(b.id), `duplicate id ${b.id}`);
      ids.add(b.id);
      assert.equal(h.b.id, b.id);
      const { answer } = b;
      assert.equal(h.b.answer.type, answer.type);
      if (answer.type === "number") {
        assert.equal(h.b.answer.value, answer.value);
        assert.equal(h.b.answer.tolerance, answer.tolerance);
        assert.ok(answer.tolerance > 0);
      } else {
        assert.equal(h.b.answer.correct, answer.correct);
        assert.equal(h.b.answer.options.length, answer.options.length);
        assert.ok(answer.correct >= 0 && answer.correct < answer.options.length);
      }
      assert.ok(b.prompt && b.explain && h.b.prompt && h.b.explain);
    } else {
      assert.equal(h.b.steps.length, b.steps.length);
      assert.ok(logic.maxFadeLevel(b.steps) >= 2);
      b.steps.forEach((s, j) => assert.deepEqual(h.b.steps[j].result, s.result, `${lesson} step ${j + 1}`));
    }
  });
});

test("practice answers agree with the formulas", () => {
  const byId = Object.fromEntries(practice("en").filter((x) => x.b.kind === "check").map((x) => [x.b.id, x.b.answer]));
  const within = (id, v) => assert.ok(Math.abs(byId[id].value - v) <= byId[id].tolerance, `${id}: ${byId[id].value} vs ${v}`);
  within("risk-measures/normal-var-95", 500000 * 0.02 * 1.6448536);
  within("risk-measures/normal-var-95", 500000 * 0.02 * 1.645);
  within("mean-reversion/half-life", Math.log(2) / 2);
  const u = Math.exp(0.25);
  within("real-options/risk-neutral-q", (Math.exp(0.04) - 1 / u) / (u - 1 / u));
  within("credit-risk/implied-hazard", (0.015 / 0.6) * 100);
  within("factor-models/index-covariance", 1.2 * 0.8 * 0.2 ** 2);

  const worked = practice("en").filter((x) => x.b.kind === "worked");
  const steps = (lesson) => worked.find((x) => x.lesson === lesson).b.steps.map((s) => s.result);
  const z99 = 2.3263479, phi = Math.exp(-z99 * z99 / 2) / Math.sqrt(2 * Math.PI);
  const risk = steps("risk-measures");
  [12000, z99, 12000 * z99, (12000 * phi) / 0.01, 12000 * z99 * Math.sqrt(10)].forEach((v, i) => close(risk[i].value, v, risk[i].tolerance, `VaR step ${i + 1}`));
  const credit = steps("credit-risk");
  const Q = Math.exp(-0.1), P = Math.exp(-0.15) * (Q + (1 - Q) * 0.4), y = -Math.log(P) / 5;
  [Q, (1 - Q) * 100, P, y * 100, (y - 0.03) * 100, 0.02 * 0.6 * 100].forEach((v, i) => close(credit[i].value, v, credit[i].tolerance, `credit step ${i + 1}`));
});

test("the guide graph reads check and worked prose", () => {
  const texts = blockTexts([
    { kind: "check", id: "x/y", prompt: "P", explain: "E", answer: { type: "choice", options: ["O1", "O2"], correct: 0 } },
    { kind: "worked", title: "T", steps: [{ text: "S1" }, { text: "S2", result: { value: 1, tolerance: 0 } }] },
  ]);
  assert.deepEqual(texts, ["P", "O1", "O2", "E", "T", "S1", "S2"]);
});
