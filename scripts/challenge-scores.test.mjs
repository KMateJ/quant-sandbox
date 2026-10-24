import { test } from "node:test";
import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { importSrc } from "./lib/load-ts.mjs";

const store = new Map();
globalThis.window = globalThis.window ?? { addEventListener() {}, removeEventListener() {} };
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
};

const { recordChallenge, readChallenges } = await importSrc("lib/game/challengeScores.ts");
const { CHALLENGES } = await importSrc("lib/game/challenges.data.ts");
const { challengesEn } = await importSrc("Language/Challenges.ts");
const { challengesHu } = await importSrc("Language/Challenges.hu.ts");

const SRC = new URL("../src/", import.meta.url);

async function sourceFiles(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await sourceFiles(p)));
    else if (/\.tsx?$/.test(e.name)) out.push(p);
  }
  return out;
}

test("recorded rounds keep played, hits, streak and best streak", () => {
  for (const hit of [true, true, false, true, true, true, false]) recordChallenge("tvm-test", hit, 1);
  assert.deepEqual(readChallenges()["tvm-test"], { played: 7, hits: 5, streak: 0, bestStreak: 3, lastAt: 1 });
  assert.ok(JSON.parse(store.get("qs.game.challenges.v1"))["tvm-test"]);
});

test("every call-site id exists in CHALLENGES and each id is used exactly once", async () => {
  const used = [];
  for (const file of await sourceFiles(fileURLToPath(new URL("features/", SRC)))) {
    const text = await readFile(file, "utf8");
    for (const [, id] of text.matchAll(/challengeId: "([a-z0-9-]+)"/g)) used.push(id);
    for (const [, id] of text.matchAll(/const CHALLENGE = "([a-z0-9-]+)"/g)) used.push(id);
  }
  const ids = CHALLENGES.map((c) => c.id);
  for (const id of used) assert.ok(ids.includes(id), `unknown id ${id}`);
  assert.deepEqual([...used].sort(), [...ids].sort());
});

test("Challenges copy: EN/HU parity and HU differs", () => {
  assert.deepEqual(Object.keys(challengesHu).sort(), Object.keys(challengesEn).sort());
  for (const k of Object.keys(challengesEn)) assert.notEqual(challengesHu[k], challengesEn[k], k);
});
