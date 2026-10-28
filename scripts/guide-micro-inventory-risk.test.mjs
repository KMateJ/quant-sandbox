import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const { inventoryPnlSd, flattenCost, simulateSkew, skewedDistances, DEFAULT_SKEW } = await importSrc("features/guide/guide.micro.inventoryRisk.math.ts");

test("inventory P&L standard deviation is |q|·σ·√τ", () => {
  assert.ok(Math.abs(inventoryPnlSd(500, 0.02, 60) - 77.4597) < 1e-3);
  assert.ok(Math.abs(inventoryPnlSd(-1000, 0.01, 100) - 100) < 1e-9);
  assert.equal(inventoryPnlSd(0, 0.02, 60), 0);
});

test("flattening costs half-spread plus fee per share", () => {
  assert.ok(Math.abs(flattenCost(500, 0.01, 0.003) - 6.5) < 1e-9);
});

test("skew moves the bid away and the ask closer when long", () => {
  assert.deepEqual(skewedDistances(0.02, 0.005, 2).map((x) => +x.toFixed(6)), [0.03, 0.01]);
  assert.deepEqual(skewedDistances(0.02, 0.005, 0), [0.02, 0.02]);
});

test("a positive skew lowers terminal inventory spread on the same seeds", () => {
  const flat = simulateSkew({ ...DEFAULT_SKEW, theta: 0 });
  const skewed = simulateSkew({ ...DEFAULT_SKEW, theta: 0.004 });
  assert.ok(skewed.inventorySd < flat.inventorySd * 0.8);
  assert.ok(skewed.pnlSd < flat.pnlSd);
});

test("deterministic, and the default stays within the step budget", () => {
  const a = simulateSkew({ ...DEFAULT_SKEW, theta: 0.002 });
  const b = simulateSkew({ ...DEFAULT_SKEW, theta: 0.002 });
  assert.deepEqual(a.terminal, b.terminal);
  assert.ok(DEFAULT_SKEW.sessions * (DEFAULT_SKEW.T / DEFAULT_SKEW.dt) <= 20000);
});
