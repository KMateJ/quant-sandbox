import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { roundTrip, spreadBp } = await importSrc("features/guide/guide.micro.marketMakers.math.ts");

const base = { halfSpread: 2, sigma: 1, seed: 1 };

test("spread income plus inventory P&L equals the total", () => {
  for (const seed of [1, 2, 3, 17, 99]) {
    const r = roundTrip({ ...base, seed });
    assert.ok(Math.abs(r.spreadIncome + r.inventoryPnl - r.total) < 1e-9);
  }
});

test("zero volatility: no inventory P&L, total is two half-spreads times size", () => {
  const r = roundTrip({ ...base, sigma: 0 });
  assert.equal(r.inventoryPnl, 0);
  assert.ok(Math.abs(r.total - (2 * 2 * 100) / 100) < 1e-9);
  assert.equal(r.spreadIncome, 4);
});

test("quotes sit half a spread either side of the mid, and the fills are at those quotes", () => {
  const r = roundTrip(base);
  assert.equal(r.mid.length, 31);
  r.mid.forEach((m, i) => {
    assert.equal(r.bid[i], m - 2);
    assert.equal(r.ask[i], m + 2);
  });
  assert.equal(r.fills.buy.price, r.ask[5]);
  assert.equal(r.fills.sell.price, r.bid[20]);
});

test("a rising mid while short turns the round trip negative", () => {
  const r = roundTrip({ ...base, sigma: 3 });
  const dm = r.mid[20] - r.mid[5];
  assert.ok(dm > 0 && r.inventoryPnl < 0 || dm < 0 && r.inventoryPnl > 0);
});

test("same seed, same path; different seed, different path", () => {
  assert.deepEqual(roundTrip(base).mid, roundTrip(base).mid);
  assert.notDeepEqual(roundTrip(base).mid, roundTrip({ ...base, seed: 2 }).mid);
});

test("spread in basis points: 49.95 / 50.05 is 20 bp, 99.98 / 100.02 is 4 bp", () => {
  assert.ok(Math.abs(spreadBp(49.95, 50.05) - 20) < 1e-9);
  assert.ok(Math.abs(spreadBp(99.98, 100.02) - 4) < 1e-9);
});
