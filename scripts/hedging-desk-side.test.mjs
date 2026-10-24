import test from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const side = await importSrc("features/hedging-desk/sidePanels.math.ts");
const pricing = await importSrc("features/hedging-desk/engine/pricing.math.ts");
const market = await importSrc("features/hedging-desk/engine/market.math.ts");
const book = await importSrc("features/hedging-desk/engine/book.math.ts");
const risk = await importSrc("features/hedging-desk/engine/risk.math.ts");
const { missionById } = await importSrc("features/hedging-desk/engine/missions.data.ts");
const { DEFAULT_COSTS } = await importSrc("features/hedging-desk/engine/desk.config.ts");

const M1 = missionById("M1");
const mk = market.buildMarket(M1.market, 7);
const quote = (id, s) => pricing.quoteInstrument(id, mk.spot[s.day], pricing.tauAt(s.day, mk.days), mk.iv[s.day], mk.rate, M1.costs);

test("ticket preview matches the fill the engine makes", () => {
  const s0 = book.startBook(M1, 7, mk);
  const net0 = risk.netDelta(s0.positions, mk, 0);
  const q = quote("C105", s0);
  const p = side.ticketPreview(q, "buy", 5, net0, M1.band);
  assert.ok(Math.abs(p.deltaImpact - 500 * q.delta) < 1e-9);
  assert.equal(p.fill, q.ask);
  assert.ok(Math.abs(p.cost - 5 * 100 * DEFAULT_COSTS.optionHalfSpread) < 1e-9);
  const s1 = book.applyOrder(s0, mk, M1, { id: "C105", side: "buy", qty: 5, tag: "manual" });
  assert.ok(Math.abs(risk.netDelta(s1.positions, mk, 0) - p.netAfter) < 1e-9);
  assert.ok(Math.abs(s0.cash - s1.cash - p.notional) < 1e-9);
  assert.equal(p.inBand, Math.abs(p.netAfter) <= M1.band);
});

test("selling puts adds positive delta", () => {
  const s0 = book.startBook(M1, 7, mk);
  const p = side.ticketPreview(quote("P95", s0), "sell", 10, 0, 100);
  assert.ok(p.deltaImpact > 0);
  assert.equal(p.fill, quote("P95", s0).bid);
});

test("ticket fee is part of the previewed cost; zero qty costs nothing", () => {
  const s0 = book.startBook(M1, 7, mk);
  const q = quote("STOCK", s0);
  assert.ok(Math.abs(side.ticketPreview(q, "buy", 100, 0, 100, 15).cost - (100 * 0.01 + 15)) < 1e-9);
  assert.equal(side.ticketPreview(q, "buy", 0, 0, 100, 15).cost, 0);
});

test("quantity parsing", () => {
  assert.equal(side.parseQty("500"), 500);
  for (const bad of ["", "0", "-5", "2.5", "abc"]) assert.equal(side.parseQty(bad), 0);
});

test("breakeven move is defined only for short gamma, long theta books", () => {
  assert.equal(side.breakevenMove(10, 5), null);
  assert.equal(side.breakevenMove(-10, -5), null);
  const be = side.breakevenMove(-200, 50);
  // At the breakeven move, ½·|Γ|·m² equals one trading day's theta.
  assert.ok(Math.abs(0.5 * 200 * be * be - (50 * 365) / 252) < 1e-9);
});

test("nearest strike", () => {
  const strikes = M1.market.strikes;
  assert.equal(side.nearestStrike(strikes, 100.2), 100);
  assert.equal(side.nearestStrike(strikes, 96.4), 97.5);
  assert.equal(side.nearestStrike(strikes, 50), 90);
});

test("instrument labels", () => {
  assert.equal(side.instrumentLabel("STOCK"), "QSBX US");
  assert.equal(side.instrumentLabel("C100"), "QSBX 100C");
  assert.equal(side.instrumentLabel("P97.5"), "QSBX 97.5P");
});
