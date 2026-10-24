import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/hedging-desk/engine/";
const book = await importSrc(`${E}book.math.ts`);
const { buildMarket } = await importSrc(`${E}market.math.ts`);
const { markToMarket } = await importSrc(`${E}risk.math.ts`);
const { missionById } = await importSrc(`${E}missions.data.ts`);
const series = await importSrc(`${E}series.math.ts`);

const M1 = missionById("M1");
const market = buildMarket(M1.market, 7);
const step = (s, n = 1) => book.reduceDesk(s, { type: "step", days: n }, market, M1);

test("priceSeries covers days 0..day", () => {
  assert.equal(series.priceSeries(market, 0).length, 1);
  const p = series.priceSeries(market, 5);
  assert.equal(p.length, 6);
  assert.equal(p[5].S, market.spot[5]);
});

test("deltaSteps has open and close per record plus today", () => {
  const s = step(book.startBook(M1, 7, market), 3);
  const rows = series.deltaSteps(s.history, s.openDelta, s.openDelta, s.day);
  assert.equal(rows.length, 2 * 3 + 2);
  assert.equal(rows[0].delta, s.history[0].openDelta);
  assert.equal(rows[1].delta, s.history[0].closeDelta);
  assert.equal(rows.at(-1).day, 3);
});

test("sharesSteps repeats the previous value before each change", () => {
  let s = book.reduceDesk(book.startBook(M1, 7, market), { type: "order", order: { id: "STOCK", side: "buy", qty: 500, tag: "manual" } }, market, M1);
  s = step(s, 2);
  const rows = series.sharesSteps(s.history, 500, 0, s.day);
  assert.equal(rows.length, 2 * 3 - 1);
  assert.equal(rows[0].held, 500);
  assert.equal(rows[1].day, rows[2].day);
  assert.equal(rows[1].needed, rows[0].needed);
});

test("unhedgedPnl starts at the opening book's mark and spans to day", () => {
  const u = series.unhedgedPnl(M1, market, 10);
  assert.equal(u.length, 11);
  assert.ok(Math.abs(u[0].pnl - markToMarket(book.startBook(M1, 7, market), market)) < 1e-9);
  assert.equal(series.unhedgedPnl(M1, market, 63).length, 64);
});
