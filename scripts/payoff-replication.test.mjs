import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import ts from "typescript";

async function load(path) {
  const source = await readFile(new URL(`../src/features/${path}.ts`, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  });
  return `data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`;
}

const bsUrl = await load("black-scholes/blackScholes.math");
const replSource = await readFile(new URL("../src/features/payoff-lab/replication/replication.math.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(replSource.replace('"../../black-scholes/blackScholes.math"', `"${bsUrl}"`), {
  compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
});
const m = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

const shape = {
  nodes: [{ x: 70, y: 5 }, { x: 90, y: 5 }, { x: 105, y: 25 }, { x: 125, y: 25 }, { x: 140, y: 10 }],
  steepness: 0.6,
  leftSlope: -0.3,
  rightSlope: 0.5,
};
const market = { spot: 100, rate: 0.04, sigma: 0.25, maturity: 1, skew: -0.15 };
const methods = ["calls", "puts", "carr-madan"];

test("every replicating portfolio reproduces the drawn payoff", () => {
  const pw = m.buildPiecewise(shape);
  for (const method of methods) {
    const p = m.replicate(pw, market, method);
    for (let S = 0; S <= 300; S += 0.7) {
      assert.ok(Math.abs(m.portfolioPayoff(p, S) - m.evalPiecewise(pw, S)) < 1e-8, `${method} @ ${S}`);
    }
  }
});

test("static replications cost the same and match the Breeden–Litzenberger integral", () => {
  const pw = m.buildPiecewise(shape);
  const [a, b, c] = methods.map((method) => m.replicate(pw, market, method).total);
  assert.ok(Math.abs(a - b) < 1e-8);
  assert.ok(Math.abs(a - c) < 1e-8);
  const bl = m.blPrice(pw, market, 200);
  assert.ok(Math.abs(bl.price - a) < 0.02, `BL ${bl.price} vs ${a}`);
  assert.ok(Math.abs(bl.mass - 1) < 0.005, `mass ${bl.mass}`);
});

test("full steepness turns an edge into a near-vertical jump", () => {
  const pw = m.buildPiecewise({ nodes: [{ x: 90, y: 0 }, { x: 110, y: 10 }], steepness: 1, leftSlope: 0, rightSlope: 0 });
  assert.equal(m.evalPiecewise(pw, 99.7), 0);
  assert.equal(m.evalPiecewise(pw, 100.3), 10);
});
