import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const E = "features/rates-desk/engine/";
const lib = await importSrc("lib/finance/curveRisk.ts");
const guide = await importSrc("features/guide/guide.wave4.math.ts");
const curve = await importSrc(`${E}curve.math.ts`);
const pricing = await importSrc(`${E}pricing.math.ts`);
const risk = await importSrc(`${E}risk.math.ts`);
const book = await importSrc(`${E}book.math.ts`);
const { ratesMissionById } = await importSrc(`${E}missions.data.ts`);

const R1 = ratesMissionById("R1");
const zeros = curve.zeroGrid(R1.start);
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg ?? ""} ${a} vs ${b}`);

test("guide re-exports the shared curve-risk helpers", () => {
  for (const name of ["KEY_RATES", "zeroAt", "priceOnCurve", "curveDuration", "keyWeight", "keyRateDurations", "bulletCashflows", "barbellCashflows"]) {
    assert.equal(typeof guide[name], typeof lib[name], name);
  }
  const cf = lib.bulletCashflows(0.05, 7);
  assert.equal(guide.priceOnCurve(cf, guide.CURVE_ZEROS), lib.priceOnCurve(cf, guide.CURVE_ZEROS));
});

test("couponCashflows handles fractional maturities", () => {
  const cf = lib.couponCashflows(0.04, 2.5);
  assert.deepEqual(cf.map((c) => c.t), [0.5, 1.5, 2.5]);
  assert.equal(cf[2].cf, 104);
  assert.deepEqual(lib.couponCashflows(0.05, 3), lib.bulletCashflows(0.05, 3));
});

test("key-rate DV01s add up to the parallel DV01", () => {
  const s = book.startRates(R1, 1, curve.factorPath(R1, 1));
  const r = risk.ratesRisk(s, R1, zeros);
  near(r.kBook.reduce((a, b) => a + b, 0), r.bookDv01, 0.01 * r.bookDv01, "book");
  for (const f of R1.futures) {
    const k = pricing.futureKrd(f, zeros).reduce((a, b) => a + b, 0);
    near(k, pricing.futureDv01(f, zeros), 0.01 * pricing.futureDv01(f, zeros), f.id);
  }
});

test("futures price is the cheapest P/CF and a 6% bond has CF ≈ 1", () => {
  for (const f of R1.futures) {
    const q = pricing.futureQuote(f, zeros);
    assert.equal(q.F, Math.min(...q.prices.map((p, i) => p / q.cfs[i])));
  }
  near(pricing.conversionFactor(0.06, 10), 1, 1e-4);
  near(pricing.conversionFactor(0.06, 7.5), 1, 1e-3);
});

test("key-rate hedge flattens every bucket", () => {
  const s = book.startRates(R1, 1, curve.factorPath(R1, 1));
  const hedged = { ...s, contracts: risk.krdHedgeQty(s, R1, zeros) };
  const per = Math.max(...R1.futures.map((f) => pricing.futureDv01(f, zeros)));
  for (const b of risk.bucketsOf(risk.ratesRisk(hedged, R1, zeros).kNet)) assert.ok(Math.abs(b) < per, `bucket ${b}`);
});

test("factorPath is deterministic and seed-dependent", () => {
  assert.deepEqual(curve.factorPath(R1, 3), curve.factorPath(R1, 3));
  assert.notDeepEqual(curve.factorPath(R1, 3), curve.factorPath(R1, 4));
  assert.equal(curve.factorPath(R1, 3).length, R1.days + 1);
  assert.deepEqual(curve.factorPath(R1, 3)[0], R1.start);
});

test("bump moves one node or the whole curve", () => {
  const p = curve.bump(zeros, "parallel", 10);
  p.forEach((q, i) => near(q.z - zeros[i].z, 0.001, 1e-12));
  const five = curve.bump(zeros, 1, 10);
  near(five[5].z - zeros[5].z, 0.001, 1e-12);
  near(five[11].z - zeros[11].z, 0, 1e-12);
});
