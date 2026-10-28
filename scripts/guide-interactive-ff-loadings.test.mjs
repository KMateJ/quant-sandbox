import assert from "node:assert/strict";
import { test } from "node:test";
import { importSrc } from "./lib/load-ts.mjs";

const m = await importSrc("features/guide/guide.famaFrench.math.ts");
const near = (a, b, tol) => assert.ok(Math.abs(a - b) <= tol, `${a} vs ${b}`);
const base = { size: 0.5, value: 0.4, months: 240 };

test("simulated factors hit their target premia exactly", () => {
  const f = m.ffFactorSample(240);
  for (const id of m.FF_FACTORS) near(f[id].reduce((s, v) => s + v, 0) / 240, m.FF_PREMIA[id], 1e-12);
});

test("default figure readouts match the numbers quoted in the lesson", () => {
  const capm = m.ffFit(base, "capm");
  near(capm.alphaAnnual * 100, 4.0, 0.005);
  near(capm.alphaT, 2.08, 0.005);
  near(capm.r2, 0.746, 0.0005);
  const ff3 = m.ffFit(base, "ff3");
  near(ff3.alphaAnnual * 100, 1.28, 0.005);
  near(ff3.alphaT, 1.04, 0.005);
  near(ff3.r2, 0.899, 0.0005);
  const ff5 = m.ffFit(base, "ff5");
  near(ff5.alphaAnnual * 100, 0.29, 0.005);
  near(ff5.alphaT, 0.26, 0.005);
  near(ff5.r2, 0.919, 0.0005);
  near(ff5.loadings.rmw, 0.3, 0.05);
});

test("adding factors shrinks alpha and raises R²", () => {
  const fits = ["capm", "ff3", "ff5"].map((model) => m.ffFit(base, model));
  assert.ok(fits[0].alphaAnnual > fits[1].alphaAnnual && fits[1].alphaAnnual > fits[2].alphaAnnual);
  assert.ok(fits[0].r2 < fits[1].r2 && fits[1].r2 < fits[2].r2);
  assert.equal(fits[0].loadings.smb, null);
});

test("expected excess return sums loadings times premia", () => {
  near(m.ffExpectedExcess({ mkt: 0.9, smb: 0.6, hml: 0.5 }, { mkt: 7, smb: 2, hml: 3, rmw: 0, cma: 0 }), 9, 1e-9);
});
