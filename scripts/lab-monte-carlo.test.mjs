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

const lab = await import(await load(new URL("../src/features/monte-carlo/monteCarloLab.math.ts", import.meta.url)));
const old = await import(await load(new URL("../src/features/monte-carlo/monteCarlo.math.ts", import.meta.url)));

const ATM = { s0: 100, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 20000, seed: 7 };

test("plain estimator reproduces monteCarloCall exactly (same seed, same draws)", () => {
  const r = lab.monteCarloLab(ATM);
  const o = old.monteCarloCall(100, 100, 1, 0.03, 0.2, 20000, 7, 150);
  assert.equal(r.summary.plain.estimate, o.estimate);
  assert.ok(Math.abs(r.summary.plain.standardError - o.standardError) < 1e-12);
  assert.equal(r.analytic, o.analytic);
  assert.equal(r.race.length, o.data.length);
});

test("antithetic and control variate reduce the standard error for an ATM call", () => {
  const { summary } = lab.monteCarloLab(ATM);
  assert.ok(summary.antithetic.standardError < summary.plain.standardError);
  assert.ok(summary.control.standardError < 0.5 * summary.plain.standardError);
});

test("all three estimators are within 3 SE of Black–Scholes across seeds", () => {
  for (const seed of [1, 7, 42, 99]) {
    const r = lab.monteCarloLab({ ...ATM, seed });
    for (const k of lab.MC_ESTIMATORS) {
      const s = r.summary[k];
      assert.ok(Math.abs(s.estimate - r.analytic) < 3 * s.standardError, `${k} seed ${seed}`);
    }
  }
});

test("bridge paths end at their draws and brushShare adds up", () => {
  const r = lab.monteCarloLab({ ...ATM, sims: 2000 });
  for (let j = 0; j < r.pathCount; j += 37) {
    const end = r.paths[r.pathSteps * r.pathCount + j];
    assert.ok(Math.abs(end / r.terminal[j] - 1) < 1e-12);
    assert.equal(r.paths[j], 100);
  }
  const all = lab.brushShare(r.terminal, r.payoff, 0, Infinity);
  assert.equal(all.draws, 1);
  assert.ok(Math.abs(all.payoff - 1) < 1e-12);
  const otm = lab.brushShare(r.terminal, r.payoff, 0, 100);
  assert.equal(otm.payoff, 0);
});

const ex = await import(await load(new URL("../src/features/monte-carlo/monteCarloExotic.math.ts", import.meta.url)));
const EX = { s0: 100, strike: 100, maturity: 1, rate: 0.03, vol: 0.2, sims: 20000, seed: 7 };
const exRun = ex.exoticRun(EX);

test("path-dependent: Asian < European and up-and-out ≤ European for every barrier", () => {
  const eu = ex.estimate(exRun.european).mean;
  assert.ok(ex.estimate(exRun.asian).mean < eu);
  for (const b of ex.barrierGrid(100, 100)) assert.ok(ex.upAndOut(exRun, b).mean <= eu + 1e-12, `B=${b}`);
  // A barrier far away knocks nothing out.
  assert.equal(ex.upAndOut(exRun, 1e9).knockedOut, 0);
  assert.ok(Math.abs(ex.upAndOut(exRun, 1e9).mean - eu) < 1e-12);
});

test("path-dependent: the barrier curve rises with B and matches upAndOut at each level", () => {
  const grid = ex.barrierGrid(100, 100);
  const curve = ex.barrierCurve(exRun, grid);
  for (let i = 1; i < curve.length; i++) assert.ok(curve[i].price >= curve[i - 1].price - 1e-12);
  for (const pt of [curve[0], curve[17], curve[39]]) assert.ok(Math.abs(pt.price - ex.upAndOut(exRun, pt.barrier).mean) < 1e-12);
});

test("path-dependent: discrete up-and-out sits above the continuous closed form, near the BGK-shifted one", () => {
  const B = 130;
  const mc = ex.upAndOut(exRun, B);
  const cont = ex.upAndOutClosedForm(100, 100, B, 1, 0.03, 0.2);
  // Broadie–Glasserman–Kou: discrete monitoring ≈ continuous with the barrier shifted up by e^{0.5826 σ √Δt}.
  const bgk = ex.upAndOutClosedForm(100, 100, B * Math.exp(0.5826 * 0.2 * Math.sqrt(1 / ex.EXOTIC_STEPS)), 1, 0.03, 0.2);
  assert.ok(mc.mean > cont, `mc ${mc.mean} vs continuous ${cont}`);
  assert.ok(Math.abs(mc.mean - bgk) < 3 * mc.se, `mc ${mc.mean} ± ${mc.se} vs BGK ${bgk}`);
  // European on the same paths agrees with Black–Scholes.
  const eu = ex.estimate(exRun.european);
  assert.ok(Math.abs(eu.mean - 9.4134) < 3 * eu.se);
});

test("path-dependent: lookback pays S_T − min ≥ 0 and is worth more than the ATM European", () => {
  assert.ok(exRun.lookback.every((v) => v >= 0));
  assert.ok(ex.estimate(exRun.lookback).mean > ex.estimate(exRun.european).mean);
});
