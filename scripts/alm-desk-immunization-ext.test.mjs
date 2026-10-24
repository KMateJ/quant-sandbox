import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const g = await importSrc("features/immunization/immunization.math.ts");
const C = g.DEFAULT_CONFIG;
const X = { ...C, extraLiabilities: [{ amount: 500_000, year: 5, from: 3 }] };

test("an extra liability counts only from its announcement until it is paid", () => {
  const s = g.newGame(4, C);
  assert.equal(g.liabilityPv(s, X), g.liabilityPv(s, C));
  const at3 = { ...s, round: 3 };
  const extra = 500_000 / (1 + g.yieldAt(at3.curve, 2)) ** 2;
  assert.ok(Math.abs(g.liabilityPv(at3, X) - g.liabilityPv(at3, C) - extra) < 1e-6);
  assert.ok(g.liabilityDuration(at3, X) < g.liabilityDuration(at3, C));
  assert.ok(g.liabilityConvexity(at3, X) < g.liabilityConvexity(at3, C));
  assert.equal(g.liabilityPv({ ...s, round: 5 }, X), g.liabilityPv({ ...s, round: 5 }, C));
});

test("the payment leaves cash when it falls due and attribution still sums", () => {
  let a = g.newGame(4, X);
  let b = g.newGame(4, C);
  for (let r = 1; r <= 5; r++) {
    a = g.advance(a, g.drawShock(4, r, X), X);
    b = g.advance(b, g.drawShock(4, r, C), C);
  }
  assert.ok(Math.abs(b.cash - a.cash - 500_000) < 1e-6);
  for (const h of a.history.slice(3)) {
    const { carry, rate, convexity, cost } = h.attribution;
    assert.ok(Number.isFinite(carry + rate + convexity + cost));
  }
  assert.ok(g.immunisedWeights({ ...a, round: 3 }, X).every((w) => w >= 0));
});
