import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/portfolio-desk/";
const { portfolioAdvice, ADVICE_IDS } = await importSrc(`${D}help/advice.math.ts`);
const { portfolioWhatIf, WHAT_IF_IDS } = await importSrc(`${D}help/whatIf.math.ts`);
const { allGuideKeys } = await importSrc(`${D}help/guide.data.ts`);
const { buildPortfolioDemo, demoStates, PORTFOLIO_DEMO_SEED } = await importSrc(`${D}demo/demo.script.ts`);
const { attribution, policyRows } = await importSrc(`${D}debrief.math.ts`);
const { PORTFOLIO_MISSIONS, portfolioMissionById } = await importSrc(`${D}engine/missions.data.ts`);
const { monthlyReturns, ewmaCov } = await importSrc(`${D}engine/market.math.ts`);
const { startPortfolio, reducePortfolio } = await importSrc(`${D}engine/book.math.ts`);
const { riskShares } = await importSrc(`${D}engine/risk.math.ts`);
const { TONE_ORDER } = await importSrc("lib/game/advice.ts");
const en = {
  ...(await importSrc("Language/PortfolioDeskMissions.ts")).portfolioDeskMissionsEn,
  ...(await importSrc("Language/PortfolioDeskHelp.ts")).portfolioDeskHelpEn,
};
const hu = {
  ...(await importSrc("Language/PortfolioDeskMissions.hu.ts")).portfolioDeskMissionsHu,
  ...(await importSrc("Language/PortfolioDeskHelp.hu.ts")).portfolioDeskHelpHu,
};

const P1 = portfolioMissionById("P1");
const P3 = portfolioMissionById("P3");
const R1 = monthlyReturns(P1, 1).R;
const run = (m, R, actions, seed = 1) => actions.reduce((s, a) => reducePortfolio(s, a, m, R), startPortfolio(m, seed));

test("P1 start: volatility off target comes first; after scaling it is on target", () => {
  const s0 = startPortfolio(P1, 1);
  assert.equal(portfolioAdvice(P1, s0, R1)[0].id, "volOff");
  const ids = portfolioAdvice(P1, run(P1, R1, [{ type: "scaleToTarget" }]), R1).map((a) => a.id);
  assert.ok(ids.includes("onTarget") && !ids.includes("volOff"), ids.join(","));
});

test("P3 warns about the stress window at month 10", () => {
  const R3 = monthlyReturns(P3, 1).R;
  const s = run(P3, R3, [{ type: "scaleToTarget" }, { type: "step", months: 10 }]);
  assert.ok(portfolioAdvice(P3, s, R3).some((a) => a.id === "stressAhead"));
});

test("advice: at most six items in tone order; settled run points to the debrief", () => {
  for (const m of PORTFOLIO_MISSIONS) {
    const R = monthlyReturns(m, 4).R;
    for (const months of [0, 5, 11, 20]) {
      const items = portfolioAdvice(m, run(m, R, [{ type: "step", months }], 4), R);
      assert.ok(items.length <= 6);
      for (let i = 1; i < items.length; i++) assert.ok(TONE_ORDER[items[i - 1].tone] <= TONE_ORDER[items[i].tone]);
    }
  }
  const done = run(P1, R1, [{ type: "step", months: 36 }]);
  assert.deepEqual(portfolioAdvice(P1, done, R1).map((a) => a.id), ["ended"]);
});

test("what-if: five scenarios, no mutation, parity spreads risk evenly", () => {
  const s = run(P1, R1, [{ type: "step", months: 4 }]);
  const snap = JSON.stringify(s);
  const w = portfolioWhatIf(P1, s, R1);
  assert.equal(JSON.stringify(s), snap);
  assert.deepEqual(w.map((x) => x.id), WHAT_IF_IDS);
  const S = ewmaCov(P1, R1, s.month);
  for (const share of riskShares(w.find((x) => x.id === "parity10").targets, S)) assert.ok(Math.abs(share - 0.2) < 0.01);
  assert.equal(w[0].cost, 0);
  assert.ok(Math.abs(w.find((x) => x.id === "scale10").vol - 0.1) < 1e-9);
});

test("demo: six steps folded deterministically, months 0 → 12", () => {
  const steps = buildPortfolioDemo();
  assert.deepEqual(steps.map((s) => s.id), ["welcome", "scale", "sixMonths", "parity", "sixMore", "yourTurn"]);
  const R = monthlyReturns(P1, PORTFOLIO_DEMO_SEED).R;
  const a = demoStates(P1, R, PORTFOLIO_DEMO_SEED);
  assert.deepEqual(a, demoStates(P1, R, PORTFOLIO_DEMO_SEED));
  assert.deepEqual(a.map((s) => s.month), [0, 0, 6, 6, 12, 12]);
});

test("attribution sums exactly to the NAV change; policy table lists four policies and you", () => {
  const s = run(P1, R1, [{ type: "scaleToTarget" }, { type: "step", months: 12 }, { type: "riskParity" }, { type: "step", months: 24 }]);
  const a = attribution(s, R1, P1);
  const sum = a.assets.reduce((x, y) => x + y, 0) + a.cash + a.costs;
  assert.ok(Math.abs(sum - a.total) < 1e-10, `${sum} vs ${a.total}`);
  const rows = policyRows(P1, 1, s);
  assert.deepEqual(rows.map((r) => r.policy), ["scaleQuarterly", "parityMonthly", "sixtyForty", "buyHold", "you"]);
  assert.equal(rows[4].nav, s.nav);
});

test("help copy: every advice, what-if and guide key exists; EN/HU parity, HU differs", () => {
  const need = [
    ...ADVICE_IDS.flatMap((id) => [`pmgrAdv_${id}_title`, `pmgrAdv_${id}_body`]),
    ...WHAT_IF_IDS.flatMap((id) => [`pmgrWi_${id}_title`, `pmgrWi_${id}_body`]),
    ...buildPortfolioDemo().flatMap((s) => [`pmgrDemo_${s.id}_title`, `pmgrDemo_${s.id}_body`]),
    ...allGuideKeys(PORTFOLIO_MISSIONS.map((m) => m.id)),
  ];
  for (const k of need) assert.ok(k in en, `missing ${k}`);
  assert.deepEqual(Object.keys(hu).sort(), Object.keys(en).sort());
  for (const k of Object.keys(en)) assert.notEqual(hu[k], en[k], k);
});
