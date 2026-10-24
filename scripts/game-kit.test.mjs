import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const G = "lib/game/";
const obj = await importSrc(`${G}objectives.ts`);
const prog = await importSrc(`${G}progress.ts`);
const ch = await importSrc(`${G}challengeScores.ts`);
const { CHALLENGES } = await importSrc(`${G}challenges.data.ts`);
const { foldStates, stepIndexById } = await importSrc(`${G}demo.ts`);
const { rankAdvice } = await importSrc(`${G}advice.ts`);
const seed = await importSrc(`${G}seed.ts`);
const { cholesky, matMul, transpose } = await importSrc("lib/math/matrix.ts");

test("capStatus truth table", () => {
  assert.equal(obj.capStatus(5, 4, 3, false), "fail");
  assert.equal(obj.capStatus(4, 4, 3, false), "atRisk");
  assert.equal(obj.capStatus(4, 4, 5, false), "onTrack");
  assert.equal(obj.capStatus(2, 4, 3, false), "onTrack");
  assert.equal(obj.capStatus(4, 4, 3, true), "pass");
  assert.equal(obj.capStatus(5, 4, 3, true), "fail");
});

test("floorStatus, bandAtSettle, countStatus, allPassed", () => {
  assert.equal(obj.floorStatus(-1, 0, 10, false), "atRisk");
  assert.equal(obj.floorStatus(5, 0, 10, false), "atRisk");
  assert.equal(obj.floorStatus(20, 0, 10, false), "onTrack");
  assert.equal(obj.floorStatus(-1, 0, 10, true), "fail");
  assert.equal(obj.floorStatus(0, 0, 10, true), "pass");
  assert.equal(obj.bandAtSettle(5, 1, 9, false), "onTrack");
  assert.equal(obj.bandAtSettle(10, 1, 9, false), "atRisk");
  assert.equal(obj.bandAtSettle(9, 1, 9, true), "pass");
  assert.equal(obj.bandAtSettle(0, 1, 9, true), "fail");
  assert.equal(obj.countStatus(0, 1, false), "onTrack");
  assert.equal(obj.countStatus(1, 1, false), "atRisk");
  assert.equal(obj.countStatus(2, 1, false), "fail");
  assert.equal(obj.countStatus(1, 1, true), "pass");
  assert.equal(obj.allPassed([]), false);
  assert.equal(obj.allPassed([{ status: "pass" }, { status: "pass" }]), true);
  assert.equal(obj.allPassed([{ status: "pass" }, { status: "onTrack" }]), false);
});

test("mergeProgress keeps the better score per rule", () => {
  let p = prog.EMPTY_PROGRESS;
  p = prog.mergeProgress(p, "A", false, 5, prog.higherIsBetter);
  assert.deepEqual(p, {});
  p = prog.mergeProgress(p, "A", true, 5, prog.higherIsBetter);
  assert.deepEqual(p.A, { completed: true, best: 5 });
  assert.equal(prog.mergeProgress(p, "A", true, 3, prog.higherIsBetter), p);
  assert.equal(prog.mergeProgress(p, "A", true, 8, prog.higherIsBetter).A.best, 8);
  assert.equal(prog.mergeProgress(p, "A", false, 99, prog.higherIsBetter), p);
  const z = prog.mergeProgress({ A: { completed: true, best: -4 } }, "A", true, 2, prog.closerToZero);
  assert.equal(z.A.best, 2);
  assert.equal(prog.mergeProgress(z, "A", true, -3, prog.closerToZero), z);
  assert.equal(prog.mergeProgress({ A: { completed: false, best: null } }, "A", true, 1, prog.closerToZero).A.best, 1);
});

test("progress store round-trips through storage with its own cache", () => {
  store.clear();
  assert.equal(prog.progressKey("alm"), "qs.game.alm.progress.v1");
  const a = prog.createProgressStore("alm", prog.higherIsBetter);
  const b = prog.createProgressStore("rates", prog.higherIsBetter);
  let calls = 0;
  const off = a.subscribe(() => calls++);
  a.record("A1", true, 10);
  a.record("A1", false, 20);
  assert.equal(calls, 1);
  assert.deepEqual(JSON.parse(store.get("qs.game.alm.progress.v1")), { A1: { completed: true, best: 10 } });
  assert.deepEqual(prog.readProgressKey("qs.game.alm.progress.v1").A1.best, 10);
  assert.deepEqual(b.read(), {});
  off();
  a.record("A2", true, 1);
  assert.equal(calls, 1);
  store.set("qs.game.bad.progress.v1", "{nope");
  assert.deepEqual(prog.readProgressKey("qs.game.bad.progress.v1"), {});
});

test("challenge scores: merge and storage", () => {
  store.clear();
  let s = ch.mergeChallenge(undefined, true, 1);
  s = ch.mergeChallenge(s, true, 2);
  s = ch.mergeChallenge(s, false, 3);
  s = ch.mergeChallenge(s, true, 4);
  assert.deepEqual(s, { played: 4, hits: 3, streak: 1, bestStreak: 2, lastAt: 4 });
  let calls = 0;
  const off = ch.subscribeChallenges(() => calls++);
  ch.recordChallenge("clt-spread", true, 100);
  ch.recordChallenge("clt-spread", true, 200);
  off();
  assert.equal(calls, 2);
  assert.deepEqual(ch.readChallenges()["clt-spread"], { played: 2, hits: 2, streak: 2, bestStreak: 2, lastAt: 200 });
  assert.deepEqual(JSON.parse(store.get(ch.CHALLENGES_KEY))["clt-spread"].played, 2);
});

test("CHALLENGES ids are unique kebab-case", () => {
  const ids = CHALLENGES.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(ids.length, 16);
  for (const id of ids) assert.match(id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
});

test("foldStates and stepIndexById", () => {
  const steps = [{ id: "a", actions: [1, 2] }, { id: "b", actions: [] }, { id: "c", actions: [10] }];
  assert.deepEqual(foldStates(0, steps, (s, x) => s + x), [3, 3, 13]);
  assert.equal(stepIndexById(steps, "c"), 2);
  assert.equal(stepIndexById(steps, "z"), -1);
});

test("rankAdvice is stable by tone and capped", () => {
  const items = ["info", "urgent", "done", "suggest", "urgent", "info", "info", "suggest"].map((tone, i) => ({ tone, i }));
  const r = rankAdvice(items);
  assert.equal(r.length, 6);
  assert.deepEqual(r.map((x) => x.i), [1, 4, 3, 7, 0, 5]);
  assert.equal(rankAdvice(items, 2).length, 2);
});

test("seeds", () => {
  assert.equal(seed.nextSeed(1), 2);
  assert.equal(seed.nextSeed(seed.MAX_SEED), 1);
  assert.notEqual(seed.subSeed(5, 1), seed.subSeed(5, 2));
  assert.equal(seed.subSeed(5, 1), seed.subSeed(5, 1));
  assert.ok(seed.subSeed(9999, 50) >= 0);
});

test("cholesky reproduces a PD matrix and rejects a non-PD one", () => {
  const a = [[4, 2, 0.6], [2, 5, 1.5], [0.6, 1.5, 3]];
  const L = cholesky(a);
  const back = matMul(L, transpose(L));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) assert.ok(Math.abs(back[i][j] - a[i][j]) < 1e-12);
  assert.equal(L[0][1], 0);
  assert.equal(cholesky([[1, 2], [2, 1]]), null);
});
