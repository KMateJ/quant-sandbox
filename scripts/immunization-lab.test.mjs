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

const lib = await import(await load(new URL("../src/lib/finance/immunization.ts", import.meta.url)));
const g = await import(await load(new URL("../src/features/immunization/immunization.math.ts", import.meta.url)));
const close = (a, b, eps, msg = "") => assert.ok(Math.abs(a - b) < eps, `${msg} ${a} vs ${b}`);
const C = g.DEFAULT_CONFIG;

test("immunizingFaces: PV and duration of the bonds equal the liability's", () => {
  const short = { coupon: 0.05, maturity: 2, face: 0 };
  const long = { coupon: 0.05, maturity: 12, face: 0 };
  const [fs, fl] = lib.immunizingFaces(short, long, 1_000_000, 7, 0.05);
  const risk = lib.portfolioRisk([{ ...short, face: fs }, { ...long, face: fl }], 0.05);
  close(risk.pv, 1_000_000 / 1.05 ** 7, 1e-6);
  close(risk.dMod, 7 / 1.05, 1e-9);
});

test("matchWeights brackets the target and clamps outside the range", () => {
  assert.deepEqual(lib.matchWeights([2, 5, 0], 3.5).map((w) => Number(w.toFixed(6))), [0.5, 0.5, 0]);
  assert.deepEqual(lib.matchWeights([2, 5, 0], 9), [0, 1, 0]);
  assert.deepEqual(lib.matchWeights([2, 5, 0], 0), [0, 0, 1]);
});

test("a new game starts immunised: zero surplus, matched duration", () => {
  const s = g.newGame(1);
  close(g.surplusOf(s, C), 0, 1e-6);
  close(g.exposure(s).dMod, g.liabilityDuration(s, C), 1e-9);
  close(g.weightsOf(s).reduce((a, b) => a + b, 0), 1, 1e-12);
});

test("a matched portfolio barely moves for a +-50 bp parallel shock; an unmatched one does", () => {
  const s = g.newGame(1);
  const hit = (state, bp) => {
    const curve = { ...state.curve, level: state.curve.level + bp / 10000 };
    return g.surplusOf({ ...state, curve }, C);
  };
  for (const bp of [-50, 50]) assert.ok(Math.abs(hit(s, bp)) < 0.001 * C.liability, `matched ${bp}: ${hit(s, bp)}`);
  const longOnly = g.rebalance(s, [0, 0, 1, 0], { ...C, costBp: 0 });
  assert.ok(Math.abs(hit(longOnly, 50)) > 0.003 * C.liability);
});

test("the same seed gives the same game; shocks are multiples of 10 bp inside the limits", () => {
  assert.deepEqual(g.drawShock(5, 3), g.drawShock(5, 3));
  assert.notDeepEqual(g.drawShock(5, 3), g.drawShock(6, 3));
  for (let r = 1; r <= 8; r++) {
    const { parallelBp, twistBp } = g.drawShock(9, r);
    assert.ok(parallelBp % 10 === 0 && Math.abs(parallelBp) <= C.maxParallelBp);
    assert.ok(twistBp % 10 === 0 && Math.abs(twistBp) <= C.maxTwistBp);
  }
  const play = () => {
    let s = g.newGame(4);
    for (let r = 1; r <= 8; r++) s = g.advance(s, g.drawShock(4, r));
    return s;
  };
  assert.deepEqual(play(), play());
});

test("attribution parts sum to the surplus change, including after a costly rebalance", () => {
  let s = g.newGame(3);
  let before = g.surplusOf(s, C);
  for (let r = 1; r <= 8; r++) {
    if (r % 3 === 0) s = g.rebalance(s, [0.1, 0.2, 0.5, 0.2]);
    const costPaid = s.pendingCost;
    const startSurplus = g.surplusOf(s, C) + costPaid;
    s = g.advance(s, g.drawShock(3, r));
    const { carry, rate, convexity, cost } = s.history[r - 1].attribution;
    close(carry + rate + convexity + cost, s.history[r - 1].surplus - startSurplus, 1e-6, `round ${r}`);
    close(cost, -costPaid, 1e-9);
    before = s.history[r - 1].surplus;
  }
  assert.ok(Number.isFinite(before));
});

test("rebalance reaches the target weights, charges cost on the value moved, and is free when nothing moves", () => {
  const s = g.newGame(2);
  assert.equal(g.rebalance(s, g.weightsOf(s)), s);
  const target = [0.25, 0.25, 0.25, 0.25];
  const t = g.rebalance(s, target);
  g.weightsOf(t).forEach((w, i) => close(w, target[i], 1e-9, `slot ${i}`));
  const moved = (g.assetsValue(s) * target.reduce((sum, w, i) => sum + Math.abs(w - g.weightsOf(s)[i]), 0)) / 2;
  close(t.pendingCost, (moved * C.costBp) / 10000, 1e-9);
  close(g.assetsValue(t), g.assetsValue(s) - t.pendingCost, 1e-6);
});

test("benchmarks: free auto-immunising ends closer to zero surplus than never rebalancing, on average", () => {
  let hold = 0;
  let auto = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const { buyHold, autoImmunised } = g.benchmarks(seed);
    assert.equal(buyHold.length, C.years + 1);
    assert.equal(autoImmunised.length, C.years + 1);
    close(buyHold[0], 0, 1e-6);
    hold += Math.abs(buyHold[C.years]);
    auto += Math.abs(autoImmunised[C.years]);
    assert.ok(Math.abs(autoImmunised[C.years]) < 0.03 * C.liability, `seed ${seed}: ${autoImmunised[C.years]}`);
  }
  assert.ok(auto < hold, `mean |final surplus|: auto ${auto / 10} vs buy-and-hold ${hold / 10}`);
});

test("the game stops after the liability is due", () => {
  let s = g.newGame(7);
  for (let r = 1; r <= 10; r++) s = g.advance(s, g.drawShock(7, r));
  assert.equal(s.round, C.years);
  assert.equal(s.history.length, C.years);
});
