import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/hedging-desk/engine/";
const book = await importSrc(`${E}book.math.ts`);
const { buildMarket } = await importSrc(`${E}market.math.ts`);
const { markToMarket } = await importSrc(`${E}risk.math.ts`);
const { missionById } = await importSrc(`${E}missions.data.ts`);
const { replayPolicy } = await importSrc(`${E}policy.math.ts`);
const { attribution, thetaGamma, dailyPnl } = await importSrc(`${E}debrief.math.ts`);

const M1 = missionById("M1");
const market = buildMarket(M1.market, 7);
const run = (perDay) => {
  let s = book.startBook(M1, 7, market);
  while (!s.settled) {
    s = perDay(s);
    s = book.reduceDesk(s, { type: "step", days: 1 }, market, M1);
  }
  return s;
};
const sumParts = (a) => a.premium + a.optionSettlement + a.stockPnl + a.financing + a.costs;
const checkIdentity = (s) => {
  const a = attribution(M1, market, s);
  assert.ok(Math.abs(a.net - markToMarket(s, market)) < 1e-6);
  assert.ok(Math.abs(sumParts(a) - a.net) < 1e-6, `parts ${sumParts(a)} vs net ${a.net}`);
  return a;
};

test("attribution sums to the P&L for the daily policy", () => {
  const a = checkIdentity(run((s) => book.reduceDesk(s, { type: "autoHedge" }, market, M1)));
  assert.ok(a.premium > 0);
  assert.ok(a.financing < 0, "a short-call hedge borrows to buy stock");
  assert.ok(a.costs < 0);
});

test("attribution sums for a run with option trades, and mid-run", () => {
  const trade = (s) => {
    if (s.day === 5) s = book.applyOrder(s, market, M1, { id: "C105", side: "buy", qty: 4, tag: "manual" });
    if (s.day === 30) s = book.applyOrder(s, market, M1, { id: "P95", side: "sell", qty: 2, tag: "manual" });
    return book.reduceDesk(s, { type: "autoHedge" }, market, M1);
  };
  checkIdentity(run(trade));
  let mid = book.startBook(M1, 7, market);
  for (let i = 0; i < 12; i++) mid = book.reduceDesk(trade(mid), { type: "step", days: 1 }, market, M1);
  mid = book.applyOrder(mid, market, M1, { id: "STOCK", side: "buy", qty: 50, tag: "manual" });
  checkIdentity(mid);
});

test("attribution sums for the no-hedge policy", () => {
  const a = checkIdentity(run((s) => s));
  assert.equal(a.stockPnl, 0);
});

test("short calls collect theta and pay gamma", () => {
  const s = run((x) => book.reduceDesk(x, { type: "autoHedge" }, market, M1));
  const { thetaCollected, gammaPaid } = thetaGamma(M1, market, s);
  assert.ok(thetaCollected > 0);
  assert.ok(gammaPaid > 0);
});

test("daily P&L sums to the final P&L", () => {
  const s = run((x) => x);
  const final = markToMarket(s, market);
  const d = dailyPnl(s.history, final);
  assert.equal(d.length, s.history.length + 1);
  assert.ok(Math.abs(d.reduce((a, b) => a + b, 0) - final) < 1e-9);
});

test("policy replays (seed 7 baseline)", () => {
  const r = [1, 5, 21, 0].map((every) => replayPolicy(M1, market, 7, every));
  for (const p of r) assert.ok(Number.isFinite(p.pnl));
  console.log("M1 seed 7 P&L daily/weekly/monthly/none:", r.map((p) => p.pnl.toFixed(2)).join(" / "));
});
