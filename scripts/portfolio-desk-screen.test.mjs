import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const D = "features/portfolio-desk/";
const { eventText } = await importSrc(`${D}eventText.ts`);
const { objectiveView } = await importSrc(`${D}objectiveViews.ts`);
const { parseTargets, ticketPreview, toTargets } = await importSrc(`${D}ticket.math.ts`);
const { positionRows, recentReturns } = await importSrc(`${D}positions.math.ts`);
const { portfolioMissionById, PORTFOLIO_MISSIONS } = await importSrc(`${D}engine/missions.data.ts`);
const { monthlyReturns, ewmaCov } = await importSrc(`${D}engine/market.math.ts`);
const { startPortfolio, reducePortfolio } = await importSrc(`${D}engine/book.math.ts`);
const { evaluatePortfolio } = await importSrc(`${D}engine/objectives.math.ts`);
const { portfolioDeskEn } = await importSrc("Language/PortfolioDesk.ts");
const { portfolioDeskHu } = await importSrc("Language/PortfolioDesk.hu.ts");

/// Fake translate that fails on unknown keys and echoes the key.
const t = (key) => {
  assert.ok(key in portfolioDeskEn, `missing copy key ${key}`);
  return key;
};

const P1 = portfolioMissionById("P1");

test("eventText covers every event kind with known copy", () => {
  const events = [
    { t: 0, kind: "start" },
    { t: 1, kind: "rebalance", turnover: 0.1, vol: 0.1, tag: "manual" },
    { t: 1, kind: "rebalance", turnover: 0.1, vol: 0.1, tag: "auto" },
    { t: 2, kind: "bigMonth", fund: -0.04, eq: -0.06, gov: 0.01 },
    { t: 3, kind: "drawdown", dd: -0.11 },
    { t: 3, kind: "shareMiss", asset: "EQ", share: 0.6 },
    { t: 36, kind: "end", nav: 1.1, bench: 1.05 },
  ];
  for (const e of events) {
    const row = eventText(e, t);
    assert.ok(row.text && row.kind && row.t);
  }
  assert.equal(eventText(events[3], t).tone, "down");
  assert.equal(eventText(events[6], t).tone, "up");
});

test("objectiveView labels every objective kind", () => {
  const s = startPortfolio(P1, 1);
  for (const m of PORTFOLIO_MISSIONS) for (const r of evaluatePortfolio(m, s)) assert.ok(objectiveView(r, t).label);
});

test("ticket blocks totals over 100% and negative or junk entries", () => {
  const { R } = monthlyReturns(P1, 1);
  const S = ewmaCov(P1, R, 0);
  const w = P1.start;
  assert.equal(ticketPreview(w, parseTargets(["60", "30", "10", "10", "0"]), S, P1, 1).valid, false);
  assert.equal(ticketPreview(w, parseTargets(["-5", "0", "0", "0", "0"]), S, P1, 1).valid, false);
  assert.equal(ticketPreview(w, parseTargets(["abc", "0", "0", "0", "0"]), S, P1, 1).valid, false);
  const ok = ticketPreview(w, parseTargets(["30", "10", "20", "10", ""]), S, P1, 1);
  assert.ok(ok.valid);
  assert.ok(Math.abs(ok.cash - 0.3) < 1e-12);
  assert.ok(Math.abs(ok.cost - 0.001 * ok.turnover) < 1e-15);
  assert.deepEqual(toTargets([0.55, 0.2, 0.1, 0.1, 0.05]), ["55", "20", "10", "10", "5"]);
  assert.equal(ticketPreview(w, parseTargets(toTargets(w)), S, P1, 1).turnover < 1e-12, true);
});

test("positions and heat strip follow the realised months", () => {
  const { R } = monthlyReturns(P1, 2);
  const s = reducePortfolio(startPortfolio(P1, 2), { type: "step", months: 14 }, P1, R);
  const S = ewmaCov(P1, R, s.month);
  const rows = positionRows(s, R, S, P1, [0.2, 0.2, 0.2, 0.2, 0.2], 100);
  assert.equal(rows.length, 6);
  assert.ok(Math.abs(rows.reduce((a, r) => a + r.weight, 0) - 1) < 1e-12);
  assert.equal(rows[0].month, R[13][0]);
  const recent = recentReturns(s, R);
  assert.deepEqual(recent.months, [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]);
  assert.equal(recent.assets[2][11], R[13][2]);
  assert.equal(recent.fund[11], s.hist[14].rp);
  assert.deepEqual(recentReturns(startPortfolio(P1, 2), R).months, []);
});

test("PortfolioDesk copy: EN/HU parity and HU differs", () => {
  assert.deepEqual(Object.keys(portfolioDeskHu).sort(), Object.keys(portfolioDeskEn).sort());
  for (const k of Object.keys(portfolioDeskEn)) assert.notEqual(portfolioDeskHu[k], portfolioDeskEn[k], k);
});
