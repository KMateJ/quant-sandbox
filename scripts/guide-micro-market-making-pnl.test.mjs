import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { applyFill, decompose, emptyLedger } = await importSrc("lib/market/maker.ts");
const { runSession, sessionParts, markoutCurve, sessionMarkouts } = await importSrc("features/guide/guide.micro.marketMakingPnl.math.ts");

test("worked example: buy 100 at 99.99, mid 100.00 then 99.95", () => {
  const midAt = (t) => (t < 10 ? 100 : 99.95);
  const l = applyFill(emptyLedger(), { t: 0, side: "buy", price: 99.99, size: 100, mid: 100, fee: 0 });
  const p = decompose(l, midAt, 60, 10);
  assert.ok(Math.abs(p.spread - 1) < 1e-9);
  assert.ok(Math.abs(p.adverse + 5) < 1e-9);
  assert.ok(Math.abs(p.inventory) < 1e-9);
  assert.ok(Math.abs(p.total + 4) < 1e-9);
  const r = decompose(applyFill(emptyLedger(), { t: 0, side: "buy", price: 99.99, size: 100, mid: 100, fee: 0.2 }), midAt, 60, 10);
  assert.ok(Math.abs(r.total + 3.8) < 1e-9);
});

test("the four parts sum to the total", () => {
  for (const seed of [1, 2, 3]) {
    const s = runSession({ informed: 0.15, offset: 1, seed });
    for (const h of [1, 10, 30]) {
      const p = sessionParts(s, h);
      assert.ok(Math.abs(p.spread + p.adverse + p.inventory + p.fees - p.total) < 1e-9);
    }
  }
});

test("markout is near zero on average without informed flow", () => {
  const sums = new Array(30).fill(0);
  for (let seed = 1; seed <= 20; seed++) sessionMarkouts(runSession({ informed: 0, offset: 0.5, seed })).forEach((r, i) => (sums[i] += r.markout / 20));
  assert.ok(sums.every((m) => Math.abs(m) < 0.3), `avg markouts ${sums.map((x) => x.toFixed(3))}`);
});

test("informed flow makes the markout negative", () => {
  let a = 0;
  for (let seed = 1; seed <= 20; seed++) a += sessionMarkouts(runSession({ informed: 0.3, offset: 0.5, seed }))[9].markout / 20;
  assert.ok(a < -0.1, `${a}`);
});

test("sessions are deterministic", () => {
  const a = runSession({ informed: 0.15, offset: 1, seed: 5 });
  const b = runSession({ informed: 0.15, offset: 1, seed: 5 });
  assert.deepEqual(a, b);
  assert.ok(a.ledger.fills.length > 0);
  assert.equal(markoutCurve(emptyLedger(), () => 0, [1])[0].markout, 0);
});
