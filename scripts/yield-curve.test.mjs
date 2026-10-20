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
const { buildTermStructure, dfFromZero, forwardRate, bootstrapStep, couponDiscounts, scenarioDelta, shockedNodes, lerpNodes, shockPath, pathAt, drawScenario, isFeasible, SHOCK_SEQUENCE } =
  await loadData("yieldCurve.math");
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

test("bootstrapStep reproduces the discount factor and zero rate the term structure solved", () => {
  const term = buildTermStructure(presetNodes("humped"));
  term.forEach((p, i) => {
    const step = bootstrapStep(term, i);
    approx(step.solvedDf, p.df);
    approx(step.couponSum, step.known.reduce((s, k) => s + k.df, 0));
    assert.equal(step.known.length, p.t <= 1 ? 0 : Math.ceil(p.t) - 1);
    approx(Math.pow(step.solvedDf, -1 / p.t) - 1, p.zero);
  });
});

test("coupon-date discount factors only use zero rates solved before the maturity", () => {
  const term = buildTermStructure(presetNodes("normal"));
  const early = term.slice(0, 5);
  const known = couponDiscounts(early.map((p) => p.t), early.map((p) => p.zero), 5);
  assert.deepEqual(known.map((k) => k.t), [1, 2, 3, 4]);
  approx(known[3].df, dfFromZero(early[4].zero, 4));
});

test("a steepener lowers the short end more than the long end, a flattener the opposite", () => {
  const nodes = presetNodes("normal");
  const steep = shockedNodes(nodes, { scenario: "steepen", sizeBp: 50 });
  const flat = shockedNodes(nodes, { scenario: "flatten", sizeBp: 50 });
  const spread = (n) => n[n.length - 1].rate - n[0].rate;
  assert.ok(spread(steep) > spread(nodes) && spread(flat) < spread(nodes));
  approx(shockedNodes(nodes, { scenario: "parallel", sizeBp: 100 })[4].rate, nodes[4].rate + 0.01);
  approx(scenarioDelta("parallel").level, 0.005);
});

test("shocks stay inside the 0-12% window", () => {
  const high = presetNodes("normal").map((n) => ({ ...n, rate: 0.115 }));
  assert.ok(shockedNodes(high, { scenario: "parallel", sizeBp: 100 }).every((n) => n.rate === 0.12));
  const low = presetNodes("normal").map((n) => ({ ...n, rate: 0.002 }));
  assert.ok(shockedNodes(low, { scenario: "parallel", sizeBp: -100 }).every((n) => n.rate === 0));
});

test("lerpNodes and pathAt hit the endpoints and the middle of each leg", () => {
  const a = presetNodes("flat");
  const b = presetNodes("inverted");
  approx(lerpNodes(a, b, 0)[3].rate, a[3].rate);
  approx(lerpNodes(a, b, 1)[3].rate, b[3].rate);
  approx(lerpNodes(a, b, 0.5)[3].rate, (a[3].rate + b[3].rate) / 2);
  const path = shockPath(a, SHOCK_SEQUENCE);
  assert.equal(path.length, SHOCK_SEQUENCE.length + 1);
  approx(pathAt(path, 0, 100)[0].rate, a[0].rate);
  approx(pathAt(path, 100, 100)[0].rate, path[1][0].rate);
  approx(pathAt(path, 150, 100)[0].rate, (path[1][0].rate + path[2][0].rate) / 2);
  approx(pathAt(path, 300, 100)[0].rate, path[3][0].rate);
  assert.ok(path.every(isFeasible));
});

test("drawScenario is deterministic and yields every scenario with sizes in multiples of 10 bp", () => {
  assert.deepEqual(drawScenario(7), drawScenario(7));
  const seen = new Set();
  for (let s = 0; s < 200; s++) {
    const { scenario, sizeBp } = drawScenario(s);
    seen.add(scenario);
    assert.equal(Math.abs(sizeBp) % 10, 0);
    assert.ok(Math.abs(sizeBp) >= 30 && Math.abs(sizeBp) <= 100);
    if (scenario === "steepen" || scenario === "flatten") assert.ok(sizeBp > 0);
  }
  assert.equal(seen.size, 4);
});

test("an infeasible curve is reported instead of thrown", () => {
  assert.equal(isFeasible(presetNodes("normal").map((n, i) => (i === 9 ? { ...n, rate: 0.12 } : n))), false);
  assert.equal(isFeasible(presetNodes("normal")), true);
});
