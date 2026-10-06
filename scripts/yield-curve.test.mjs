import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function loadData(path) {
  const source = await readFile(new URL(`../src/features/yield-curve/${path}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}

const { presetNodes, MATURITY_LABELS } = await loadData("presets");
const { buildTermStructure, dfFromZero, forwardRate } = await loadData("yieldCurve.math");
const { effectDelta, formatDelta, strongestEffects, describeEffects, rateDomain } = await loadData("effects.math");
const approx = (a, b) => assert.ok(Math.abs(a - b) < 1e-10, `${a} != ${b}`);

test("all presets retain the ten requested maturities and finite derived quantities", () => {
  assert.deepEqual(MATURITY_LABELS, ["3M", "6M", "1Y", "2Y", "3Y", "5Y", "7Y", "10Y", "20Y", "30Y"]);
  for (const preset of ["normal", "flat", "inverted", "humped"]) {
    const term = buildTermStructure(presetNodes(preset));
    term.forEach((point, i) => {
      assert.ok(point.df > 0);
      for (const key of ["par", "zero", "fwd", "df"]) assert.ok(Number.isFinite(point[key]));
      approx(dfFromZero(point.zero, point.t), point.df);
      approx(forwardRate(term[i - 1]?.df ?? 1, point.df, point.t - point.fwdFrom), point.fwd);
    });
  }
});

test("raising 5Y by 25 bp leaves earlier nodes unchanged and amplifies the incoming forward", () => {
  const nodes = presetNodes("normal");
  const before = buildTermStructure(nodes);
  const after = buildTermStructure(nodes.map((n, i) => i === 5 ? { ...n, rate: n.rate + 0.0025 } : n));
  assert.deepEqual(after.slice(0, 5), before.slice(0, 5));
  approx(effectDelta(before[5], after[5], "par"), 0.0025);
  assert.ok(after[5].zero > before[5].zero);
  assert.ok(after[5].df < before[5].df);
  assert.ok(after[5].fwd - before[5].fwd > after[5].zero - before[5].zero);
  assert.ok(after[6].fwd < before[6].fwd);
  approx(effectDelta(before[5], after[5], "df"), (after[5].df - before[5].df) / before[5].df);
  assert.ok(strongestEffects(before, after, "fwd").includes(5));
  assert.deepEqual(describeEffects(before[5], after[5]).map((x) => x.key),
    ["ycObserveRaise", "ycObserveAmplified", "ycObserveDfDown"]);
  assert.equal(describeEffects(before[6], after[6])[0].key, "ycObserveLinked");
});

test("lowering a quote reverses takeaways; unchanged and non-amplified cases stay honest", () => {
  const nodes = presetNodes("normal");
  const before = buildTermStructure(nodes);
  const after = buildTermStructure(nodes.map((n, i) => i === 5 ? { ...n, rate: n.rate - 0.0025 } : n));
  const observations = describeEffects(before[5], after[5]);
  assert.equal(observations[0].key, "ycObserveLower");
  assert.equal(observations[2].key, "ycObserveDfUp");
  assert.deepEqual(describeEffects(before[5], before[5]), []);
  const short = buildTermStructure(nodes.map((n, i) => i === 0 ? { ...n, rate: n.rate + 0.0025 } : n));
  assert.equal(describeEffects(before[0], short[0])[1].key, "ycObserveForward");
  assert.deepEqual(strongestEffects(before, before, "zero"), []);
});

test("delta formatting uses bp for rates, relative percent for discount factors and no negative zero", () => {
  assert.equal(formatDelta(0.0138), "+138 bp");
  assert.equal(formatDelta(-0.0025), "\u221225 bp");
  assert.equal(formatDelta(-0.019, true), "\u22121.9%");
  assert.equal(formatDelta(0.00002), "+0.2 bp");
  assert.equal(formatDelta(-1e-12), "0.0 bp");
});

test("infeasible quotes fail explicitly instead of fabricating a clipped discount factor", () => {
  const nodes = presetNodes("normal").map((n, i) => i === 9 ? { ...n, rate: 0.12 } : n);
  assert.throws(() => buildTermStructure(nodes), RangeError);
});

test("chart bounds fit positive, flat and negative forward curves without clipping", () => {
  for (const preset of ["normal", "flat", "inverted", "humped"]) {
    const term = buildTermStructure(presetNodes(preset));
    const [low, high] = rateDomain(term);
    term.forEach((p) => [p.par, p.zero, p.fwd].forEach((r) => assert.ok(r > low && r < high)));
    assert.ok(high - low < 0.09, "Normal market curves should not waste the chart's vertical range");
  }
  const term = buildTermStructure(presetNodes("normal"));
  term[5].fwd = -0.01;
  assert.ok(rateDomain(term)[0] < -0.01, "Negative forwards must remain visible");
});
