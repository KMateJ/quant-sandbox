import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { ratesDeskEn } = await importSrc("Language/RatesDesk.ts");
const { ratesDeskHu } = await importSrc("Language/RatesDesk.hu.ts");
const { eventRow } = await importSrc("features/rates-desk/eventText.ts");
const { RATES_MISSIONS, ratesMissionById } = await importSrc("features/rates-desk/engine/missions.data.ts");

const used = new Set();
const t = (key, vars) => {
  used.add(key);
  assert.ok(key in ratesDeskEn, `missing key ${key}`);
  return `${key}${vars ? JSON.stringify(vars) : ""}`;
};

const EVENTS = [
  { t: 0, kind: "start" },
  { t: 1, kind: "move", d2: -1.2, d10: 0.8 },
  { t: 1, kind: "fill", future: "10Y", qty: -12, price: 109.5, tag: "manual" },
  { t: 1, kind: "fill", future: "5Y", qty: 3, price: 106.5, tag: "auto" },
  { t: 2, kind: "dv01Miss", net: 1500 },
  { t: 2, kind: "krdMiss", node: 2, value: -2400 },
  { t: 3, kind: "ctdSwitch", future: "10Y", to: 3 },
  { t: 10, kind: "expired", future: "10Y-F", qty: -481, price: 108.2 },
  { t: 20, kind: "end", pnl: -1200 },
];

test("eventRow covers every event kind", () => {
  const m = ratesMissionById("R5");
  for (const e of EVENTS) {
    const row = eventRow(e, m, t);
    assert.ok(row.kind && row.text && row.t, e.kind);
  }
});

test("every mission has a title and brief; every objective kind has a label", () => {
  for (const m of RATES_MISSIONS) {
    assert.ok(`ratdM_${m.id}Title` in ratesDeskEn);
    assert.ok(`ratdM_${m.id}Brief` in ratesDeskEn);
    for (const o of m.objectives) assert.ok(`ratdObj_${o.kind}` in ratesDeskEn, o.kind);
  }
  for (const s of ["parallelUp", "parallelDown", "steepener", "flattener", "belly"]) assert.ok(`ratdScen_${s}` in ratesDeskEn);
});

test("EN and HU tables match and HU differs from EN", () => {
  assert.deepEqual(Object.keys(ratesDeskHu).sort(), Object.keys(ratesDeskEn).sort());
  for (const [k, v] of Object.entries(ratesDeskEn)) {
    assert.notEqual(ratesDeskHu[k], v, `HU equals EN for ${k}`);
    const vars = (s) => [...s.matchAll(/{{(\w+)}}/g)].map((x) => x[1]).sort();
    assert.deepEqual(vars(ratesDeskHu[k]), vars(v), `placeholders differ for ${k}`);
  }
});
