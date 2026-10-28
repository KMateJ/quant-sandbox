import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const gm = await importSrc("features/glosten-milgrom/glostenMilgrom.math.ts");
const grid = Array.from({ length: 19 }, (_, i) => (i + 1) / 20);

test("ask ≥ mu ≥ bid; π = 0 gives zero spread", () => {
  for (const pi of [0.05, 0.2, 0.6]) for (const mu of grid) {
    assert.ok(gm.askAt(mu, pi) >= mu - 1e-12 && mu >= gm.bidAt(mu, pi) - 1e-12);
  }
  for (const mu of grid) assert.ok(Math.abs(gm.askAt(mu, 0) - gm.bidAt(mu, 0)) < 1e-12);
});

test("π = 1: the first trade reveals V", () => {
  assert.equal(gm.update(0.5, "B", 1), 1);
  assert.equal(gm.update(0.5, "S", 1), 0);
});

test("belief is a martingale under the maker's measure", () => {
  for (const pi of [0.1, 0.3, 0.8]) for (const mu of grid) {
    const pb = mu * gm.pBuy(1, pi) + (1 - mu) * gm.pBuy(0, pi);
    const e = pb * gm.update(mu, "B", pi) + (1 - pb) * gm.update(mu, "S", pi);
    assert.ok(Math.abs(e - mu) < 1e-12);
  }
});

test("flipping tile k changes only steps ≥ k", () => {
  const trades = gm.drawTrades({ pi: 0.2, prior: 0.5, trueV: 1, n: 30 }, 7);
  const base = gm.gmPath(trades, 0.2, 0.5);
  const k = 12;
  const flipped = trades.slice();
  flipped[k] = flipped[k] === "B" ? "S" : "B";
  const alt = gm.gmPath(flipped, 0.2, 0.5);
  for (let i = 0; i <= k; i++) assert.equal(alt[i].mu, base[i].mu);
  assert.notEqual(alt[k].next, base[k].next);
});

test("drawTrades is deterministic per seed", () => {
  const p = { pi: 0.2, prior: 0.5, trueV: 0, n: 50 };
  assert.deepEqual(gm.drawTrades(p, 42), gm.drawTrades(p, 42));
  assert.notDeepEqual(gm.drawTrades(p, 42), gm.drawTrades(p, 43));
});

const median = (xs) => { const s = xs.slice().sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const medianTrades = (pi) => {
  const p = { pi, prior: 0.5, trueV: 1, n: 2000 };
  const out = [];
  for (let seed = 1; seed <= 2000; seed++) {
    const n = gm.tradesToConfidence(gm.gmPath(gm.drawTrades(p, seed), pi, 0.5), 1, 0.9);
    out.push(n ?? p.n);
  }
  return median(out);
};

test("doubling π cuts trades to 90% confidence to about a quarter", () => {
  const ratio = medianTrades(0.2) / medianTrades(0.1);
  console.log(`trades-to-0.9 ratio π0.2/π0.1 = ${ratio.toFixed(3)}`);
  assert.ok(ratio >= 0.2 && ratio <= 0.35, `ratio ${ratio}`);
});

test("infoPerTrade ≈ 2π² for small π", () => {
  assert.ok(Math.abs(gm.infoPerTrade(0.05) / (2 * 0.05 ** 2) - 1) < 0.01);
});

test("you-quote: better price wins, ties go to nobody, P&L signs", () => {
  const step = { trade: "B", mu: 0.5, ask: 0.6, bid: 0.4, next: 0.6 };
  assert.equal(gm.resolveQuote({ bid: 0.4, ask: 0.58 }, step).won, true);
  assert.equal(gm.resolveQuote({ bid: 0.4, ask: 0.6 }, step).won, false);
  assert.ok(Math.abs(gm.resolveQuote({ bid: 0.38, ask: 0.62 }, step).error - 0.02) < 1e-12);
  const sold = gm.resolveQuote({ bid: 0.3, ask: 0.55 }, step);
  assert.ok(Math.abs(gm.quotePnl([sold], 1) - (0.55 - 1)) < 1e-12);
  const bought = gm.resolveQuote({ bid: 0.45, ask: 0.9 }, { ...step, trade: "S" });
  assert.ok(bought.won && Math.abs(gm.quotePnl([bought], 1) - 0.55) < 1e-12);
  assert.equal(gm.meanQuoteError([]), 0);
});
