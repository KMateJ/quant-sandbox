import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function load(path) {
  const source = await readFile(new URL(`../src/features/treasury-futures/${path}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return outputText;
}

const mathCode = await load("treasuryFutures.math");
const mathUrl = `data:text/javascript;base64,${Buffer.from(mathCode).toString("base64")}`;
const scenarioCode = (await load("scenarios")).replace('"./treasuryFutures.math"', `"${mathUrl}"`);
const math = await import(mathUrl);
const scenarios = await import(`data:text/javascript;base64,${Buffer.from(scenarioCode).toString("base64")}`);

test("Treasury fractional quotation is exact and rejects invalid thirty-seconds", () => {
  assert.equal(math.parseTreasuryQuote("93'08"), 93.25);
  assert.equal(math.parseTreasuryQuote("150"), 150);
  assert.throws(() => math.parseTreasuryQuote("93'32"), RangeError);
});

test("worksheet CTD answers use given clean prices and conversion factors", () => {
  const five = scenarios.loadScenario("five-bonds");
  const fiveResults = math.deliveryEconomics(five.bonds, five.futures);
  assert.equal(math.cheapestBond(fiveResults).id, "D");
  assert.ok(Math.abs(fiveResults.find((bond) => bond.id === "D").netBasis - 0.54) < 1e-10);
  const fractional = scenarios.loadScenario("fractional-quote");
  assert.equal(fractional.futures, 93.25);
  const fractionalResults = math.deliveryEconomics(fractional.bonds, fractional.futures);
  assert.equal(math.cheapestBond(fractionalResults).id, "B");
  assert.ok(Math.abs(fractionalResults.find((bond) => bond.id === "B").netBasis - 1.8719) < 1e-10);
});

test("scenario 1 computes four-decimal, coupon-sensitive Eurex-style factors", () => {
  const { bonds } = scenarios.loadScenario("bund");
  assert.equal(bonds[0].conversionFactor, 0.6175);
  assert.equal(bonds[1].conversionFactor, 0.6174);
  assert.ok(Math.abs(bonds[0].accruedInterest - 0.0157534) < 1e-6);
  assert.ok(Math.abs(bonds[1].accruedInterest - 0.2835616) < 1e-6);
  assert.notEqual(
    math.eurexConversionFactor(0.005, "2036-08-15", "2027-03-10"),
    math.eurexConversionFactor(0.06, "2036-08-15", "2027-03-10"),
  );
});

test("delivery-date cash flows are excluded and bullet principal remains at maturity", () => {
  const bond = { couponRate: 0.08, maturity: 3, frequency: 2, principalPayments: [{ time: 3, amount: 100 }] };
  const flows = math.cashFlowsAfterDelivery(bond, 1, 0.09);
  assert.ok(flows.every((flow) => flow.time > 1));
  assert.equal(flows.at(-1).principal, 100);
  assert.equal(math.cashFlowsAfterDelivery(bond, 3, 0.09).length, 0);
});

test("amortizing scenario preserves worksheet schedules and coupon-date accrued interest", () => {
  const { bonds } = scenarios.loadScenario("amortizing");
  assert.deepEqual(bonds[0].principalPayments, [{ time: 4.25, amount: 50 }, { time: 5.25, amount: 50 }]);
  assert.equal(bonds[1].accruedInterest, 0);
  assert.deepEqual(bonds[2].principalPayments.map((p) => p.time), [1.75, 2.25, 2.75, 3.25]);
  assert.ok(bonds.every((bond) => bond.conversionFactor > 0 && bond.cleanPrice > 0));
  assert.ok(math.cashFlowsAfterDelivery(bonds[2], 2, 0.09).every((flow) => flow.time > 2));
  assert.equal(math.cheapestBond(math.deliveryEconomics(bonds, 100)).id, "A");
});

test("dirty and clean delivery comparisons agree when accrued interest matches", () => {
  const bond = { id: "A", couponRate: 0.05, maturity: 5, frequency: 2, principalPayments: [{ time: 5, amount: 100 },],
    cleanPrice: 102, conversionFactor: 0.9, accruedInterest: 1.25, priceSource: "given" };
  const result = math.deliveryEconomics([bond], 100)[0];
  assert.equal(result.netBasis, result.dirtyCostDifference);
  assert.equal(result.invoiceDirty, result.invoiceClean + 1.25);
});

test("switching points mark changes in the cheapest bond, not irrelevant pair intersections", () => {
  const crossing = [
    { id: "A", cleanPrice: 100, conversionFactor: 1 },
    { id: "B", cleanPrice: 110, conversionFactor: 1.1 },
    { id: "C", cleanPrice: 150, conversionFactor: 0.5 },
  ];
  const points = math.switchingPoints(crossing);
  assert.ok(points.some((point) => Math.abs(point.price - 100) < 1e-9 && point.from === "A" && point.to === "B"));
  assert.ok(points.every((point) => Number.isFinite(point.price)));
});

test("principal schedule validation rejects under-amortization", () => {
  assert.throws(() => math.buildCashFlows({
    couponRate: 0.05, maturity: 2, frequency: 1, principalPayments: [{ time: 2, amount: 50 }],
  }), RangeError);
});

test("off-coupon principal repayments split accrued coupons without losing cash flows", () => {
  const bond = { couponRate: 0.1, maturity: 3, frequency: 1,
    principalPayments: [{ time: 1.5, amount: 50 }, { time: 3, amount: 50 }] };
  const flows = math.buildCashFlows(bond);
  assert.equal(flows.find((flow) => flow.time === 1.5).principal, 50);
  assert.equal(flows.find((flow) => flow.time === 2).coupon, 7.5);
  assert.equal(flows.find((flow) => flow.time === 3).principal, 50);
});

test("generalized conversion factors reject delivery on or after maturity", () => {
  const bond = { couponRate: 0.05, maturity: 2, frequency: 1, principalPayments: [{ time: 2, amount: 100 }] };
  assert.throws(() => math.generalizedConversionFactor(bond, 2), RangeError);
});
