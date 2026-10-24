import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const S = await importSrc("features/sandbox/sandbox.math.ts");
const { CHALLENGES } = await importSrc("lib/game/challenges.data.ts");
const { sandboxEn } = await importSrc("Language/Sandbox.ts");
const { sandboxHu } = await importSrc("Language/Sandbox.hu.ts");

test("deskSummary lists completed missions, sorted, for old and new shapes", () => {
  const p = { M2: { completed: true, best: 3 }, M1: { completed: true, bestPnl: -20 }, M3: { completed: false, best: null } };
  assert.deepEqual(S.deskSummary(p).completed, ["M1", "M2"]);
  assert.deepEqual(S.deskSummary({}).completed, []);
});

test("challengeSummary and totals", () => {
  const none = S.challengeSummary(undefined);
  assert.equal(none.played, 0);
  assert.ok(Number.isNaN(none.hitRate));
  assert.deepEqual(S.challengeSummary({ played: 4, hits: 3, streak: 0, bestStreak: 2, lastAt: 1 }), { played: 4, hitRate: 0.75, bestStreak: 2 });
  const t = S.challengeTotals({ a: { played: 2, hits: 1, streak: 0, bestStreak: 1, lastAt: 0 }, b: { played: 2, hits: 2, streak: 2, bestStreak: 2, lastAt: 0 } });
  assert.deepEqual(t, { played: 4, hitRate: 0.75 });
  assert.ok(Number.isNaN(S.challengeTotals({}).hitRate));
});

test("groupChallenges covers every challenge exactly once, in area order", () => {
  const groups = S.groupChallenges(CHALLENGES);
  const ids = groups.flatMap((g) => g.items.map((c) => c.id));
  assert.deepEqual([...ids].sort(), CHALLENGES.map((c) => c.id).sort());
  assert.deepEqual(groups.map((g) => g.area), S.AREA_ORDER.filter((a) => CHALLENGES.some((c) => c.area === a)));
});

test("copy: every challenge and area has EN and HU names; parity; HU differs", () => {
  for (const c of CHALLENGES) assert.ok(sandboxEn[`sbxCh_${c.id}`], c.id);
  for (const a of S.AREA_ORDER) assert.ok(sandboxEn[`sbxArea_${a}`], a);
  assert.deepEqual(Object.keys(sandboxHu).sort(), Object.keys(sandboxEn).sort());
  for (const k of Object.keys(sandboxEn)) assert.notEqual(sandboxHu[k], sandboxEn[k], k);
});
