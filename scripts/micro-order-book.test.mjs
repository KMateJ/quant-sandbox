import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const O = await importSrc("features/order-book/orderBook.math.ts");
const L = await importSrc("lib/market/ladder.ts");
const B = await importSrc("lib/market/book.ts");
const F = await importSrc("lib/market/flow.ts");

const book = (liq = "normal", seed = 3) => F.seedBook(O.presetSpec(liq), 10000, seed);

test("ladder takes sum to the preview and match previewMarket", () => {
  const b = book();
  for (const [side, size] of [["buy", 1600], ["sell", 900], ["buy", 50]]) {
    const rows = L.ladderRows(b, O.LADDER_DEPTH, 10000, { side, size });
    const p = B.previewMarket(b, side, size);
    assert.equal(rows.reduce((s, r) => s + r.take, 0), p.filled);
    for (const r of p.rows) assert.equal(rows.find((x) => x.price === r.price).take, r.take);
  }
});

test("sizeToRow round-trips with the preview", () => {
  const b = book();
  for (const side of ["buy", "sell"]) {
    const levels = side === "buy" ? b.asks : b.bids;
    const price = levels[3].price;
    const size = O.sizeToRow(b, side, price);
    const p = B.previewMarket(b, side, size);
    assert.equal(p.rows.at(-1).price, price);
    assert.equal(p.rows.length, 4);
    assert.equal(O.sideAt(b, price), side);
  }
});

test("slippage grows with size", () => {
  const b = book();
  const curve = O.slippageCurve(b, "buy", O.curveSizes(b, "buy")).filter((c) => Number.isFinite(c.bp));
  assert.ok(curve.length > 5);
  for (let i = 1; i < curve.length; i++) assert.ok(curve[i].bp >= curve[i - 1].bp - 1e-12);
  assert.ok(curve[0].bp > 0);
  assert.ok(Number.isNaN(O.slippageCurve(b, "buy", [1e9])[0].bp));
});

test("windowCentre keeps the ladder still inside the band", () => {
  assert.equal(L.windowCentre(null, 10000.5), 10001);
  assert.equal(L.windowCentre(10000, 10002), 10000);
  assert.equal(L.windowCentre(10000, 10003.5), 10004);
});

test("predict rounds are deterministic and walk 3–6 levels", () => {
  for (const liq of ["thin", "normal", "deep"]) {
    for (let seed = 1; seed <= 40; seed++) {
      const b = book(liq, seed);
      const r = O.predictRound(seed, b);
      assert.deepEqual(r, O.predictRound(seed, b));
      assert.equal(r.size % 100, 0);
      const n = O.levelsWalked(b, r.side, r.size);
      assert.ok(n >= 3 && n <= 6, `${liq} seed ${seed}: ${n} levels`);
    }
  }
});

test("presets are valid and ordered by depth", () => {
  const [thin, normal, deep] = ["thin", "normal", "deep"].map(O.presetSpec);
  assert.ok(thin.depthPerLevel < normal.depthPerLevel && normal.depthPerLevel < deep.depthPerLevel);
  for (const s of [thin, normal, deep]) {
    const fair = F.fairPath(s, 60, 1);
    const draws = F.flowSchedule(s, 60, 1);
    let b = F.seedBook(s, fair[0], 1);
    for (let t = 0; t < 60; t++) b = F.applyTick(b, draws[t], fair, t, s).book;
    assert.ok(B.spreadTicks(b) >= 1);
  }
  assert.ok(Math.abs(O.slippageBp("sell", 9990, 10000) - 10) < 1e-9);
});
