import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/rates-desk/";
const { ratesAdvice, ADVICE_IDS } = await importSrc(`${E}help/advice.math.ts`);
const { ratesWhatIf, WHAT_IF_IDS } = await importSrc(`${E}help/whatIf.math.ts`);
const guide = await importSrc(`${E}help/guide.data.ts`);
const { buildRatesDemo, RATES_DEMO_SEED } = await importSrc(`${E}demo/demo.script.ts`);
const { foldStates } = await importSrc("lib/game/demo.ts");
const { TONE_ORDER } = await importSrc("lib/game/advice.ts");
const curve = await importSrc(`${E}engine/curve.math.ts`);
const book = await importSrc(`${E}engine/book.math.ts`);
const risk = await importSrc(`${E}engine/risk.math.ts`);
const { evaluateRates } = await importSrc(`${E}engine/objectives.math.ts`);
const { RATES_MISSIONS, ratesMissionById } = await importSrc(`${E}engine/missions.data.ts`);
const helpEn = (await importSrc("Language/RatesDeskHelp.ts")).ratesDeskHelpEn;
const helpHu = (await importSrc("Language/RatesDeskHelp.hu.ts")).ratesDeskHelpHu;
const msEn = (await importSrc("Language/RatesDeskMissions.ts")).ratesDeskMissionsEn;
const msHu = (await importSrc("Language/RatesDeskMissions.hu.ts")).ratesDeskMissionsHu;

const setup = (id, seed = 1) => {
  const mission = ratesMissionById(id);
  const path = curve.factorPath(mission, seed);
  const act = (s, a) => book.reduceRates(s, a, mission, path);
  return { mission, path, act, s0: book.startRates(mission, seed, path) };
};
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o)) deepFreeze(v);
  }
  return o;
};

test("R1 start: DV01 outside the band comes first, with a ticket", () => {
  const { mission, path, s0 } = setup("R1");
  const adv = ratesAdvice(mission, s0, path);
  assert.equal(adv[0].id, "dv01Outside");
  assert.equal(adv[0].action.kind, "ticket");
  assert.equal(adv[0].action.side, "SELL");
});

test("after a key-rate hedge there is no curve-risk advice", () => {
  const { mission, path, act, s0 } = setup("R2");
  const s = act(s0, { type: "krdHedge" });
  assert.ok(!ratesAdvice(mission, s, path).some((a) => a.id === "curveRisk"));
  const dv = act(s0, { type: "dv01Hedge", future: 2 });
  assert.ok(ratesAdvice(mission, dv, path).some((a) => a.id === "curveRisk"));
});

test("R5 warns about the roll on day 8", () => {
  const { mission, path, act, s0 } = setup("R5");
  const s = act(s0, { type: "step", days: 8 });
  const roll = ratesAdvice(mission, s, path).find((a) => a.id === "rollDeadline");
  assert.equal(roll?.tone, "urgent");
  assert.equal(roll.vars.days, 2);
  assert.ok(!ratesAdvice(mission, act(s0, { type: "step", days: 5 }), path).some((a) => a.id === "rollDeadline"));
});

test("at most six items in tone order; settled shows only ended", () => {
  for (const m of RATES_MISSIONS) {
    const { path, act, s0 } = setup(m.id, 3);
    for (const s of [s0, act(s0, { type: "step", days: 9 })]) {
      const adv = ratesAdvice(m, s, path);
      assert.ok(adv.length <= 6);
      for (let i = 1; i < adv.length; i++) assert.ok(TONE_ORDER[adv[i - 1].tone] <= TONE_ORDER[adv[i].tone]);
    }
    const end = ratesAdvice(m, act(s0, { type: "step", days: 99 }), path);
    assert.deepEqual(end.map((a) => a.id), ["ended"]);
  }
});

test("what-if never mutates and the key-rate card flattens every bucket", () => {
  const { mission, path, s0 } = setup("R2");
  deepFreeze(s0);
  const cards = ratesWhatIf(mission, s0, path);
  assert.deepEqual(cards.map((c) => c.id), ["doNothing", "dv01With10Y", "dv01With5Y", "dv01With2Y", "keyRate"]);
  const k = cards.find((c) => c.id === "keyRate");
  assert.ok(Math.abs(k.bucketValue) < 2000);
  assert.ok(k.verdicts.includes("curveRiskSmall"));
  assert.equal(cards[0].traded, 0);
  const r5 = setup("R5");
  const roll = ratesWhatIf(r5.mission, r5.s0, r5.path).find((c) => c.id === "rollToBack");
  assert.equal(roll.trades[2], 481);
  assert.ok(roll.trades[3] < 0);
  assert.ok(roll.verdicts.includes("inBand"));
  const after = ratesWhatIf(r5.mission, r5.act(r5.s0, { type: "step", days: 10 }), r5.path).find((c) => c.id === "rollToBack");
  assert.deepEqual(after.verdicts, ["blocked"]);
});

test("demo folds deterministically to a passed R1", () => {
  const m = ratesMissionById("R1");
  const steps = buildRatesDemo(m, RATES_DEMO_SEED);
  assert.deepEqual(steps.map((s) => s.id), ["welcome", "dv01Hedge", "fiveDays", "keyRate", "toEnd", "yourTurn"]);
  const path = curve.factorPath(m, RATES_DEMO_SEED);
  const fold = () => foldStates(book.startRates(m, RATES_DEMO_SEED, path), steps, (s, a) => book.reduceRates(s, a, m, path));
  const states = fold();
  assert.deepEqual(states, fold());
  assert.equal(states[2].day, 5);
  const last = states.at(-1);
  assert.equal(last.settled, true);
  assert.ok(evaluateRates(m, last).every((r) => r.status === "pass"));
  assert.ok(Math.abs(risk.ratesRisk(states[1], m, curve.zeroGrid(path[0])).net) < 1000);
});

const vars = (s) => [...s.matchAll(/{{(\w+)}}/g)].map((x) => x[1]).sort();
const parity = (en, hu) => {
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
  for (const [k, v] of Object.entries(en)) {
    assert.notEqual(hu[k], v, `HU equals EN for ${k}`);
    assert.deepEqual(vars(hu[k]), vars(v), `placeholders differ for ${k}`);
  }
};

test("copy exists for every advice, what-if, guide and demo id; EN/HU parity", () => {
  for (const id of ADVICE_IDS) for (const p of ["Title", "Body"]) assert.ok(`ratdAdv_${id}${p}` in helpEn, `${id}${p}`);
  for (const id of WHAT_IF_IDS) assert.ok(`ratdWi_${id}` in helpEn, id);
  for (const v of ["inBand", "outsideBand", "curveRiskLeft", "curveRiskSmall", "costly", "blocked"]) assert.ok(`ratdWiV_${v}` in helpEn, v);
  for (const [id, n] of Object.entries(guide.PLAYBOOKS)) {
    for (let i = 1; i <= n.steps; i++) assert.ok(`ratdGdPlay_${id}_step${i}` in helpEn);
    for (let i = 1; i <= n.traps; i++) assert.ok(`ratdGdPlay_${id}_trap${i}` in helpEn);
  }
  for (const a of guide.GUIDE_PANELS) assert.ok(`ratdGdPanel_${a}` in helpEn, a);
  for (const k of guide.GUIDE_KEYS) assert.ok(`ratdGdKey_${k}` in helpEn, k);
  for (let i = 1; i <= guide.GUIDE_MISTAKES; i++) assert.ok(`ratdGdMistake${i}` in helpEn);
  for (const term of guide.GUIDE_TERMS) assert.ok(`ratdGdTerm_${term}` in helpEn && `ratdGdTermText_${term}` in helpEn, term);
  for (const s of buildRatesDemo(ratesMissionById("R1"), RATES_DEMO_SEED)) {
    assert.ok(`ratdDemo_${s.id}Title` in msEn && `ratdDemo_${s.id}Body` in msEn, s.id);
  }
  for (const m of RATES_MISSIONS) assert.ok(`ratdMs_${m.id}Tagline` in msEn, m.id);
  parity(helpEn, helpHu);
  parity(msEn, msHu);
});
