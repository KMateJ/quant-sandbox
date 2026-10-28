import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function load(path) {
  const source = await readFile(new URL(`../src/${path}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return outputText;
}

const dataUrl = (code) => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
const bondUrl = dataUrl(await load("lib/finance/bond"));
const mathCode = (await load("features/duration-convexity/durationConvexity.math")).replace('"../../lib/finance/bond"', `"${bondUrl}"`);
const math = await import(dataUrl(mathCode));

const bond = { face: 100, couponRate: 0.04, ytm: 0.06, years: 20, freq: 2 };

test("zeroWithDuration: the twin's modified duration equals the target", () => {
  for (const [d, y, f] of [[8, 0.06, 2], [3.3, 0.02, 1], [12.5, 0.09, 4]]) {
    const years = math.zeroWithDuration(d, y, f);
    // On-grid zero bond priced by the library must agree with the closed form when the period count is whole.
    assert.ok(Math.abs(years / (1 + y / f) - d) < 1e-9);
  }
  const years = math.zeroWithDuration(8, 0.06, 2);
  const eps = 1e-5;
  const p = (dy) => 1 / Math.pow(1 + (0.06 + dy) / 2, years * 2);
  const modDur = -(p(eps) - p(-eps)) / (2 * eps) / p(0);
  assert.ok(Math.abs(modDur - 8) < 1e-6);
});

test("zero twin: convexity formula matches the finite-difference second derivative", () => {
  const years = 7.3;
  const eps = 1e-4;
  const p = (dy) => Math.pow(1 + (0.05 + dy) / 2, -years * 2);
  const numeric = (p(eps) - 2 * p(0) + p(-eps)) / (eps * eps) / p(0);
  assert.ok(Math.abs(numeric - math.zeroConvexity(years, 0.05, 2)) < 1e-3);
});

test("zeroPriceChangePct is exact at zero shock and falls when yields rise", () => {
  assert.equal(math.zeroPriceChangePct(8, 0.06, 2, 0), 0);
  assert.ok(math.zeroPriceChangePct(8, 0.06, 2, 100) < 0);
  assert.ok(math.zeroPriceChangePct(8, 0.06, 2, -100) > 0);
});

test("equal duration: the higher-convexity bond gains more and loses less", () => {
  const m = math.bondMeasures(bond);
  const years = math.zeroWithDuration(m.modified, bond.ytm, bond.freq);
  const cZero = math.zeroConvexity(years, bond.ytm, bond.freq);
  const hi = cZero > m.convexity ? "zero" : "bond";
  const change = (bp) => ({ bond: math.shockOutcomes(bond, bp).exact, zero: math.zeroPriceChangePct(years, bond.ytm, bond.freq, bp) });
  for (const bp of [-200, -100, 100, 200]) {
    const c = change(bp);
    const other = hi === "zero" ? "bond" : "zero";
    assert.ok(c[hi] > c[other], `${bp} bp`);
  }
});

test("shockOutcomes matches shockResult", () => {
  const m = math.bondMeasures(bond);
  const r = math.shockResult(bond, m, 150);
  const o = math.shockOutcomes(bond, 150);
  assert.equal(o.exact, r.exactPct);
  assert.equal(o.duration, r.durationPct);
  assert.equal(o.durConvex, r.durConvexPct);
  assert.ok(o.exact > o.duration);
});

test("drawShock: multiples of 25 in [50, 250], both signs, deterministic", () => {
  const seen = new Set();
  for (let seed = 1; seed <= 200; seed++) {
    const s = math.drawShock(seed);
    assert.ok(s % 25 === 0);
    assert.ok(Math.abs(s) >= 50 && Math.abs(s) <= 250);
    assert.equal(s, math.drawShock(seed));
    seen.add(Math.sign(s));
  }
  assert.equal(seen.size, 2);
});
