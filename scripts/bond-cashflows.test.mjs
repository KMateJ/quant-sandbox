import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

const cache = new Map();

/// Transpiles a TS module and its relative imports into data: URLs (type-only imports vanish).
async function load(url) {
  if (cache.has(url.href)) return cache.get(url.href);
  const source = await readFile(url, "utf8");
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  for (const [, spec] of outputText.matchAll(/from "(\.{1,2}\/[^"]+)"/g)) {
    const dep = await load(new URL(`${spec}.ts`, url));
    outputText = outputText.replaceAll(`"${spec}"`, `"${dep}"`);
  }
  const dataUrl = `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
  cache.set(url.href, dataUrl);
  return dataUrl;
}

const dir = new URL("../src/features/bond-pricing/", import.meta.url);
const math = await import(await load(new URL("bondPricing.math.ts", dir)));
const url = await import(await load(new URL("bondPricing.url.ts", dir)));
const urlState = await import(await load(new URL("../../lib/urlState.ts", dir)));

const close = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} != ${b}`);
const bond = { face: 100, couponRate: 0.05, ytm: 0.06, years: 10, freq: 2 };

test("the standard bond as a stream reproduces the bond formulas", () => {
  const flows = math.bondFlows(bond);
  assert.equal(flows.length, 20);
  assert.equal(flows[19], 102.5);
  const a = math.analyzeStream(flows, math.regularCoupon(bond), bond.ytm, bond.freq);
  const b = math.analyzeBond(bond);
  close(a.price, b.price);
  close(a.macaulay, b.macaulay);
  close(a.modified, b.modified);
  close(a.convexity, b.convexity);
  assert.deepEqual(a.rows, b.rows);
  close(math.streamPrice(flows, bond.ytm, bond.freq), b.price);
});

test("raising one flow adds exactly its discounted amount and the PV shrinks with time", () => {
  const flows = math.bondFlows(bond);
  const base = math.streamPrice(flows, bond.ytm, bond.freq);
  const bumped = math.streamPrice(math.withFlow(flows, 9, flows[9] + 10), bond.ytm, bond.freq);
  close(bumped - base, 10 / Math.pow(1.03, 10));
  const rows = math.streamSchedule(Array(8).fill(10), 2.5, 0.06, 2);
  for (let k = 1; k < rows.length; k++) assert.ok(rows[k].presentValue < rows[k - 1].presentValue);
});

test("a large mid-life flow splits into coupon and principal and pulls duration in", () => {
  const flows = math.withFlow(math.bondFlows(bond), 3, 50);
  const rows = math.streamSchedule(flows, 2.5, bond.ytm, bond.freq);
  assert.equal(rows[3].coupon, 2.5);
  assert.equal(rows[3].principal, 47.5);
  assert.equal(math.streamSchedule([1], 2.5, 0.06, 2)[0].coupon, 1);
  const custom = math.analyzeStream(flows, 2.5, bond.ytm, bond.freq);
  assert.ok(custom.macaulay < math.analyzeBond(bond).macaulay);
  // A single payment's Macaulay duration is its time.
  close(math.analyzeStream([0, 0, 0, 100], 0, 0.06, 2).macaulay, 2);
  assert.equal(math.analyzeStream([0, 0], 0, 0.06, 2).macaulay, 0);
});

test("streamYtm inverts streamPrice", () => {
  const flows = math.withFlow(math.bondFlows(bond), 5, 30);
  for (const y of [0.01, 0.06, 0.15]) close(math.streamYtm(flows, math.streamPrice(flows, y, 2), 2), y, 1e-8);
  assert.ok(Number.isNaN(math.streamYtm([0, 0], 10, 2)));
  const curve = math.streamPriceYieldCurve(flows, 2, 0.2, 10);
  assert.equal(curve.length, 11);
  for (let i = 1; i < curve.length; i++) assert.ok(curve[i].price < curve[i - 1].price);
});

test("the broken axis inverts its own pixel map", () => {
  for (const couponMax of [2.5, 0]) {
    const axis = math.brokenCashflowAxis({ couponMax, totalMax: 102.5, top: 26, innerH: 240 });
    for (const v of [0, 1, 2.5, 3, 60, 102.5]) {
      const py = axis.y(v);
      if (py < axis.gapTopY || py >= axis.gapBottomY || !axis.hasBreak) close(axis.invert(py), v, 1e-9);
    }
    assert.ok(axis.invert(axis.y(102.5) - 20) > 102.5, "dragging above the top grows the flow");
  }
});

test("custom flows round-trip through the URL and only count for a matching bond", () => {
  const params = new URLSearchParams("cf=2.5,40,102.5&years=1.5");
  const state = urlState.parseUrlState(url.BOND_SCHEMA, params);
  assert.deepEqual(state.cf, [2.5, 40, 102.5]);
  assert.equal(urlState.parseUrlState(url.BOND_SCHEMA, new URLSearchParams("cf=1,x")).cf, null);
  assert.equal(urlState.parseUrlState(url.BOND_SCHEMA, new URLSearchParams("cf=1,-2")).cf, null);
  const written = urlState.writeUrlState(url.BOND_SCHEMA, { ...state, cf: [1.234, 5] }, new URLSearchParams());
  assert.equal(written.get("cf"), "1.23,5");
  assert.equal(urlState.writeUrlState(url.BOND_SCHEMA, { ...state, cf: null }, new URLSearchParams()).has("cf"), false);
  assert.deepEqual(url.activeFlows({ ...bond, years: 1.5 }, [2.5, 40, 102.5]), [2.5, 40, 102.5]);
  assert.equal(url.customFlows(bond, [1, 2, 3]), null);
  assert.deepEqual(url.activeFlows(bond, [1, 2, 3]), math.bondFlows(bond));
});

test("editing a bond term drops custom flows, moving the yield keeps them", () => {
  assert.deepEqual(url.bondPatch({ ytm: 0.07 }), { ytm: 0.07 });
  assert.deepEqual(url.bondPatch({ years: 5 }), { years: 5, cf: null });
});
