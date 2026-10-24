import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/retirement-desk/engine/";
const mk = await importSrc(`${E}market.math.ts`);
const rules = await importSrc(`${E}rules.math.ts`);
const { successOdds } = await importSrc(`${E}odds.math.ts`);
const book = await importSrc(`${E}book.math.ts`);
const { evaluateRetirement } = await importSrc(`${E}objectives.math.ts`);
const { replayRetirement } = await importSrc(`${E}policy.math.ts`);
const { RETIREMENT_MISSIONS, retirementMissionById, DEFAULT_RETIREMENT } = await importSrc(`${E}missions.data.ts`);

const T1 = retirementMissionById("T1");
const close = (a, b, eps, msg = "") => assert.ok(Math.abs(a - b) < eps, `${msg} ${a} vs ${b}`);
const deepFreeze = (o) => {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    Object.values(o).forEach(deepFreeze);
  }
  return o;
};
const takeAll = (m, seed, amount, equity = m.equity0) => {
  const sh = mk.yearShocks(m, seed);
  let s = book.startRetirement(m, seed);
  while (!s.settled) s = book.reduceRetirement(s, { type: "take", amount: amount(s), equity, tag: "manual" }, m, sh);
  return s;
};

test("yearShocks is deterministic per seed, one pair per year", () => {
  assert.deepEqual(mk.yearShocks(T1, 4), mk.yearShocks(T1, 4));
  assert.notDeepEqual(mk.yearShocks(T1, 4), mk.yearShocks(T1, 5));
  assert.equal(mk.yearShocks(retirementMissionById("T4"), 1).length, 35);
});

test("legs correlate at rho and the mix matches its closed-form stats", () => {
  const m = { ...T1, years: 20_000 };
  const zs = mk.yearShocks(m, 11);
  const eq = zs.map(([z1, z2]) => mk.portfolioReturn(m, 1, z1, z2, 0));
  const bd = zs.map(([z1, z2]) => mk.portfolioReturn(m, 0, z1, z2, 0));
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const cov = (a, b) => mean(a.map((x, i) => (x - mean(a)) * (b[i] - mean(b))));
  close(cov(eq, bd) / Math.sqrt(cov(eq, eq) * cov(bd, bd)), T1.rho, 0.03, "rho");
  const mix = zs.map(([z1, z2]) => mk.portfolioReturn(m, 0.6, z1, z2, 0));
  const st = mk.portfolioStats(T1, 0.6);
  close(mean(mix), st.mu, 0.003, "mu");
  close(Math.sqrt(cov(mix, mix)), st.vol, 0.003, "vol");
});

test("forced returns replace the equity leg only, for their year", () => {
  const T2 = retirementMissionById("T2");
  close(mk.portfolioReturn(T2, 1, 2, 0, 1), -0.18, 1e-12);
  close(mk.portfolioReturn(T2, 0, 2, 0.5, 1), mk.portfolioReturn(T1, 0, 2, 0.5, 1), 1e-12);
  assert.notEqual(mk.portfolioReturn(T2, 1, 2, 0, 6), -0.18);
  assert.equal(mk.portfolioReturn({ ...T1, sigmaE: 10 }, 1, -5, 0, 1), -0.9);
});

test("spending rules and guardrails", () => {
  assert.equal(rules.nextWithdrawal("fixed", T1, 30_000, 1), 40_000);
  assert.equal(rules.nextWithdrawal("fixedLow", T1, null, 1e6), 35_000);
  assert.equal(rules.nextWithdrawal("pctWealth", T1, null, 900_000), 36_000);
  assert.equal(rules.nextWithdrawal("guardrails", T1, null, 1e6), 40_000);
  close(rules.nextWithdrawal("guardrails", T1, 40_000, 700_000), 36_000, 1e-9);
  close(rules.nextWithdrawal("guardrails", T1, 40_000, 1_500_000), 44_000, 1e-9);
  assert.equal(rules.nextWithdrawal("guardrails", T1, 40_000, 1_000_000), 40_000);
  assert.equal(rules.withdrawalRate(10, 0), 1);
});

test("successOdds is deterministic, bounded, and has the edge cases", () => {
  const o = successOdds(T1, 3, 1, 1e6, 40_000, 0.6, "fixed");
  assert.equal(o, successOdds(T1, 3, 1, 1e6, 40_000, 0.6, "fixed"));
  assert.ok(successOdds(T1, 3, 1, 1e6, 40_000, 0.6, "guardrails") >= o, "guardrails odds at least the fixed odds");
  assert.ok(successOdds(T1, 3, 1, 1e6, 60_000, 0.6) < successOdds(T1, 3, 1, 1e6, 40_000, 0.6), "default odds follow the amount");
  assert.ok(o > 0 && o < 1);
  assert.equal(successOdds(T1, 3, 1, 1e6, 0, 0.6, "fixedLow") >= o, true);
  assert.equal(successOdds({ ...T1, target: 0 }, 3, 1, 1e6, 0, 0.6, "fixed"), 1);
  assert.equal(successOdds(T1, 3, 5, 50_000, 50_000, 0.6), 0);
  assert.ok(successOdds(T1, 3, 1, 1e6, 80_000, 0.6, "fixed") < successOdds(T1, 3, 1, 1e6, 30_000, 0.6, "fixedLow"));
});

test("reducer: cut detection, rows, settle at the last year", () => {
  const sh = mk.yearShocks(T1, 2);
  let s = book.startRetirement(T1, 2);
  s = book.reduceRetirement(s, { type: "take", amount: 40_000, equity: 0.6, tag: "manual" }, T1, sh);
  s = book.reduceRetirement(s, { type: "take", amount: 37_000, equity: 0.6, tag: "manual" }, T1, sh);
  assert.equal(s.cuts, 0);
  s = book.reduceRetirement(s, { type: "take", amount: 30_000, equity: 0.6, tag: "manual" }, T1, sh);
  assert.equal(s.cuts, 1);
  close(s.events.find((e) => e.kind === "cut").pct, 30 / 37 - 1, 1e-12);
  assert.equal(s.rows.length, 3);
  assert.equal(s.rows[1].start, s.rows[0].end);
  s = book.reduceRetirement(s, { type: "auto", years: 99, rule: "fixed" }, T1, sh);
  assert.equal(s.year, 30);
  assert.ok(s.settled);
  assert.equal(s.events.filter((e) => e.kind === "end").length, 1);
  assert.equal(book.reduceRetirement(s, { type: "take", amount: 1, equity: 0.6, tag: "manual" }, T1, sh), s);
});

test("reducer: taking everything goes broke and settles", () => {
  const sh = mk.yearShocks(T1, 2);
  const s = book.reduceRetirement(book.startRetirement(T1, 2), { type: "take", amount: 2e6, equity: 0.6, tag: "manual" }, T1, sh);
  assert.ok(s.broke && s.settled);
  assert.equal(s.wealth, 0);
  assert.equal(s.rows[0].take, 1e6);
  assert.equal(evaluateRetirement(T1, s, 0)[0].status, "fail");
});

test("reducer: equity locked, immutability, restore", () => {
  const T3 = retirementMissionById("T3");
  const sh = mk.yearShocks(T3, 1);
  let s = deepFreeze(book.startRetirement(T3, 1));
  s = deepFreeze(book.reduceRetirement(s, { type: "take", amount: 40_000, equity: 1, tag: "manual" }, T3, sh));
  assert.equal(s.equity, 0.6);
  s = deepFreeze(book.reduceRetirement(s, { type: "auto", years: 3, rule: "guardrails" }, T3, sh));
  assert.equal(s.year, 4);
  assert.ok(s.minOdds <= s.rows[0].odds);
  assert.equal(book.reduceRetirement(s, { type: "restore", state: book.startRetirement(T3, 1) }, T3, sh).year, 0);
});

test("every objective kind evaluates; settled games are pass or fail", () => {
  const kinds = new Set();
  for (const m of RETIREMENT_MISSIONS) {
    for (const r of evaluateRetirement(m, book.startRetirement(m, 1), 0.9)) assert.ok(r.status === "onTrack" || r.status === "atRisk");
    for (const r of evaluateRetirement(m, replayRetirement(m, 1, "guardrails"), 1)) {
      kinds.add(r.def.kind);
      assert.ok(r.status === "pass" || r.status === "fail");
    }
  }
  assert.deepEqual([...kinds].sort(), ["avgSpendAtLeast", "cutsAtMost", "legacyAtLeast", "moneyLasts", "oddsNeverBelow"]);
  const live = evaluateRetirement(T1, book.startRetirement(T1, 1), 0.5);
  assert.equal(live[0].status, "atRisk");
  const s = takeAll({ ...T1, years: 3 }, 1, () => 40_000);
  const low = { ...T1, objectives: [{ kind: "oddsNeverBelow", floor: 0.99 }] };
  assert.equal(evaluateRetirement(low, { ...s, settled: false, minOdds: 0.5 }, 1)[0].status, "fail");
});

test("replayRetirement is deterministic and honours the equity override", () => {
  assert.deepEqual(replayRetirement(T1, 5, "pctWealth"), replayRetirement(T1, 5, "pctWealth"));
  const s = replayRetirement(T1, 5, "guardrails", 0.4);
  assert.ok(s.rows.every((r) => r.equity === 0.4));
  assert.equal(DEFAULT_RETIREMENT.paths, 400);
});
