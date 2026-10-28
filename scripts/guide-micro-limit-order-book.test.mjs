import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { bookForFigure, flatBook, ladder, slippageBp, slippageCurve, walkBook, MID_TICKS } = await importSrc(
  "features/guide/guide.micro.limitOrderBook.math.ts",
);

const close = (a, b, tol = 1e-9) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("the figure's book has ten levels a side and a two-tick spread around 100.00", () => {
  const b = bookForFigure();
  assert.equal(b.asks.length, 10);
  assert.equal(b.bids.length, 10);
  assert.equal(b.asks[0].price, 10001);
  assert.equal(b.bids[0].price, 9999);
  assert.equal(MID_TICKS, 10000);
});

test("the first four ask levels carry the worked example's sizes", () => {
  assert.deepEqual(ladder(bookForFigure(), "buy", 4).map((l) => l.size), [318, 311, 518, 453]);
});

test("worked example: buy 1,600", () => {
  const w = walkBook(bookForFigure(), "buy", 1600);
  assert.deepEqual(w.rows.map((r) => r.take), [318, 311, 518, 453]);
  assert.equal(w.filled, 1600);
  assert.equal(w.unfilled, 0);
  const notional = 318 * 100.01 + 311 * 100.02 + 518 * 100.03 + 453 * 100.04;
  close(notional, 160043.06, 1e-6);
  close(w.avgPrice / 100, 100.0269125, 1e-9);
  close(w.slippageBp, 2.69125, 1e-6);
  close(w.costUsd, 43.06, 1e-6);
});

test("check example: asks 50.00 × 200 and 50.01 × 300, buy 400 averages 50.005", () => {
  const b = flatBook([[5000, 200], [5001, 300]], [[4999, 100]]);
  const w = walkBook(b, "buy", 400, 5000.5);
  close(w.avgPrice / 100, 50.005, 1e-9);
});

test("slippageBp is positive for a buy above and a sell below the mid, negative otherwise", () => {
  assert.ok(slippageBp(10002, 10000, "buy") > 0);
  assert.ok(slippageBp(9998, 10000, "sell") > 0);
  assert.ok(slippageBp(9998, 10000, "buy") < 0);
  close(slippageBp(10001, 10000, "buy"), 1);
  close(slippageBp(9999, 10000, "sell"), 1);
});

test("slippage curve is non-decreasing in size, on both sides", () => {
  const sizes = Array.from({ length: 40 }, (_, i) => 100 * (i + 1));
  for (const side of ["buy", "sell"]) {
    const curve = slippageCurve(bookForFigure(), side, sizes);
    assert.ok(curve.length >= 35);
    for (let i = 1; i < curve.length; i++) assert.ok(curve[i].bp >= curve[i - 1].bp - 1e-12);
  }
});

test("total cost grows faster than linearly: doubling the size more than doubles the cost", () => {
  const b = bookForFigure();
  assert.ok(walkBook(b, "buy", 3200).costUsd > 2 * walkBook(b, "buy", 1600).costUsd);
});

test("a size beyond the book reports the unfilled part", () => {
  const w = walkBook(bookForFigure(), "buy", 50000);
  assert.ok(w.unfilled > 0);
  assert.equal(w.filled + w.unfilled, 50000);
});

test("same seed, same book", () => {
  assert.deepEqual(bookForFigure(3), bookForFigure(3));
});
