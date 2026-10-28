import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/market-making-desk/";
const { mmAdvice, ADVICE_IDS } = await importSrc(`${D}help/advice.math.ts`);
const { mmWhatIf, WHAT_IF_IDS, WHAT_IF_VERDICTS } = await importSrc(`${D}help/whatIf.math.ts`);
const { allGuideKeys } = await importSrc(`${D}help/guide.data.ts`);
const { buildMmDemo, demoStates, MM_DEMO_MISSION, MM_DEMO_SEED } = await importSrc(`${D}demo/demo.script.ts`);
const { policyRows, markoutHistogram } = await importSrc(`${D}debrief.math.ts`);
const { MM_MISSIONS, mmMissionById } = await importSrc(`${D}engine/missions.data.ts`);
const { mmMarket } = await importSrc(`${D}engine/market.math.ts`);
const { startMm, reduceMm } = await importSrc(`${D}engine/book.math.ts`);
const { mmPnlParts } = await importSrc(`${D}engine/objectives.math.ts`);
const { TONE_ORDER } = await importSrc("lib/game/advice.ts");
const en = {
  ...(await importSrc("Language/MarketMakingDeskMissions.ts")).marketMakingDeskMissionsEn,
  ...(await importSrc("Language/MarketMakingDeskHelp.ts")).marketMakingDeskHelpEn,
};
const hu = {
  ...(await importSrc("Language/MarketMakingDeskMissions.hu.ts")).marketMakingDeskMissionsHu,
  ...(await importSrc("Language/MarketMakingDeskHelp.hu.ts")).marketMakingDeskHelpHu,
};

const MM1 = mmMissionById("MM1");
const MM4 = mmMissionById("MM4");
const join = { type: "setQuote", quote: { bidOffset: 0.5, askOffset: 0.5, live: true } };
const run = (m, market, actions, seed = 7) => actions.reduce((s, a) => reduceMm(s, a, m, market), startMm(m, seed, market));
const M1 = mmMarket(MM1, 7);

test("MM1 start: notQuoting first; after F4 the desk is on track", () => {
  assert.equal(mmAdvice(MM1, startMm(MM1, 7, M1))[0].id, "notQuoting");
  const ids = mmAdvice(MM1, run(MM1, M1, [join])).map((a) => a.id);
  assert.ok(ids.includes("onTrack") && !ids.includes("notQuoting"), ids.join(","));
});

test("long 2,000 shares: inventoryNear is urgent and suggests F7", () => {
  const s = run(MM1, M1, [join]);
  const long = { ...s, ledger: { ...s.ledger, inventory: 2000 } };
  const a = mmAdvice(MM1, long)[0];
  assert.equal(a.id, "inventoryNear");
  assert.equal(a.tone, "urgent");
  assert.deepEqual(a.action, { kind: "key", code: "F7" });
  const short = mmAdvice(MM1, { ...s, ledger: { ...s.ledger, inventory: -2000 } }).find((x) => x.id === "inventoryNear");
  assert.equal(short.action.code, "F8");
});

test("MM4 at t = 280 warns about the news", () => {
  const M4 = mmMarket(MM4, 7);
  const s = run(MM4, M4, [join, { type: "step", ticks: 280 }]);
  const a = mmAdvice(MM4, s);
  assert.ok(a.some((x) => x.id === "newsSoon" && x.tone === "urgent"), a.map((x) => x.id).join(","));
});

test("advice: at most six items in tone order; a settled run points to the debrief", () => {
  for (const m of MM_MISSIONS) {
    const market = mmMarket(m, 3);
    for (const ticks of [0, 60, 280, 450]) {
      const items = mmAdvice(m, run(m, market, [join, { type: "step", ticks }], 3));
      assert.ok(items.length <= 6);
      for (let i = 1; i < items.length; i++) assert.ok(TONE_ORDER[items[i - 1].tone] <= TONE_ORDER[items[i].tone]);
    }
  }
  const done = run(MM1, M1, [join, { type: "step", ticks: 600 }]);
  assert.deepEqual(mmAdvice(MM1, done).map((a) => a.id), ["ended"]);
});

test("what-if: five rows, no mutation, deterministic", () => {
  const s = run(MM1, M1, [join, { type: "step", ticks: 200 }]);
  const snap = JSON.stringify(s);
  const a = mmWhatIf(MM1, s, M1);
  assert.equal(JSON.stringify(s), snap);
  assert.deepEqual(a.map((r) => r.id), [...WHAT_IF_IDS]);
  assert.ok(a.length <= 5);
  assert.deepEqual(mmWhatIf(MM1, s, M1), a);
  for (const r of a) assert.ok(WHAT_IF_VERDICTS.includes(r.verdict) && Number.isFinite(r.pnl));
  const pulled = a.find((r) => r.id === "doNothing");
  assert.equal(pulled.maxInv >= Math.abs(s.ledger.inventory), true);
});

test("demo: six steps on MM1, folded deterministically, quoting after the join step", () => {
  const steps = buildMmDemo();
  assert.deepEqual(steps.map((x) => x.id), ["welcome", "join", "inventory", "toxic", "widen", "yourTurn"]);
  const m = mmMissionById(MM_DEMO_MISSION);
  const market = mmMarket(m, MM_DEMO_SEED);
  const a = demoStates(m, market, MM_DEMO_SEED);
  assert.equal(a.length, steps.length);
  assert.equal(JSON.stringify(a), JSON.stringify(demoStates(m, market, MM_DEMO_SEED)));
  assert.equal(a[1].t, 30);
  assert.equal(a[4].t, 90);
  assert.ok(a[1].quote.live && a[1].ledger.fills.length > 0);
});

test("debrief: attribution sums to the total within $0.01; policy table has robots then your run", () => {
  const s = run(MM1, M1, [join, { type: "step", ticks: 600 }]);
  const p = mmPnlParts(MM1, s);
  assert.ok(Math.abs(p.spread + p.adverse + p.inventory + p.fees - p.total) < 0.01);
  const rows = policyRows(MM1, 7, M1, s);
  assert.deepEqual(rows.map((r) => r.policy), ["join", "wide", "as", "flatten", "you"]);
  const bars = markoutHistogram(MM1, s);
  assert.equal(bars.reduce((n, b) => n + b.n, 0), s.ledger.fills.filter((f) => f.fee > 0).length);
});

test("every advice, what-if, guide and demo id has EN and HU copy; HU differs", () => {
  const keys = [
    ...ADVICE_IDS.flatMap((id) => [`mmdAdv_${id}_title`, `mmdAdv_${id}_body`]),
    "mmdAdv_inventoryNear_bodyShort", "mmdAdv_oneSided_bodyShort",
    ...WHAT_IF_IDS.flatMap((id) => [`mmdWi_${id}_title`, `mmdWi_${id}_body`]),
    ...WHAT_IF_VERDICTS.map((v) => `mmdWiV_${v}`),
    ...allGuideKeys(MM_MISSIONS.map((m) => m.id)),
    ...buildMmDemo().flatMap((x) => [`mmdDemo_${x.id}_title`, `mmdDemo_${x.id}_body`]),
    ...MM_MISSIONS.flatMap((m) => [`mmdMsTagline_${m.id}`, `mmdMsTag_${m.id}`]),
  ];
  for (const k of keys) {
    assert.ok(en[k], `EN missing ${k}`);
    assert.ok(hu[k], `HU missing ${k}`);
  }
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
  for (const k of Object.keys(en)) {
    assert.notEqual(hu[k], en[k], `HU equals EN for ${k}`);
    const ph = (s) => (s.match(/\{\{\w+\}\}/g) ?? []).sort().join();
    assert.equal(ph(hu[k]), ph(en[k]), `placeholders differ for ${k}`);
  }
});
