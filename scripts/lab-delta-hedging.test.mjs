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

const m = await import(await load(new URL("../src/features/delta-hedging/deltaHedging.math.ts", import.meta.url)));
const base = { s0: 100, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, freq: 52 };

test("grid is daily and rebalances follow the frequency", () => {
  assert.deepEqual(m.hedgeGrid(1, 252), { grid: 252, every: 1 });
  assert.deepEqual(m.hedgeGrid(1, 52), { grid: 252, every: 5 });
  assert.deepEqual(m.hedgeGrid(0.25, 4), { grid: 63, every: 63 });
  const r = m.simulateDeltaHedgeSeeded(base, 7);
  assert.equal(r.rows.length, 253);
  assert.equal(r.rebalances, 50); // every 5 steps, excluding expiry
});

test("accounting: error is replicating − option, zero at t=0, terminal matches payoff gap", () => {
  const r = m.simulateDeltaHedgeSeeded(base, 7);
  assert.equal(r.rows[0].error, 0);
  for (const row of r.rows) assert.ok(Math.abs(row.error - (row.replicating - row.option)) < 1e-12);
  const last = r.rows.at(-1);
  assert.ok(Math.abs(last.option - r.payoff) < 1e-12);
  assert.ok(Math.abs(r.hedgeError - (r.terminalValue - r.payoff)) < 1e-12);
  assert.ok(r.maxAbsError >= Math.abs(r.hedgeError));
});

test("held delta only changes at rebalances; step rows duplicate the time stamp there", () => {
  const r = m.simulateDeltaHedgeSeeded(base, 3);
  for (let i = 1; i < r.rows.length; i++) {
    if (!r.rows[i].rebalanced) assert.equal(r.rows[i].deltaHeld, r.rows[i - 1].deltaHeld);
    else assert.equal(r.rows[i].deltaHeld, r.rows[i].deltaTrue);
  }
  const steps = m.heldDeltaStepRows(r.rows);
  assert.equal(steps.length, r.rows.length + r.rebalances);
});

test("same seed reproduces; more frequent rebalancing shrinks the error spread", () => {
  const a = m.simulateDeltaHedgeSeeded(base, 11);
  const b = m.simulateDeltaHedgeSeeded(base, 11);
  assert.deepEqual(a.rows.at(-1), b.rows.at(-1));
  const study = m.hedgeFrequencyStudy(base, [4, 12, 52, 252], 120, 5);
  assert.equal(study.length, 4);
  assert.ok(study[0].sd > study[1].sd && study[1].sd > study[2].sd && study[2].sd > study[3].sd, `sd not decreasing: ${study.map((s) => s.sd.toFixed(3))}`);
  // Common random numbers: the daily hedge is a fine version of the quarterly one on identical paths.
  const ratio = study[3].sd / study[0].sd;
  assert.ok(ratio < 0.35, `daily/quarterly ratio ${ratio}`);
  assert.ok(study.every((s) => s.errors.length === 120));
});

test("error domain is symmetric and never degenerate", () => {
  assert.deepEqual(m.errorDomain([]), [-0.01, 0.01]);
  const [lo, hi] = m.errorDomain([-2, 0.5]);
  assert.equal(lo, -hi);
  assert.ok(hi > 2);
});
