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

const m = await import(await load(new URL("../src/features/tvm/tvm.math.ts", import.meta.url)));
const close = (a, b, tol = 1e-6) => assert.ok(Math.abs(a - b) < tol, `${a} ≉ ${b}`);

// Defaults of the lab: principal 1000, contribution 200, 6%, 20 years.
const P = 1000, C = 200, r = 0.06, n = 20;
const target = m.balanceAt(P, C, r, n);

test("each solver inverts the future value at the lab defaults", () => {
  close(target, 1000 * 1.06 ** 20 + (200 * (1.06 ** 20 - 1)) / 0.06);
  const pay = m.solvePayment(target, P, r, n);
  assert.ok(pay.ok); close(pay.value, C);
  const rate = m.solveRate(target, P, C, n);
  assert.ok(rate.ok); close(rate.value, r, 1e-9);
  const years = m.solveYears(target, P, C, r);
  assert.ok(years.ok); close(years.value, n, 1e-9);
});

test("unreachable targets are reported, not solved", () => {
  assert.deepEqual(m.solvePayment(500, 1000, 0.06, 10), { ok: false, reason: "tooLow" });
  assert.deepEqual(m.solveRate(1000, 1000, 200, 10), { ok: false, reason: "tooLow" });
  assert.deepEqual(m.solveRate(1e9, 1000, 0, 5), { ok: false, reason: "tooHigh" });
  assert.deepEqual(m.solveYears(5000, 1000, 0, 0), { ok: false, reason: "never" });
  close(m.solveYears(3000, 1000, 500, 0).value, 4);
  assert.deepEqual(m.solveYears(800, 1000, 0, 0.05), { ok: true, value: 0 });
});

test("doubling time: exact vs rule of 72", () => {
  close(m.doublingTime(0.06), 11.895661, 1e-6);
  close(m.ruleOf72(0.06), 12);
  close(1000 * 1.06 ** m.doublingTime(0.06), 2000, 1e-6);
  assert.equal(m.doublingTime(0), Infinity);
});

test("balance split adds up", () => {
  const s = m.balanceSplit(P, C, r, 10);
  close(s.paidIn, 3000);
  close(s.paidIn + s.interest, s.balance);
});

test("deposit race: early start beats paying the same later; lump sum compounds", () => {
  const A = { kind: "annual", amount: 1000, start: 0 };
  const B = { kind: "annual", amount: 2000, start: 20 };
  const L = { kind: "lump", amount: 10000, start: 0 };
  close(m.planBalance(A, 0.06, 40), 1000 * (Math.pow(1.06, 40) - 1) / 0.06, 1e-6);
  close(m.planBalance(B, 0.06, 40), 2000 * (Math.pow(1.06, 20) - 1) / 0.06, 1e-6);
  close(m.planBalance(L, 0.06, 40), 10000 * Math.pow(1.06, 40), 1e-6);
  assert.equal(m.planPaidIn(A, 40), 40000);
  assert.equal(m.planPaidIn(B, 40), 40000);
  assert.equal(m.planBalance(B, 0.06, 20), 0);
  assert.equal(m.planPaidIn(B, 25.5), 10000);
  // Between year-ends the balance grows smoothly and never jumps backwards.
  assert.ok(m.planBalance(A, 0.06, 10.5) > m.planBalance(A, 0.06, 10));
  assert.ok(m.planBalance(A, 0.06, 11) > m.planBalance(A, 0.06, 10.75));
  assert.equal(m.raceLeader([A, B, L], 0.06, 0), 2);
  assert.equal(m.raceLeader([A, B, L], 0.06, 40), 0);
  assert.equal(m.raceLeader([B], 0.06, 5), -1);
});

// #region Sequence-of-returns risk
const R = m.SEQUENCE_RETURNS;
const ordered = (preset) => m.presetOrder(R, preset).map((i) => R[i]);
const endOf = (p) => p.wealth[p.wealth.length - 1];

test("sequence: without withdrawals every order ends at the same wealth", () => {
  const base = endOf(m.sequenceWealth(R, m.SEQUENCE_START, 0));
  for (const preset of ["original", "crashFirst", "crashLast"]) close(endOf(m.sequenceWealth(ordered(preset), m.SEQUENCE_START, 0)), base, 1e-6);
  const shuffled = m.moveInOrder(m.moveInOrder(R.map((_, i) => i), 0, 9), 4, 1).map((i) => R[i]);
  close(endOf(m.sequenceWealth(shuffled, m.SEQUENCE_START, 0)), base, 1e-6);
  close(base, 199252, 1);
});

test("sequence: with withdrawals the crash early costs more than the crash late", () => {
  const w = 0.06 * m.SEQUENCE_START;
  const first = endOf(m.sequenceWealth(ordered("crashFirst"), m.SEQUENCE_START, w));
  const last = endOf(m.sequenceWealth(ordered("crashLast"), m.SEQUENCE_START, w));
  assert.ok(first < last, `${first} < ${last}`);
  close(first, 45554, 1);
  close(last, 97618, 1);
});

test("sequence: money runs out and stays at zero", () => {
  const p = m.sequenceWealth(ordered("crashFirst"), m.SEQUENCE_START, 0.08 * m.SEQUENCE_START);
  assert.equal(p.ranOutYear, 15);
  assert.equal(endOf(p), 0);
  assert.ok(p.wealth.every((v) => v >= 0));
});

test("sequence: order helpers", () => {
  assert.deepEqual(m.moveInOrder([0, 1, 2, 3], 0, 2), [1, 2, 0, 3]);
  assert.deepEqual(m.moveInOrder([0, 1, 2, 3], 3, 0), [3, 0, 1, 2]);
  assert.deepEqual(m.parseOrder("2,0,1", 3), [2, 0, 1]);
  assert.equal(m.parseOrder("2,0,0", 3), null);
  assert.equal(m.parseOrder("x", 3), null);
  assert.equal(m.presetOrder(R, "crashFirst")[0], R.indexOf(Math.min(...R)));
});
// #endregion
