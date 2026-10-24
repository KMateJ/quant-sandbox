import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/retirement-desk/";
const { retirementAdvice, ADVICE_IDS } = await importSrc(`${E}help/advice.math.ts`);
const { retirementWhatIf, WHAT_IF_IDS } = await importSrc(`${E}help/whatIf.math.ts`);
const guide = await importSrc(`${E}help/guide.data.ts`);
const { buildRetirementDemo, RETIREMENT_DEMO_SEED, RETIREMENT_DEMO_MISSION } = await importSrc(`${E}demo/demo.script.ts`);
const { foldStates } = await importSrc("lib/game/demo.ts");
const { TONE_ORDER } = await importSrc("lib/game/advice.ts");
const book = await importSrc(`${E}engine/book.math.ts`);
const { yearShocks } = await importSrc(`${E}engine/market.math.ts`);
const { successOdds } = await importSrc(`${E}engine/odds.math.ts`);
const { RETIREMENT_MISSIONS, retirementMissionById } = await importSrc(`${E}engine/missions.data.ts`);
const helpEn = (await importSrc("Language/RetirementDeskHelp.ts")).retirementDeskHelpEn;
const helpHu = (await importSrc("Language/RetirementDeskHelp.hu.ts")).retirementDeskHelpHu;
const msEn = (await importSrc("Language/RetirementDeskMissions.ts")).retirementDeskMissionsEn;
const msHu = (await importSrc("Language/RetirementDeskMissions.hu.ts")).retirementDeskMissionsHu;

const setup = (id, seed = 3) => {
  const mission = retirementMissionById(id);
  const shocks = yearShocks(mission, seed);
  const act = (s, a) => book.reduceRetirement(s, a, mission, shocks);
  return { mission, act, s0: book.startRetirement(mission, seed) };
};
const advise = (m, s, amount, equity = s.equity) => retirementAdvice(m, s, { amount, equity }, successOdds(m, s.seed, s.year + 1, s.wealth, amount, equity));
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o)) deepFreeze(v);
  }
  return o;
};

test("T1 at 70,000 puts low odds first; at 40,000 on year 0 it is on track", () => {
  const { mission, s0 } = setup("T1");
  const hot = advise(mission, s0, 70_000);
  assert.equal(hot[0].id, "oddsLow");
  assert.equal(hot[0].action.kind, "fill");
  assert.ok(hot.some((a) => a.id === "rateHot"));
  assert.equal(advise(mission, s0, 40_000)[0].id, "onTrack");
});

test("after three cuts, no cuts are left", () => {
  const { mission, act, s0 } = setup("T1");
  let s = s0;
  for (const amount of [40_000, 35_000, 31_000, 27_000]) s = act(s, { type: "take", amount, equity: 0.6, tag: "manual" });
  assert.equal(s.cuts, 3);
  assert.ok(advise(mission, s, 27_000).some((a) => a.id === "noCutsLeft" && a.tone === "urgent"));
});

test("at most six items, in tone order; settled shows only ended", () => {
  for (const m of RETIREMENT_MISSIONS) {
    const { act, s0 } = setup(m.id, 5);
    for (const s of [s0, act(s0, { type: "auto", years: 12, rule: "fixed" }), act(s0, { type: "auto", years: 25, rule: "pctWealth" })]) {
      for (const amount of [20_000, 40_000, 90_000]) {
        const adv = advise(m, s, amount);
        assert.ok(adv.length <= 6);
        for (let i = 1; i < adv.length; i++) assert.ok(TONE_ORDER[adv[i - 1].tone] <= TONE_ORDER[adv[i].tone]);
      }
    }
    const end = act(s0, { type: "auto", years: 99, rule: "fixedLow" });
    assert.deepEqual(advise(m, end, 1).map((a) => a.id), ["ended"]);
  }
});

test("what-if does not mutate, spending less never lowers the odds, T3 has no equity cards", () => {
  const { mission, act, s0 } = setup("T1");
  const s = deepFreeze(act(s0, { type: "auto", years: 4, rule: "fixed" }));
  const cards = retirementWhatIf(mission, s, { amount: 45_000, equity: 0.6 });
  assert.deepEqual(cards.map((c) => c.id), WHAT_IF_IDS);
  const by = Object.fromEntries(cards.map((c) => [c.id, c]));
  assert.ok(by.spendLess10.odds >= by.thisDecision.odds);
  assert.ok(by.spendLess10.verdicts.includes("countsAsCut") === (40_500 < 0.9 * s.last));
  const t3 = setup("T3");
  assert.ok(!retirementWhatIf(t3.mission, t3.s0, { amount: 40_000, equity: 0.6 }).some((c) => c.id.startsWith("equity")));
});

test("demo folds deterministically on T1", () => {
  const steps = buildRetirementDemo();
  assert.deepEqual(steps.map((s) => s.id), ["welcome", "firstYear", "guardFive", "oddsChart", "whatIf", "yourTurn"]);
  const m = retirementMissionById(RETIREMENT_DEMO_MISSION);
  const shocks = yearShocks(m, RETIREMENT_DEMO_SEED);
  const fold = () => foldStates(book.startRetirement(m, RETIREMENT_DEMO_SEED), steps, (s, a) => book.reduceRetirement(s, a, m, shocks));
  const states = fold();
  assert.deepEqual(states, fold());
  assert.equal(states[1].year, 1);
  assert.equal(states[1].rows[0].take, 40_000);
  assert.equal(states.at(-1).year, 6);
  const rs = states.at(-1).rows.map((r) => r.r);
  assert.ok(rs.some((r) => r > 0) && rs.some((r) => r < 0), "mixed start");
});

const vars = (s) => [...s.matchAll(/{{(\w+)}}/g)].map((x) => x[1]).sort();
const parity = (en, hu) => {
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
  for (const [k, v] of Object.entries(en)) {
    assert.notEqual(hu[k], v, `HU equals EN for ${k}`);
    assert.deepEqual(vars(hu[k]), vars(v), `placeholders differ for ${k}`);
  }
};

test("copy for every advice, what-if, guide and demo id; EN/HU parity", () => {
  for (const id of ADVICE_IDS) for (const p of ["title", "body"]) assert.ok(`retrAdv_${id}_${p}` in helpEn, `${id} ${p}`);
  for (const id of WHAT_IF_IDS) assert.ok(`retrWi_${id}` in helpEn, id);
  for (const v of ["comfortable", "stretched", "likelyOut", "countsAsCut"]) assert.ok(`retrWiV_${v}` in helpEn, v);
  for (const [id, n] of Object.entries(guide.PLAYBOOKS)) {
    for (let i = 1; i <= n.steps; i++) assert.ok(`retrGdPlay_${id}_step${i}` in helpEn);
    for (let i = 1; i <= n.traps; i++) assert.ok(`retrGdPlay_${id}_trap${i}` in helpEn);
  }
  for (const a of guide.GUIDE_PANELS) assert.ok(`retrGdPanel_${a}` in helpEn, a);
  for (const k of guide.GUIDE_KEYS) assert.ok(`retrGdKey_${k}` in helpEn, k);
  for (let i = 1; i <= guide.GUIDE_MISTAKES; i++) assert.ok(`retrGdMistake${i}` in helpEn);
  for (const term of guide.GUIDE_TERMS) assert.ok(`retrGdTerm_${term}` in helpEn && `retrGdTermText_${term}` in helpEn, term);
  for (const s of buildRetirementDemo()) assert.ok(`retrDemo_${s.id}_title` in msEn && `retrDemo_${s.id}_body` in msEn, s.id);
  for (const m of RETIREMENT_MISSIONS) assert.ok(`retrMs_${m.id}_tagline` in msEn, m.id);
  parity(helpEn, helpHu);
  parity(msEn, msHu);
});
