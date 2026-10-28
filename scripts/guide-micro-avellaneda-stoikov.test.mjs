import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { asQuotes, asReservation, asTotalSpread } = await importSrc("lib/market/quotes.ts");
const { indifferencePrices, spreadVsTime, AS_GAMMAS, AS_BASE } = await importSrc("features/guide/guide.micro.avellanedaStoikov.math.ts");

const near = (a, b, tol = 1e-4) => assert.ok(Math.abs(a - b) < tol, `${a} vs ${b}`);

test("worked example", () => {
  const q = asQuotes({ s: 100, q: 6, gamma: 0.1, sigma: 2, k: 1.5, tLeft: 0.5 });
  near(q.reservation, 98.8);
  near(asTotalSpread(0.1, 2, 1.5, 0.5), 1.4908);
  near(q.bid, 98.0546);
  near(q.ask, 99.5454);
  near(asTotalSpread(0.5, 2, 1.5, 0), 1.1507);
  near(asTotalSpread(0.1, 2, 1.5, 0), 1.2908);
});

test("average of the indifference prices is the reservation price", () => {
  for (const q of [-10, -3, 0, 4, 10]) {
    const { bid, ask } = indifferencePrices(100, q, 0.2, 2, 0.7);
    near((bid + ask) / 2, asReservation(100, q, 0.2, 2, 0.7), 1e-9);
  }
});

test("spread falls with gamma at tau = 0 and rises at tau = 1", () => {
  const rows = spreadVsTime(AS_GAMMAS, AS_BASE.sigma, AS_BASE.k, AS_BASE.T, 10);
  const first = rows[0];
  const last = rows[rows.length - 1];
  assert.equal(first.tau, 1);
  assert.equal(last.tau, 0);
  assert.ok(first.g0 < first.g1 && first.g1 < first.g2);
  assert.ok(last.g0 > last.g1 && last.g1 > last.g2);
});
