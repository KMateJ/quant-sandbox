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

const m = await import(await load(new URL("../src/features/monte-carlo/monteCarloPages.math.ts", import.meta.url)));
const lab = await import(await load(new URL("../src/features/monte-carlo/monteCarloLab.math.ts", import.meta.url)));

const ATM = { s0: 100, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 20000, seed: 7 };

test("plain estimator matches the lab plain run exactly", () => {
  const vr = m.varianceReductionRun(ATM);
  const l = lab.monteCarloLab(ATM);
  assert.equal(vr.summary.plain.estimate, l.summary.plain.estimate);
  assert.equal(vr.analytic, l.analytic);
});

test("antithetic, control and combined all have a smaller standard error than plain", () => {
  const { summary } = m.varianceReductionRun(ATM);
  for (const k of ["antithetic", "control", "both"]) {
    assert.ok(summary[k].standardError < summary.plain.standardError, k);
  }
  assert.ok(summary.both.standardError < summary.antithetic.standardError);
});

test("every estimate lies within 3 SE of the Black-Scholes price, for several seeds", () => {
  for (const seed of [1, 2, 3, 4, 5, 6]) {
    const { analytic, summary } = m.varianceReductionRun({ ...ATM, seed });
    for (const k of ["plain", "antithetic", "control", "both"]) {
      assert.ok(Math.abs(summary[k].estimate - analytic) < 3 * summary[k].standardError, `${k} seed ${seed}`);
    }
  }
});

test("equivalentPlainDraws is the variance ratio times the draws", () => {
  assert.equal(m.equivalentPlainDraws(1000, 0.2, 0.1), 4000);
  assert.equal(m.equivalentPlainDraws(1000, 0.2, 0), Infinity);
});

test("Feynman-Kac: the MC average at x is within 3 SE of the PDE solution", () => {
  for (const [x, t] of [[100, 0], [80, 0.5], [120, 0.25]]) {
    const r = m.feynmanKacRun({ x, t, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 20000, seed: 3 });
    assert.ok(Math.abs(r.estimate - r.closed) < 3 * r.standardError, `x=${x} t=${t}`);
    assert.equal(r.payoffs.length, 20000);
  }
});

test("Feynman-Kac: at t = T the price is the payoff, and the curve is monotone in x", () => {
  const r = m.feynmanKacRun({ x: 130, t: 1, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 500, seed: 3 });
  assert.equal(r.closed, 30);
  assert.ok(Math.abs(r.estimate - 30) < 1e-9);
  const c = m.feynmanKacRun({ x: 100, t: 0, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 2000, seed: 3 }).curve;
  for (let i = 1; i < c.length; i++) assert.ok(c[i].closed >= c[i - 1].closed && c[i].mc >= c[i - 1].mc);
});
