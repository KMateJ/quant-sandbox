import { test } from "node:test";
import assert from "node:assert/strict";
import { importSrc } from "./lib/load-ts.mjs";

const C = await importSrc("lib/finance/callable.ts");

const base = { coupon: 0.06, maturity: 10, freq: 2, callPrice: 100, protection: 3 };
const yields = Array.from({ length: 57 }, (_, i) => 0.01 + i * 0.0025);

test("callable never exceeds straight, for every spec and yield", () => {
  for (const freq of [1, 2, 4]) for (const protection of [1, 3, 5, 9]) for (const callPrice of [100, 105, 110]) {
    const spec = { ...base, freq, protection, callPrice };
    for (const y of yields) {
      const q = C.callablePriceAt(spec, y);
      assert.ok(q.callable <= q.straight + 1e-9, `${freq} ${protection} ${callPrice} ${y}`);
      assert.ok(q.call >= 0 && Math.abs(q.straight - q.callable - q.call) < 1e-12);
    }
  }
});

test("effective convexity is negative around and below the coupon, positive at high yields", () => {
  for (const y of [0.04, 0.05, 0.06]) assert.ok(C.effectiveRisk(base, y).cEff < 0, `y ${y}`);
  assert.ok(C.effectiveRisk(base, 0.12).cEff > 0);
  const ranges = C.negativeConvexityRanges(base, yields);
  assert.equal(ranges.length, 1);
  assert.ok(ranges[0][0] < 0.04 && ranges[0][1] > 0.06 && ranges[0][1] < 0.12, JSON.stringify(ranges));
});

test("with protection = maturity the callable equals the straight bond", () => {
  const spec = { ...base, protection: base.maturity };
  assert.deepEqual(C.callDates(spec), []);
  for (const y of yields) {
    const q = C.callablePriceAt(spec, y);
    assert.equal(q.call, 0);
    assert.equal(q.callable, q.straight);
  }
  assert.equal(C.callSchedule(spec, 0.02).length, 0);
  assert.equal(C.expectedRedemption(spec, 0.02), null);
});

test("call schedule: dates from the end of protection, issuer calls only when yields are low", () => {
  const dates = C.callSchedule(base, 0.03).map((d) => d.t);
  assert.equal(dates[0], 3);
  assert.equal(dates[dates.length - 1], 9.5);
  assert.equal(dates.length, 14);
  assert.ok(C.callSchedule(base, 0.03).every((d) => d.call));
  assert.ok(C.callSchedule(base, 0.09).every((d) => !d.call));
  assert.equal(C.expectedRedemption(base, 0.03), 3);
  assert.equal(C.expectedRedemption(base, 0.09), null);
});

test("yield to worst: premium callable trades to the call, discount to maturity; bounds never throw", () => {
  const rich = C.callablePriceAt(base, 0.03).callable;
  const r = C.yieldToWorst(base, rich);
  assert.ok(r.ytw <= r.ytm + 1e-12 && r.ytw <= r.ytc + 1e-12);
  assert.equal(r.worstDate, 3);
  const cheap = C.callablePriceAt(base, 0.09).callable;
  const d = C.yieldToWorst(base, cheap);
  assert.equal(d.worstDate, base.maturity);
  assert.ok(Math.abs(d.ytw - d.ytm) < 1e-12);
  const out = C.yieldToWorst(base, 1e9);
  assert.ok(Number.isNaN(out.ytm) && Number.isNaN(out.ytw));
  // Round trip: the straight bond priced at its own yield gives the yield back.
  const p = C.straightPriceAt(base, 0.07);
  assert.ok(Math.abs(C.yieldToWorst({ ...base, protection: 10 }, p).ytm - 0.07) < 1e-9);
});

test("a call price far above any bond value is never exercised", () => {
  const spec = { ...base, callPrice: 400 };
  assert.ok(C.callValueAt(spec, 0.01) < 1e-6);
});
