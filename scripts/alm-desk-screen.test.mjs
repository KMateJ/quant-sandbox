import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { almDeskEn } = await importSrc("Language/AlmDesk.ts");
const { almDeskHu } = await importSrc("Language/AlmDesk.hu.ts");
const { eventText } = await importSrc("features/alm-desk/eventText.ts");
const { objectiveText } = await importSrc("features/alm-desk/missionCopy.ts");
const { parseTargets, targetsFromWeights } = await importSrc("features/alm-desk/ticket.math.ts");
const { holdingRows, curveHistory } = await importSrc("features/alm-desk/deskView.math.ts");
const book = await importSrc("features/alm-desk/engine/book.math.ts");
const { ALM_MISSIONS, almMissionById } = await importSrc("features/alm-desk/engine/missions.data.ts");

const tr = (table) => {
  const used = new Set();
  const t = (key, vars = {}) => {
    used.add(key);
    assert.ok(key in table, `missing key ${key}`);
    return table[key].replace(/\{\{(\w+)\}\}/g, (_, k) => String(vars[k]));
  };
  return { t, used };
};

const EVENTS = [
  { t: 0, kind: "start" },
  { t: 1, kind: "shock", parallelBp: 30, twistBp: -10 },
  { t: 1, kind: "rebalance", cost: 120, duration: 7.3, tag: "manual" },
  { t: 1, kind: "rebalance", cost: 0, duration: 7.3, tag: "auto" },
  { t: 2, kind: "matured", tenor: 2, amount: 400_000 },
  { t: 2, kind: "gapMiss", gap: 0.4 },
  { t: 2, kind: "convMiss", gap: -18 },
  { t: 3, kind: "liabilityAdded", amount: 500_000, year: 5, contribution: 450_000 },
  { t: 5, kind: "liabilityPaid", amount: 500_000 },
  { t: 5, kind: "rejected", reason: "tradeLimit" },
  { t: 8, kind: "end", surplus: -1200 },
];

test("AlmDesk EN and HU have the same keys and HU differs everywhere", () => {
  assert.deepEqual(Object.keys(almDeskHu).sort(), Object.keys(almDeskEn).sort());
  for (const k of Object.keys(almDeskEn)) assert.notEqual(almDeskHu[k], almDeskEn[k], `HU equals EN for ${k}`);
});

test("eventText covers every event kind in both languages without leftover placeholders", () => {
  for (const table of [almDeskEn, almDeskHu]) {
    const { t } = tr(table);
    for (const e of EVENTS) {
      const row = eventText(e, t);
      assert.ok(row.text && row.kind && row.t, e.kind);
      assert.ok(!/\{\{|undefined/.test(row.text), `${e.kind}: ${row.text}`);
    }
  }
});

test("every mission has a title, a brief and labelled objectives", () => {
  const { t } = tr(almDeskEn);
  for (const m of ALM_MISSIONS) {
    assert.ok(t(`almdMission${m.id}Title`) && t(`almdMission${m.id}Brief`));
    for (const o of m.objectives) assert.ok(!/\{\{|undefined/.test(objectiveText(o, 1, t).label));
  }
});

test("ticket targets parse, cap at 100% and round-trip weights", () => {
  assert.deepEqual(parseTargets(["20", "30", "40"]).weights.map((w) => Number(w.toFixed(6))), [0.2, 0.3, 0.4, 0.1]);
  assert.equal(parseTargets(["60", "50", "0"]).over, true);
  assert.equal(parseTargets(["x", "0", "0"]).weights, null);
  assert.deepEqual(parseTargets(["", "", ""]).weights, [0, 0, 0, 1]);
  assert.deepEqual(targetsFromWeights([0.25, 0.5, 0.125, 0.125]), ["25", "50", "12.5"]);
});

test("holdings rows and curve history follow the book", () => {
  const m = almMissionById("A1");
  let s = book.startAlm(m, 3);
  const rows = holdingRows(s, m);
  assert.deepEqual(rows.map((r) => r.kind), ["bond", "cash", "liability"]);
  assert.ok(Math.abs(rows[0].weight - 1) < 1e-9);
  for (let i = 0; i < 3; i++) s = book.reduceAlm(s, { type: "step" }, m);
  const curves = curveHistory(s, m);
  assert.equal(curves.length, 4);
  assert.deepEqual(curves.at(-1), s.game.curve);
});
